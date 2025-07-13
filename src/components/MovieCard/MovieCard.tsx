import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

type Movie = {
  id: string;
  name: string;
  year: number;
  rating: { kp: number };
  poster: { url: string };
};

type Props = {
  movie: Movie;
  isSaved: boolean;
  onSave?: (id: string) => void;
  onDelete?: (id: string) => void;
  showSaveButton: boolean;
};

// Оборачиваем компонент в forwardRef, чтобы получать ref из родителя
const MovieCard = forwardRef<HTMLDivElement, Props>(({
  movie,
  isSaved,
  onSave,
  onDelete,
  showSaveButton
}, ref) => {

  const placeholderImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="%23ccc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="20">Нет постера</text></svg>';

  return (
    <div className="movie-card" ref={ref}>
      <Link to={`/movie/${movie.id}`} className="movie-card__link">
        <img
          src={movie.poster?.url || placeholderImage}
          alt={movie.name || 'Нет названия'}
        />
        <div className="card__info">
          <h3 className="card__title">{movie.name || 'Нет названия'}</h3>
          <p className="card__meta card__year">Год выпуска: {movie.year}</p>
          <p className="card__meta card__rating">Рейтинг: {movie.rating.kp}</p>

          {showSaveButton ? (
            <button
              className={!isSaved ? "heart-btn" : "heart-btn heart-btn_active"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onSave?.(movie.id);
              }}
            ></button>
          ) : (
            <button
              className="heart-btn heart-btn_active"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete?.(movie.id);
              }}
            ></button>
          )}
        </div>
      </Link>
    </div>
  );
});

export default MovieCard;
