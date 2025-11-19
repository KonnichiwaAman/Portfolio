# Deployment Instructions for Netlify

## Prerequisites

1.  **Netlify Account**: Create an account at [netlify.com](https://www.netlify.com/).
2.  **GitHub Repository**: Ensure your project is pushed to a GitHub repository.
3.  **Resend API Key**: You need an API key from [Resend](https://resend.com/) for the contact form to work.

## Steps to Deploy

1.  **Log in to Netlify** and click **"Add new site"** > **"Import an existing project"**.
2.  **Connect to GitHub** and select your repository (`Portfolio-main`).
3.  **Configure Build Settings**:
    *   **Base directory**: (leave empty)
    *   **Build command**: `npm install --legacy-peer-deps && npm run build`
    *   **Publish directory**: `dist`
    *   **Functions directory**: `functions` (Netlify should detect this automatically)

4.  **Environment Variables**:
    Click on **"Show advanced"** or go to **Site Settings > Environment variables** after the site is created. Add the following variables:
    *   `RESEND_API_KEY`: Your Resend API key (starts with `re_`).
    *   `CONTACT_EMAIL`: The email address where you want to receive contact form submissions (e.g., `helloamanawasthi@gmail.com`).
    *   `NODE_VERSION`: `18` (This is also set in `netlify.toml`, but good to double-check).

5.  **Deploy**: Click **"Deploy site"**.

## Post-Deployment

*   **Contact Form**: Test the contact form to ensure emails are being sent.
*   **CMS**: Access the CMS at `your-site-url/admin`. You may need to enable **Identity** and **Git Gateway** in Netlify Site Settings > Identity.

## Local Development

To run the project locally with the serverless functions, use the Netlify CLI:

1.  Install Netlify CLI: `npm install -g netlify-cli`
2.  Link your site: `netlify link`
3.  Run dev server: `netlify dev`

This will start a local server that emulates the Netlify environment, including the functions.
