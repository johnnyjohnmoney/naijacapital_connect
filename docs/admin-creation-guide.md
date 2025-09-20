# NaijaConnect Capital - Admin Creation Guide

## 🔐 Secure Admin Account Creation

This guide provides multiple secure methods to create administrator accounts for NaijaConnect Capital platform.

### ⚠️ Security Notice

- Admin accounts should NEVER be created through public registration
- All admin creation methods require secure authentication or secret keys
- Change the ADMIN_SECRET_KEY in production environments

---

## Method 1: CLI Script (Recommended)

### Prerequisites

- tsx package installed (already in devDependencies)
- Database connection available
- Run from project root directory

### Usage

```bash
npm run create-admin
```

The script will:

1. Check for existing admin accounts
2. Prompt for admin details securely
3. Validate input and create the account
4. Display success confirmation

---

## Method 2: Direct API Call

### Using the secure API endpoint with secret key

```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Name",
    "email": "admin@naijaconnect.com",
    "password": "SecurePassword123",
    "adminSecretKey": "NaijaConnect-Admin-2024-SecureKey-ChangeThis"
  }'
```

### Response

```json
{
  "message": "Administrator account created successfully",
  "admin": {
    "id": "admin-id",
    "name": "Admin Name",
    "email": "admin@naijaconnect.com",
    "role": "ADMINISTRATOR",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Method 3: Admin-to-Admin Creation

### For existing admins to create new admin accounts

```bash
# First login and get session/token, then:
curl -X PUT http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "New Admin Name",
    "email": "newadmin@naijaconnect.com",
    "password": "SecurePassword123"
  }'
```

---

## 🛡️ Security Features

### 1. Secret Key Protection

- Requires `ADMIN_SECRET_KEY` environment variable
- Key must match for initial admin creation
- Change default key in production

### 2. Admin Session Authentication

- Existing admins can create new admins
- Requires valid admin session
- No secret key needed for authenticated requests

### 3. Email Uniqueness

- Prevents duplicate accounts
- Validates email format
- Normalizes email to lowercase

### 4. Password Security

- Minimum 8 characters required
- Hashed with bcrypt (12 rounds)
- Secure input handling in CLI script

### 5. Input Validation

- Zod schema validation
- Comprehensive error handling
- Sanitized input processing

---

## 🔧 Environment Setup

### Required Environment Variables

Add to `.env.local`:

```bash
# CHANGE THIS IN PRODUCTION!
ADMIN_SECRET_KEY="NaijaConnect-Admin-2024-SecureKey-ChangeThis"
```

### Database Setup

Ensure your database is running and Prisma is configured:

```bash
npm run db:generate
npm run db:push
```

---

## 📝 Usage Examples

### Creating First Admin

```bash
# Use the CLI script (recommended)
npm run create-admin

# Follow the prompts:
# Enter admin full name: John Doe
# Enter admin email: admin@naijaconnect.com
# Enter admin password: ********
# Confirm password: ********
```

### Verifying Admin Creation

1. Go to http://localhost:3000/auth/signin
2. Login with admin credentials
3. You should be redirected to the admin dashboard
4. Verify admin features are accessible

---

## ⚡ Quick Start

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Create your first admin** (in a new terminal):

   ```bash
   npm run create-admin
   ```

3. **Login and test**:
   - Visit: http://localhost:3000/auth/signin
   - Use the admin credentials you just created
   - Access admin dashboard: http://localhost:3000/dashboard

---

## 🚨 Production Notes

### Before Deployment:

1. **Change the ADMIN_SECRET_KEY** to a strong, unique value
2. **Use environment variables** for all sensitive configuration
3. **Restrict API access** to admin creation endpoints
4. **Consider rate limiting** for admin creation attempts
5. **Monitor admin account creation** logs
6. **Use HTTPS** in production environments

### Additional Security Measures:

- Implement IP allowlisting for admin creation
- Add multi-factor authentication for admin accounts
- Regular audit of admin account activity
- Implement account lockout after failed attempts
