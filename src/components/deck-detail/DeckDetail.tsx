"use client";

import React from "react";
import { useParams } from "next/navigation"; // if you're using App Router
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { useDeckDetail } from "@/services/deck";
import { useUserStore } from "@/store/userState";
import Link from "next/link";
import useDeckGroundState from "@/store/deckGroundState";

const DeckDetail: React.FC = () => {
  const params = useParams();
  const deck_id = Number(params?.deck_id); // assumes URL like /deck/[deck_id]

  const { userId } = useUserStore()

  const { data, isLoading, error } = useDeckDetail(deck_id, userId);
  const {setDeckId} = useDeckGroundState();

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading deck details...</p>;
  }

  if (error || !data) {
    return <p className="text-center text-red-500">Failed to load deck.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
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
        <Button onClick={()=>setDeckId(deck_id)} as={Link} href="/study/deck/repetition">Start</Button>
      </div>

    </div>
  );
};

export default DeckDetail;
