import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import './MovieFilters.css';

const genresList = ['драма', 'комедия', 'боевик', 'триллер', 'фантастика'];

const MovieFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);

  // Инициализация из searchParams
  const [localGenres, setLocalGenres] = useState<string[]>(searchParams.getAll('genres') || []);
  const [localRating, setLocalRating] = useState({
    min: Number(searchParams.get('ratingMin')) || 6,
    max: Number(searchParams.get('ratingMax')) || 10,
  });
  const [localYear, setLocalYear] = useState({
    from: Number(searchParams.get('yearFrom')) || 2000,
    to: Number(searchParams.get('yearTo')) || 2025,
  });

  const toggleGenre = (genre: string) => {
    setLocalGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    localGenres.forEach((g) => params.append('genres', g));
    params.set('ratingMin', localRating.min.toString());
    params.set('ratingMax', localRating.max.toString());
    params.set('yearFrom', localYear.from.toString());
    params.set('yearTo', localYear.to.toString());

    setSearchParams(params);
    setShowPopup(false); 
  };

  return (
    <>
      <button className="movie-filters__toggle-btn" onClick={() => setShowPopup(true)}>
        Фильтры
      </button>

      <div className={`movie-filters ${showPopup ? 'movie-filters_open' : ''}`}>
        <div className="movie-filters__content">
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
              min={1}
              max={10}
              onChange={(e) =>
                setLocalRating({ ...localRating, min: +e.target.value })
              }
            />
            <span className="movie-filters__span">-</span>
            <input
              className="movie-filters__input-number" 
              type="number"
              value={localRating.max}
              min={1}
              max={10}
              onChange={(e) =>
                setLocalRating({ ...localRating, max: +e.target.value })
              }
            />
          </fieldset>

          <fieldset className="movie-filters__year">
            <legend className="movie-filters__title">Год выпуска</legend>
            <input
              className="movie-filters__input-number" 
              type="number"
              value={localYear.from}
              min={1990}
              max={2025}
              onChange={(e) =>
                setLocalYear({ ...localYear, from: +e.target.value })
              }
            />
            <span className="movie-filters__span">-</span>
            <input
              className="movie-filters__input-number" 
              type="number"
              value={localYear.to}
              min={1990}
              max={2025}
              onChange={(e) =>
                setLocalYear({ ...localYear, to: +e.target.value })
              }
            />
          </fieldset>

          <button className="movie-filters__apply-btn" onClick={applyFilters}>
            Применить
          </button>
        </div>
      </div>
    </>
  );
};

export default MovieFilters;
