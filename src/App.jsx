
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Pokedex from './Components/Pokedex/Pokedex';
import PokemonDetail from './Components/PokemonDetail/PokemonDetail';
import Footer from './Components/Footer/Footer';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
