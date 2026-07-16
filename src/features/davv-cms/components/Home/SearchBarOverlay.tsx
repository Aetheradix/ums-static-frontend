import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBarOverlay() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Action trigger for searches
    console.log('Search query:', query);
  };

  return (
    <div className="relative -mt-10 max-w-[820px] mx-auto px-4 z-30 select-none">
      <form
        onSubmit={handleSearch}
        className="w-full flex items-center gap-2 bg-white border border-slate-200/80 rounded-2xl md:rounded-full p-2.5 shadow-xl hover:shadow-2xl hover:border-blue/30 transition-all"
      >
        <div className="flex-1 flex items-center gap-3 pl-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Results, Notices, Courses..."
            className="w-full bg-transparent outline-none text-navy text-sm md:text-base py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-[#002147] hover:bg-blue text-white font-black text-xs md:text-sm uppercase tracking-wider rounded-xl md:rounded-full px-6 py-3 transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
