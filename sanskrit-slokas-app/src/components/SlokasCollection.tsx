"use client";

import React from 'react';
import Link from 'next/link';

// Reverted to a simple data structure without images
const deities = [
  { name: 'Shiva'},
  { name: 'Shakti'},
  { name: 'Vishnu'},
  { name: 'Ganapathi'},
  { name: 'Skanda'},
  { name: 'Aditya'},
];

const scriptures = [
  { name: 'Bhagavad Gita', description: 'A 700-verse Hindu scripture that is part of the epic Mahabharata.' },
];

const DeityCard = ({ name }: { name: string }) => (
  <Link href={`/slokas/${name.toLowerCase()}`}>
    <div className="bg-brand-surface p-4 rounded-lg shadow-sm flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer border border-brand-border h-full">
      <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
        <span className="text-2xl font-bold text-white">{name.charAt(0)}</span>
      </div>
      <span className="text-lg font-semibold text-brand-text">{name}</span>
    </div>
  </Link>
);

const ScriptureCard = ({ name, description }: { name: string, description: string }) => (
  <Link href={`/slokas/scripture/${name.toLowerCase().replace(/\\s+/g, '-')}`}>
    <div className="bg-brand-surface p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-brand-border cursor-pointer h-full">
      <h3 className="text-xl font-semibold text-brand-primary mb-2">{name}</h3>
      <p className="text-brand-muted-text">{description}</p>
    </div>
  </Link>
);

const SlokasCollection = () => {
  const [activeTab, setActiveTab] = React.useState('Deities');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brand-text">Slokas Collection</h1>
        <p className="mt-2 text-brand-muted-text max-w-3xl mx-auto">
          Explore a vast collection of Sanskrit slokas, categorized by deity, scripture, or theme. Each sloka includes its meaning and audio for easy learning.
        </p>
      </div>

      <div className="mt-10 max-w-xl mx-auto">
        <input
          type="search"
          placeholder="Search slokas by name, deity, scripture or theme..."
          className="w-full p-4 border border-brand-border rounded-full bg-brand-surface focus:ring-2 focus:ring-brand-primary focus:outline-none"
        />
      </div>

      <div className="mt-10">
        <div className="border-b border-brand-border">
          <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('Deities')}
              className={`${activeTab === 'Deities' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted-text hover:text-brand-text hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
            >
              Deities
            </button>
            <button
              onClick={() => setActiveTab('Scriptures')}
              className={`${activeTab === 'Scriptures' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted-text hover:text-brand-text hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
            >
              Scriptures
            </button>
            <button
              onClick={() => setActiveTab('Themes')}
              className={`${activeTab === 'Themes' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted-text hover:text-brand-text hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
            >
              Themes
            </button>
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'Deities' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {deities.map(deity => (
                <DeityCard key={deity.name} name={deity.name} />
              ))}
            </div>
          )}
          {activeTab === 'Scriptures' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {scriptures.map(scripture => (
                <ScriptureCard key={scripture.name} name={scripture.name} description={scripture.description} />
              ))}
            </div>
          )}
          {activeTab === 'Themes' && <div className="text-center py-10 text-brand-muted-text">Themes content coming soon.</div>}
        </div>
      </div>
    </div>
  );
};

export default SlokasCollection; 