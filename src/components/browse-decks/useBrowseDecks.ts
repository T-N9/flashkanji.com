import { useDecks } from "@/services/decks";
import { useState } from "react";

const useBrowseDecks = () => {
  const [search, setSearch] = useState<string>("");
  const [level, setLevel] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const limit = 6;

  const { data, isLoading } = useDecks({
    search,
    level,
    category,
    page,
    limit,
  });

  return {
    search,
    setSearch,
    level,
    setLevel,
    category,
    setCategory,
    page,
    setPage,
    data,
    isLoading,
  };
};

export default useBrowseDecks;
