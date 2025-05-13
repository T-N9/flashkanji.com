import LogOutButton from '@/components/auth/LogOutButton'
import UserProfileSection from '@/components/user-profile'
import React from 'react'

const ProfilePage = () => {
  return (
    <div className='flex flex-col gap-5 items-center justify-center h-screen'>
      <UserProfileSection />
      <LogOutButton />
    </div>
  )
}

export default ProfilePage