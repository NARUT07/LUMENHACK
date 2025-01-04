from flask import jsonify
from app import app, products

@app.route('/alerts/low_stock', methods=['GET'])
def low_stock_alerts():
    alerts = {prod['name']: prod['stock_level'] < prod['reorder_point'] for prod in products if prod['stock_level'] < prod['reorder_point']}
    return jsonify({"low_stock_alerts": alerts})

@app.route('/alerts/reorder_points', methods=['GET'])
def reorder_alerts():
    return low_stock_alerts()
