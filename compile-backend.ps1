# Compile Backend
Write-Host "Compiling Java Backend..." -ForegroundColor Green

# Create bin directory if it doesn't exist
New-Item -Path "backend\bin" -ItemType Directory -Force | Out-Null

# Navigate to backend source directory
Set-Location -Path "backend\src\main\java"

# Compile all Java files
javac -d "..\..\..\bin" `
    com\quiz\model\*.java `
    com\quiz\handler\*.java `
    com\quiz\manager\*.java `
    com\quiz\client\*.java `
    com\quiz\QuizServer.java

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend compiled successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Compilation failed!" -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location -Path "..\..\.."
