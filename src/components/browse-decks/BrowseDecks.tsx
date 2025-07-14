"use client";

import React, { useState, useMemo, useEffect } from "react";
import useBrowseDecks from "./useBrowseDecks";
import { Card, CardBody, CardHeader, Input, Select, SelectItem } from "@heroui/react";
import debounce from "lodash/debounce";
import Link from "next/link";
import useDeckGroundState from "@/store/deckGroundState";

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Browse Decks</h2>

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

      {/* Deck Results */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {data?.decks.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">No decks found.</p>
          ) : (
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseDecks;
