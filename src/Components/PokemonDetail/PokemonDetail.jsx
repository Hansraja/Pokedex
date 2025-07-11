import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Weight, Ruler, Star } from 'lucide-react';
import axios from 'axios';
import './PokemonDetail.css';

function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878',
      fighting: '#C03028',
      flying: '#A890F0',
      poison: '#A040A0',
      ground: '#E0C068',
      rock: '#B8A038',
      bug: '#A8B820',
      ghost: '#705898',
      steel: '#B8B8D0',
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      psychic: '#F85888',
      ice: '#98D8D8',
      dragon: '#7038F8',
      dark: '#705848',
      fairy: '#EE99AC',
      unknown: '#68A090',
      shadow: '#604E82'
    };
    return typeColors[type] || '#68A090';
  };

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const speciesResponse = await axios.get(response.data.species.url);
        
        setPokemon({
          ...response.data,
          species: speciesResponse.data
        });
        setLoading(false);
      } catch (err) {
        setError('Pokemon not found');
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="pokemon-detail-container">
        <div className="loading-detail">Loading Pokemon details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-detail-container">
        <div className="error-detail">{error}</div>
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft className="back-icon" />
          Back to Pokedex
        </button>
      </div>
    );
  }

  return (
    <div className="pokemon-detail-container">
      <button onClick={() => navigate('/')} className="back-btn">
        <ArrowLeft className="back-icon" />
        Back to Pokedex
      </button>

      <div className="pokemon-detail-card">
        <div className="pokemon-header">
          <h1 className="pokemon-name-large">{pokemon.name}</h1>
          <div className="pokemon-types-large">
            {pokemon.types.map((typeInfo, index) => (
              <span 
                key={index} 
                className="type-badge-large"
                style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="pokemon-content">
          <div className="pokemon-image-section">
            <div className="pokemon-image-large-container">
              <img 
                className="pokemon-image-large" 
                src={pokemon.sprites.other?.dream_world?.front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                onError={(e) => {
                  e.target.src = pokemon.sprites.front_default;
                }}
              />
            </div>
          </div>

          <div className="pokemon-stats-section">
            <div className="pokemon-basic-info">
              <div className="info-item">
                <Ruler className="info-icon" />
                <span className="info-label">Height</span>
                <span className="info-value">{pokemon.height / 10} m</span>
              </div>
              <div className="info-item">
                <Weight className="info-icon" />
                <span className="info-label">Weight</span>
                <span className="info-value">{pokemon.weight / 10} kg</span>
              </div>
              <div className="info-item">
                <Star className="info-icon" />
                <span className="info-label">Base Experience</span>
                <span className="info-value">{pokemon.base_experience}</span>
              </div>
            </div>

            <div className="pokemon-abilities">
              <h3 className="section-title">Abilities</h3>
              <div className="abilities-list">
                {pokemon.abilities.map((ability, index) => (
                  <span key={index} className="ability-badge">
                    {ability.ability.name.replace('-', ' ')}
                    {ability.is_hidden && <span className="hidden-label">(Hidden)</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pokemon-stats">
          <h3 className="section-title">Base Stats</h3>
          <div className="stats-list">
            {pokemon.stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-name">{stat.stat.name.replace('-', ' ')}</span>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar"
                    style={{ 
                      width: `${(stat.base_stat / 255) * 100}%`,
                      backgroundColor: stat.base_stat > 100 ? '#43e97b' : stat.base_stat > 50 ? '#f8d030' : '#f5576c'
                    }}
                  />
                </div>
                <span className="stat-value">{stat.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
