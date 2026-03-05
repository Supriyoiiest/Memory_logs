import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const loveNotes = pgTable("love_notes", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 50 }).notNull().unique(),
  imageUrl: text("image_url").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLoveNoteSchema = createInsertSchema(loveNotes).omit({ id: true, createdAt: true });

export type LoveNote = typeof loveNotes.$inferSelect;
export type InsertLoveNote = z.infer<typeof insertLoveNoteSchema>;

export type CreateNoteRequest = InsertLoveNote;
export type NoteResponse = LoveNote;
