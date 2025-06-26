import React from 'react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-brand-surface p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center border border-brand-border">
    <div className="text-brand-primary mb-5">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-brand-text">{title}</h3>
    <p className="text-brand-muted-text leading-relaxed">{description}</p>
  </div>
);

const Features = () => {
  return (
    <section className="py-20 bg-brand-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text">Discover the Power of Sanskrit</h2>
          <p className="mt-4 text-lg text-brand-muted-text">Our app is designed to provide an intuitive and comprehensive learning experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>}
            title="Extensive Sloka Library"
            description="Access a curated collection of Sanskrit slokas covering various themes and deities."
          />
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m-7.072-7.072a5 5 0 000 7.072m7.072-7.072a5 5 0 010 7.072M4.464 8.464a5 5 0 000 7.072" /></svg>}
            title="Audio Playback"
            description="Listen to authentic pronunciations of each sloka to enhance your learning experience."
          />
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            title="Meaning and Translation"
            description="Understand the deeper meaning of each sloka with detailed translations and explanations."
          />
        </div>
      </div>
    </section>
  );
};

export default Features; 