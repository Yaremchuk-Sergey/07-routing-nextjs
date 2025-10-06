"use client";

import { useState, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  HydrationBoundary,
  DehydratedState,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, type FetchNotesResponse } from "../../lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  dehydratedState?: DehydratedState | null;
}

const NotesClientInner = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () =>
      fetchNotes({ page: currentPage, perPage: 12, search: debouncedSearch }),
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {error && <p>Error loading notes: {error.message}</p>}

      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState ?? undefined}>
        <NotesClientInner />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
