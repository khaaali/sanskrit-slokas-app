import React from 'react';
import Link from 'next/link';

// This is a placeholder and should be replaced with a real component
const ScriptureSlokaListPage = ({ params }: { params: { scripture: string } }) => {
  const scriptureName = params.scripture.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/slokas" className="flex items-center text-brand-muted-text hover:text-brand-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Collection
        </Link>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-text">Slokas from {scriptureName}</h1>
      </div>
      <div className="text-center py-10 text-brand-muted-text">
        Sloka list for {scriptureName} coming soon.
      </div>
    </div>
  );
};

export default ScriptureSlokaListPage; 