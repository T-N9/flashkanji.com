"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation"; // if you're using App Router
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { useDeckDetail, useDeckSrsSessions } from "@/services/deck";
import { useUserStore } from "@/store/userState";
import Link from "next/link";
import useDeckGroundState from "@/store/deckGroundState";

const DeckDetail: React.FC = () => {
  const params = useParams();
  const deck_id = Number(params?.deck_id); // assumes URL like /deck/[deck_id]

  const { userId } = useUserStore();
  const router = useRouter();

  const { data, isLoading, error } = useDeckDetail(deck_id, userId);
  const { data: sessionData, isLoading: isSessionLoading, error: sessionError } = useDeckSrsSessions(deck_id, userId)
  const { setDeckId, setSrsId, setIsReviewMode } = useDeckGroundState();

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading deck details...</p>;
  }

  if (error || !data) {
    return <p className="text-center text-red-500">Failed to load deck.</p>;
  }

  const handleClickReview = (srsId: number) => {
    setSrsId(srsId)
    setDeckId(deck_id)

    router.push('/study/deck/cards')
  }

  const handleClickRepetition = (srsId: number) => {
    setSrsId(srsId)
    setDeckId(deck_id)
    setIsReviewMode(true)


    router.push('/study/deck/repetition')
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-2 lg:px-6 space-y-5">
      <Card className="border border-default-200 shadow-md">
        <CardHeader className="text-xl font-bold">{data.name}</CardHeader>
        <CardBody>
          <p className="text-gray-700 mb-3">{data.description}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p><strong>Level:</strong> N{data.level}</p>
            <p><strong>Total Cards:</strong> {data.totalCards}</p>
            <p><strong>Learned Cards:</strong> {data.learnedCards}</p>
            <p><strong>Visibility:</strong> {data.is_public ? "Public" : "Private"}</p>
            <p><strong>Last Updated:</strong> {new Date(data.updated_at).toLocaleString()}</p>
          </div>
        </CardBody>
      </Card>

      <div>
        <h1>Learn new cards today</h1>
        <Button onClick={() => setDeckId(deck_id)} as={Link} href="/study/deck/repetition">Start</Button>
      </div>

      <div className="space-y-2">
        <h1>Previous Sessions</h1>
        {
          sessionData?.sessions?.length && sessionData?.sessions?.length >= 0 ?

            sessionData?.sessions?.map((session, idx) => {
              return (
                <div key={idx} className=" p-2 border rounded-md space-y-2">
                  <div className="flex justify-between">
                    <p> Session {session.card_count}</p>
                    <p className="text-sm"> {new Date(session.created_at).toLocaleString()}</p>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => handleClickReview(session.id)}>Review</Button>
                    <Button size="sm" onClick={() => handleClickRepetition(session.id)}>Repetition</Button>
                  </div>

                </div>
              )
            })

            :
            <div>
              No previous sessions
            </div>
        }
      </div>

    </div>
  );
};

export default DeckDetail;
