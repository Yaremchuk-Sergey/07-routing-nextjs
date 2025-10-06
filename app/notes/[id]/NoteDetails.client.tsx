"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import type { Note } from "../../../types/note";
import css from "./NoteDetails.module.css";

interface NoteDetailsClientProps {
  id: string;
  dehydratedState?: DehydratedState | null;
}

const NoteDetailsInner = ({ id }: { id: string }) => {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id && id !== "undefined",
    refetchOnMount: false,
  });

  if (!id || id === "undefined") return <p>Invalid note ID</p>;
  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </div>
  );
};

const NoteDetailsClient = ({ id, dehydratedState }: NoteDetailsClientProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState ?? undefined}>
        <NoteDetailsInner id={id} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
};

export default NoteDetailsClient;
