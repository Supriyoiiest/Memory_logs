import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Heart, Image as ImageIcon, Video, PawPrint } from "lucide-react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Memory Lane", icon: ImageIcon, color: "text-primary" },
    { href: "/hugs", label: "Virtual Hugs", icon: Heart, color: "text-red-500" },
    { href: "/call", label: "Video Call", icon: Video, color: "text-secondary" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <PawPrint className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-display text-2xl text-foreground mt-1 tracking-wider">
              Jhingy <span className="text-red-500">&</span> Posto
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location === item.href || (location.startsWith('/memory/') && item.href === '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold ${
                    isActive 
                      ? "bg-white shadow-md text-foreground scale-105" 
                      : "text-muted-foreground hover:bg-white/50 hover:text-foreground hover:scale-105"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-around items-center p-3">
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith('/memory/') && item.href === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                  isActive ? "text-foreground scale-110" : "text-muted-foreground"
                }`}
              >
                <div className={`p-2 rounded-full ${isActive ? 'bg-white shadow-sm' : ''}`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
