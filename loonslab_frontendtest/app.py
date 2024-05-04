from flask import Flask, render_template, request  # Import necessary modules
import requests  # Import requests module for making HTTP requests

app = Flask(__name__)  # Create a Flask application

# OpenWeatherMap API key
API_KEY = 'API_KEY'  

@app.route('/')  # Route for the home page
def index():
    return render_template('index.html')  # Render the index.html template

@app.route('/weather', methods=['POST'])  # Route for getting weather data
def weather():
    city = request.form['city']  # Get city name from form data
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'  # Construct API URL for current weather
    response = requests.get(url)  # Make GET request to OpenWeatherMap API
    data = response.json()  # Parse response as JSON

    if data['cod'] == 200:  # Check if response status is OK
        weather_data = {  # Extract weather data from JSON response
            'city': data['name'],
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description']
        }
        return render_template('weather.html', weather=weather_data)  # Render weather.html template with weather data
    else:
        error_msg = data['message']  # Get error message from response
        return render_template('error.html', error=error_msg)  # Render error.html template with error message

@app.route('/forecast', methods=['POST'])  # Route for getting weather forecast
def forecast():
    lat = request.form['lat']  # Get latitude from form data
    lon = request.form['lon']  # Get longitude from form data
    url = f'http://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API_KEY}&units=metric'  # Construct API URL for weather forecast
    response = requests.get(url)  # Make GET request to OpenWeatherMap API
    data = response.json()  # Parse response as JSON

    if 'daily' in data:  # Check if daily forecast data is available
        forecast_data = []  # Initialize list to store forecast data
        for day in data['daily'][:3]:  # Loop through the next 3 days of forecast data
            forecast_data.append({  # Extract forecast data for each day
                'date': day['dt'],
                'temperature': day['temp']['day'],
                'description': day['weather'][0]['description']
            })
        return render_template('forecast.html', forecast=forecast_data)  # Render forecast.html template with forecast data
    else:
        error_msg = data['message']  # Get error message from response
        return render_template('error.html', error=error_msg)  # Render error.html template with error message

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask application in debug mode
