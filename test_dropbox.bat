@echo off
echo Installing required Python packages...
pip install -r requirements.txt

echo.
echo Running Dropbox connection test...
python test_dropbox.py

echo.
echo Press any key to exit...
pause > nul 