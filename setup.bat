@echo off
echo Setting up Git repository...

:: Configure Git
git config --global user.name "Umufundi"
git config --global user.email "florentinniyongere.fn@gmail.com"

:: Initialize Git if not already initialized
git init

:: Add all files
git add .

:: Create initial commit
git commit -m "Initial commit: Receipt Management System"

:: Add remote (using HTTPS)
git remote remove origin
git remote add origin https://github.com/Umufundi/receipt-management.git

:: Create and switch to main branch
git branch -M main

:: Push to GitHub (this will prompt for credentials)
git push -u origin main

echo.
echo Git setup completed!
echo Repository should now be available at: https://github.com/Umufundi/receipt-management
echo.
echo Press any key to exit...
pause > nul 