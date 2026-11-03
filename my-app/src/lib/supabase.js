import { createClient } from '@supabase/supabase-js';

// The publishable key is intended for browser use. Database policies protect access.
export const supabase = createClient(
  'https://ivhvsyqvlyuptlemqyvs.supabase.co',
  'sb_publishable_h_4G2TQ_FxzWB0ncVEz9xQ_Naw88LPR',
);

export function sessionUser(session) {
  const user = session?.user;
  if (!user) return null;

  return {
    id: user.id,
    name: user.user_metadata?.name || user.email,
    email: user.email,
    mobile: user.user_metadata?.mobile || '',
    role: user.app_metadata?.role === 'admin' ? 'admin' : 'customer',
  };
}
