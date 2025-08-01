"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-brand-surface shadow-sm border-b border-[#C0C0C0]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            {/* Placeholder for Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="App logo icon" role="img">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
            </svg>
            <span className="text-xl font-bold text-brand-text">Sanskrit Slokas</span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/slokas" className="text-[#5A5A5A] hover:text-brand-primary transition-colors">Slokas</Link>
          {/* <Link href="/learn" className="text-[#5A5A5A] hover:text-brand-primary transition-colors">Learn</Link> */}
          <Link href="/upload" className="text-[#5A5A5A] hover:text-brand-primary transition-colors">Upload</Link>
          <Link href="/about" className="text-[#5A5A5A] hover:text-brand-primary transition-colors">About</Link>
        </nav>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Open menu"
            className="text-brand-primary focus:outline-none"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {/* Placeholder for Search */}
          <div className="relative">
            <input type="search" placeholder="Search" className="bg-brand-background rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          {/* Placeholder for Bookmarks */}
          <button className="text-brand-muted-text hover:text-brand-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Bookmark icon" role="img">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          {/* Placeholder for User Profile */}
          <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-brand-surface ring-2 ring-brand-primary">
            {/* User Profile Image */}
          </div>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#C0C0C0] shadow-lg z-50">
          <nav className="flex flex-col items-start px-6 py-4 space-y-2">
            <Link href="/slokas" className="block w-full text-[#5A5A5A] hover:text-brand-primary py-2" onClick={() => setMobileMenuOpen(false)}>Slokas</Link>
            {/* <Link href="/learn" className="block w-full text-[#5A5A5A] hover:text-brand-primary py-2" onClick={() => setMobileMenuOpen(false)}>Learn</Link> */}
            <Link href="/upload" className="block w-full text-[#5A5A5A] hover:text-brand-primary py-2" onClick={() => setMobileMenuOpen(false)}>Upload</Link>
            <Link href="/about" className="block w-full text-[#5A5A5A] hover:text-brand-primary py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 