import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  BookOpen,
  History,
  ShieldCheck,
  LogOut,
  Volume2,
  VolumeX,
  User,
  GraduationCap,
} from 'lucide-react';
import { isSoundEnabled, toggleSound } from '../utils/soundEffects';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const updated = toggleSound();
    setSoundOn(updated);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-950/80 border border-slate-800 p-1 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200 overflow-hidden">
            <img
              src="/logo.png"
              alt="Infinity Classes Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Infinity<span className="text-amber-400">Classes</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full">
              CBSE Class 10
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              isActive('/')
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-brand-400" />
            Dashboard
          </Link>

          <Link
            to="/history"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              isActive('/history')
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4 text-indigo-400" />
            My History
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive('/admin')
                  ? 'bg-purple-950/60 text-purple-200 border border-purple-800/60 shadow-sm'
                  : 'text-purple-300 hover:text-purple-100 hover:bg-purple-950/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right Section: Sound Toggle + User Pill + Logout */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle sound effects"
          >
            {soundOn ? (
              <Volume2 className="w-5 h-5 text-brand-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {/* User Badge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-sm">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              ) : (
                <GraduationCap className="w-4 h-4 text-brand-400" />
              )}
            </div>
            <div className="hidden sm:block text-left leading-none">
              <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
              <span className="text-[10px] text-slate-400 capitalize">
                {user?.role || 'student'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

