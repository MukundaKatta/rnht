# Historical SQL, not part of the migration set

These four files were applied by hand in the Supabase SQL editor before the
numbered `supabase/migrations/` folder existed. `supabase db push` never read
them, which is why the numbered set could not rebuild the database on its own.

Their objects now live in `migrations/000_baseline_profiles_slides_activities.sql`.
Keep these for reference; do not run them.
