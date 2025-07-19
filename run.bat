//hosts the tool on your own localhost, in-browser. 

@echo off
where python >nul 2>nul
if %errorlevel%==0 (
    start "" python -m http.server 8000
    timeout /t 2 >nul
    start "" http://localhost:8000/index.html
) else (
    start "" "%CD%\scripts\index.html"
    echo.
    echo Python not found. For full functionality, install Python from https://www.python.org/
    pause
)
