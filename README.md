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

Simply open [Lovable](https://lovable.dev/projects/06589d33-2c62-4311-98dd-430f000dd51c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
