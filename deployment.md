# Deployment Guide

This document provides instructions for deploying the Tours & Detours website to production.

## Recommended Platforms

We recommend using modern frontend hosting platforms like **Vercel**, **Netlify**, or **GitHub Pages**.

### 1. Vercel (Recommended)
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project in Vercel.
3. Vercel will automatically detect Vite and use `npm run build` as the build command and `dist` as the output directory.
4. **Environment Variables**: Add any necessary environment variables in the Vercel dashboard.

### 2. Netlify
1. Connect your repository to Netlify.
2. Set Build command to `npm run build`.
3. Set Publish directory to `dist`.

## Security Best Practices for Deployment

### Content Security Policy (CSP)
We've added a basic CSP via meta tag in `index.html`. For enhanced security, consider setting these via HTTP headers in your hosting provider's configuration:

**Vercel (`vercel.json`):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://wa.me; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## Maintenance
- **Admin Interface**: Accessible via `/admin`. Changes made there are stored in the browser's `localStorage`. For a multi-user environment, a real backend database would be required.
- **Backups**: Periodically download the `localStorage` data if you make significant changes via the admin panel.
