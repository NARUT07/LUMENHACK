from flask import request, jsonify
from app import app, products, categories, suppliers, transaction_history

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
