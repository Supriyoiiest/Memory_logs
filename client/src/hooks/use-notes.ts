import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// --- Types derived from the schema/API ---
type NoteInput = z.infer<typeof api.notes.create.input>;
type NoteResponse = z.infer<typeof api.notes.create.responses[201]>;

// Fetch a single note by token
export function useNote(token: string) {
  return useQuery({
    queryKey: [api.notes.get.path, token],
    queryFn: async () => {
      if (!token) return null;
      const url = buildUrl(api.notes.get.path, { token });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch note");
      
      const data = await res.json();
      return api.notes.get.responses[200].parse(data);
    },
    enabled: !!token,
  });
}

// Create a new note
export function useCreateNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: NoteInput) => {
      const validated = api.notes.create.input.parse(data);
      const res = await fetch(api.notes.create.path, {
        method: api.notes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.notes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create note");
      }
      
      return api.notes.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Pre-populate the cache for the newly created note
      queryClient.setQueryData([api.notes.get.path, data.token], data);
    },
  });
}

// Get a random image from Drive
export function useRandomDriveImage() {
  return useMutation({
    mutationFn: async (folderLink: string) => {
      const payload = { folderLink };
      const validated = api.drive.getRandomImage.input.parse(payload);
      
      const res = await fetch(api.drive.getRandomImage.path, {
        method: api.drive.getRandomImage.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch image from drive");
      }
      
      return api.drive.getRandomImage.responses[200].parse(await res.json());
    },
  });
}
