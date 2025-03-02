import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__, template_folder="templates")
CORS(app)  # Enable CORS

# Set up Google Gemini API key
genai.configure(api_key=" ")

# Function to get AI response
def get_gemini_response(user_input):
    try:
        model = genai.GenerativeModel("gemini-pro")  # Use the correct Gemini model
        response = model.generate_content(user_input)
        return response.text if response else "Sorry, I couldn't understand that."
    except Exception as e:
        return f"Error: {str(e)}"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    bot_response = get_gemini_response(user_message)
    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(debug=True)
