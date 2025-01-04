import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import numpy as np
import pickle

file_path =r"C:\Users\vanga\OneDrive\Desktop\lumen hack\Inventory_DataSet.xlsx" # Replace with your file path
data = pd.read_excel(file_path)
data['Order Date'] = pd.to_datetime(data['Order Date'], errors='coerce')
data_cleaned = data.dropna(subset=['Order Date'])


data_cleaned['DaysSinceOrder'] = (pd.Timestamp.now() - data_cleaned['Order Date']).dt.days

features = data_cleaned[['StockLevel', 'ReorderPoint', 'DaysSinceOrder']]
target = data_cleaned['Quantity']

X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

model = RandomForestRegressor(random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)

model_path = "demand_forecast_model.pkl"
with open(model_path, 'wb') as file:
    pickle.dump(model, file)

print(f"Model trained successfully! RMSE: {rmse}")
print(f"Model saved at: {model_path}")
