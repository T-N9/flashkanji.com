'use client'
import { useUserStore } from '@/store/userState';
import { Avatar, Card, CardBody, CardHeader } from '@heroui/react';
import React from 'react'

const UserProfileSection = () => {

    const { username, email, created_at, japanese_level, avatarUrl } = useUserStore();

    return (
        <section className="max-w-md mx-auto mt-10 px-4">
            <Card shadow="md" className="rounded-2xl border border-gray-200">
                <CardHeader className="flex gap-4 items-center">
                    <Avatar
                        src={avatarUrl}
                        className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white"
                    />
                    <div>
                        <h3 className="text-lg font-semibold">{username || 'Guest'}</h3>
                        <p className="text-sm text-gray-500">{email || 'No email'}</p>
                    </div>
                </CardHeader>

                <CardBody className="text-sm text-gray-700 space-y-2">
                    <div>
                        <span className="font-medium">Japanese Level: </span>
                        {japanese_level || 'Unknown'}
                    </div>
                    <div>
                        <span className="font-medium">Joined: </span>
                        {created_at ? new Date(created_at).toLocaleDateString() : 'N/A'}
                    </div>
                </CardBody>
            </Card>
        </section>
    )
}

export default UserProfileSection