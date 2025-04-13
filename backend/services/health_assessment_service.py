
class HealthAssessmentService:
    def __init__(self, supabase_service):
        self.supabase_service = supabase_service
        
    def submit_health_assessment(self, data):
        try:
            client = self.supabase_service.get_client()
            
            # Extract user ID and required fields
            user_id = data.get('user_id')
            
            if not user_id:
                return {"error": "User ID is required"}
            
            # Prepare health assessment data
            assessment_data = {
                'user_id': user_id,
                'full_name': data.get('fullName'),
                'age': data.get('age'),
                'height': data.get('height'),
                'height_unit': data.get('heightUnit'),
                'weight': data.get('weight'),
                'weight_unit': data.get('weightUnit'),
                'sex': data.get('sex'),
                'city': data.get('city'),
                'health_concerns': data.get('healthConcerns'),
                'medical_conditions': data.get('medicalConditions'),
                'other_condition': data.get('otherCondition'),
                'diet_type': data.get('dietType'),
                'wakeup_time': data.get('wakeupTime'),
                'sleep_time': data.get('sleepTime'),
                'profession': data.get('profession'),
                'occupation': data.get('occupation'),
                'leave_home_time': data.get('leaveHomeTime'),
                'return_home_time': data.get('returnHomeTime'),
                'break_times': data.get('breakTimes'),
                'working_hours': data.get('workingHours'),
                'meals': data.get('meals'),
                'activities': data.get('activities'),
                'photo_urls': data.get('photo_urls', []),
                'medical_report_urls': data.get('medical_report_urls', [])
            }
            
            # Insert health assessment
            result = client.table('health_assessments').insert(assessment_data).execute()
            
            if result.data:
                return {"success": True, "assessment": result.data[0]}
            else:
                return {"error": "Failed to submit health assessment"}
        except Exception as e:
            return {"error": str(e)}
