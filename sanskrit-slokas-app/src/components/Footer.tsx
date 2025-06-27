import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brand-surface mt-auto py-6 border-t border-[#C0C0C0]">
      <div className="container mx-auto px-4 text-center text-[#5A5A5A]">
        &copy; {new Date().getFullYear()} Sanskrit Slokas App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 