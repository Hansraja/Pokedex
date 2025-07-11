import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";

function PokemonList({ currentOffset, setNextUrl, setPrevUrl, setLoading, limit, searchTerm, isSearchMode }){
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLocalLoading] = useState(true);
  const [allPokemon, setAllPokemon] = useState([]);

  async function downloadPokemons(){
    setLocalLoading(true);
    setLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`);
      const pokemonResults = response.data.results;
      
      // Update pagination URLs in parent component and save to localStorage
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      
      // Save pagination URLs to localStorage for persistence
      localStorage.setItem('pokedex-nextUrl', response.data.next || '');
      localStorage.setItem('pokedex-prevUrl', response.data.previous || '');
      
      const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));
      const pokemonData = await axios.all(pokemonResultPromise);
      console.log(response.data);
      const res = pokemonData.map((pokeData) =>{
        const pokemon = pokeData.data;
        return {
            name: pokemon.name,
            id: pokemon.id,
            image: (pokemon.sprites.other)? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_default,
            types: pokemon.types,

          };

      });
      setPokemonList(res);
      console.log(res);
      setLocalLoading(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      setLocalLoading(false);
      setLoading(false);
    }
  }

  async function searchPokemon(searchTerm) {
    setLocalLoading(true);
    setLoading(true);
    try {
      // If we don't have all pokemon data, fetch it
      if (allPokemon.length === 0) {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1010');
        setAllPokemon(response.data.results);
      }

      // Filter pokemon by name
      const filteredPokemon = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Get detailed data for filtered pokemon (limit to 20 results)
      const limitedResults = filteredPokemon.slice(0, 20);
      const pokemonResultPromise = limitedResults.map((pokemon) => axios.get(pokemon.url));
      const pokemonData = await axios.all(pokemonResultPromise);

      const res = pokemonData.map((pokeData) => {
        const pokemon = pokeData.data;
        return {
          name: pokemon.name,
          id: pokemon.id,
          image: (pokemon.sprites.other)? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_default,
          types: pokemon.types,
        };
      });

      setPokemonList(res);
      setLocalLoading(false);
      setLoading(false);
    } catch (error) {
      console.error("Error searching Pokémon:", error);
      setLocalLoading(false);
      setLoading(false);
    }
  }
  useEffect(() => {
    if (isSearchMode && searchTerm.trim()) {
      searchPokemon(searchTerm);
    } else if (!isSearchMode) {
      downloadPokemons();
    }
  }, [currentOffset, searchTerm, isSearchMode]);

  // Fetch all pokemon data on component mount for search functionality
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1010');
        setAllPokemon(response.data.results);
      } catch (error) {
        console.error("Error fetching all Pokémon data:", error);
      }
    };
    fetchAllPokemon();
  }, []);

 return (
  <div className="pokemon-list-wrapper">
      {(loading)?
       <Loader2 className="load-icon" />:
       pokemonList.map((p) => <Pokemon key={p.id} name={p.name} image={p.image} id={p.id} types={p.types} />)
      }
  </div>
 )
}
export default PokemonList; 