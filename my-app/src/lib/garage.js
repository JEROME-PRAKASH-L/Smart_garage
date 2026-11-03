import { supabase } from './supabase';

async function result(query) {
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export function readServices() {
  return result(supabase.from('services').select('*').order('id'));
}

export function createBooking(form, customerId) {
  return result(supabase.from('bookings').insert({
    customer_id: customerId,
    customer_name: form.customer_name.trim(),
    phone: form.phone,
    vehicle_number: form.vehicle_number.trim(),
    vehicle_type: form.vehicle_type,
    vehicle_brand: form.vehicle_brand,
    vehicle_model: form.vehicle_model,
    service: form.service,
    date: form.date,
    time_slot: form.time_slot,
    pickup_type: form.pickup_type,
    delivery_type: form.delivery_type,
    address: form.address,
    notes: form.notes,
  }).select('id').single());
}

export function readMyBookings(customerId) {
  return result(supabase.from('bookings').select('*')
    .eq('customer_id', customerId).order('created_at', { ascending: false }));
}

export function readBookings() {
  return result(supabase.from('bookings').select('*')
    .order('created_at', { ascending: false }));
}

export function readCustomers() {
  return result(supabase.from('profiles').select('*').eq('role', 'customer')
    .order('created_at', { ascending: false }));
}

export function readDoorstepBookings() {
  return result(supabase.from('bookings').select('*').eq('pickup_type', 'door')
    .order('created_at', { ascending: false }));
}

export function readMessages() {
  return result(supabase.from('contacts').select('*')
    .order('created_at', { ascending: false }));
}

export function updateBookingStatus(id, status) {
  return result(supabase.from('bookings').update({ status }).eq('id', id)
    .select('id').single());
}

export function saveService(service, id) {
  const values = {
    name: service.name.trim(),
    description: service.description,
    price: Number(service.price),
    duration: service.duration,
  };
  const query = id
    ? supabase.from('services').update(values).eq('id', id)
    : supabase.from('services').insert(values);
  return result(query.select('id').single());
}

export function deleteService(id) {
  return result(supabase.from('services').delete().eq('id', id).select('id').single());
}

export function sendMessage(form) {
  return result(supabase.from('contacts').insert(form));
}
