from flask import Flask, request, jsonify, session, redirect, url_for, flash
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
import json

app = Flask(__name__)
app.secret_key = "1234" 


app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "password"
app.config["MYSQL_DB"] = "inventory_db"

mysql = MySQL(app)
bcrypt = Bcrypt(app)

def role_required(required_role):
    """Decorator for role-based access control."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            if "user_id" not in session or "role" not in session:
                return jsonify({"message": "Unauthorized access"}), 401
            if session["role"] != required_role:
                return jsonify({"message": f"Access restricted to {required_role} role"}), 403
            return func(*args, **kwargs)
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator

@app.route("/login", methods=["POST"])
def login():
    """Authenticate user and initiate session."""
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT id, password, role FROM users WHERE username=%s", (username,))
    user = cur.fetchone()
    cur.close()

    if user and bcrypt.check_password_hash(user[1], password):
        session["user_id"] = user[0]
        session["role"] = user[2]
        return jsonify({"message": "Login successful", "role": user[2]}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route("/logout", methods=["POST"])
def logout():
    """Log out the user and clear session."""
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route("/manage-suppliers", methods=["GET", "POST", "PUT", "DELETE"])
def manage_suppliers():
    """Manage suppliers based on user role."""
    user_role = session.get("role", "Guest")

    if request.method == "GET":
        # Admin and Manager can view suppliers
        if user_role not in ["Admin", "Manager"]:
            return jsonify({"message": "Access denied"}), 403

        cur = mysql.connection.cursor()
        cur.execute("SELECT id, name, contact_info, created_at, updated_at FROM Suppliers")
        suppliers = cur.fetchall()
        cur.close()

        # Convert JSON strings back into Python dictionaries
        supplier_list = [
            {
                "id": supplier[0],
                "name": supplier[1],
                "contact_info": json.loads(supplier[2]),
                "created_at": supplier[3],
                "updated_at": supplier[4],
            }
            for supplier in suppliers
        ]
        return jsonify({"suppliers": supplier_list}), 200

    elif request.method == "POST":
        # Admin can add suppliers
        if user_role != "Admin":
            return jsonify({"message": "Access restricted to Admin"}), 403

        data = request.json
        name = data.get("name")
        contact_info = data.get("contact_info")

        if not name or not contact_info:
            return jsonify({"message": "Name and contact_info are required"}), 400

        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO Suppliers (name, contact_info) VALUES (%s, %s)",
            (name, json.dumps(contact_info)),
        )
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Supplier added successfully"}), 201

    elif request.method == "PUT":
        # Admin and Manager can edit suppliers
        if user_role not in ["Admin", "Manager"]:
            return jsonify({"message": "Access denied"}), 403

        data = request.json
        supplier_id = data.get("id")
        name = data.get("name")
        contact_info = data.get("contact_info")

        if not supplier_id or not (name or contact_info):
            return jsonify({"message": "Supplier ID and at least one field to update are required"}), 400

        cur = mysql.connection.cursor()
        if name:
            cur.execute("UPDATE Suppliers SET name=%s WHERE id=%s", (name, supplier_id))
        if contact_info:
            cur.execute(
                "UPDATE Suppliers SET contact_info=%s WHERE id=%s",
                (json.dumps(contact_info), supplier_id),
            )
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Supplier updated successfully"}), 200

    elif request.method == "DELETE":
        # Admin can delete suppliers
        if user_role != "Admin":
            return jsonify({"message": "Access restricted to Admin"}), 403

        data = request.json
        supplier_id = data.get("id")

        if not supplier_id:
            return jsonify({"message": "Supplier ID is required"}), 400

        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM Suppliers WHERE id=%s", (supplier_id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Supplier deleted successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
