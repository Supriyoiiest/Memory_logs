import { db } from "./db";
import { loveNotes, type CreateNoteRequest, type NoteResponse } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createNote(note: CreateNoteRequest): Promise<NoteResponse>;
  getNoteByToken(token: string): Promise<NoteResponse | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createNote(note: CreateNoteRequest): Promise<NoteResponse> {
    const [created] = await db.insert(loveNotes).values(note).returning();
    return created;
  }

  async getNoteByToken(token: string): Promise<NoteResponse | undefined> {
    const [note] = await db.select().from(loveNotes).where(eq(loveNotes.token, token));
    return note;
  }
}

export const storage = new DatabaseStorage();
