from flask import request, jsonify
from app import app, products, categories

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
