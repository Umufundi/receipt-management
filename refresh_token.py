import os
import subprocess
from datetime import datetime
import re

# Load token from environment variable
DROPBOX_ACCESS_TOKEN = os.getenv('DROPBOX_ACCESS_TOKEN')

# Validate environment variable
if not DROPBOX_ACCESS_TOKEN:
    print("Error: Missing DROPBOX_ACCESS_TOKEN environment variable")
    exit(1)

def update_token_in_file():
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
            f"dropboxAccessToken: '{DROPBOX_ACCESS_TOKEN}'",
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
    print("Starting token update process...")
    if update_token_in_file():
        print("Token update completed successfully")
    else:
        print("Failed to update token in file")

if __name__ == "__main__":
    main() 