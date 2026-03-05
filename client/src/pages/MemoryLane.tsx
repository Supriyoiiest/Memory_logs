import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Search, Link as LinkIcon, Loader2, Save, Sparkles } from "lucide-react";
import { useCreateNote, useRandomDriveImage } from "@/hooks/use-notes";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function MemoryLane() {
  const [, setLocation] = useLocation();
  const { width, height } = useWindowSize();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<"create" | "find">("create");
  
  // Create state
  const [folderLink, setFolderLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  
  // Find state
  const [searchToken, setSearchToken] = useState("");

  // Mutations
  const driveMutation = useRandomDriveImage();
  const createMutation = useCreateNote();

  const handleFetchImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderLink) return;
    try {
      const res = await driveMutation.mutateAsync(folderLink);
      setImageUrl(res.imageUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMemory = async () => {
    if (!imageUrl || !content) return;
    try {
      // Generate a cute random 6-character token
      const newToken = Math.random().toString(36).substring(2, 8).toUpperCase();
      await createMutation.mutateAsync({
        token: newToken,
        imageUrl,
        content
      });
      setGeneratedToken(newToken);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchToken.trim()) {
      setLocation(`/memory/${searchToken.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {generatedToken && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-5xl md:text-6xl text-primary drop-shadow-sm">Memory Lane 🦊🐰</h1>
        <p className="text-lg text-muted-foreground font-medium">Relive your magical moments together.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-white/50 backdrop-blur p-1.5 rounded-full flex gap-2 shadow-inner border border-white">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2.5 rounded-full font-bold transition-all ${
              activeTab === "create" 
                ? "bg-primary text-white shadow-md shadow-primary/30" 
                : "text-foreground hover:bg-white"
            }`}
          >
            Create New 🐾
          </button>
          <button
            onClick={() => setActiveTab("find")}
            className={`px-6 py-2.5 rounded-full font-bold transition-all ${
              activeTab === "find" 
                ? "bg-secondary text-white shadow-md shadow-secondary/30" 
                : "text-foreground hover:bg-white"
            }`}
          >
            Find Memory 🔍
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "create" ? (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {!imageUrl ? (
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-orange-500/10 border border-white">
                <h3 className="text-2xl font-display text-foreground mb-6 flex items-center gap-2">
                  <ImageIcon className="text-primary" /> Pick a Random Memory
                </h3>
                <form onSubmit={handleFetchImage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">Google Drive Folder Link</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="url"
                        value={folderLink}
                        onChange={(e) => setFolderLink(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/..."
                        required
                        className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-medium text-lg"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={driveMutation.isPending || !folderLink}
                    className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-primary to-orange-400 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {driveMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Digging up a memory...</span>
                    ) : (
                      "Surprise Me! 🥕"
                    )}
                  </button>
                  {driveMutation.isError && (
                    <p className="text-destructive text-center font-medium mt-2">Oops! Couldn't grab an image. Is the folder public?</p>
                  )}
                </form>
              </div>
            ) : !generatedToken ? (
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="flex justify-center">
                  <div className="polaroid-card">
                    <img src={imageUrl} alt="Random Memory" className="w-full h-auto object-cover rounded-sm border border-border" />
                    <div className="mt-4 text-center font-display text-xl text-muted-foreground">What a day! ✨</div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-orange-500/10 border border-white">
                  <h3 className="text-2xl font-display text-foreground mb-4">Write your 5 lines... ✍️</h3>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Line 1: We went to...&#10;Line 2: You smiled so bright...&#10;Line 3: The sun was...&#10;Line 4: We held hands...&#10;Line 5: I love you forever."
                    rows={6}
                    className="w-full p-4 rounded-2xl bg-white border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-medium text-lg resize-none leading-relaxed"
                  />
                  <button
                    onClick={handleSaveMemory}
                    disabled={createMutation.isPending || !content}
                    className="w-full mt-4 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-secondary to-emerald-400 text-white shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {createMutation.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                    Save Memory 💚
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-md mx-auto border-4 border-primary/20"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="text-4xl font-display text-foreground mb-4">Memory Saved!</h2>
                <p className="text-lg text-muted-foreground mb-6 font-medium">Keep this token safe. You can use it to revisit this memory anytime.</p>
                <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-200">
                  <p className="text-sm font-bold text-orange-400 mb-1 uppercase tracking-wider">Your Token</p>
                  <p className="text-5xl font-display text-primary tracking-widest">{generatedToken}</p>
                </div>
                <button
                  onClick={() => {
                    setImageUrl("");
                    setContent("");
                    setGeneratedToken("");
                    setFolderLink("");
                  }}
                  className="mt-8 px-8 py-3 rounded-xl font-bold text-primary hover:bg-orange-50 transition-colors"
                >
                  Create another memory
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="find"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-xl shadow-secondary/10 border border-white max-w-lg mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-3xl font-display text-foreground">Find a Memory</h3>
              <p className="text-muted-foreground font-medium mt-2">Enter your special token below</p>
            </div>
            
            <form onSubmit={handleSearch} className="space-y-6">
              <input
                type="text"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value.toUpperCase())}
                placeholder="e.g. XYZ123"
                className="w-full px-6 py-5 rounded-2xl text-center font-display text-4xl tracking-widest uppercase bg-white border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                maxLength={10}
              />
              <button
                type="submit"
                disabled={!searchToken}
                className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-secondary to-emerald-400 text-white shadow-lg shadow-secondary/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Open Memory Box 🎁
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
