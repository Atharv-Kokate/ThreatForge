"""
Simple script to test if the server can start and respond
"""
import requests
import time
import sys

def test_server():
    """Test if server is running on localhost:8000"""
    url = "http://localhost:8000"
    
    print("Testing backend server connection...")
    print(f"URL: {url}")
    print("-" * 50)
    
    try:
        response = requests.get(url, timeout=5)
        print(f"✅ SUCCESS! Server is running!")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Cannot connect to server")
        print("   The backend server is NOT running on port 8000")
        print("\n   To start the server, run:")
        print("   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        return False
    except requests.exceptions.Timeout:
        print("❌ ERROR: Connection timeout")
        print("   Server might be starting up, try again in a few seconds")
        return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Backend Server Connection Test")
    print("=" * 50)
    print()
    
    if not test_server():
        print()
        print("=" * 50)
        print("TROUBLESHOOTING:")
        print("=" * 50)
        print("1. Make sure you're in the Backend/fastapi-llm-service directory")
        print("2. Activate virtual environment: venv\\Scripts\\activate")
        print("3. Start server: python -m uvicorn app.main:app --reload --port 8000")
        print("4. Wait for 'Application startup complete' message")
        print("5. Then run this test again")
        sys.exit(1)
    else:
        print()
        print("=" * 50)
        print("✅ Backend is ready!")
        print("=" * 50)

