# Ritu Gupta

A personal literary site with a private studio at `/admin`.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The studio is at [http://localhost:3000/admin](http://localhost:3000/admin). The local sign-in is in `.env.local`.

Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` before the site is shared.

## What you can edit

From the studio, without touching code:

- Homepage copy, portrait, announcement, and featured work
- About page
- Books, poems, writing, and Spotify audio
- Substack and Spotify profile links
- Elsewhere links
- Contact details
- Images

Publishing, unpublishing, featuring, and deleting update the public pages.

Until Supabase is connected, content is stored in `data/store.json` on this computer.

## Supabase

1. Create a project.
2. Paste `supabase/schema.sql` into the SQL editor and run it.
3. Under Authentication, create one user and turn off public sign-ups.
4. Add these to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service role key stays on the server. Do not put it in client code.

When those values are present, the studio saves to Supabase instead of the local file. Sign-in accepts the Supabase user.
