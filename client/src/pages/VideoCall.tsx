import { motion } from "framer-motion";
import { Video } from "lucide-react";

export default function VideoCall() {
  const roomName = "JhingyLovesPosto";
  const jitsiUrl = `https://meet.jit.si/${roomName}`;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-display text-primary flex items-center justify-center gap-3">
          <Video className="w-10 h-10" /> 
          Cozy Video Call Room 🦊🐰
        </h1>
        <p className="text-muted-foreground font-medium mt-2">Your private space to see each other.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 relative"
      >
        {/* Placeholder background while loading */}
        <div className="absolute inset-0 bg-orange-50 flex items-center justify-center z-0">
          <p className="font-display text-2xl text-orange-300 animate-pulse">Connecting to your room...</p>
        </div>
        
        {/* The iFrame */}
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full h-full relative z-10 border-0"
        />
      </motion.div>
    </div>
  );
}
