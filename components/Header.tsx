
import React from 'react';
import { View, User } from '../types';
import { SchoolLogoIcon } from './IconComponents';

interface HeaderProps {
  setView: (view: View) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const NavButton: React.FC<{ onClick: () => void, children: React.ReactNode, primary?: boolean }> = ({ onClick, children, primary = false }) => {
  const baseClasses = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300";
  const standardClasses = "text-slate-600 hover:bg-slate-200";
  const primaryClasses = "bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm";
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${primary ? primaryClasses : standardClasses}`}>
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ setView, currentUser, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(View.FEED)}>
          <SchoolLogoIcon className="h-10 w-10" />
          <h1 className="text-xl font-bold text-slate-800">
            BISB <span className="font-normal text-slate-500">Lost & Found</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <NavButton onClick={() => setView(View.FEED)}>Feed</NavButton>
          {currentUser ? (
            <>
              {currentUser.isAdmin && <Nav