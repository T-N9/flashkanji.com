"use client";

import React, { useState, useMemo, useEffect } from "react";
import useBrowseDecks from "./useBrowseDecks";
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from "@heroui/react";
import debounce from "lodash/debounce";
import Link from "next/link";
import Image from "next/image";
import { Funnel } from "@phosphor-icons/react";

const LEVEL_OPTIONS = [
  { label: "N5", value: 5 },
  { label: "N4", value: 4 },
  { label: "N3", value: 3 },
];

const CATEGORY_OPTIONS = ["kotoba", "grammar", "jlpt"];

const BrowseDecks = () => {
  const {
    search,
    setSearch,
    level,
    setLevel,
    category,
    setCategory,
    data,
    isLoading,
    isFetching
  } = useBrowseDecks();

  const [searchInput, setSearchInput] = useState<string>(search);

  // Stable debounced function
  const debouncedSetSearch = useMemo(() => debounce((val: string) => {
    setSearch(val);
  }, 500), [setSearch]);

  // Effect to run debounced search when searchInput changes
  useEffect(() => {
    debouncedSetSearch(searchInput);
    return () => debouncedSetSearch.cancel();
  }, [searchInput, debouncedSetSearch]);

  const [isFilterBar, setIsFilterBar] = useState(false);

  return (
    <div className="max-w-screen-md mx-auto p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">Browse Decks</h2>

        <Funnel className="cursor-pointer" onClick={()=> setIsFilterBar(!isFilterBar)} size={28} />
      </div>

      {
        isFilterBar &&

        <>
          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Input
              label="Search by name"
              placeholder="e.g. Collection 5"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <Select
              label="Level"
              selectedKeys={level !== undefined ? [String(level)] : []}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setLevel(isNaN(val) ? undefined : val);
              }}
              placeholder="Select Level"
            >
              {LEVEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} >
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Category"
              selectedKeys={category ? [category] : []}
              onChange={(e) => {
                const val = e.target.value;
                setCategory(val || undefined);
              }}
              placeholder="Select Category"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <SelectItem key={cat} >
                  {cat}
                </SelectItem>
              ))}
            </Select>
          </div>
          {(searchInput || level !== undefined || category !== undefined) && (
            <div className="mb-6">
              <Button
                variant="light"
                size="sm"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setLevel(undefined);
                  setCategory(undefined);
                }}
                className="text-orange-500"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </>
      }



      {/* Deck Results */}
      {isFetching ? (
        <div className="grid md:grid-cols-2 gap-4">
          <Card shadow="sm" className="border border-default-200 animate-pulse">
            <CardHeader className="font-semibold">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
            </CardHeader>
            <CardBody>
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-3 w-1/3 bg-gray-200 rounded mb-4" />
              <div className="flex gap-2 mt-2 text-xs flex-wrap">
                <span className="h-5 w-16 bg-orange-200 rounded" />
                <span className="h-5 w-20 bg-orange-200 rounded" />
                <span className="h-5 w-12 bg-orange-200 rounded" />
              </div>
            </CardBody>
          </Card>
          <Card shadow="sm" className="border border-default-200 animate-pulse">
            <CardHeader className="font-semibold">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
            </CardHeader>
            <CardBody>
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-3 w-1/3 bg-gray-200 rounded mb-4" />
              <div className="flex gap-2 mt-2 text-xs flex-wrap">
                <span className="h-5 w-16 bg-orange-200 rounded" />
                <span className="h-5 w-20 bg-orange-200 rounded" />
                <span className="h-5 w-12 bg-orange-200 rounded" />
              </div>
            </CardBody>
          </Card>
          <Card shadow="sm" className="border border-default-200 animate-pulse">
            <CardHeader className="font-semibold">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
            </CardHeader>
            <CardBody>
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-3 w-1/3 bg-gray-200 rounded mb-4" />
              <div className="flex gap-2 mt-2 text-xs flex-wrap">
                <span className="h-5 w-16 bg-orange-200 rounded" />
                <span className="h-5 w-20 bg-orange-200 rounded" />
                <span className="h-5 w-12 bg-orange-200 rounded" />
              </div>
            </CardBody>
          </Card>
          <Card shadow="sm" className="border border-default-200 animate-pulse">
            <CardHeader className="font-semibold">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
            </CardHeader>
            <CardBody>
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-3 w-1/3 bg-gray-200 rounded mb-4" />
              <div className="flex gap-2 mt-2 text-xs flex-wrap">
                <span className="h-5 w-16 bg-orange-200 rounded" />
                <span className="h-5 w-20 bg-orange-200 rounded" />
                <span className="h-5 w-12 bg-orange-200 rounded" />
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="">
          {data?.decks.length === 0 ? (
            <div>
              <Image className="mx-auto" src={`/assets/character/hmm.png`} width={100} height={100} alt="No sessions" />
              <p className="text-center text-gray-400 col-span-full">No decks found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">{
              data?.decks.map((deck) => (
                <Link key={deck.id} href={`/flashdecks/${deck.id}`} className="no-underline">
                  <Card shadow="sm" className="border border-default-200">
                    <CardHeader className="font-semibold">{deck.name}</CardHeader>
                    <CardBody>
                      <p className="text-sm text-gray-600 mb-2">{deck.description}</p>
                      <p className="text-xs text-gray-400">Level: {deck.level}</p>
                      <div className="flex gap-2 mt-2 text-xs text-orange-500 flex-wrap">
                        {deck.categories.map((cat) => (
                          <span key={cat} className="bg-orange-100 px-2 py-1 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseDecks;
