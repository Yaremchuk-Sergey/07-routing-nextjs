import axios from "axios";
import type { Note } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

// ----- Отримати список нотаток -----
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(API_URL, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    params,
  });
  return response.data;
};

// ----- Отримати деталі нотатки за id -----
export const fetchNoteById = async (id: string): Promise<Note> => {
  if (!id || id === "undefined") throw new Error("Invalid note id");
  const response = await axios.get<Note>(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
};

// ----- Створити нову нотатку -----
export const createNote = async (note: Partial<Note>): Promise<Note> => {
  const response = await axios.post<Note>(API_URL, note, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
};

// ----- Видалити нотатку -----
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
};
