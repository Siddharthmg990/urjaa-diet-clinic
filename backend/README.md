
# Flask Backend for Urjaa Diet Clinic

This is the Flask backend API service that connects the React frontend with Supabase.

## Setup

1. Create a virtual environment:
```
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run the development server:
```
python app.py
```

The API will be available at `http://localhost:5000`.

## Google OAuth Setup

To enable Google OAuth login, you need to:

1. Go to the Google Cloud Console and create OAuth credentials
2. Configure your Supabase project with these credentials
   - In the Supabase Dashboard, go to Authentication > Providers > Google
   - Enter your Client ID and Client Secret
   - Set the authorized redirect URI to your Supabase auth callback URL
3. Make sure to set the appropriate Site URL and redirect URLs in your Supabase Authentication settings

The application handles the OAuth flow by opening a popup window and exchanging the access token with Supabase.

