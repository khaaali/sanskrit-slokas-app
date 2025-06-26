import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-brand-surface shadow-sm border-b border-brand-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            {/* Placeholder for Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
            </svg>
            <span className="text-xl font-bold text-brand-text">Sanskrit Slokas</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/slokas" className="text-brand-muted-text hover:text-brand-primary transition-colors">Slokas</Link>
          <Link href="/learn" className="text-brand-muted-text hover:text-brand-primary transition-colors">Learn</Link>
          <Link href="/about" className="text-brand-muted-text hover:text-brand-primary transition-colors">About</Link>
        </nav>
        <div className="flex items-center space-x-4">
          {/* Placeholder for Search */}
          <div className="relative">
            <input type="search" placeholder="Search" className="bg-brand-background rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          {/* Placeholder for Bookmarks */}
          <button className="text-brand-muted-text hover:text-brand-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          {/* Placeholder for User Profile */}
          <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-brand-surface ring-2 ring-brand-primary">
            {/* User Profile Image */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 