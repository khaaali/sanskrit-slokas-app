import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brand-surface mt-auto py-6 border-t border-brand-border">
      <div className="container mx-auto px-4 text-center text-brand-muted-text">
        &copy; {new Date().getFullYear()} Sanskrit Slokas App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 