import React, { useState, useEffect } from 'react';
import { adminAPI, moviesAPI, bookingsAPI } from '../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    genre: 'Action, Sci-Fi',
    duration: 150,
    language: 'English',
    rating: 8.5,
    certificate: 'PG-13',
    status: 'now-showing',
    director: '',
    cast: 'Actor One, Actor Two',
    releaseDate: new Date().toISOString().split('T')[0],
  });
  const [isSubmittingMovie, setIsSubmittingMovie] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, bookingsRes] = await Promise.all([
        adminAPI.getStats(),
        moviesAPI.getAll({ status: 'All' }),
        bookingsAPI.getAll(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (moviesRes.data.success) setMovies(moviesRes.data.data);
      if (bookingsRes.data.success) setAllBookings(bookingsRes.data.data);
    } catch (err) {
      console.error('[AdminDashboard] Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingMovie(true);
      const payload = {
        ...movieForm,
        genre: movieForm.genre.split(',').map((g) => g.trim()),
        cast: movieForm.cast.split(',').map((c) => c.trim()),
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating),
      };

      const res = await moviesAPI.create(payload);
      if (res.data.success) {
        setActionMessage('New movie created successfully!');
        setMovieForm({
          title: '',
          description: '',
          posterUrl: '',
          backdropUrl: '',
          trailerUrl: '',
          genre: 'Action, Sci-Fi',
          duration: 150,
          language: 'English',
          rating: 8.5,
          certificate: 'PG-13',
          status: 'now-showing',
          director: '',
          cast: '',
          releaseDate: new Date().toISOString().split('T')[0],
        });
        await loadDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to create movie');
    } finally {
      setIsSubmittingMovie(false);
    }
  };

  const handleDeleteMovie = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await moviesAPI.delete(id);
      if (res.data.success) {
        setActionMessage(`Movie "${title}" deleted.`);
        await loadDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete movie');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-secondary mt-3">Loading administrator dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Dashboard Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-dark">
        <div>
          <span className="badge bg-warning bg-opacity-25 text-warning mb-1">
            <i className="bi bi-shield-lock-fill me-1"></i> ADMIN CONSOLE
          </span>
          <h2 className="text-white fw-bold mb-1">IMovies Management Hub</h2>
          <p className="text-secondary small mb-0">Platform analytics, catalog control, and live reservations</p>
        </div>

        {/* Tab switcher */}
        <div className="btn-group p-1 rounded-3" style={{ background: '#12141c', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            className={`btn btn-sm px-3 rounded-2 fw-semibold ${activeTab === 'overview' ? 'btn-danger' : 'text-secondary btn-link text-decoration-none'}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-graph-up me-1"></i> Overview
          </button>
          <button
            className={`btn btn-sm px-3 rounded-2 fw-semibold ${activeTab === 'movies' ? 'btn-danger' : 'text-secondary btn-link text-decoration-none'}`}
            onClick={() => setActiveTab('movies')}
          >
            <i className="bi bi-film me-1"></i> Manage Movies
          </button>
          <button
            className={`btn btn-sm px-3 rounded-2 fw-semibold ${activeTab === 'bookings' ? 'btn-danger' : 'text-secondary btn-link text-decoration-none'}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-ticket-perforated me-1"></i> All Bookings
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {actionMessage}
          <button type="button" className="btn-close" onClick={() => setActionMessage('')}></button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="im-card p-3 rounded-4" style={{ background: '#12141e' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-secondary small">Total Revenue</span>
              <i className="bi bi-cash-stack text-success fs-5"></i>
            </div>
            <h4 className="text-white fw-bold mb-0">₹{stats?.totalRevenue?.toLocaleString() || 0}</h4>
            <span className="text-success small" style={{ fontSize: '0.72rem' }}>
              <i className="bi bi-arrow-up-right me-1"></i> Confirmed sales
            </span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="im-card p-3 rounded-4" style={{ background: '#12141e' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-secondary small">Tickets Booked</span>
              <i className="bi bi-ticket-detailed text-danger fs-5"></i>
            </div>
            <h4 className="text-white fw-bold mb-0">{stats?.totalTicketsSold || 0}</h4>
            <span className="text-secondary small" style={{ fontSize: '0.72rem' }}>
              Seats reserved
            </span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="im-card p-3 rounded-4" style={{ background: '#12141e' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-secondary small">Movies Listed</span>
              <i className="bi bi-film text-warning fs-5"></i>
            </div>
            <h4 className="text-white fw-bold mb-0">{stats?.totalMovies || 0}</h4>
            <span className="text-secondary small" style={{ fontSize: '0.72rem' }}>
              In catalog
            </span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="im-card p-3 rounded-4" style={{ background: '#12141e' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-secondary small">Users Registered</span>
              <i className="bi bi-people text-info fs-5"></i>
            </div>
            <h4 className="text-white fw-bold mb-0">{stats?.totalUsers || 0}</h4>
            <span className="text-secondary small" style={{ fontSize: '0.72rem' }}>
              Registered customers
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & RECENT BOOKINGS */}
      {activeTab === 'overview' && (
        <div className="im-card p-4 rounded-4" style={{ background: '#12141e' }}>
          <h5 className="text-white fw-bold mb-3">
            <i className="bi bi-clock-history text-danger me-2"></i> Recent Platform Bookings
          </h5>

          {stats?.recentBookings && stats.recentBookings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="text-secondary small">
                    <th>BOOKING ID</th>
                    <th>CUSTOMER</th>
                    <th>MOVIE</th>
                    <th>THEATER</th>
                    <th>SEATS</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {stats.recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-bold text-white">{b.bookingId}</td>
                      <td>{b.user?.name || 'Customer'}</td>
                      <td className="text-white">{b.movie?.title}</td>
                      <td className="text-secondary">{b.theater?.name}</td>
                      <td>
                        <span className="badge bg-danger bg-opacity-25 text-danger">
                          {b.seats?.map((s) => s.seatNumber).join(', ')}
                        </span>
                      </td>
                      <td className="text-warning fw-semibold">₹{b.totalAmount}</td>
                      <td>
                        <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-secondary small mb-0">No bookings recorded yet.</p>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE MOVIES */}
      {activeTab === 'movies' && (
        <div className="row g-4">
          {/* Create Movie Form */}
          <div className="col-lg-5">
            <div className="im-card p-4 rounded-4" style={{ background: '#12141e' }}>
              <h5 className="text-white fw-bold mb-3">
                <i className="bi bi-plus-circle text-danger me-2"></i> Add New Movie
              </h5>
              <form onSubmit={handleCreateMovie} className="small">
                <div className="mb-2">
                  <label className="form-label text-secondary mb-1">Movie Title</label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label text-secondary mb-1">Description</label>
                  <textarea
                    rows="2"
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    value={movieForm.description}
                    onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label text-secondary mb-1">
                      Poster Image URL <span className="text-danger">*</span>
                    </label>
                    <input
                      type="url"
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      placeholder="https://.../poster.jpg"
                      value={movieForm.posterUrl}
                      onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                      required
                    />
                    <small className="text-secondary" style={{ fontSize: '0.68rem' }}>
                      Must be direct image ending in .jpg/.png
                    </small>
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary mb-1">Backdrop Image URL</label>
                    <input
                      type="url"
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      placeholder="https://.../banner.jpg"
                      value={movieForm.backdropUrl}
                      onChange={(e) => setMovieForm({ ...movieForm, backdropUrl: e.target.value })}
                    />
                    <small className="text-secondary" style={{ fontSize: '0.68rem' }}>
                      Wide banner image (optional)
                    </small>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label text-secondary mb-1">
                    <i className="bi bi-youtube text-danger me-1"></i> Trailer URL (YouTube Link)
                  </label>
                  <input
                    type="url"
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={movieForm.trailerUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                  />
                  <small className="text-secondary" style={{ fontSize: '0.68rem' }}>
                    Paste standard YouTube video or trailer link
                  </small>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label text-secondary mb-1">Genres (comma separated)</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      value={movieForm.genre}
                      onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      value={movieForm.duration}
                      onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-4">
                    <label className="form-label text-secondary mb-1">Language</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      value={movieForm.language}
                      onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label text-secondary mb-1">Rating (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      value={movieForm.rating}
                      onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label text-secondary mb-1">Status</label>
                    <select
                      className="form-select form-select-sm bg-dark text-white border-secondary"
                      value={movieForm.status}
                      onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                    >
                      <option value="now-showing">Now Showing</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-cinema btn-sm w-100 mt-2 fw-semibold"
                  disabled={isSubmittingMovie}
                >
                  {isSubmittingMovie ? 'Saving...' : 'Add Movie to Catalog'}
                </button>
              </form>
            </div>
          </div>

          {/* Existing Movies Table */}
          <div className="col-lg-7">
            <div className="im-card p-4 rounded-4" style={{ background: '#12141e' }}>
              <h5 className="text-white fw-bold mb-3">
                <i className="bi bi-collection-play text-danger me-2"></i> Current Movies ({movies.length})
              </h5>

              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                  <thead>
                    <tr className="text-secondary small">
                      <th>POSTER</th>
                      <th>TITLE</th>
                      <th>STATUS</th>
                      <th>RATING</th>
                      <th className="text-end">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {movies.map((m) => (
                      <tr key={m._id}>
                        <td>
                          <img
                            src={m.posterUrl}
                            alt={m.title}
                            className="rounded-2"
                            style={{ width: '36px', height: '50px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        </td>
                        <td className="fw-semibold text-white">{m.title}</td>
                        <td>
                          <span className={`badge ${m.status === 'now-showing' ? 'bg-danger' : 'bg-secondary'}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="text-warning">★ {m.rating}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            onClick={() => handleDeleteMovie(m._id, m.title)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALL BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="im-card p-4 rounded-4" style={{ background: '#12141e' }}>
          <h5 className="text-white fw-bold mb-3">
            <i className="bi bi-list-check text-danger me-2"></i> All Platform Bookings ({allBookings.length})
          </h5>

          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr className="text-secondary small">
                  <th>ID</th>
                  <th>USER</th>
                  <th>MOVIE</th>
                  <th>THEATER</th>
                  <th>SHOWTIME</th>
                  <th>SEATS</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody className="small">
                {allBookings.map((b) => (
                  <tr key={b._id}>
                    <td className="fw-bold text-white">{b.bookingId}</td>
                    <td>
                      <div>{b.user?.name || 'Customer'}</div>
                      <div className="text-secondary" style={{ fontSize: '0.72rem' }}>{b.user?.email}</div>
                    </td>
                    <td className="text-white">{b.movie?.title}</td>
                    <td className="text-secondary">{b.theater?.name}</td>
                    <td>{b.showDate} {b.showTime}</td>
                    <td>
                      <span className="badge bg-danger bg-opacity-25 text-danger">
                        {b.seats?.map((s) => s.seatNumber).join(', ')}
                      </span>
                    </td>
                    <td className="text-warning fw-semibold">₹{b.totalAmount}</td>
                    <td>
                      <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
