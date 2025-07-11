import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import './Pokemon.css';

function Pokemon({ name, image, id, types }) {
  const navigate = useNavigate();
  
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

  const handleViewDetails = () => {
    navigate(`/pokemon/${id}`);
  };

  return (
    <div className="pokemon-card">
      <div className="pokemon-image-container">
        <img 
          className="pokemon-image" 
          src={image} 
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=No+Image';
          }}
        />
      </div>
      <h2 className="pokemon-name">{name}</h2>
      {types && (
        <div className="pokemon-types">
          {types.map((typeInfo, index) => (
            <span 
              key={index} 
              className="type-badge"
              style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>
      )}
      <button className="view-details-btn" onClick={handleViewDetails}>
        <Eye className="view-icon" />
        View Details
      </button>
    </div>
  );
}

export default Pokemon;