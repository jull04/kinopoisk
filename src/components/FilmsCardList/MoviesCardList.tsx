import "./MoviesCardList.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Preloader from "../Preloader/Preloader";
import { kinopoiskApi } from "../../utils/kinopoiskApi";
import MovieCard from "../MovieCard/MovieCard";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import MovieFilters from "../MovieFilters/MovieFilters";

type Movie = {
  id: string;
  name: string;
  year: number;
  rating: { kp: number };
  poster: { url: string };
};

const MoviesCardList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [movieToSave, setMovieToSave] = useState<Movie | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const page = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (pathname === "/") {
      const cached = localStorage.getItem("movies");
      if (cached && !searchParams.toString()) {
        setMovies(JSON.parse(cached));
        page.current = Math.ceil(JSON.parse(cached).length / 50) + 1;
      } else {
        setMovies([]);
        page.current = 1;
        fetchMovies(page.current);
      }
    } else {
      const saved = JSON.parse(localStorage.getItem("savedMovies") || "[]");
      setSavedMovies(saved);
    }
  }, [pathname, searchParams]);

  const fetchMovies = async (pageNumber: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const params: any = {
        page: pageNumber,
        limit: 50,
        sortField: "rating.kp",
        sortType: -1,
        "rating.kp": `${searchParams.get("ratingMin") || 6}-${
          searchParams.get("ratingMax") || 10
        }`,
        year: `${searchParams.get("yearFrom") || 2000}-${
          searchParams.get("yearTo") || 2025
        }`,
        notNullFields: ["name", "rating.kp", "poster.url"],
      };

      const selectedGenres = searchParams.getAll("genres");
      if (selectedGenres.length > 0) {
        params.genres = selectedGenres.join(",");
      }

      const response = await kinopoiskApi.get("/movie", { params });

      const newMovies: Movie[] = response.data.docs;
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const unique = newMovies.filter((m) => !existingIds.has(m.id));
        const updated = [...prev, ...unique];
        localStorage.setItem("movies", JSON.stringify(updated));
        return updated;
      });
      page.current += 1;
    } catch (err) {
      console.error("Ошибка загрузки фильмов:", err);
    } finally {
      setLoading(false);
    }
  };

  // IntersectionObserver для последнего элемента списка
  const observeLastElement = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || pathname !== "/") return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMovies(page.current);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, pathname]
  );

  const handleSaveMovie = (movieId: string) => {
    const movie = movies.find((m) => m.id === movieId);
    if (movie) {
      const alreadySaved = isSaved(movie.id);
      if (alreadySaved) {
        setMovieToDelete(movie);
        setShowDeleteModal(true);
      } else {
        setMovieToSave(movie);
        setConfirmOpen(true);
      }
    }
  };

  const handleSave = (movie: Movie) => {
    const saved = JSON.parse(localStorage.getItem("savedMovies") || "[]");
    const isAlreadySaved = saved.some((m: Movie) => m.id === movie.id);
    const updated = isAlreadySaved
      ? saved.filter((m: Movie) => m.id !== movie.id)
      : [movie, ...saved];

    localStorage.setItem("savedMovies", JSON.stringify(updated));
    setSavedMovies(updated);
  };

  const isSaved = (movieId: string): boolean => {
    const saved = JSON.parse(localStorage.getItem("savedMovies") || "[]");
    return saved.some((m: Movie) => m.id === movieId);
  };

  const handleConfirmSave = () => {
    if (movieToSave) handleSave(movieToSave);
    setMovieToSave(null);
    setConfirmOpen(false);
  };

  const handleCancelSave = () => {
    setMovieToSave(null);
    setConfirmOpen(false);
  };

  const initiateDeleteMovie = (movie: Movie) => {
    setMovieToDelete(movie);
    setShowDeleteModal(true);
  };

  const confirmDeleteMovie = () => {
    if (movieToDelete) {
      const updated = savedMovies.filter((m) => m.id !== movieToDelete.id);
      setSavedMovies(updated);
      localStorage.setItem("savedMovies", JSON.stringify(updated));
      setMovieToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <section>
      <ConfirmModal
  open={confirmOpen || showDeleteModal}
  onConfirm={confirmOpen ? handleConfirmSave : confirmDeleteMovie}
  onCancel={
    confirmOpen
      ? handleCancelSave
      : () => {
          setMovieToDelete(null);
          setShowDeleteModal(false);
        }
  }
  title={confirmOpen ? "Добавить в избранное?" : "Удалить из избранного?"}
/>

      {pathname === "/" && <MovieFilters />}

      <div className="movie-grid">
        {pathname === "/" && (
          <>
            {movies.length === 0 && !loading && (
              <p className="movie__empty-message">Нет фильмов</p>
            )}

            {movies.map((movie, index) => {
              const isLast = index === movies.length - 1;
              if (isLast) {
                return (
                  <div key={movie.id} ref={observeLastElement}>
                    <MovieCard
                      movie={movie}
                      isSaved={isSaved(movie.id)}
                      onSave={handleSaveMovie}
                      showSaveButton={true}
                    />
                  </div>
                );
              } else {
                return (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isSaved={isSaved(movie.id)}
                    onSave={handleSaveMovie}
                    showSaveButton={true}
                  />
                );
              }
            })}
          </>
        )}

        {pathname === "/saved-movies" && (
          <>
            {savedMovies.length === 0 && !loading ? (
              <p className="movie__empty-message">Нет сохраненных фильмов</p>
            ) : (
              savedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isSaved={true}
                  onDelete={() => initiateDeleteMovie(movie)}
                  showSaveButton={false}
                />
              ))
            )}
          </>
        )}
      </div>

      {pathname === "/" && loading && <Preloader />}
    </section>
  );
};

export default MoviesCardList;
