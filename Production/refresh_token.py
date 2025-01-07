import os
import subprocess
from datetime import datetime
import re
import pytz
import json

# Load token from environment variable
DROPBOX_ACCESS_TOKEN = os.getenv('DROPBOX_ACCESS_TOKEN')

# Validate environment variable
if not DROPBOX_ACCESS_TOKEN:
    print("Error: Missing DROPBOX_ACCESS_TOKEN environment variable")
    exit(1)

def update_token_in_file():
    """Update the access token in script.js."""
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(script_dir, "script.js")
        
        # Read the current content
        with open(script_path, "r") as f:
            content = f.read()
        
        # Get current time in Eastern Time
        eastern = pytz.timezone('America/New_York')
        current_time = datetime.now(eastern)
        
        # Create new config object
        new_config = {
            'accessToken': DROPBOX_ACCESS_TOKEN,
            'lastUpdated': current_time.isoformat(),
            'expiryHours': 4
        }
        
        # Format the new configuration
        new_config_str = f"""// Dropbox Configuration
window.dropboxConfig = {{
    accessToken: '{new_config["accessToken"]}',
    lastUpdated: '{new_config["lastUpdated"]}',
    expiryHours: {new_config["expiryHours"]}
}};"""
        
        # Replace the existing configuration using a more precise regex
        pattern = r'\/\/ Dropbox Configuration\s*window\.dropboxConfig\s*=\s*{[\s\S]*?};'
        new_content = re.sub(pattern, new_config_str, content)
        
        # Write the updated content
        with open(script_path, "w") as f:
            f.write(new_content)
        
        print(f"Token updated successfully in {script_path}")
        return True
    except Exception as e:
        print(f"Error updating token in file: {str(e)}")
        return False

def main():
    print("Starting token update process...")
    if update_token_in_file():
        print("Token update completed successfully")
    else:
        print("Failed to update token in file")

if __name__ == "__main__":
    main() 