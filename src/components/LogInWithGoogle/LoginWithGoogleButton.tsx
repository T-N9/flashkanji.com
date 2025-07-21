'use client'

import { supabase } from '@/lib/supabaseClient'
import { Button } from '@heroui/react';

export default function LoginWithGoogleButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  }

  return <Button variant='bordered' onClick={handleLogin}><img src="/assets/Google.svg"/> Continue with Google</Button>;
}
