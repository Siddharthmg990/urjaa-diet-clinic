
class AuthService:
    def __init__(self, supabase_service):
        self.supabase_service = supabase_service
        
    def login(self, email, password):
        try:
            client = self.supabase_service.get_client()
            result = client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if result.user and result.session:
                # Get profile info
                profile = client.table('profiles').select('*').eq('id', result.user.id).single().execute()
                
                return {
                    "user": {
                        "id": result.user.id,
                        "email": result.user.email,
                        "name": profile.data.get('name') if profile.data else result.user.user_metadata.get('name', 'User'),
                        "role": profile.data.get('role') if profile.data else 'user',
                        "phone": profile.data.get('phone'),
                        "phoneVerified": profile.data.get('phone_verified')
                    },
                    "session": {
                        "access_token": result.session.access_token,
                        "refresh_token": result.session.refresh_token,
                        "expires_at": result.session.expires_at
                    }
                }
            else:
                return {"error": "Authentication failed"}
        except Exception as e:
            return {"error": str(e)}
    
    def login_with_google(self, access_token):
        try:
            client = self.supabase_service.get_client()
            result = client.auth.sign_in_with_oauth({
                "provider": "google",
                "access_token": access_token
            })
            
            if result.user and result.session:
                # Get profile info
                profile = client.table('profiles').select('*').eq('id', result.user.id).single().execute()
                
                return {
                    "user": {
                        "id": result.user.id,
                        "email": result.user.email,
                        "name": profile.data.get('name') if profile.data else result.user.user_metadata.get('name', 'User'),
                        "role": profile.data.get('role') if profile.data else 'user',
                        "phone": profile.data.get('phone'),
                        "phoneVerified": profile.data.get('phone_verified')
                    },
                    "session": {
                        "access_token": result.session.access_token,
                        "refresh_token": result.session.refresh_token,
                        "expires_at": result.session.expires_at
                    }
                }
            else:
                return {"error": "Google authentication failed"}
        except Exception as e:
            return {"error": str(e)}
    
    def register(self, email, password, name):
        try:
            client = self.supabase_service.get_client()
            result = client.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": {"name": name}
                }
            })
            
            if result.user and result.session:
                return {
                    "user": {
                        "id": result.user.id,
                        "email": result.user.email,
                        "name": name or 'User',
                        "role": 'user',
                        "phone": None,
                        "phoneVerified": False
                    },
                    "session": {
                        "access_token": result.session.access_token,
                        "refresh_token": result.session.refresh_token,
                        "expires_at": result.session.expires_at
                    }
                }
            else:
                return {"error": "Registration failed"}
        except Exception as e:
            return {"error": str(e)}
    
    def logout(self):
        try:
            client = self.supabase_service.get_client()
            client.auth.sign_out()
            return {"success": True}
        except Exception as e:
            return {"error": str(e)}
    
    def verify_phone(self, user_id, phone, otp, name=None):
        try:
            client = self.supabase_service.get_client()
            formatted_phone = f"+91{phone}"
            
            # In a real application, you'd verify the OTP here
            # For this example, we'll assume OTP verification is successful
            
            # Update profile
            result = client.table('profiles').update({
                "phone": formatted_phone,
                "phone_verified": True,
                "name": name
            }).eq('id', user_id).execute()
            
            if result.data:
                return {
                    "success": True,
                    "profile": {
                        "phone": formatted_phone,
                        "phoneVerified": True,
                        "name": name
                    }
                }
            else:
                return {"error": "Failed to update profile"}
        except Exception as e:
            return {"error": str(e)}
    
    def get_session(self, access_token):
        try:
            client = self.supabase_service.get_client_with_token(access_token)
            result = client.auth.get_user()
            
            if not result.user:
                return {"session": None, "user": None}
            
            # Get profile info
            profile = client.table('profiles').select('*').eq('id', result.user.id).single().execute()
            
            return {
                "session": {"access_token": access_token},
                "user": {
                    "id": result.user.id,
                    "email": result.user.email,
                    "name": profile.data.get('name') if profile.data else result.user.user_metadata.get('name', 'User'),
                    "role": profile.data.get('role') if profile.data else 'user',
                    "phone": profile.data.get('phone'),
                    "phoneVerified": profile.data.get('phone_verified')
                }
            }
        except Exception as e:
            print(f"Error getting session: {str(e)}")
            return {"session": None, "user": None, "error": str(e)}
