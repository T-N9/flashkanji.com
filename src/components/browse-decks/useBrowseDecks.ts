import { useDecks } from "@/services/decks";
import { useEffect, useState } from "react";

const useBrowseDecks = () => {
  const [search, setSearch] = useState<string>("");
  const [level, setLevel] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const limit = 6;

  const { data, isLoading, isFetching, refetch } = useDecks({
    search,
    level,
    category,
    page,
    limit,
  });

  useEffect(() => {
    refetch();
  }, [page]);

  const totalPages = data && Math.ceil(data.total / data.limit);

  const handleChange = (newPage: number) => {
    setPage(newPage);
  };

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
    isFetching,
    handleChange,
    totalPages
  };
};

export default useBrowseDecks;
