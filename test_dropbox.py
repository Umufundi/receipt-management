import requests
import json
from datetime import datetime
import os

# Get Dropbox token from environment variable
DROPBOX_TOKEN = os.getenv('DROPBOX_ACCESS_TOKEN')

if not DROPBOX_TOKEN:
    print("Error: DROPBOX_ACCESS_TOKEN environment variable not set")
    exit(1)

def test_dropbox_connection():
    print("Testing Dropbox connection...")
    
    try:
        # Test account info
        headers = {
            "Authorization": f"Bearer {DROPBOX_TOKEN}",
            "Content-Type": "application/json"
        }
        
        # Dropbox API requires a properly formatted JSON request body
        account_response = requests.post(
            "https://api.dropboxapi.com/2/users/get_current_account",
            headers=headers,
            data=json.dumps(None)  # This will be serialized as "null" which is what Dropbox expects
        )
        
        if account_response.status_code == 200:
            account_info = account_response.json()
            print(f"✓ Successfully connected to Dropbox!")
            print(f"✓ Connected as: {account_info['name']['display_name']}")
            
            # Create a test text file
            test_content = f"Test file created at {datetime.now()}".encode()
            
            # Upload the test file
            upload_headers = {
                "Authorization": f"Bearer {DROPBOX_TOKEN}",
                "Dropbox-API-Arg": json.dumps({
                    "path": "/test_connection.txt",
                    "mode": "add",
                    "autorename": True
                }),
                "Content-Type": "application/octet-stream"
            }
            
            upload_response = requests.post(
                "https://content.dropboxapi.com/2/files/upload",
                headers=upload_headers,
                data=test_content
            )
            
            if upload_response.status_code == 200:
                result = upload_response.json()
                print("✓ Test file uploaded successfully")
                print(f"File path: {result['path_display']}")
                print(f"File size: {result['size']} bytes")
            else:
                print("✗ Failed to upload test file")
                print(f"Status code: {upload_response.status_code}")
                print(f"Response: {upload_response.text}")
        else:
            print("✗ Failed to get account info")
            print(f"Status code: {account_response.status_code}")
            print(f"Response: {account_response.text}")
            
    except Exception as e:
        print("✗ Error occurred:")
        print(e)

if __name__ == "__main__":
    test_dropbox_connection() 