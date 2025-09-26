# # import requests

# # # Test symptom matcher
# # data = {"symptoms": "I have chest pain and headache"}
# # r = requests.post("http://127.0.0.1:5000/match", json=data)
# # print("Matcher Output:", r.json())

# # # Test upload prescription
# # files = {"file": open("test_file.txt", "rb")}
# # data = {"filename": "test_file.txt"}
# # r = requests.post("http://127.0.0.1:5000/upload_prescription", files=files, data=data)
# # print("Upload Output:", r.json())

# # # Test book appointment
# # appointment = {
# #     "appointment_id": "1",
# #     "patient_name": "John Doe",
# #     "doctor_name": "Dr. Smith",
# #     "time": "2025-09-25 10:00"
# # }
# # r = requests.post("http://127.0.0.1:5000/book", json=appointment)
# # print("Book Appointment Output:", r.json())



# import requests

# # Test symptom matcher
# data = {"symptoms": "I have chest pain and headache"}
# try:
#     r = requests.post("http://127.0.0.1:5000/match", json=data)
#     print("Match Response:", r.json())
# except Exception as e:
#     print("Error:", e)

# # Test booking
# appointment = {
#     "patient_id": "1",
#     "doctor_id": "2",
#     "date": "2025-09-25",
#     "time": "10:00 AM"
# }
# try:
#     r = requests.post("http://127.0.0.1:5000/book", json=appointment)
#     print("Book Response:", r.json())
# except Exception as e:
#     print("Error:", e)



import requests
import uuid

# --- Registration and Login Test ---

# Generate a unique email for the new user to avoid conflicts
user_email = f"testuser_{uuid.uuid4()}@example.com"
user_password = "password123"

# 1. Register a new user
registration_data = {
    "email": user_email,
    "password": user_password,
    "name": "Test User",
    "role": "patient"
}
try:
    r = requests.post("http://127.0.0.1:5000/register", json=registration_data)
    print("Registration Response:", r.json())
except Exception as e:
    print("Error during registration:", e)

# 2. Attempt to log in with correct credentials
login_data_correct = {
    "email": user_email,
    "password": user_password,
    "role": "patient"
}
try:
    r = requests.post("http://127.0.0.1:5000/login", json=login_data_correct)
    print("Login (Correct Credentials) Response:", r.json())
except Exception as e:
    print("Error during login (correct credentials):", e)

# 3. Attempt to log in with incorrect credentials
login_data_incorrect = {
    "email": user_email,
    "password": "wrongpassword",
    "role": "patient"
}
try:
    r = requests.post("http://127.0.0.1:5000/login", json=login_data_incorrect)
    print("Login (Incorrect Credentials) Response:", r.json())
except Exception as e:
    print("Error during login (incorrect credentials):", e)


# --- Other Tests ---

# Test symptom matcher
data = {"symptoms": "I have chest pain and headache"}
try:
    r = requests.post("http://127.0.0.1:5000/match", json=data)
    print("Match Response:", r.json())
except Exception as e:
    print("Error:", e)

# Test booking
appointment = {
    "patient_id": "1",
    "doctor_id": "2",
    "date": "2025-09-25",
    "time": "10:00 AM"
}
try:
    r = requests.post("http://127.0.0.1:5000/book", json=appointment)
    print("Book Response:", r.json())
except Exception as e:
    print("Error:", e)

# Test upload prescription
# try:
#     with open('sample_prescription.pdf', 'rb') as f:
#         files = {'file': f}
#         data = {'filename': 'sample_prescription.pdf'}
#         r = requests.post("http://127.0.0.1:5000/upload_prescription", files=files, data=data)
#         print("Upload Prescription Response:", r.json())
# except FileNotFoundError:
#     print("sample_prescription.pdf not found. Skipping upload test.")
# except Exception as e:
#     print("Error during prescription upload:", e)
