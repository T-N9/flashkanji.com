import LogOutButton from '@/components/auth/LogOutButton'
import UserProfileSection from '@/components/user-profile'
import React from 'react'

const ProfilePage = () => {
  return (
    <div className='flex flex-col min-h-screen justify-center gap-5 max-w-screen-sm mx-auto pt-5 px-6'>
      <UserProfileSection />
      <LogOutButton />
    </div>
  )
}

export default ProfilePage