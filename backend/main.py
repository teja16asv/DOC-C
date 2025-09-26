# # DOC C+ | Flask Backend for Hackathon

# from flask import Flask, request, jsonify
# from matcher_ibm_aws import Matcher
# from aws_storage import upload_file, add_item, get_items

# app = Flask(__name__)

# # Initialize matcher
# matcher = Matcher("kb_csv.csv")

# # --- Symptom Matching ---
# @app.route('/match', methods=['POST'])
# def match_symptoms():
#     data = request.json
#     user_text = data.get('symptoms')
#     result = matcher.match(user_text)
#     return jsonify(result)


# # --- Book Appointment ---
# @app.route('/book', methods=['POST'])
# def book_appointment():
#     data = request.json
#     add_item('Appointments', data)
#     return jsonify({"status": "success", "message": "Appointment booked"})


# # --- Upload Prescription ---
# @app.route('/upload_prescription', methods=['POST'])
# def upload_prescription():
#     file = request.files['file']
#     filename = request.form['filename']
#     s3_path = upload_file(file, filename)
#     return jsonify({"status": "success", "s3_path": s3_path})


# if __name__ == "__main__":
#     app.run(debug=True)





# from flask import Flask, request, jsonify
# from matcher_aws import SymptomToSpecialistMatcherAWS
# from aws_storage import upload_file, add_item, get_items

# app = Flask(__name__)

# matcher = SymptomToSpecialistMatcherAWS("kb_csv.csv")

# @app.route('/match', methods=['POST'])
# def match_symptoms():
#     data = request.json
#     user_text = data.get('symptoms')
#     result = matcher.match(user_text)
#     return jsonify(result)

# @app.route('/book', methods=['POST'])
# def book_appointment():
#     data = request.json
#     add_item('Appointments', data)
#     return jsonify({"status": "success", "message": "Appointment booked"})

# @app.route('/upload_prescription', methods=['POST'])
# def upload_prescription():
#     file = request.files['file']
#     filename = request.form['filename']
#     s3_path = upload_file(file, filename)
#     return jsonify({"status": "success", "s3_path": s3_path})

# if __name__ == "__main__":
#     app.run(debug=True)



# # test_api.py
# import requests

# # Sample input for symptom matching
# data = {"symptoms": "I have chest pain and headache"}

# # Make a POST request to the Flask endpoint
# try:
#     response = requests.post("http://127.0.0.1:5000/match", json=data)
#     print("Status code:", response.status_code)
#     print("Response:", response.json())
# except requests.exceptions.RequestException as e:
#     print("Error connecting to API:", e)


# # Optional: test appointment booking
# appointment_data = {
#     "patient_id": 1,
#     "doctor_id": 2,
#     "date": "2025-09-25",
#     "time": "10:00 AM"
# }

# try:
#     response = requests.post("http://127.0.0.1:5000/book", json=appointment_data)
#     print("Appointment Status code:", response.status_code)
#     print("Appointment Response:", response.json())
# except requests.exceptions.RequestException as e:
#     print("Error connecting to API:", e)




from flask import Flask, request, jsonify
from matcher_aws import Matcher
from aws_storage import upload_file, add_item, get_items, get_user_by_email, DYNAMODB_USERS_TABLE
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

matcher = Matcher("kb_csv.csv")

# Symptom → Specialist
@app.route("/match", methods=["POST"])
def match_symptoms():
    data = request.json
    text = data.get("symptoms")
    result = matcher.match(text)
    return jsonify(result)

# Book appointment
@app.route('/book', methods=['POST'])
def book_appointment():
    data = request.json
    add_item('Appointments', data)
    return jsonify({"status": "success", "message": "Appointment booked"})


# Upload prescription
@app.route("/upload_prescription", methods=["POST"])
def upload_prescription():
    file = request.files["file"]
    filename = request.form.get("filename", file.filename)
    s3_path = upload_file(file, filename)
    return jsonify({"status": "success", "s3_path": s3_path})

# --- User Registration ---
@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    # Check if user already exists
    if get_user_by_email(email): # Pass only email
        return jsonify({"status": "error", "message": "User with this email already exists"}), 409

    # Hash the password and create the user item
    user_data = data.copy()
    user_data["password_hash"] = generate_password_hash(password)
    user_data.setdefault("role", "patient")  # Default role to patient
    del user_data["password"] # Do not store plain password
    user_data.pop("id", None) # Ensure no 'id' is passed from the client

    new_user = add_item(DYNAMODB_USERS_TABLE, user_data)
    return jsonify({"status": "success", "message": "User registered successfully", "user": {"id": new_user["id"], "email": new_user["email"]}}), 201

# --- User Login ---
@app.route("/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return jsonify({"status": "error", "message": "Email, password, and role are required"}), 400

    user = get_user_by_email(email)

    if not user:
        return jsonify({"status": "error", "message": "User not found. Please register first."}), 404

    if user.get("role") != role:
        return jsonify({"status": "error", "message": f"You are registered as a {user.get('role')}, not a {role}."}), 403

    if not check_password_hash(user.get("password_hash", ""), password):
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401

    return jsonify({"status": "success", "message": "Login successful", "user": {"id": user["id"], "email": user["email"], "role": user["role"]}}), 200

if __name__ == "__main__":
    app.run(debug=True)
