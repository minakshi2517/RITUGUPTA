import { SettingsEditor } from "@/components/admin/forms";
import { getSettings, storageMode } from "@/lib/data";
import { supabaseAuthConfigured } from "@/lib/supabase";

export default async function SettingsPage() {
  const settings = await getSettings();
  const mode = storageMode();
  return (
    <div className="grid max-w-2xl gap-10">
      <SettingsEditor settings={settings} mode={mode} />
      <section className="border-t border-line pt-8 text-ink-soft">
        <h2 className="font-serif text-3xl text-ink">Where this is saved</h2>
        <p className="mt-3">
          {mode === "local"
            ? "On this computer, in the studio file. Add Supabase keys to .env.local before the site goes online."
            : "In your Supabase project."}
        </p>
        <p className="mt-3">
          {supabaseAuthConfigured()
            ? "Sign-in accepts your Supabase user, and the local studio password if it still matches."
            : "Sign-in uses the email and password in .env.local. Change them before sharing the site."}
        </p>
      </section>
    </div>
  );
}
