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
