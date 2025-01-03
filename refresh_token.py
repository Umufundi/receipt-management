import requests
import json
import os
import subprocess
from datetime import datetime
import re

# Load tokens from environment variables
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
DROPBOX_APP_KEY = os.getenv('DROPBOX_APP_KEY')
DROPBOX_APP_SECRET = os.getenv('DROPBOX_APP_SECRET')
DROPBOX_REFRESH_TOKEN = os.getenv('DROPBOX_REFRESH_TOKEN')

# Validate environment variables
if not all([GITHUB_TOKEN, DROPBOX_APP_KEY, DROPBOX_APP_SECRET, DROPBOX_REFRESH_TOKEN]):
    print("Error: Missing required environment variables")
    print("Please set all required environment variables:")
    print("- GITHUB_TOKEN")
    print("- DROPBOX_APP_KEY")
    print("- DROPBOX_APP_SECRET")
    print("- DROPBOX_REFRESH_TOKEN")
    exit(1)

# GitHub settings
GITHUB_REPO = "Umufundi/receipt-management"
GITHUB_API_BASE = "https://api.github.com"

def refresh_access_token():
    """Refresh the Dropbox access token using the refresh token."""
    try:
        response = requests.post(
            "https://api.dropboxapi.com/oauth2/token",
            data={
                "grant_type": "refresh_token",
                "refresh_token": DROPBOX_REFRESH_TOKEN,
                "client_id": DROPBOX_APP_KEY,
                "client_secret": DROPBOX_APP_SECRET
            }
        )
        response.raise_for_status()
        return response.json()["access_token"]
    except Exception as e:
        print(f"Error refreshing token: {str(e)}")
        return None

def update_token_in_file(new_token):
    """Update the access token in script.js and create a backup."""
    try:
        # Create a backup of the current script.js
        backup_name = f"script.js.bak.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        subprocess.run(["copy", "script.js", backup_name], shell=True, check=True)
        
        # Read the current content
        with open("script.js", "r") as f:
            content = f.read()
        
        # Update the token using regex
        updated_content = re.sub(
            r"dropboxAccessToken:\s*'[^']*'",
            f"dropboxAccessToken: '{new_token}'",
            content
        )
        
        # Write the updated content
        with open("script.js", "w") as f:
            f.write(updated_content)
        
        print(f"Token updated successfully. Backup created as {backup_name}")
        return True
    except Exception as e:
        print(f"Error updating token in file: {str(e)}")
        return False

def main():
    print("Starting token refresh process...")
    new_token = refresh_access_token()
    
    if new_token:
        if update_token_in_file(new_token):
            print("Token refresh completed successfully")
        else:
            print("Failed to update token in file")
    else:
        print("Failed to refresh token")

if __name__ == "__main__":
    main() 