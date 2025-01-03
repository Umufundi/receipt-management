@echo off
echo Installing required packages...
pip install requests

echo.
echo Please ensure you have set the following environment variables:
echo - GITHUB_TOKEN
echo - DROPBOX_APP_KEY
echo - DROPBOX_APP_SECRET
echo - DROPBOX_REFRESH_TOKEN

echo.
echo Refreshing Dropbox token...
python refresh_token.py

echo.
echo Press any key to exit...
pause > nul 