create schema if not exists garage_private;
revoke all on schema garage_private from public, anon, authenticated;

create or replace function garage_private.sync_garage_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.raw_user_meta_data ->> 'smart_garage' = 'true' then
    insert into public.profiles (id, name, email, mobile, dob, role)
    values (
      new.id,
      coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), new.email),
      new.email,
      new.raw_user_meta_data ->> 'mobile',
      nullif(new.raw_user_meta_data ->> 'dob', '')::date,
      case when new.raw_app_meta_data ->> 'role' = 'admin' then 'admin' else 'customer' end
    )
    on conflict (id) do update set
      name = excluded.name,
      email = excluded.email,
      mobile = excluded.mobile,
      dob = excluded.dob,
      role = excluded.role;
  end if;
  return new;
end;
$$;
revoke all on function garage_private.sync_garage_profile() from public, anon, authenticated;
drop trigger if exists smart_garage_auth_profile on auth.users;
create trigger smart_garage_auth_profile
after insert or update of raw_user_meta_data, raw_app_meta_data, email on auth.users
for each row execute function garage_private.sync_garage_profile();

drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
using ((select auth.uid()) = id or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists bookings_select_own on public.bookings;
drop policy if exists bookings_admin_select on public.bookings;
create policy bookings_select on public.bookings for select to authenticated
using ((select auth.uid()) = customer_id or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant usage on schema public to anon, authenticated;
revoke all on public.profiles, public.services, public.bookings, public.contacts from anon, authenticated;
grant select on public.services to anon, authenticated;
grant select on public.profiles, public.bookings, public.contacts to authenticated;
grant insert (name, description, price, duration), update (name, description, price, duration), delete on public.services to authenticated;
grant insert (customer_id, customer_name, phone, vehicle_number, vehicle_type, vehicle_brand, vehicle_model, service, date, time_slot, pickup_type, delivery_type, address, notes) on public.bookings to authenticated;
grant update (status) on public.bookings to authenticated;
grant insert (name, email, phone, message) on public.contacts to anon, authenticated;
grant usage on sequence public.services_id_seq, public.bookings_id_seq to authenticated;
grant usage on sequence public.contacts_id_seq to anon, authenticated;

alter table public.services add constraint garage_service_price_nonnegative check (price >= 0);
alter table public.contacts add constraint garage_contact_content check (
  length(trim(name)) between 1 and 100 and
  length(email) between 3 and 254 and
  length(trim(message)) between 1 and 5000
);
alter table public.bookings add constraint garage_booking_content check (
  length(trim(customer_name)) between 1 and 100 and
  length(trim(vehicle_number)) between 1 and 50 and
  length(trim(service)) between 1 and 100
);

