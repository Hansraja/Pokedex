import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Search from "../Search/Search";
import './Pokedex.css';
import PokemonList from "../PokemonList/PokemonList"; 

function Pokedex(){
  const [currentOffset, setCurrentOffset] = useState(() => {
    // Check if the user is returning after a long time (e.g., 30 minutes)
    const lastVisit = localStorage.getItem('pokedex-lastVisit');
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    // If it's been more than 30 minutes, or no last visit recorded, reset to beginning
    if (!lastVisit || (currentTime - parseInt(lastVisit)) > thirtyMinutes) {
      // Clear all pagination data
      localStorage.removeItem('pokedex-offset');
      localStorage.removeItem('pokedex-nextUrl');
      localStorage.removeItem('pokedex-prevUrl');
      localStorage.setItem('pokedex-lastVisit', currentTime.toString());
      return 0;
    }
    
    // Update last visit time
    localStorage.setItem('pokedex-lastVisit', currentTime.toString());
    
    // Get saved offset from localStorage or default to 0
    const savedOffset = localStorage.getItem('pokedex-offset');
    return savedOffset ? parseInt(savedOffset, 10) : 0;
  });
  
  const [nextUrl, setNextUrl] = useState(() => {
    // Only get saved URLs if we're not resetting
    const lastVisit = localStorage.getItem('pokedex-lastVisit');
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (!lastVisit || (currentTime - parseInt(lastVisit)) > thirtyMinutes) {
      return null;
    }
    return localStorage.getItem('pokedex-nextUrl') || null;
  });
  
  const [prevUrl, setPrevUrl] = useState(() => {
    // Only get saved URLs if we're not resetting
    const lastVisit = localStorage.getItem('pokedex-lastVisit');
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (!lastVisit || (currentTime - parseInt(lastVisit)) > thirtyMinutes) {
      return null;
    }
    return localStorage.getItem('pokedex-prevUrl') || null;
  });
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const limit = 20;

  // Save offset and update last visit time whenever offset changes
  useEffect(() => {
    localStorage.setItem('pokedex-offset', currentOffset.toString());
    localStorage.setItem('pokedex-lastVisit', Date.now().toString());
  }, [currentOffset]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      setIsSearchMode(true);
      // Reset pagination when searching
      setCurrentOffset(0);
      setNextUrl(null);
      setPrevUrl(null);
      // Scroll to top when starting a search
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      setIsSearchMode(false);
      // Restore pagination state when clearing search
      const savedOffset = localStorage.getItem('pokedex-offset');
      setCurrentOffset(savedOffset ? parseInt(savedOffset, 10) : 0);
      // Scroll to top when clearing search
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleGoHome = () => {
    // Reset to first page
    setCurrentOffset(0);
    setSearchTerm('');
    setIsSearchMode(false);
    setNextUrl(null);
    setPrevUrl(null);
    
    // Clear localStorage pagination data
    localStorage.removeItem('pokedex-offset');
    localStorage.removeItem('pokedex-nextUrl');
    localStorage.removeItem('pokedex-prevUrl');
    localStorage.setItem('pokedex-lastVisit', Date.now().toString());
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handleNext = () => {
    if (nextUrl && !loading && !isSearchMode) {
      setCurrentOffset(currentOffset + limit);
      // Update last visit time when user actively navigates
      localStorage.setItem('pokedex-lastVisit', Date.now().toString());
      // Scroll to top when navigating to next page
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const handlePrevious = () => {
    if (prevUrl && !loading && !isSearchMode) {
      setCurrentOffset(currentOffset - limit);
      // Update last visit time when user actively navigates
      localStorage.setItem('pokedex-lastVisit', Date.now().toString());
      // Scroll to top when navigating to previous page
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  return(
    <div className="pokedex-wrapper">
      <div className="header-section">
        <h1 className="pokedex-heading clickable-heading" onClick={handleGoHome}>
          Pokédex
        </h1>
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