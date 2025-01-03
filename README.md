# Receipt Management System

A web-based system for managing receipts, allowing employees to upload receipts and automatically organizing them in Dropbox.

## Features

- Modern, responsive web interface
- Receipt image upload with preview
- Automatic organization in Dropbox by year/month/expense type
- Form validation and error handling
- Status notifications for user feedback
- Automatic token refresh mechanism

## Setup Instructions

### 1. Dropbox Setup

1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Click "Create app"
3. Choose "Scoped access"
4. Choose "Full Dropbox" access
5. Name your app (e.g., "CompanyReceiptManager")
6. In the app settings:
   - Under "Permissions", enable:
     - `files.content.write`
     - `files.content.read`
   - Note down your App Key and App Secret
   - Generate an access token
   - Generate a refresh token (this is important for long-term access)

### 2. Configure Token Refresh

1. Open `refresh_token.py`
2. Replace the placeholder values:
   ```python
   APP_KEY = "YOUR_APP_KEY"
   APP_SECRET = "YOUR_APP_SECRET"
   REFRESH_TOKEN = "YOUR_REFRESH_TOKEN"
   ```
3. Set up automatic token refresh:
   - Windows: Use Task Scheduler
     1. Open Task Scheduler
     2. Create a new task
     3. Set trigger to run daily
     4. Action: Start Program
     5. Program: path to `refresh_token.bat`
   - Linux/Mac:
     1. Add to crontab: `0 0 * * * /path/to/refresh_token.py`

### 3. Configure the Application

1. Open `script.js`
2. The access token will be automatically managed by the refresh mechanism
3. No need to manually update the token anymore

### 4. Deploy the Application

#### Option 1: GitHub Pages
1. Create a new repository on GitHub
2. Push the code to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be available at `https://<username>.github.io/<repository-name>`

#### Option 2: Local Server
1. Install a local server (e.g., Python's HTTP server)
2. Run the server:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
3. Access the application at `http://localhost:8000`

## Folder Structure

The receipts will be automatically organized in Dropbox with the following structure:
```
/Receipts/
    /2024/
        /January/
            /Gas/
                2024-01-15-Shell-50.00.jpg
            /Car Maintenance/
                2024-01-20-AutoShop-150.00.jpg
```

## Security Considerations

1. The Dropbox access token is sensitive information. In a production environment:
   - Store it in environment variables
   - Use a backend server to handle uploads
   - Implement proper authentication

2. The current implementation is for demonstration purposes. For production:
   - Add user authentication
   - Implement CSRF protection
   - Use HTTPS
   - Add rate limiting
   - Implement proper error logging

## Browser Compatibility

Tested and working in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Support

For issues or questions, please:
1. Check the browser console for errors
2. Verify Dropbox token permissions
3. Contact system administrator 

## Token Management

The system now includes automatic token refresh:
- Tokens are refreshed automatically on schedule
- Backups are kept in the `token_backup` directory
- Each refresh updates `script.js` automatically
- Logs are maintained for tracking refresh status

### Manual Token Refresh

If you need to refresh the token manually:
1. Run `refresh_token.bat` (Windows)
2. Or run `python refresh_token.py` (Any OS)

### Troubleshooting Token Issues

If you encounter token-related issues:
1. Check the token backup directory for the latest valid token
2. Verify App Key and App Secret in `refresh_token.py`
3. Ensure the refresh token hasn't been revoked
4. Check the scheduled task/cron job is running 

# Token Refresh Setup

## Environment Variables Setup
For security, sensitive tokens are stored as environment variables. Follow these steps to set them up:

### Windows
1. Open System Properties > Advanced > Environment Variables
2. Under "User variables", click "New" for each variable:
   ```
   GITHUB_TOKEN=your_github_token
   DROPBOX_APP_KEY=your_app_key
   DROPBOX_APP_SECRET=your_app_secret
   DROPBOX_REFRESH_TOKEN=your_refresh_token
   ```

### Linux/Mac
Add to your `~/.bashrc` or `~/.zshrc`:
```bash
export GITHUB_TOKEN=your_github_token
export DROPBOX_APP_KEY=your_app_key
export DROPBOX_APP_SECRET=your_app_secret
export DROPBOX_REFRESH_TOKEN=your_refresh_token
```

## Automatic Token Refresh
The system includes an automatic token refresh mechanism:

1. Run `refresh_token.bat` to manually refresh the token
2. Set up automatic refresh:
   - Windows: Use Task Scheduler to run `refresh_token.bat` daily
   - Linux/Mac: Add a cron job to run `refresh_token.py` daily

### Windows Task Scheduler Setup
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to Daily
4. Action: Start a program
5. Program/script: path_to_refresh_token.bat
6. Start in: path_to_script_directory

### Linux/Mac Cron Setup
Add to crontab (`crontab -e`):
```
0 0 * * * /path/to/python /path/to/refresh_token.py
```

## Security Notes
- Never commit tokens directly to the repository
- Use environment variables for sensitive data
- Keep your tokens secure and rotate them regularly
- Store backups of your tokens in a secure password manager 