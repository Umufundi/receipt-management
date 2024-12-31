# Receipt Management System

A web-based system for managing receipts, allowing employees to upload receipts and automatically organizing them in Dropbox.

## Features

- Modern, responsive web interface
- Receipt image upload with preview
- Automatic organization in Dropbox by year/month/expense type
- Form validation and error handling
- Status notifications for user feedback

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
   - Generate an access token
   - Copy the access token

### 2. Configure the Application

1. Open `script.js`
2. Replace the empty `dropboxAccessToken` value with your token:
   ```javascript
   const config = {
       dropboxAccessToken: 'YOUR_ACCESS_TOKEN_HERE',
       uploadEndpoint: 'https://content.dropboxapi.com/2/files/upload'
   };
   ```

### 3. Deploy the Application

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