
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import time
from services.supabase_service import SupabaseService
from services.auth_service import AuthService
from services.file_service import FileService
from services.appointment_service import AppointmentService
from services.health_assessment_service import HealthAssessmentService

app = Flask(__name__)
CORS(app)

# Initialize services
supabase_service = SupabaseService()
auth_service = AuthService(supabase_service)
file_service = FileService(supabase_service)
appointment_service = AppointmentService(supabase_service)
health_assessment_service = HealthAssessmentService(supabase_service)

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# Auth endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    result = auth_service.login(email, password)
    if result.get('error'):
        return jsonify(result), 401
    return jsonify(result)

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    result = auth_service.register(email, password, name)
    if result.get('error'):
        return jsonify(result), 400
    return jsonify(result)

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    result = auth_service.logout()
    return jsonify(result)

@app.route('/api/auth/verify-phone', methods=['POST'])
def verify_phone():
    data = request.json
    phone = data.get('phone')
    otp = data.get('otp')
    name = data.get('name')
    user_id = data.get('user_id')
    
    result = auth_service.verify_phone(user_id, phone, otp, name)
    if result.get('error'):
        return jsonify(result), 400
    return jsonify(result)

@app.route('/api/auth/session', methods=['GET'])
def get_session():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"session": None, "user": None})
    
    token = auth_header.split(' ')[1]
    result = auth_service.get_session(token)
    return jsonify(result)

# File storage endpoints
@app.route('/api/storage/initialize', methods=['POST'])
def initialize_storage():
    result = file_service.initialize_storage()
    return jsonify(result)

@app.route('/api/storage/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    bucket_id = request.form.get('bucket_id')
    user_id = request.form.get('user_id')
    custom_path = request.form.get('custom_path', None)
    is_public = request.form.get('is_public', 'true').lower() == 'true'
    
    # Save file temporarily
    temp_path = f"/tmp/{int(time.time())}_{file.filename}"
    file.save(temp_path)
    
    result = file_service.upload_file(bucket_id, user_id, temp_path, file.filename, custom_path, is_public)
    
    # Clean up temp file
    if os.path.exists(temp_path):
        os.remove(temp_path)
    
    if result.get('error'):
        return jsonify(result), 400
    return jsonify(result)

# Appointment endpoints
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    result = appointment_service.get_appointments(user_id)
    return jsonify(result)

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    data = request.json
    result = appointment_service.create_appointment(data)
    if result.get('error'):
        return jsonify(result), 400
    return jsonify(result)

@app.route('/api/appointments/<appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    data = request.json
    result = appointment_service.update_appointment(appointment_id, data)
    if result.get('error'):
        return jsonify(result), 400
    return jsonify(result)

# Health assessment endpoints
@app.route('/api/health-assessment', methods=['POST'])
def submit_health_assessment():
    data = request.json
    result = health_assessment_service.submit_health_assessment(data)
    if result.get('error'):
        return jsonify(result), 400
    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
