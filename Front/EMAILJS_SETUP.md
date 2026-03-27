# EmailJS Setup Guide

This guide will help you set up EmailJS to send OTP emails in your application.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (free tier includes 200 emails/month)

## Step 2: Create an Email Service

1. Log in to your EmailJS dashboard: [https://dashboard.emailjs.com/admin](https://dashboard.emailjs.com/admin)
2. Click on **"Email Services"** in the left sidebar
3. Click **"Add New Service"**
4. Choose your email provider (Gmail, Outlook, etc.) or use "Custom SMTP Server"
5. Follow the setup instructions for your chosen provider
6. Once created, note down your **Service ID** (e.g., `service_abc123`)

## Step 3: Create an Email Template

1. Click on **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. Give it a name (e.g., "OTP Verification")
4. In the template editor, create your email template:

   **Subject:** `Your OTP Code`
   
   **Body:**
   ```
   Hello {{to_name}},
   
   Your OTP code is: {{otp}}
   
   This code will expire in 10 minutes.
   
   If you didn't request this code, please ignore this email.
   ```

5. The template variables `{{to_name}}`, `{{otp}}`, and `{{to_email}}` will be automatically replaced
6. Click **"Save"**
7. Note down your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Your Public Key

1. Click on **"Account"** in the left sidebar
2. Go to **"General"** tab
3. Find your **Public Key** (e.g., `abcdefghijklmnop`)

## Step 5: Configure Your Application

1. In the `Front` directory, create a `.env` file (if it doesn't exist)
2. Add the following variables:

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. Replace the placeholder values with your actual credentials:
   - `your_service_id_here` → Your Service ID from Step 2
   - `your_template_id_here` → Your Template ID from Step 3
   - `your_public_key_here` → Your Public Key from Step 4

## Step 6: Restart Your Development Server

After creating/updating the `.env` file:

1. Stop your React development server (Ctrl+C)
2. Start it again with `npm start`

**Important:** React requires environment variables to be prefixed with `REACT_APP_` and you must restart the server for changes to take effect.

## Example .env File

```env
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=abcdefghijklmnop
```

## Testing

1. Make sure your `.env` file is properly configured
2. Start your application
3. Try signing up or logging in
4. Check your email for the OTP code

## Troubleshooting

- **"EmailJS configuration is missing"**: Make sure your `.env` file exists and has all three variables
- **"Failed to send OTP email"**: 
  - Check that your Service ID, Template ID, and Public Key are correct
  - Verify your email service is properly connected in EmailJS dashboard
  - Check the browser console for detailed error messages
- **Environment variables not working**: 
  - Make sure variables start with `REACT_APP_`
  - Restart your development server after creating/updating `.env`
  - Check that `.env` is in the `Front` directory (same level as `package.json`)

## Security Note

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- For production, set these environment variables in your hosting platform (Vercel, Netlify, etc.)
