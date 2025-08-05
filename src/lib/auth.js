import { supabase } from './supabaseClient';

export async function getUserProfile() {
  const user = supabase.auth.user();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return { id: user.id, email: user.email, role: data.role };
}

export function setupAuthListener() {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = session.user;
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          role: 'user', // default role
        });
      }
    }
  });
}
