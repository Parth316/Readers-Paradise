//RTK Query 

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const openLibraryApi = createApi({
    reducerPath: 'openLibraryApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://openlibrary.org' }),
    endpoints: (builder) => ({
        searchBooks: builder.query({
            query: ({ query, page = 1, limit = 10 }) => `/search.json?q=${query}&page=${page}&limit=${limit}`,
        }),
        getBookDetails: builder.query({
            query: (olid) => `/books/${olid}.json`,
        }),
    }),
});

export const { useSearchBooksQuery, useGetBookDetailsQuery } = openLibraryApi;
