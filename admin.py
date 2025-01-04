from flask import request, jsonify
from app import app, products, suppliers, transaction_history

@app.route('/admin/manage_users', methods=['POST'])
def manage_users():
    user_data = request.get_json()
    # Logic to manage users (add/edit/delete)
    return jsonify({"message": "User managed successfully!"})

@app.route('/admin/manage_suppliers', methods=['POST'])
def add_supplier():
    try:
        data = request.get_json()
        required_fields = ['name', 'contact_info']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing mandatory fields"}), 400
        new_supplier = {
            "name": data['name'],
            "contact_info": data['contact_info'],
            "order_history": [],
            "current_order_status": "Pending"
        }
        suppliers.append(new_supplier)
        return jsonify({"message": "Supplier added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": f"Error adding supplier: {e}"}), 400

@app.route('/admin/record_stock_transaction', methods=['POST'])
def record_stock_transaction():
    try:
        data = request.get_json()
        required_fields = ['product_name', 'transaction_type', 'quantity']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing mandatory fields"}), 400
        if data['transaction_type'] not in ['in', 'out']:
            return jsonify({"error": "Invalid transaction type"}), 400
        product = next((prod for prod in products if prod['name'] == data['product_name']), None)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        if data['transaction_type'] == 'in':
            product['stock_level'] += data['quantity']
        else:
            if product['stock_level'] < data['quantity']:
                return jsonify({"error": "Insufficient stock"}), 400
            product['stock_level'] -= data['quantity']
        transaction_history.append(data)
        return jsonify({"message": "Transaction recorded successfully!"})
    except Exception as e:
        return jsonify({"error": f"Error recording transaction: {e}"}), 400
