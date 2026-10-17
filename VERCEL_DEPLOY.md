# PB ACADEMIA — Vercel deployment

This is the original React/Vite app with its browser SPA routes and the original Firebase integration. The Gemini AI generation endpoint has a Vercel Function under `api/generate.ts`, alongside the existing `api/chat.ts` and `api/health.ts` functions. Gemini API credentials are kept server-side.

## Deploy and get a live .vercel.app link

1. Extract this ZIP. Upload the **contents of `PB-ACADEMIA-main`** to a GitHub repository, or deploy the directory using the Vercel CLI.
2. In [Vercel](https://vercel.com/new), import the repository. Set **Root Directory** to the directory containing `package.json` and `vercel.json` (the default `/` if you uploaded the contents directly).
3. Framework Preset: **Vite**. Install Command: `npm install` (or Vercel default). Build Command: `npm run build`. Output Directory: `dist`. These settings are also set where appropriate in `vercel.json`.
4. In **Project Settings → Environment Variables**, add:
   - `GEMINI_API_KEY` — required for AI tools and chatbot, **secret/server-side**, without any `VITE_` prefix.
   - `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` — optional overrides for the existing upload settings; see `.env.example`.
   Select **Production** and any Preview/Development environments where you want these features to work. Redeploy after adding variables.
5. Click **Deploy**. The successful deployment will provide a URL such as `https://your-project.vercel.app`.
6. For Firebase Google sign-in, add **the actual Vercel deployment domain** to **Firebase Console → Authentication → Settings → Authorized domains**. Ensure the existing Firebase project's Authentication providers, Firestore rules, and Cloud Storage policies are configured appropriately. Firebase itself is not hosted on Vercel, and this ZIP does not modify Firebase's live settings.
7. Check `/` and a direct/refresh of a client route; check `/api/health` (reports `key: Set` when the Gemini variable exists), then test chatbot/AI features and Firebase login with your own credentials.

## Notes

- Do **not** place `GEMINI_API_KEY` in a `VITE_`-prefixed environment variable: Vite client variables are public.
- The existing `server.ts` and `npm run dev` are unchanged for local development. Vercel uses Vite's static `dist` output and the `api/*.ts` serverless functions instead of running the local Express server.
- No real deployment or live API calls were performed when preparing this ZIP. A working public URL is created only after deploying to your Vercel account.
