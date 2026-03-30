# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth for your TiffinHub application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step-by-Step Setup

### 1. Go to Google Cloud Console

1. Visit https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Make sure billing is enabled (Google OAuth is free, but requires billing enabled)

### 2. Enable Google+ API

1. In the left sidebar, go to **APIs & Services > Library**
2. Search for "Google+ API"
3. Click on it and click **Enable**

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Select **External** (unless you want internal only)
3. Click **Create**

Fill in the required fields:

- **App name**: TiffinHub (or your preferred name)
- **User support email**: your email
- **Developer contact**: your email

**Scopes** (add these):
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`

**Test users** (if in testing mode):
- Add your email address as a test user
- You can add other test emails too

Click **Save and Continue** through the summary.

### 4. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Name: `TiffinHub Web Client` (or any name)

**Authorized redirect URIs** (IMPORTANT):
Add these exact URLs (adjust port if needed):

```
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

For production, add:
```
https://yourdomain.com/api/auth/callback/google
```

5. Click **Create**

You'll see:
- **Client ID** (something like `123456789-abc.apps.googleusercontent.com`)
- **Client Secret** (a long string)

### 5. Update Your `.env.local` File

Open `/Users/apple/Desktop/project/.env.local` and add:

```env
# OAuth Providers
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

**Important**: Remove the empty quotes and use the actual values from Google Cloud Console.

### 6. Update NEXTAUTH_SECRET (if not already)

```bash
openssl rand -base64 32
```

Copy the output and update:
```env
NEXTAUTH_SECRET="your-generated-secret-key"
```

### 7. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 8. Test Google OAuth

1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. You should be redirected to Google's consent screen
4. After approving, you'll be logged in and redirected to the dashboard

**Note**: If you're still in "Testing" mode in Google OAuth consent, only test users you added can sign in. Add your email as a test user or publish your app to move to production.

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check that there are no typos
- Ensure the protocol (http vs https) is correct

### Error: "access_denied" or "Error 403: access_denied"
- Make sure your app is configured correctly in the OAuth consent screen
- Check that you've added the required scopes
- If in testing mode, ensure your email is added as a test user

### Error: "invalid_request" or missing GOOGLE_CLIENT_ID
- Verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env.local`
- Restart the Next.js server after updating `.env.local`
- Check that there are no extra spaces or quotes in the values

### Button shows "Not Configured" or is disabled
- The environment variables are not set or the server hasn't been restarted
- Make sure you saved `.env.local` and restarted the server

### "Error: unauthorized_email"
- The email you're trying to sign in with is not allowed
- If your OAuth app is in "Testing" mode, add this email as a test user in the OAuth consent screen

## Production Deployment

When deploying to production:

1. Add your production domain to **Authorized redirect URIs**:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

2. Update `.env.local` (or your hosting platform's environment variables) with the same `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

3. Update `NEXTAUTH_URL` to your production URL:
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   ```

4. Consider moving from "Testing" to "Production" in the OAuth consent screen (requires verification by Google if requesting sensitive scopes)

## Need Help?

- Check the NextAuth.js Google Provider docs: https://next-auth.js.org/providers/google
- Google Cloud Console OAuth docs: https://cloud.google.com/endpoints/docs/openapi/enable-google-authentication
