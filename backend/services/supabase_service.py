
import os
from supabase import create_client, Client

class SupabaseService:
    def __init__(self):
        self.supabase_url = "https://frsijcoffdlkwzrbwjhp.supabase.co"
        self.supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyc2lqY29mZmRsa3d6cmJ3amhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTYzMDQsImV4cCI6MjA1OTU5MjMwNH0.tdFKSPYo4LDdpQQXkGe0MEkZyGSD2mZU4HVWIknCfFY"
        self.client = create_client(self.supabase_url, self.supabase_key)
        
    def get_client(self):
        return self.client
    
    def get_client_with_token(self, access_token):
        # Create a new client with the user's access token
        try:
            client = create_client(self.supabase_url, self.supabase_key)
            client.auth.set_session(access_token)
            return client
        except Exception as e:
            print(f"Error creating client with token: {str(e)}")
            return self.client
