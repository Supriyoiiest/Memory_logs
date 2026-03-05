import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function VirtualHugs() {
  const [isHugged, setIsHugged] = useState(false);

  // Cute Zootopia Hug GIF from tenor/unsplash
  const hugGifUrl = "https://media1.tenor.com/m/82K4r-4t0ZIAAAAd/zootopia-hug.gif";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <AnimatePresence mode="wait">
        {!isHugged ? (
          <motion.div
            key="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-6xl font-display text-foreground mb-12">Need a hug? 🥺</h1>
            
            <motion.button
              onClick={() => setIsHugged(true)}
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut" 
              }}
              className="relative group focus:outline-none"
            >
              <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-red-400 to-red-600 p-12 rounded-full shadow-[0_0_50px_rgba(239,68,68,0.5)] border-4 border-white">
                <Heart className="w-32 h-32 text-white fill-white" />
              </div>
            </motion.button>
            <p className="mt-8 text-xl font-bold text-muted-foreground">Tap the heart!</p>
          </motion.div>
        ) : (
          <motion.div
            key="hug"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center w-full max-w-2xl"
          >
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl shadow-red-500/20 border-8 border-white bg-white">
              <img 
                src={hugGifUrl} 
                alt="Zootopia Hug" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-8">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-6xl font-display text-white drop-shadow-lg"
                >
                  Jhingy loves Posto! ❤️
                </motion.h2>
              </div>
            </div>
            
            <button
              onClick={() => setIsHugged(false)}
              className="mt-10 px-8 py-4 rounded-full font-bold text-lg bg-white text-red-500 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-red-100"
            >
              Give another hug! 🫂
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
