import Header from '../Header/Header';
import { Routes, Route } from "react-router-dom";
import './App.css';
import FilmsCardList from '../FilmsCardList/MoviesCardList';
import MovieDetails from '../MovieDetails/MovieDetails';
import MovieFilters from '../MovieFilters/MovieFilters';

function App() {
  return (
    <div className="page">
      <Header/>
      <Routes>
        <Route path='/' element={
          <>
          <MovieFilters/>
          <FilmsCardList/>
          </>
        }/>
        <Route path='/saved-movies' element={
          <FilmsCardList/>
        }/>
        <Route path='/movie/:id' element={
          <MovieDetails/>
        }/>
      </Routes>
    </div>
  );
}

export default App;
