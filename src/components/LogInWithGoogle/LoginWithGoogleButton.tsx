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

  return <Button onClick={handleLogin}>Log In with Google</Button>;
}
