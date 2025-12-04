# Debugging 404 Error

## ✅ Good News: Server IS Running!

A 404 error means the server is responding, but the route isn't found.

## Quick Checks

### 1. Check Available Routes

Open in browser:
```
http://localhost:8000/docs
```

This shows all available endpoints in Swagger UI.

### 2. Test Routes Endpoint

Open in browser:
```
http://localhost:8000/test-routes
```

This will show all registered routes.

### 3. Verify Registration Endpoint

Try directly in browser (will show method not allowed, but confirms route exists):
```
http://localhost:8000/auth/register
```

Should show: `{"detail":"Method Not Allowed"}` (not 404)

## Common Causes

### 1. Server Not Restarted After Code Changes

**Solution:**
- Stop server (Ctrl+C)
- Restart: `python main.py`

### 2. Wrong URL Path

**Check:**
- Frontend should call: `/auth/register`
- Full URL: `http://localhost:8000/auth/register`
- NOT: `/register` or `/api/auth/register`

### 3. Routes Not Loaded

**Check backend logs for:**
```
INFO:     Application startup complete.
```

If you see import errors, routes won't load.

## Test Registration Endpoint Directly

### Using curl (if available):
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"test123"}'
```

### Using PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"test@test.com","username":"testuser","password":"test123"}'
```

## Check Browser Console

In frontend, open browser console (F12) and check:
1. What URL is being called?
2. What's the full error response?

## Verify Backend Logs

When you try to register, check the backend terminal:
- Do you see the request coming in?
- Any error messages?

## Quick Fix: Restart Backend

1. Stop backend (Ctrl+C in terminal)
2. Restart: `python main.py`
3. Wait for "Application startup complete"
4. Try registration again

