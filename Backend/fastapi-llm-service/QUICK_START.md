# 🚀 QUICK START - Backend Server

## ⚠️ IMPORTANT: You MUST start the backend before using the frontend!

---

## Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter
- OR right-click Start → "Windows PowerShell" or "Terminal"

**Mac/Linux:**
- Open Terminal app

---

## Step 2: Navigate to Backend Directory

```bash
cd Backend\fastapi-llm-service
```

**Full path example (Windows):**
```cmd
cd C:\Users\athar\OWASP-Risks\Backend\fastapi-llm-service
```

---

## Step 3: Activate Virtual Environment

**Windows:**
```cmd
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

**If venv doesn't exist, create it first:**
```bash
python -m venv venv
# Then activate (use command above)
```

---

## Step 4: Install Dependencies (First Time Only)

```bash
pip install -r requirements.txt
```

---

## Step 5: Start the Server

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**OR use the simple method:**
```bash
python main.py
```

---

## ✅ Success Looks Like This:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     CORS allowed origins: ['http://localhost:5173', ...]
INFO:     Application startup complete.
```

---

## 🧪 Test if Server is Running

**Option 1: Open in Browser**
- Go to: http://localhost:8000
- You should see JSON response

**Option 2: Run Test Script**
```bash
python test_server.py
```

---

## ❌ Common Problems

### Problem: "python: command not found"
**Solution:** 
- Try `python3` instead
- Or install Python from python.org

### Problem: "No module named 'uvicorn'"
**Solution:**
```bash
pip install uvicorn[standard]
```

### Problem: "Address already in use"
**Solution:**
- Something else is using port 8000
- Close that program
- OR use different port: `--port 8001`

### Problem: Import errors
**Solution:**
- Make sure you're in `Backend\fastapi-llm-service` directory
- Check all files are present

---

## 📝 Keep Terminal Open!

**IMPORTANT:** Don't close the terminal window where the server is running!
- The server must stay running for the frontend to work
- To stop server: Press `Ctrl + C` in the terminal

---

## 🔄 After Starting Backend

1. ✅ Server is running (you see the INFO messages)
2. ✅ Test in browser: http://localhost:8000 works
3. ✅ Go to frontend and try registration again

---

## 🆘 Still Not Working?

1. **Check if port 8000 is free:**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   
   # Mac/Linux
   lsof -i :8000
   ```

2. **Try different port:**
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```
   Then update Frontend `.env` to use port 8001

3. **Check firewall:**
   - Windows Firewall might be blocking
   - Temporarily disable to test

4. **Check Python version:**
   ```bash
   python --version
   ```
   Should be Python 3.8 or higher

