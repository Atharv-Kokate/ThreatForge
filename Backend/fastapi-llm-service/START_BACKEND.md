# How to Start the Backend Server

## Quick Start (Windows)

1. **Open Command Prompt or PowerShell**
2. **Navigate to the backend directory:**
   ```cmd
   cd Backend\fastapi-llm-service
   ```

3. **Double-click `start_server.bat`** OR run:
   ```cmd
   start_server.bat
   ```

## Quick Start (Mac/Linux)

1. **Open Terminal**
2. **Navigate to the backend directory:**
   ```bash
   cd Backend/fastapi-llm-service
   ```

3. **Make script executable and run:**
   ```bash
   chmod +x start_server.sh
   ./start_server.sh
   ```

## Manual Start

### Step 1: Navigate to Backend Directory
```bash
cd Backend/fastapi-llm-service
```

### Step 2: Activate Virtual Environment

**Windows:**
```cmd
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### Step 3: Install Dependencies (if not already installed)
```bash
pip install -r requirements.txt
```

### Step 4: Start the Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

OR using the backward-compatible main.py:
```bash
python main.py
```

## Verify Backend is Running

After starting, you should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Test Backend

1. **Open browser:** http://localhost:8000
2. **You should see:**
   ```json
   {
     "message": "OWASP Risk Analysis LLM Service",
     "version": "1.0.0",
     "status": "operational"
   }
   ```

3. **Test health endpoint:** http://localhost:8000/health

## Troubleshooting

### Port 8000 Already in Use
If you get "Address already in use":
- Find what's using port 8000 and stop it
- OR use a different port:
  ```bash
  uvicorn app.main:app --reload --port 8001
  ```
- Then update Frontend `.env` file to match

### Module Not Found Errors
```bash
pip install -r requirements.txt
```

### Database Connection Errors
- Make sure PostgreSQL is running
- Check DATABASE_URL in `.env` file
- Database will be created automatically on first run

### Virtual Environment Issues
```bash
# Remove old venv
rm -rf venv  # Mac/Linux
rmdir /s venv  # Windows

# Create new one
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## Common Issues

1. **"python: command not found"**
   - Use `python3` instead of `python`
   - Or install Python from python.org

2. **"uvicorn: command not found"**
   - Run: `pip install uvicorn[standard]`
   - Or: `pip install -r requirements.txt`

3. **Import errors**
   - Make sure you're in the `Backend/fastapi-llm-service` directory
   - Check that all files are present

## Next Steps

Once backend is running:
1. Keep this terminal window open
2. Start your frontend in a new terminal
3. Try registering a user again

