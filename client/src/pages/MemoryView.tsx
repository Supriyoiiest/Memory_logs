import { useRoute } from "wouter";
import { useNote } from "@/hooks/use-notes";
import { Link } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MemoryView() {
  const [, params] = useRoute("/memory/:token");
  const token = params?.token || "";
  
  const { data: note, isLoading, isError } = useNote(token);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-display text-2xl text-muted-foreground animate-pulse">Unlocking memory...</p>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="max-w-md mx-auto text-center mt-20 bg-white/80 p-10 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-display text-destructive mb-4">Oh no! 😿</h2>
        <p className="text-lg text-muted-foreground font-medium mb-8">We couldn't find a memory with that token. Maybe check for typos?</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <ArrowLeft className="w-5 h-5" /> Back to Memory Lane
        </Link>
      </div>
    );
  }

  // Split lines for beautiful rendering
  const lines = note.content.split('\n').filter(l => l.trim() !== '');

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold mb-8">
        <ArrowLeft className="w-5 h-5" /> Go Back
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
          animate={{ opacity: 1, rotate: -2, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex justify-center"
        >
          <div className="polaroid-card">
            <img src={note.imageUrl} alt="Memory" className="w-full max-h-[60vh] object-cover rounded-sm" />
            <div className="mt-6 flex justify-between items-center text-muted-foreground px-2">
              <span className="font-display text-xl">{new Date(note.createdAt!).toLocaleDateString()}</span>
              <span className="font-bold text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full">{note.token}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl shadow-primary/5 border border-white"
        >
          <h2 className="text-4xl font-display text-primary mb-8">Remember this? 🥰</h2>
          <div className="space-y-6">
            {lines.map((line, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="flex gap-4 items-start"
              >
                <span className="font-display text-2xl text-secondary/40 select-none">{(idx + 1).toString().padStart(2, '0')}</span>
                <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
                  {line}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-right">
            <p className="font-display text-2xl text-red-500">Love, Jhingy & Posto ❤️</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
