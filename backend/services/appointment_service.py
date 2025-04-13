
from datetime import datetime
import json

class AppointmentService:
    def __init__(self, supabase_service):
        self.supabase_service = supabase_service
        
    def get_appointments(self, user_id):
        try:
            client = self.supabase_service.get_client()
            
            # Query appointments with joined dietitian data
            result = client.table('appointments').select('*, dietitian:profiles!dietitian_id(name)') \
                .eq('user_id', user_id) \
                .order('appointment_date', {'ascending': True}) \
                .execute()
            
            # Transform the data to match the expected frontend format
            appointments = []
            for appointment in result.data:
                # Determine appointment type from notes or reason
                notes = appointment.get('notes') or ''
                reason = appointment.get('reason') or ''
                appointment_type = 'in-person'
                
                if 'video' in (notes + reason).lower():
                    appointment_type = 'video'
                elif 'phone' in (notes + reason).lower():
                    appointment_type = 'phone'
                
                # Format the appointment date
                appointment_date = appointment.get('appointment_date')
                appointment_time = appointment.get('appointment_time') or '12:00 PM'
                
                # Convert time to 24-hour format
                try:
                    time_parts = appointment_time.split(' ')
                    time = time_parts[0]
                    modifier = time_parts[1] if len(time_parts) > 1 else 'AM'
                    
                    hours, minutes = time.split(':')
                    hours = int(hours)
                    
                    if hours == 12:
                        hours = 0
                        
                    if modifier == 'PM':
                        hours += 12
                        
                    time_24h = f"{hours:02d}:{minutes}"
                except Exception:
                    time_24h = "12:00"
                
                # Create date object
                try:
                    date_obj = datetime.fromisoformat(f"{appointment_date}T{time_24h}:00")
                except Exception:
                    # Fallback to current date if parsing fails
                    date_obj = datetime.now()
                
                appointments.append({
                    'id': appointment.get('id'),
                    'date': date_obj.isoformat(),
                    'dietitianName': appointment.get('dietitian', {}).get('name') or "Dr. Sarah Johnson",
                    'type': appointment_type,
                    'duration': 30,  # Hard-coded duration
                    'status': appointment.get('status') or 'pending',
                    'notes': appointment.get('reason') or ''
                })
            
            return {"appointments": appointments}
        except Exception as e:
            return {"error": str(e), "appointments": []}
            
    def create_appointment(self, data):
        try:
            client = self.supabase_service.get_client()
            
            # Extract data from request
            date = data.get('date')
            time = data.get('time')
            appointment_type = data.get('type')
            user_id = data.get('userId')
            
            if not date or not time or not user_id:
                return {"error": "Missing required fields"}
            
            # Format date to YYYY-MM-DD
            if isinstance(date, str) and 'T' in date:
                date = date.split('T')[0]
            
            # Prepare data for insertion
            appointment_data = {
                'appointment_date': date,
                'appointment_time': time,
                'status': 'requested',
                'reason': f"{appointment_type} consultation request",
                'notes': f"{appointment_type} session requested by client",
                'user_id': user_id,
                'dietitian_id': None
            }
            
            # Insert appointment
            result = client.table('appointments').insert(appointment_data).execute()
            
            if result.data:
                return {"success": True, "appointment": result.data[0]}
            else:
                return {"error": "Failed to create appointment"}
        except Exception as e:
            return {"error": str(e)}
            
    def update_appointment(self, appointment_id, data):
        try:
            client = self.supabase_service.get_client()
            
            # Handle appointment cancellation
            if data.get('status') == 'cancelled':
                result = client.table('appointments').update({
                    'status': 'cancelled'
                }).eq('id', appointment_id).execute()
                
                if result.data:
                    return {"success": True, "appointment": result.data[0]}
                else:
                    return {"error": "Failed to cancel appointment"}
            
            # Handle other updates
            update_data = {}
            for key in ['appointment_date', 'appointment_time', 'status', 'reason', 'notes']:
                if key in data:
                    update_data[key] = data[key]
            
            if update_data:
                result = client.table('appointments').update(update_data).eq('id', appointment_id).execute()
                
                if result.data:
                    return {"success": True, "appointment": result.data[0]}
                else:
                    return {"error": "Failed to update appointment"}
            
            return {"error": "No update data provided"}
        except Exception as e:
            return {"error": str(e)}
