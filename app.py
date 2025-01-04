from flask import Flask, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)

# Load Demand Forecast Model
try:
    with open('demand_forecast_model.pkl', 'rb') as file:
        demand_forecast_model = pickle.load(file)
except Exception as e:
    print(f"Error loading model: {e}")
    demand_forecast_model = None

# Dummy data
products = []
categories = ["Router", "Switch", "Modem", "Multiplexer", "Combiner", "Card", "Splitter"]
transaction_history = []
suppliers = []

# Product management routes
@app.route('/admin/manage_products', methods=['POST'])
def add_product():
    try:
        data = request.get_json()
        required_fields = ['name', 'category', 'stock_level', 'reorder_point']
        # Ensure mandatory fields are provided
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing mandatory fields"}), 400
        
        # Validate category
        if data['category'] not in categories:
            return jsonify({"error": "Invalid category"}), 400
        
        # Add product to the list
        new_product = {
            "name": data['name'],
            "category": data['category'],
            "stock_level": data['stock_level'],
            "reorder_point": data['reorder_point']
        }
        products.append(new_product)
        return jsonify({"message": "Product added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": f"Error adding product: {e}"}), 400

# ====================== Admin Routes ======================

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

# ====================== Manager Routes ======================

@app.route('/manager/edit_product/<string:name>', methods=['PUT'])
def edit_product(name):
    try:
        data = request.get_json()
        product = next((prod for prod in products if prod['name'] == name), None)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        if 'category' in data and data['category'] in categories:
            product['category'] = data['category']
        if 'stock_level' in data:
            product['stock_level'] = data['stock_level']
        if 'reorder_point' in data:
            product['reorder_point'] = data['reorder_point']
        return jsonify({"message": "Product updated successfully!"})
    except Exception as e:
        return jsonify({"error": f"Error updating product: {e}"}), 400

@app.route('/manager/manage_stock_transactions', methods=['POST'])
def manage_stock_transactions():
    return record_stock_transaction()

@app.route('/manager/edit_supplier/<string:name>', methods=['PUT'])
def edit_supplier(name):
    try:
        data = request.get_json()
        supplier = next((sup for sup in suppliers if sup['name'] == name), None)
        if not supplier:
            return jsonify({"error": "Supplier not found"}), 404
        if 'contact_info' in data:
            supplier['contact_info'] = data['contact_info']
        return jsonify({"message": "Supplier updated successfully!"})
    except Exception as e:
        return jsonify({"error": f"Error updating supplier: {e}"}), 400

# ====================== Staff Routes ======================

@app.route('/staff/view_stock', methods=['GET'])
def view_stock_staff():
    return jsonify({"products": products})

@app.route('/staff/perform_stock_transaction', methods=['POST'])
def perform_stock_transaction():
    return record_stock_transaction()

# ====================== Alerts and Notifications ======================

@app.route('/alerts/low_stock', methods=['GET'])
def low_stock_alerts():
    alerts = {prod['name']: prod['stock_level'] < prod['reorder_point'] for prod in products if prod['stock_level'] < prod['reorder_point']}
    return jsonify({"low_stock_alerts": alerts})

@app.route('/alerts/reorder_points', methods=['GET'])
def reorder_alerts():
    return low_stock_alerts()

# ====================== Demand Forecasting ======================

@app.route('/forecast', methods=['POST'])
def forecast_demand():
    if not demand_forecast_model:
        return jsonify({"error": "Model not loaded"}), 500
    try:
        data = request.get_json()
        input_data = pd.DataFrame(data)
        predictions = demand_forecast_model.predict(input_data)
        return jsonify({"predictions": predictions.tolist()})
    except Exception as e:
        return jsonify({"error": f"Error processing data: {e}"}), 400

if __name__ == '__main__':
    app.run(debug=True)
