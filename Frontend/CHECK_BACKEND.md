# Backend Connection Troubleshooting

## Quick Check

1. **Is the backend running?**
   ```bash
   # In Backend/fastapi-llm-service directory
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Test backend directly in browser:**
   - Open: http://localhost:8000
   - You should see: `{"message":"OWASP Risk Analysis LLM Service","version":"1.0.0","status":"operational"}`

3. **Test backend health endpoint:**
   - Open: http://localhost:8000/health
   - You should see: `{"status":"healthy","service":"OWASP Risk Analysis LLM Service"}`

4. **Check frontend API URL:**
   - Open browser console (F12)
   - Look for: `API Base URL: http://localhost:8000`
   - If it shows a different URL, check your `.env` file

## Common Issues

### Backend not running
- **Solution**: Start the backend server
- **Command**: `cd Backend/fastapi-llm-service && uvicorn app.main:app --reload`

### Wrong port
- **Check**: Backend might be running on a different port
- **Solution**: Update `VITE_API_BASE_URL` in Frontend `.env` file

### Firewall blocking
- **Check**: Windows Firewall might be blocking port 8000
- **Solution**: Allow port 8000 through firewall or use a different port

### Database connection error
- **Check**: Backend logs for database errors
- **Solution**: Ensure PostgreSQL is running and database exists

## Verify Connection

Run this in browser console on your frontend:
```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

If this works, the backend is reachable. If not, check backend is running.

