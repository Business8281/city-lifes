# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/06589d33-2c62-4311-98dd-430f000dd51c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/06589d33-2c62-4311-98dd-430f000dd51c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## App icons and splash screens

This repo includes a helper script to generate all required icons for Web, iOS, and Android from `public/icon.svg`.

- iOS app icons must NOT contain transparency. The script generates opaque (no alpha) PNGs for iOS to satisfy Xcode.
- Output files are written to `ios/App/App/Assets.xcassets/AppIcon.appiconset` and Android `res` directories.

To regenerate icons locally:

```sh
bash ./generate-icons.sh
# then sync native projects
npx cap sync
```

If you see an Xcode error like:

> Failed to generate flattened icon stack for icon named 'AppIcon'

run the script above to ensure all sizes exist and the iOS icons are opaque (no alpha) and try building again.

## How can I deploy this project?

### Hostinger (Apache) static hosting

This is a Vite React SPA — deploy the built `dist/` to your Hostinger site's document root and add an Apache rewrite for client-side routing.

1) Configure environment for production

Create `.env.production` at repo root using `.env.production.example` and fill your Supabase values:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

2) Build production assets

```
npm ci
npm run build
```

3) Ensure SPA rewrites

An Apache `.htaccess` is provided in `public/.htaccess` and will be copied to `dist/.htaccess` on build. It rewrites unknown routes to `index.html` so React Router works on refresh/deep links.

4) Upload to Hostinger

- In hPanel → Files → File Manager, open your domain's `public_html/` (or subdomain root).
- Upload the contents of `dist/` (not the folder itself). Ensure `index.html`, `assets/`, and `.htaccess` are present in the root.

5) Configure SSL and DNS

- Issue a Let’s Encrypt SSL for your domain in hPanel → Security → SSL.
- If issuance fails due to CAA, add a CAA record for `letsencrypt.org` and retry.

6) Supabase Auth settings

- In Supabase Dashboard → Authentication → URL Configuration:
	- Site URL: `https://your-domain.com`
	- Redirect URLs: add `https://your-domain.com/auth/callback`
- For Google provider: ensure authorized domains include your domain in Google Cloud Console.

Common pitfalls

- Missing `.htaccess` → 404s on refresh. Ensure the file exists in the deployed root.
- Wrong env keys at build time → auth/API calls fail in production. Rebuild after fixing `.env.production`.
- Mixed content/HTTP → force HTTPS in Hostinger and Supabase URLs.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
