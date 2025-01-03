@echo off
echo Pushing GitHub Actions workflow...

:: Add workflow file
git add .github/workflows/deploy.yml

:: Commit changes
git commit -m "Add GitHub Actions workflow for automatic deployment"

:: Push to GitHub
git push origin main

echo.
echo Workflow has been pushed!
echo The site will now automatically deploy when you push changes to main
echo.
echo Press any key to exit...
pause > nul 