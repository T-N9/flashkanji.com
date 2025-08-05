'use client'
import { useUserStore } from '@/store/userState';
import { Avatar, Card, CardBody, CardHeader, Progress } from '@heroui/react';
import moment from 'moment';
import React from 'react'

const UserProfileSection = () => {

    const { username, email, created_at, japanese_level, avatarUrl, rank , xp_points} = useUserStore();

    const RANKS = [
        {
            name: "Mizunoto",
            kanji: "癸",
            xp: 0,
            color: "bg-gradient-to-r from-yellow-500 to-amber-600", // Bronze vibe
        },
        {
            name: "Mizunoe",
            kanji: "壬",
            xp: 500,
            color: "bg-gradient-to-r from-orange-400 to-yellow-500",
        },
        {
            name: "Kanoto",
            kanji: "辛",
            xp: 1500,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
        },
        {
            name: "Kanoe",
            kanji: "庚",
            xp: 3000,
            color: "bg-gradient-to-r from-slate-400 to-gray-500", // Silver-like
        },
        {
            name: "Tsuchinoto",
            kanji: "己",
            xp: 5000,
            color: "bg-gradient-to-r from-blue-400 to-sky-500",
        },
        {
            name: "Tsuchinoe",
            kanji: "戊",
            xp: 8000,
            color: "bg-gradient-to-r from-violet-500 to-indigo-600",
        },
        {
            name: "Hinoto",
            kanji: "丁",
            xp: 12000,
            color: "bg-gradient-to-r from-rose-400 to-pink-500",
        },
        {
            name: "Hinoe",
            kanji: "丙",
            xp: 17000,
            color: "bg-gradient-to-r from-red-500 to-rose-600",
        },
        {
            name: "Kinoto",
            kanji: "乙",
            xp: 23000,
            color: "bg-gradient-to-r from-lime-400 to-green-500",
        },
        {
            name: "Kinoe",
            kanji: "甲",
            xp: 30000,
            color: "bg-gradient-to-r from-teal-400 to-emerald-500",
        },
        {
            name: "Hashira",
            kanji: "柱",
            xp: 40000,
            color: "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500", // Rainbow/elite
        },
    ];

    return (
        <section className="">
            <Card className="rounded-2xl border border-gray-200">
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
                    <div className='flex px-2 gap-2 justify-between items-center'>
                        <span>
                            {RANKS[rank - 1].name}
                        </span>
                        <Progress value={(100/RANKS[rank].xp)* xp_points} size='sm' />
                        <span>
                            {RANKS[rank].name}
                        </span>
                    </div>
                    <div className='flex gap-3 justify-between overflow-x-scroll pb-4'>
                        {
                            RANKS.map((item, idx) => {
                                return (
                                    <div key={idx} className=''>
                                        <div className={`text-3xl font-bold text-white ${item.color} p-2 rounded-full border shadow ${idx + 1 === rank ? '' : 'opacity-50'}`}>
                                            {item.kanji}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        <span className="font-medium">Japanese Level: </span>
                        {japanese_level || 'Unknown'}
                    </div>
                    <div>
                        <span className="font-medium">Joined: </span>
                        {created_at ? moment(created_at).format('MMMM Do YYYY') : 'N/A'}
                    </div>
                </CardBody>
            </Card>
        </section>
    )
}

export default UserProfileSection