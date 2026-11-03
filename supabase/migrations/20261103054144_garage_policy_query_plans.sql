alter policy services_admin_insert on public.services with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy services_admin_update on public.services using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin') with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy services_admin_delete on public.services using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy bookings_admin_update on public.bookings using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin') with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy contacts_admin_select on public.contacts using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy profiles_select on public.profiles using ((select auth.uid()) = id or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy bookings_select on public.bookings using ((select auth.uid()) = customer_id or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

