
import os
import time
from pathlib import Path

class FileService:
    def __init__(self, supabase_service):
        self.supabase_service = supabase_service
        
    def initialize_storage(self):
        try:
            client = self.supabase_service.get_client()
            
            # List all buckets
            buckets_result = client.storage.list_buckets()
            
            # Check if 'user_uploads' bucket exists
            bucket_exists = any(bucket.get('name') == 'user_uploads' for bucket in buckets_result)
            
            if not bucket_exists:
                # Create the bucket
                client.storage.create_bucket('user_uploads', {'public': True, 'file_size_limit': 10485760})
            
            return {"success": True, "bucket": "user_uploads"}
        except Exception as e:
            return {"error": str(e)}
    
    def upload_file(self, bucket_id, user_id, file_path, original_filename, custom_path=None, is_public=True):
        try:
            client = self.supabase_service.get_client()
            
            # Create file path with user ID for organization
            file_id = int(time.time())
            file_ext = Path(original_filename).suffix
            safe_filename = original_filename.replace("/", "_").replace(" ", "_")
            
            # Use custom path or generate one
            if custom_path:
                file_name = custom_path
            else:
                file_name = f"{user_id}/{file_id}_{safe_filename}"
            
            # Upload file
            with open(file_path, 'rb') as f:
                result = client.storage.from_(bucket_id).upload(file_name, f, {'upsert': True})
            
            if 'error' in result:
                return {"error": result['error']}
            
            # Get public URL if successful
            public_url = client.storage.from_(bucket_id).get_public_url(file_name)
            
            return {
                "path": file_name,
                "publicUrl": public_url,
                "error": None
            }
        except Exception as e:
            return {"error": str(e), "path": None, "publicUrl": None}
