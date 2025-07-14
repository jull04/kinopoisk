import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import './MovieFilters.css';

const genresList = ['драма', 'комедия', 'боевик', 'триллер', 'фантастика'];

const MovieFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showPopup, setShowPopup] = useState(false);
  
    const defaultGenres: string[] = [];
    const defaultRating = { min: 0, max: 10 };
    const defaultYear = { from: 1900, to: 2025 };
  
    // Инициализация из searchParams или по умолчанию
    const [localGenres, setLocalGenres] = useState<string[]>(searchParams.getAll('genres') || defaultGenres);
    const [localRating, setLocalRating] = useState({
      min: Number(searchParams.get('ratingMin')) || defaultRating.min.toString(),
      max: Number(searchParams.get('ratingMax')) || defaultRating.max.toString(),
    });
    const [localYear, setLocalYear] = useState({
      from: Number(searchParams.get('yearFrom')) || defaultYear.from.toString(),
      to: Number(searchParams.get('yearTo')) || defaultYear.to.toString(),
    });
  
    const toggleGenre = (genre: string) => {
      setLocalGenres((prev) =>
        prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
      );
    };
  
    const applyFilters = () => {
      const params = new URLSearchParams();
      localGenres.forEach((g) => params.append('genres', g));
      params.set('ratingMin', localRating.min ? Number(localRating.min).toString() : defaultRating.min.toString());
      params.set('ratingMax', localRating.max ? Number(localRating.max).toString() : defaultRating.max.toString());
      params.set('yearFrom', localYear.from ? Number(localYear.from).toString() : defaultYear.from.toString());
      params.set('yearTo', localYear.to ? Number(localYear.to).toString() : defaultYear.to.toString());
  
      setSearchParams(params);
      setShowPopup(false); 
    };
  
    
    const resetFilters = () => {
      setLocalGenres(defaultGenres);
      setLocalRating(defaultRating);
      setLocalYear(defaultYear);
      setSearchParams({});
    };
  
    return (
      <>
        <button className="movie-filters__toggle-btn" onClick={() => setShowPopup(true)}>
          Фильтры
        </button>
  
        <div className={`movie-filters ${showPopup ? 'movie-filters_open' : ''}`} onClick={() => setShowPopup(false)}>
          <div className="movie-filters__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="movie-filters__close-btn"
              onClick={() => setShowPopup(false)}
              aria-label="Закрыть"
            />
  
            <fieldset className="movie-filters__genres">
              <legend className="movie-filters__title">Жанры</legend>
              {genresList.map((g) => (
                <label className="movie-filters__label" key={g}>
                  <input
                    className="movie-filters__input-checkbox" 
                    type="checkbox"
                    checked={localGenres.includes(g)}
                    onChange={() => toggleGenre(g)}
                  />
                  {g}
                </label>
              ))}
            </fieldset>
  
            <fieldset className="movie-filters__rating">
              <legend className="movie-filters__title">Рейтинг</legend>
              <input
                className="movie-filters__input-number" 
                type="number"
                value={localRating.min}
                min={0}
                max={10}
                onChange={(e) =>
                  setLocalRating({ ...localRating, min: e.target.value })
                }
              />
              <span className="movie-filters__span">-</span>
              <input
                className="movie-filters__input-number" 
                type="number"
                value={localRating.max}
                min={0}
                max={10}
                onChange={(e) =>
                  setLocalRating({ ...localRating, max: e.target.value })
                }
              />
            </fieldset>
  
            <fieldset className="movie-filters__year">
              <legend className="movie-filters__title">Год выпуска</legend>
              <input
                className="movie-filters__input-number" 
                type="number"
                value={localYear.from}
                min={1900}
                max={2025}
                onChange={(e) =>
                  setLocalYear({ ...localYear, from: e.target.value })
                }
              />
              <span className="movie-filters__span">-</span>
              <input
                className="movie-filters__input-number" 
                type="number"
                value={localYear.to}
                min={1900}
                max={2025}
                onChange={(e) =>
                  setLocalYear({ ...localYear, to: e.target.value })
                }
              />
            </fieldset>
  
            <div className="movie-filters__buttons">
              <button className="movie-filters__btn" onClick={applyFilters}>
                Применить
              </button>
              <button className="movie-filters__btn" onClick={resetFilters}>
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default MovieFilters;
  