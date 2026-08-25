import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateRoom } from './pages/CreateRoom';
import { JoinRoom } from './pages/JoinRoom';
import { BoothRoom } from './pages/BoothRoom';
import { Gallery } from './pages/Gallery';
import { Profile } from './pages/Profile';
import { Camera, PlusCircle, UserCheck, Film, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-4 z-40 w-full max-w-5xl mx-auto px-4">
      <div className="flex h-14 items-center justify-between rounded-full glass-panel px-5 border border-white/10 shadow-2xl backdrop-blur-2xl">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-md shadow-rose-600/20 group-hover:scale-105 transition-all">
            <Camera className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold tracking-tight text-white">
              PHOTO<span className="text-rose-500">BOTH</span>
            </span>
            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold text-rose-400 border border-rose-500/20 uppercase tracking-widest hidden sm:inline">
              STUDIO
            </span>
          </div>
        </Link>

        {/* Minimal Navigation Links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/create"
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              isActive('/create')
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Create Room</span>
          </Link>

          <Link
            to="/join"
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              isActive('/join')
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-rose-400" />
            <span>Join Code</span>
          </Link>

          <Link
            to="/gallery"
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              isActive('/gallery')
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Gallery</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-zinc-500 mt-20">
    <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Camera className="h-4 w-4 text-rose-500" />
        <span className="font-bold text-zinc-300">PhotoBoth Studio</span>
        <span>— Real-Time Multiplayer Photo Booth</span>
      </div>
      <p className="flex items-center gap-1.5 font-medium text-zinc-400">
        <span>Created by</span>
        <span className="font-extrabold text-rose-400 tracking-wide uppercase">zeddlyf</span>
        <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" />
      </p>
    </div>
  </footer>
);

export function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#08080a] text-zinc-100 selection:bg-rose-500 selection:text-white">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 pt-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route path="/room/:code" element={<BoothRoom />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
