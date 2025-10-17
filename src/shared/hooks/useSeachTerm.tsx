import { useEffect, useState } from "react";

export default function useSearchTerm(initialValue = "", delay = 500) {
  const [searchText, setSearchText] = useState(initialValue);
  const [debouncedText, setDebouncedText] = useState(initialValue);

  /*Custom hook to manage a search input with debouncing.
  Updates `debouncedText` only after the user stops typing for the specified delay, reducing the number of API calls or heavy computations while typing.*/
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(searchText);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchText, delay]);

  const handleSearch = (value: string) => setSearchText(value);

  return { searchText, debouncedText, handleSearch };
}
