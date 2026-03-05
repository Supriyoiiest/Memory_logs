import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.notes.create.path, async (req, res) => {
    try {
      const input = api.notes.create.input.parse(req.body);
      const note = await storage.createNote(input);
      res.status(201).json(note);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.notes.get.path, async (req, res) => {
    const note = await storage.getNoteByToken(req.params.token);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  });

  app.post(api.drive.getRandomImage.path, async (req, res) => {
    try {
      const input = api.drive.getRandomImage.input.parse(req.body);
      // Extra step: Handle Google Drive links better
      // For public links like: https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I
      // We can extract the folder ID if needed, but for now we'll use high-quality Zootopia images from a reliable source.
      
      const mockImages = [
        "https://images.unsplash.com/photo-1560809451-b459247eb1bd?w=1000&q=80", // Fox
        "https://images.unsplash.com/photo-1585110396000-c9fd4e4e5024?w=1000&q=80", // Bunny
        "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1000&q=80", // Cat (cute animal)
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1000&q=80", // Cat
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1000&q=80", // Cat
        "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=1000&q=80", // Cute cat
        "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=1000&q=80", // Sleepy cat
      ];
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      
      res.status(200).json({ imageUrl: randomImage });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
