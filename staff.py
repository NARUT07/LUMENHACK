from flask import jsonify
from app import app, products, transaction_history

@app.route('/staff/view_stock', methods=['GET'])
def view_stock_staff():
    return jsonify({"products": products})

@app.route('/staff/perform_stock_transaction', methods=['POST'])
def perform_stock_transaction():
    return record_stock_transaction()
