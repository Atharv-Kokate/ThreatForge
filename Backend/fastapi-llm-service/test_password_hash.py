"""
Test script to verify password hashing works
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.auth.utils import get_password_hash, verify_password

# Test with various password lengths
test_passwords = [
    "short",
    "normalpassword123",
    "a" * 100,  # 100 character password
    "a" * 200,  # 200 character password
    "test@#$%^&*()_+-=[]{}|;:,.<>?/~`",
]

print("Testing password hashing...")
print("=" * 50)

for password in test_passwords:
    try:
        print(f"\nTesting password length: {len(password)} characters")
        hashed = get_password_hash(password)
        print(f"✅ Hash successful: {hashed[:50]}...")
        
        # Verify it works
        if verify_password(password, hashed):
            print(f"✅ Verification successful")
        else:
            print(f"❌ Verification FAILED")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

print("\n" + "=" * 50)
print("Test complete!")

