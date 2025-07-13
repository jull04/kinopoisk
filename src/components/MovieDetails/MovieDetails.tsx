import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { kinopoiskApi } from "../../utils/kinopoiskApi";
import "./MovieDetails.css";
import Preloader from "../Preloader/Preloader";

type Movie = {
  name: string;
  description?: string;
  rating: { kp: number };
  year: number;
  genres: { name: string }[];
  poster: { url: string };
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  
  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await kinopoiskApi.get(`/movie/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке фильма:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <Preloader />;
  if (!movie) return <p>Фильм не найден</p>;

  return (
    <div className="movie-details">
      {movie.poster?.url ? (
        <img
          className="movie-details__poster"
          src={movie.poster.url}
          alt={movie.name}
        />
      ) : (
        <div className="movie-details__poster--placeholder">Нет постера</div>
      )}

      <div className="movie-details__info">
        <h1 className="movie-details__title">{movie.name}</h1>
        <p className="movie-details__rating">Рейтинг: {movie.rating.kp}</p>
        <p className="movie-details__year">Год выпуска: {movie.year}</p>
        <p className="movie-details__description">
          {movie.description || "Описание недоступно."}
        </p>
        <div className="movie-details__genres">
          <strong>Жанры:</strong>{" "}
          {movie.genres?.map((genre) => genre.name).join(", ") || "Не указаны"}
        </div>
      </div>
      <button className="back-button" onClick={goBack}>
        &lt; Назад
      </button>
    </div>
  );
};

export default MovieDetails;
