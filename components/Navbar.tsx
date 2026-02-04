import React from 'react';
import Logo from '../Logo';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full px-8 py-5 flex items-center justify-between border-b border-deepTeal/40 bg-black/80 backdrop-blur-md fixed top-0 z-50">
      <div className="flex items-center gap-3">
        <Logo className="w-9 h-9" />
        <span className="text-2xl font-black text-softLime tracking-tight">
          Breachless
        </span>
      </div>

      <div className="flex gap-8 text-lg font-bold text-oliveGrey">
        <a href="#analyze" className="hover:text-white">Analyze</a>
        <a href="#contact" className="hover:text-white">Contact</a>
        <a href="#docs" className="hover:text-white">Docs</a>
      </div>
    </nav>
  );
};

export default Navbar;
