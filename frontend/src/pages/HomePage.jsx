import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { moviesAPI } from '../services/api';
import MovieCard from '../components/MovieCard';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [filters, setFilters] = useState({ genres: ['All'], languages: ['All'] });
  const [loading, setLoading] = useState(true);

  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || 'now-showing';
  const currentGenre = searchParams.get('genre') || 'All';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [moviesRes, featuredRes, filtersRes] = await Promise.all([
          moviesAPI.getAll({
            search: currentSearch,
            status: currentStatus,
            genre: currentGenre,
          }),
          moviesAPI.getFeatured(),
          moviesAPI.getFilters(),
        ]);

        if (moviesRes.data.success) {
          setMovies(moviesRes.data.data);
        }
        if (featuredRes.data.success) {
          setFeaturedMovies(featuredRes.data.data);
        }
        if (filtersRes.data.success) {
          setFilters(filtersRes.data.data);
        }
      } catch (err) {
        console.error('[HomePage] Fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentSearch, currentStatus, currentGenre]);

  const handleStatusChange = (status) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('status', status);
    setSearchParams(newParams);
  };

  const handleGenreChange = (genre) => {
    const newParams = new URLSearchParams(searchParams);
    if (genre === 'All') {
      newParams.delete('genre');
    } else {
      newParams.set('genre', genre);
    }
    setSearchParams(newParams);
  };

  const heroMovie = featuredMovies[0] || movies[0];

  return (
    <div className="homepage-wrap">
      {/* Hero Showcase Banner */}
      {heroMovie && !currentSearch && (
        <section className="container mb-5 pt-3">
          <div
            className="hero-banner shadow-lg position-relative"
            style={{
              backgroundImage: `url(${heroMovie.backdropUrl || heroMovie.posterUrl})`,
            }}
          >
            <div className="hero-overlay"></div>
            <div className="position-relative text-white z-2" style={{ maxWidth: '650px' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-danger text-uppercase px-2 py-1 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                  FEATURED SPOTLIGHT
                </span>
                <span className="badge bg-dark bg-opacity-75 border border-secondary text-warning">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  {heroMovie.rating.toFixed(1)} Rating
                </span>
                <span className="text-secondary small">• {heroMovie.genre.join(', ')}</span>
              </div>

              <h1 className="display-4 fw-black mb-2 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                {heroMovie.title}
              </h1>

              <p className="text-light opacity-75 mb-4 line-clamp-3 small d-none d-md-block" style={{ lineHeight: '1.6' }}>
                {heroMovie.description}
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link to={`/movie/${heroMovie._id}`} className="btn btn-cinema px-4 py-2">
                  <i className="bi bi-ticket-perforated me-2"></i> Book Tickets Now
                </Link>
                {heroMovie.trailerUrl && (
                  <a
                    href={heroMovie.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-cinema-outline px-3 py-2"
                  >
                    <i className="bi bi-play-circle me-1"></i> Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Movie Catalog Section */}
      <section className="container mb-5">
        {/* Navigation Tabs & Genre Filter Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-2 border-bottom border-dark">
          {/* Status Tabs */}
          <div className="btn-group p-1 rounded-3" style={{ background: '#12141c', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              className={`btn btn-sm px-4 rounded-3 fw-semibold transition ${
                currentStatus === 'now-showing' ? 'btn-danger text-white' : 'text-secondary btn-link text-decoration-none'
              }`}
              onClick={() => handleStatusChange('now-showing')}
            >
              <i className="bi bi-play-fill me-1"></i> Now Showing
            </button>
            <button
              className={`btn btn-sm px-4 rounded-3 fw-semibold transition ${
                currentStatus === 'coming-soon' ? 'btn-danger text-white' : 'text-secondary btn-link text-decoration-none'
              }`}
              onClick={() => handleStatusChange('coming-soon')}
            >
              <i className="bi bi-calendar-event me-1"></i> Coming Soon
            </button>
          </div>

          {/* Genre Filters & Search Feedback */}
          <div className="d-flex align-items-center gap-2 overflow-auto py-1">
            <span className="text-secondary small fw-medium text-nowrap">Filter Genre:</span>
            {filters.genres.map((genre) => (
              <button
                key={genre}
                className={`btn btn-sm text-nowrap rounded-pill px-3 ${
                  currentGenre === genre
                    ? 'btn-danger text-white'
                    : 'btn-dark text-secondary border-secondary'
                }`}
                style={{ fontSize: '0.8rem' }}
                onClick={() => handleGenreChange(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Notification Banner */}
        {currentSearch && (
          <div className="alert alert-dark border-secondary d-flex justify-content-between align-items-center mb-4">
            <div>
              <i className="bi bi-search me-2 text-danger"></i>
              Showing results for "<strong>{currentSearch}</strong>"
            </div>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('search');
                setSearchParams(newParams);
              }}
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Movies Grid */}
        {loading ? (
          <div className="text-center py-5 my-5">
            <div className="spinner-border text-danger mb-3" role="status"></div>
            <p className="text-secondary small">Loading available movies...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="row g-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5 my-5 p-4 rounded-4" style={{ background: '#12141c', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
            <i className="bi bi-camera-reels text-secondary display-3 mb-3 d-block"></i>
            <h5 className="text-white fw-bold">No movies found</h5>
            <p className="text-secondary small mb-3">
              We couldn't find any movies matching the chosen filter or search query.
            </p>
            <button
              className="btn btn-cinema-outline btn-sm"
              onClick={() => setSearchParams({ status: 'now-showing' })}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Cinema Features Banner */}
      <section className="container mb-5">
        <div className="p-4 p-md-5 rounded-4" style={{ background: 'linear-gradient(135deg, #151722, #1d1b28)', border: '1px solid rgba(229, 9, 20, 0.2)' }}>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="fs-1 text-danger mb-2"><i className="bi bi-lightning-charge"></i></div>
              <h6 className="text-white fw-bold mb-1">Instant Seat Reservation</h6>
              <p className="text-secondary small mb-0">Select your favorite recliner or VIP seat with live availability tracking.</p>
            </div>
            <div className="col-md-4">
              <div className="fs-1 text-warning mb-2"><i className="bi bi-qr-code-scan"></i></div>
              <h6 className="text-white fw-bold mb-1">Contactless M-Tickets</h6>
              <p className="text-secondary small mb-0">Show your digital ticket barcode at cinema entry for instantaneous access.</p>
            </div>
            <div className="col-md-4">
              <div className="fs-1 text-danger mb-2"><i className="bi bi-arrow-repeat"></i></div>
              <h6 className="text-white fw-bold mb-1">Flexible Cancellation</h6>
              <p className="text-secondary small mb-0">Cancel anytime prior to show start with instant seat release and refunds.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
