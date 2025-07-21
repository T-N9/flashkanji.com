"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation"; // if you're using App Router
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { useDeckDetail, useDeckSrsSessions } from "@/services/deck";
import { useUserStore } from "@/store/userState";
import Link from "next/link";
import useDeckGroundState from "@/store/deckGroundState";
import { Globe, Lock } from "@phosphor-icons/react";
import moment from "moment";
import { useGeneralStore } from "@/store/generalState";
import RamenLoading from "../common/RamenLoading";
import Image from "next/image";
import CharacterImage from "../common/character";

const DeckDetail: React.FC = () => {
  const params = useParams();
  const deck_id = Number(params?.deck_id); // assumes URL like /deck/[deck_id]

  const { userId } = useUserStore();
  const router = useRouter();

  const { data, isLoading, error } = useDeckDetail(deck_id, userId);
  const { setIsInGround, setIsSaveRepetition } = useGeneralStore();
  const { data: sessionData, isLoading: isSessionLoading, error: sessionError } = useDeckSrsSessions(deck_id, userId)
  const { setDeckId, setSrsId, setIsReviewMode, setIsReviewByDate } = useDeckGroundState();

  if (isLoading) {
    return <div className=""><RamenLoading /></div>;
  }

  if (error || !data) {
    return <p className="text-center text-red-500">Failed to load deck.</p>;
  }

  const handleClickReview = (srsId: number) => {
    setSrsId(srsId)
    setDeckId(deck_id)
    setIsInGround(true)

    router.push('/study/deck/cards')
  }

  const handleClickRepetition = (srsId: number) => {
    setSrsId(srsId)
    setDeckId(deck_id)
    setIsReviewMode(true)
    setIsReviewByDate(false)
    setIsInGround(true)
    setIsSaveRepetition(false);

    router.push('/study/deck/repetition')
  }

  const hasTodaySession = sessionData?.sessions?.some((session) =>
    moment(session.created_at).isSame(moment(), 'day')
  );

  return (
    <div className="max-w-3xl mx-auto py-6 px-2 lg:px-6 space-y-10">
      <Card className="border border-default-200">
        <CardHeader className="flex flex-col items-start gap-2 lg:flex-row justify-between lg:items-center">
          <h1 className="text-xl font-bold">{data.name}</h1>
          <div className="flex gap-1 justify-center items-center ">
            <p className="text-sm !text-gray-500">{moment(data.updated_at).format('MMMM Do YYYY')}</p>
            <div className="text-gray-500">
              {data.is_public ? <Globe size={20} /> : <Lock size={20} />}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700 mb-3">{data.description}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p><strong>Level:</strong> N{data.level}</p>
            <p><strong>Learned </strong> {data.learnedCards} / {data.totalCards} cards</p>
          </div>
        </CardBody>
      </Card>

      {!hasTodaySession ? (
        <div className="text-center space-y-4">
          <div>
            <CharacterImage src="kiss.png" alt="Learn new cards today" />
            <p className="text-2xl font-bold">Learn new cards today!</p>
          </div>
          <Button
            onClick={() => {
              setDeckId(deck_id);
              setIsInGround(true);
            }}
            color="primary"
            as={Link}
            href="/study/deck/repetition"
          >
            Start
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <CharacterImage src="happy.png" alt="Great Job" />
          <p className="text-gray-500 italic"><span className="text-2xl text-orange-500 font-bold">Great Job!</span><br />You’ve already studied new cards today.<br /> Come back tomorrow!</p>
        </div>
      )}

      <hr />

      <div className="space-y-2">
        <h1 className="font-bold text-xl">Previous Sessions</h1>
        {
          sessionData?.sessions?.length && sessionData?.sessions?.length >= 0 ?

            sessionData?.sessions?.map((session, idx) => {
              return (
                <div key={idx} className=" p-2 border rounded-md space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm">Reviewed <span className="text-orange-500"> {moment(session.created_at).fromNow()}</span> | {moment(session.created_at).format('MMMM Do YYYY, h:mm a')}</p>
                    <p className="text-sm">{session.card_count} cards </p>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => handleClickReview(session.id)}>Review</Button>
                    <Button size="sm" onClick={() => handleClickRepetition(session.id)}>Repetition</Button>
                  </div>

                </div>
              )
            })

            :
            <div className="text-center">
              <CharacterImage src="hmm.png" alt="No sessions" />
              No previous sessions
            </div>
        }
      </div>

    </div>
  );
};

export default DeckDetail;
