import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';

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
    
  return (
    <div className="card" ref={ref}>
      <Link to={`/movie/${movie.id}`} className="card__link">
        <img
          className="card__img"
          src={movie.poster?.url || PLACEHOLDER_IMAGE}
          alt={movie.name || 'Нет названия'}
        />
        <div className="card__info">
          <h3 className="card__title">{movie.name || 'Нет названия'}</h3>
          <p className="card__meta card__meta-year">Год выпуска: {movie.year}</p>
          <p className="card__meta card__meta-rating">Рейтинг: {movie.rating.kp}</p>

          {showSaveButton ? (
            <button
              className={!isSaved ? "card__heart-btn" : "card__heart-btn card__heart-btn_active"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onSave?.(movie.id);
              }}
            ></button>
          ) : (
            <button
              className="card__heart-btn card__heart-btn_active"
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
