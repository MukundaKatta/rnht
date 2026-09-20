-- 019: a deleted account's gifts must never re-attach to whoever next controls
-- that email address.
--
-- delete-account keeps donations for the temple's tax records but only clears
-- user_id. donor_email stays on the row, and the 012 back-link trigger matches
-- on donor_email alone, so the next person to sign up with that address (the
-- donor again, a recycled corporate/ISP address, or someone else on a shared
-- family address) inherited the whole giving history and could print 501(c)(3)
-- receipts for it in their own name.
--
-- The records still have to survive for the IRS, so nothing is deleted here:
-- delete-account now stamps custom_fields.account_deleted = true on the rows it
-- releases, and the trigger below refuses to re-link anything carrying that
-- stamp. Idempotent.

create or replace function public.backlink_guest_donations()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null or btrim(new.email) = '' then
    return new;
  end if;
  update public.donations d
     set user_id = new.id
   where d.user_id is null
     and lower(btrim(d.donor_email)) = lower(btrim(new.email))
     -- Never re-link a gift released by an account deletion.
     and coalesce(d.custom_fields ->> 'account_deleted', 'false') <> 'true';
  return new;
end;
$$;
