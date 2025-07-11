import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import './search.css';

function Search({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Call onSearch with debouncing effect
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <div className="search-container">
      <form className="search-wrapper" onSubmit={handleSubmit}>
        <input 
          id='pokemon-name-search' 
          type="text" 
          placeholder="Search Pokémon by name..." 
          aria-label="Search Pokémon"
          value={searchValue}
          onChange={handleInputChange}
        />
        <SearchIcon className="search-icon"/>
      </form>
    </div>
  );
} 

export default Search;
