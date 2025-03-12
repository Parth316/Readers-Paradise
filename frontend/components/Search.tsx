import React, { useState, ChangeEvent, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

interface SearchResult {
  _id: string;
  title: string;
  description: string;
  author: string;
  publication_year: number;
}

const BACKEND_URL = 'http://localhost:5000';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<SearchResult[]>(`${BACKEND_URL}/api/books/search`, {
        params: { q: query },
        timeout: 5000,
      });

      setSearchResults(response.data || []);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? `API Error: ${err.message}`
        : 'An unexpected error occurred';
      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSearchResults(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchSearchResults]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = (): void => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
  };

  const handleResultClick = (id: string) => {
    navigate(`/book/${id}`);
    clearSearch();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search books..."
          className="w-full pl-10 pr-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={isLoading}
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {searchTerm && (
        <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {isLoading && <div className="p-3 text-center text-gray-500">Loading...</div>}
          {error && <div className="p-3 text-center text-red-600">{error}</div>}

          {!isLoading && !error && searchResults.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  onClick={() => handleResultClick(result._id)}
                  className="p-3 border-b border-gray-100 cursor-pointer hover:bg-amber-100 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                  <p className="text-sm text-gray-600">{result.author}</p>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && searchResults.length === 0 && (
            <div className="p-3 text-center text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;