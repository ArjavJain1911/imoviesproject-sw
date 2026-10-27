import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const formatDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return `${hours}h ${remainder}m`;
  };

  const isComingSoon = movie.status === 'coming-soon';

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div className="im-card h-100 d-flex flex-column overflow-hidden position-relative">
        {/* Poster Wrapper */}
        <Link to={`/movie/${movie._id}`} className="text-decoration-none">
          <div className="movie-poster-wrap">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="movie-poster-img"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
              }}
            />
            {/* Rating Badge */}
            <div className="rating-badge d-flex align-items-center gap-1">
              <i className="bi bi-star-fill text-warning"></i>
              <span>{movie.rating.toFixed(1)}</span>
            </div>

            {/* Status / Certificate Badge */}
            <div className="position-absolute bottom-0 start-0 m-2 d-flex gap-1">
              <span className="badge bg-dark bg-opacity-75 text-white border border-secondary" style={{ fontSize: '0.7rem' }}>
                {movie.certificate || 'U/A'}
              </span>
              <span className="badge bg-danger bg-opacity-90 text-white" style={{ fontSize: '0.7rem' }}>
                {movie.language}
              </span>
            </div>
          </div>
        </Link>

        {/* Details Content */}
        <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
          <div>
            <Link to={`/movie/${movie._id}`} className="text-decoration-none">
              <h6 className="text-white fw-bold mb-1 text-truncate" title={movie.title}>
                {movie.title}
              </h6>
            </Link>

            <div className="d-flex align-items-center gap-2 text-secondary mb-2" style={{ fontSize: '0.78rem' }}>
              <span><i className="bi bi-clock me-1"></i>{formatDuration(movie.duration)}</span>
              <span>•</span>
              <span className="text-truncate">{movie.genre.slice(0, 2).join(', ')}</span>
            </div>
          </div>

          <div className="mt-2">
            {isComingSoon ? (
              <Link to={`/movie/${movie._id}`} className="btn btn-outline-secondary w-100 btn-sm fw-medium">
                <i className="bi bi-info-circle me-1"></i> View Details
              </Link>
            ) : (
              <Link to={`/movie/${movie._id}`} className="btn btn-cinema w-100 btn-sm">
                <i className="bi bi-ticket-perforated me-1"></i> Book Tickets
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
