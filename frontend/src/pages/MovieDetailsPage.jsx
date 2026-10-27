import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { moviesAPI, showsAPI } from '../services/api';
import { useBooking } from '../context/BookingContext';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingSession } = useBooking();

  const [movie, setMovie] = useState(null);
  const [theatersWithShows, setTheatersWithShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(true);
  const [loadingShows, setLoadingShows] = useState(false);

  // Generate date options for the next 5 days
  const dateOptions = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayName, formatted };
  });

  // Fetch movie info
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await moviesAPI.getById(id);
        if (res.data.success) {
          setMovie(res.data.data);
        }
      } catch (err) {
        console.error('[MovieDetails] Error fetching movie:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Fetch shows for the selected movie & date
  useEffect(() => {
    const fetchShows = async () => {
      if (!id) return;
      try {
        setLoadingShows(true);
        const res = await showsAPI.getByMovie(id, selectedDate);
        if (res.data.success) {
          setTheatersWithShows(res.data.data);
        }
      } catch (err) {
        console.error('[MovieDetails] Error fetching shows:', err.message);
      } finally {
        setLoadingShows(false);
      }
    };

    fetchShows();
  }, [id, selectedDate]);

  const handleSelectShowtime = (show) => {
    setBookingSession(show, movie);
    navigate(`/seat-selection/${show._id}`);
  };

  const formatDuration = (mins) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-secondary mt-3">Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center my-5">
        <h4 className="text-white">Movie not found</h4>
        <button className="btn btn-cinema mt-3" onClick={() => navigate('/')}>
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="movie-details-wrap">
      {/* Movie Hero Banner Header */}
      <div
        className="position-relative text-white py-5"
        style={{
          background: `linear-gradient(0deg, #0b0c10 10%, rgba(11, 12, 16, 0.85) 60%, rgba(11, 12, 16, 0.6) 100%), url(${movie.backdropUrl || movie.posterUrl}) center/cover no-repeat`,
          minHeight: '420px',
        }}
      >
        <div className="container py-4">
          <div className="row g-4 align-items-center">
            {/* Poster Card */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border border-secondary"
                style={{ maxHeight: '380px', objectFit: 'cover', width: '100%', maxWidth: '270px' }}
              />
            </div>

            {/* Movie Info */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger text-uppercase px-2 py-1">
                  {movie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
                </span>
                <span className="badge bg-dark border border-secondary text-light">
                  {movie.certificate}
                </span>
                <span className="badge bg-dark border border-secondary text-warning">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  {movie.rating.toFixed(1)} / 10 ({movie.votesCount?.toLocaleString()} votes)
                </span>
                <span className="text-secondary small">
                  <i className="bi bi-clock me-1"></i> {formatDuration(movie.duration)}
                </span>
                <span className="text-secondary small">
                  <i className="bi bi-translate me-1"></i> {movie.language}
                </span>
              </div>

              <h1 className="display-5 fw-bold mb-3">{movie.title}</h1>

              {/* Genre Pills */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.genre.map((g) => (
                  <span key={g} className="badge bg-secondary bg-opacity-25 text-white border border-secondary px-3 py-1">
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-light opacity-75 mb-4" style={{ maxWidth: '800px', lineHeight: '1.6' }}>
                {movie.description}
              </p>

              {/* Director & Cast Details */}
              <div className="d-flex flex-column gap-2 small text-secondary mb-4">
                {movie.director && (
                  <div>
                    <strong className="text-white">Director:</strong> {movie.director}
                  </div>
                )}
                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <strong className="text-white">Starring:</strong> {movie.cast.join(', ')}
                  </div>
                )}
              </div>

              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-cinema-outline btn-sm d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-play-circle-fill text-danger fs-5"></i>
                  <span>Watch Official Trailer</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Theater Selection Section */}
      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-dark">
          <div>
            <h3 className="fw-bold text-white mb-1">
              <i className="bi bi-calendar3 me-2 text-danger"></i> Select Show Date & Cinema
            </h3>
            <p className="text-secondary small mb-0">Choose your preferred date, theater, and time slot</p>
          </div>

          {/* Date Selector Pills */}
          <div className="d-flex align-items-center gap-2 overflow-auto py-1">
            {dateOptions.map((opt) => (
              <button
                key={opt.dateStr}
                className={`btn btn-sm text-center px-3 py-2 rounded-3 transition ${
                  selectedDate === opt.dateStr
                    ? 'btn-danger text-white shadow'
                    : 'btn-dark text-secondary border-secondary'
                }`}
                style={{ minWidth: '85px' }}
                onClick={() => setSelectedDate(opt.dateStr)}
              >
                <div className="fw-bold small">{opt.dayName}</div>
                <div style={{ fontSize: '0.75rem' }}>{opt.formatted}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Theaters List */}
        {loadingShows ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="text-secondary small mt-2">Loading showtimes for selected date...</p>
          </div>
        ) : theatersWithShows.length > 0 ? (
          <div className="d-flex flex-column gap-4">
            {theatersWithShows.map(({ theater, shows }) => (
              <div
                key={theater._id}
                className="im-card p-4 rounded-4"
                style={{ background: '#12141e' }}
              >
                <div className="row g-3 align-items-center">
                  {/* Theater Info Left */}
                  <div className="col-lg-4 border-end-lg border-dark">
                    <h5 className="text-white fw-bold mb-1">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i> {theater.name}
                    </h5>
                    <p className="text-secondary small mb-2">{theater.address}, {theater.city}</p>
                    
                    {/* Facilities Badges */}
                    <div className="d-flex flex-wrap gap-1">
                      {theater.facilities?.map((f) => (
                        <span key={f} className="badge bg-dark text-secondary border border-secondary" style={{ fontSize: '0.68rem' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Showtimes Buttons Right */}
                  <div className="col-lg-8">
                    <div className="d-flex flex-wrap gap-3">
                      {shows.map((show) => (
                        <div key={show._id} className="text-center">
                          <button
                            className="btn btn-dark border-secondary px-3 py-2 rounded-3 text-start position-relative d-flex flex-column gap-1 transition"
                            style={{ minWidth: '130px', background: '#181b29' }}
                            onClick={() => handleSelectShowtime(show)}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="text-white fw-bold fs-6">{show.time}</span>
                              <span className="badge bg-danger bg-opacity-25 text-danger small" style={{ fontSize: '0.65rem' }}>
                                {show.format}
                              </span>
                            </div>
                            <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                              {show.screenName}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-1 pt-1 border-top border-dark">
                              <span className="text-warning fw-semibold" style={{ fontSize: '0.75rem' }}>
                                ₹{show.pricing?.standard || 180}+
                              </span>
                              <span
                                className={`small ${show.isAlmostFull ? 'text-warning' : 'text-success'}`}
                                style={{ fontSize: '0.68rem' }}
                              >
                                {show.availableSeats} seats
                              </span>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 p-4 rounded-4" style={{ background: '#12141e', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
            <i className="bi bi-calendar-x text-secondary display-4 mb-3 d-block"></i>
            <h5 className="text-white fw-bold">No shows scheduled for this date</h5>
            <p className="text-secondary small mb-3">
              Please select another date above or check back later for newly added cinema schedules.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
