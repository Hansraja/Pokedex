import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Search from "../Search/Search";
import './Pokedex.css';
import PokemonList from "../PokemonList/PokemonList"; 

function Pokedex(){
  const [currentOffset, setCurrentOffset] = useState(() => {
    // Get saved offset from localStorage or default to 0
    const savedOffset = localStorage.getItem('pokedex-offset');
    return savedOffset ? parseInt(savedOffset, 10) : 0;
  });
  const [nextUrl, setNextUrl] = useState(() => {
    // Get saved nextUrl from localStorage
    return localStorage.getItem('pokedex-nextUrl') || null;
  });
  const [prevUrl, setPrevUrl] = useState(() => {
    // Get saved prevUrl from localStorage
    return localStorage.getItem('pokedex-prevUrl') || null;
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const limit = 20;

  // Save offset to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokedex-offset', currentOffset.toString());
  }, [currentOffset]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      setIsSearchMode(true);
      // Reset pagination when searching
      setCurrentOffset(0);
      setNextUrl(null);
      setPrevUrl(null);
    } else {
      setIsSearchMode(false);
      // Restore pagination state when clearing search
      const savedOffset = localStorage.getItem('pokedex-offset');
      setCurrentOffset(savedOffset ? parseInt(savedOffset, 10) : 0);
    }
  };

  const handleNext = () => {
    if (nextUrl && !loading && !isSearchMode) {
      setCurrentOffset(currentOffset + limit);
    }
  };

  const handlePrevious = () => {
    if (prevUrl && !loading && !isSearchMode) {
      setCurrentOffset(currentOffset - limit);
    }
  };

  return(
    <div className="pokedex-wrapper">
      <div className="header-section">
        <h1 className="pokedex-heading">Pokédex</h1>
        <p className="pokedex-subtitle">Discover and explore the world of Pokémon</p>
      </div>
      <Search onSearch={handleSearch} />
      <PokemonList 
        currentOffset={currentOffset}
        setNextUrl={setNextUrl}
        setPrevUrl={setPrevUrl}
        setLoading={setLoading}
        limit={limit}
        searchTerm={searchTerm}
        isSearchMode={isSearchMode}
      />
      <div className="controls">
        <button 
          className="control-btn" 
          aria-label="Previous page"
          onClick={handlePrevious}
          disabled={!prevUrl || loading || isSearchMode}
        >
          <ChevronLeft className="button-icon"/>
          <span className="btn-text">Previous</span>
        </button>
        <button 
          className="control-btn" 
          aria-label="Next page"
          onClick={handleNext}
          disabled={!nextUrl || loading || isSearchMode}
        >
          <span className="btn-text">Next</span>
          <ChevronRight className="button-icon"/>
        </button>
      </div>
    </div>
  )
}

export default Pokedex;