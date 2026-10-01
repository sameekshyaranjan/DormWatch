import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AccommodationMap from '../components/AccommodationMap';
import { Icon } from '../components/landing/Icon';

type Filter = 'all' | 'safe' | 'caution' | 'avoid';
type Sort = 'score-desc' | 'score-asc' | 'reports' | 'name';

const FILTERS: { id: Filter; label: string; tone?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'safe', label: 'Excellent 80+', tone: 'green' },
  { id: 'caution', label: 'Fair 50–79', tone: 'amber' },
  { id: 'avoid', label: 'Critical <50', tone: 'red' },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: 'score-desc', label: 'Highest Trust Score' },
  { id: 'score-asc', label: 'Lowest Trust Score' },
  { id: 'reports', label: 'Most reports' },
  { id: 'name', label: 'Name (A–Z)' },
];

const TYPE_LABEL: Record<string, string> = { pg: 'PG', hostel: 'Hostel', apartment: 'Apartment' };

const scoreOf = (acc: any): number => Math.round(Number(acc.trustScore ?? acc.dsi ?? 0));
const toneOf = (score: number) => (score >= 80 ? 'green' : score >= 50 ? 'amber' : 'red');
const labelOf = (score: number) => (score >= 80 ? 'Excellent' : score >= 50 ? 'Fair' : 'Critical');
const reportsOf = (acc: any): number => Number(acc.totalReports ?? acc.reportCount ?? 0);
const rentOf = (acc: any): number | null => {
  const rent = Number(acc.monthlyRent ?? acc.pricePerMonth ?? 0);
  return rent > 0 ? rent : null;
};
const matchesFilter = (score: number, filter: Filter) =>
  filter === 'all' ||
  (filter === 'safe' && score >= 80) ||
  (filter === 'caution' && score >= 50 && score < 80) ||
  (filter === 'avoid' && score < 50);

function PropertyCard({ acc, view }: { acc: any; view: 'grid' | 'list' }) {
  const score = scoreOf(acc);
  const tone = toneOf(score);
  const reports = reportsOf(acc);
  const verified = Number(acc.verifiedReportCount ?? 0);
  const rent = rentOf(acc);
  const place = [...new Set([acc.area, acc.city].filter(Boolean))].join(', ') || acc.address;

  return (
    <Link to={`/accommodations/${acc._id}`} className={`prop-card prop-card--${view}`}>
      <div className="prop-media">
        {acc.images?.length > 0 ? (
          <img src={acc.images[0]} alt={acc.name} loading="lazy" />
        ) : (
          <div className="prop-media__empty">
            <Icon name="home" size={30} />
            <span>No photos yet</span>
          </div>
        )}
        <span className={`prop-score prop-score--${tone}`}>
          <i /> {score} · {labelOf(score)}
        </span>
        {acc.images?.length > 1 && (
          <span className="prop-photos"><Icon name="camera" size={12} /> {acc.images.length}</span>
        )}
      </div>

      <div className="prop-body">
        <div className="prop-title">
          <div>
            <span className="micro-label">{(TYPE_LABEL[acc.type] || acc.type || 'Hostel / PG').toString().toUpperCase()}</span>
            <h3>{acc.name}</h3>
          </div>
          <span className={`prop-ring prop-ring--${tone}`} style={{ '--p': score } as React.CSSProperties} aria-label={`Trust Score ${score} out of 100`}>
            <strong>{score}</strong>
          </span>
        </div>

        <p className="prop-place"><Icon name="pin" size={14} /> {place}</p>

        <dl className="prop-stats">
          <div>
            <dt>Reports</dt>
            <dd>{reports}</dd>
          </div>
          <div>
            <dt>Verified</dt>
            <dd>{verified}</dd>
          </div>
          <div>
            <dt>Rent</dt>
            <dd>{rent ? `₹${rent.toLocaleString('en-IN')}` : '—'}</dd>
          </div>
        </dl>

        <div className="prop-foot">
          {acc.isVerified ? (
            <span className="prop-verified"><Icon name="check" size={13} /> Verified property</span>
          ) : (
            <span className="prop-unverified">Owner not yet verified</span>
          )}
          <span className="prop-cta">Safety profile <Icon name="arrow" size={15} /></span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="prop-card prop-card--grid is-skeleton" aria-hidden="true">
      <div className="prop-media sk" />
      <div className="prop-body">
        <span className="sk sk-line" style={{ width: '40%' }} />
        <span className="sk sk-line sk-line--lg" style={{ width: '75%' }} />
        <span className="sk sk-line" style={{ width: '60%' }} />
        <span className="sk sk-block" />
      </div>
    </div>
  );
}

export const AccommodationList: React.FC = () => {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  // Pre-filled from the landing page search (?q=Koramangala)
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') ?? '');
  const [selectedFilter, setSelectedFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('score-desc');
  const [showMap, setShowMap] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchAccommodations();
  }, []);

  // Keep ?q= in the URL so searches can be shared and survive a refresh.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (searchTerm.trim()) next.set('q', searchTerm.trim());
      else next.delete('q');
      if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
    }, 300);
    return () => window.clearTimeout(t);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAccommodations = async () => {
    try {
      const response = await fetch(`${API}/api/accommodations`);
      const data = await response.json();
      if (data.success) {
        setAccommodations(data.data);
      } else {
        setError('Failed to load accommodations');
      }
    } catch {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const searched = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return (accommodations || []).filter(
      (acc) =>
        !q ||
        acc.name?.toLowerCase().includes(q) ||
        acc.address?.toLowerCase().includes(q) ||
        acc.area?.toLowerCase().includes(q) ||
        acc.city?.toLowerCase().includes(q)
    );
  }, [accommodations, searchTerm]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: searched.length, safe: 0, caution: 0, avoid: 0 };
    searched.forEach((acc) => {
      const s = scoreOf(acc);
      if (s >= 80) c.safe += 1;
      else if (s >= 50) c.caution += 1;
      else c.avoid += 1;
    });
    return c;
  }, [searched]);

  const results = useMemo(() => {
    const list = searched.filter((acc) => matchesFilter(scoreOf(acc), selectedFilter));
    const sorted = [...list];
    if (sort === 'score-desc') sorted.sort((a, b) => scoreOf(b) - scoreOf(a));
    else if (sort === 'score-asc') sorted.sort((a, b) => scoreOf(a) - scoreOf(b));
    else if (sort === 'reports') sorted.sort((a, b) => reportsOf(b) - reportsOf(a));
    else sorted.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return sorted;
  }, [searched, selectedFilter, sort]);

  const summary = useMemo(() => {
    const scores = accommodations.map(scoreOf);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const cities = new Set(accommodations.map((a) => a.city).filter(Boolean));
    return { total: accommodations.length, avg, excellent: scores.filter((s) => s >= 80).length, cities: cities.size };
  }, [accommodations]);

  // Popular areas come from the data itself, most listed first.
  const popularAreas = useMemo(() => {
    const freq = new Map<string, number>();
    accommodations.forEach((a) => {
      const key = a.area || a.city;
      if (key) freq.set(key, (freq.get(key) || 0) + 1);
    });
    return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);
  }, [accommodations]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
  };

  return (
    <div className="dw dw-page listing">
      {/* Search header */}
      <section className="listing-hero page-shell">
        <div className="listing-hero__copy">
          <span className="section-index">EXPLORE</span>
          <h1>Find a safe place<br />near campus.</h1>
          <p>Every property shows a live Trust Score built from verified student reports. Search by name, area or city.</p>

          <form className="listing-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <Icon name="search" size={20} />
            <label className="sr-only" htmlFor="listing-q">Search accommodations</label>
            <input
              id="listing-q"
              type="search"
              placeholder="Search by name, area or city…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
            {searchTerm && (
              <button type="button" className="listing-search__clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
                <Icon name="x" size={16} />
              </button>
            )}
          </form>

          {popularAreas.length > 0 && (
            <div className="area-chips" aria-label="Popular areas">
              <span>Popular:</span>
              {popularAreas.map((area) => (
                <button
                  key={area}
                  className={searchTerm.toLowerCase() === area.toLowerCase() ? 'is-active' : ''}
                  onClick={() => setSearchTerm(searchTerm.toLowerCase() === area.toLowerCase() ? '' : area)}
                >
                  {area}
                </button>
              ))}
            </div>
          )}
        </div>

        <dl className="listing-summary" aria-label="Summary">
          <div>
            <dt>Properties</dt>
            <dd>{loading ? '—' : summary.total}</dd>
          </div>
          <div>
            <dt>Average Trust Score</dt>
            <dd>{loading ? '—' : summary.avg}</dd>
          </div>
          <div>
            <dt>Rated Excellent</dt>
            <dd>{loading ? '—' : summary.excellent}</dd>
          </div>
          <div>
            <dt>Cities</dt>
            <dd>{loading ? '—' : summary.cities}</dd>
          </div>
        </dl>
      </section>

      {/* Toolbar */}
      <div className="listing-toolbar-host">
        <div className="listing-toolbar page-shell">
          <div className="filter-group" role="radiogroup" aria-label="Filter by Trust Score">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="radio"
                aria-checked={selectedFilter === f.id}
                className={selectedFilter === f.id ? 'is-active' : ''}
                onClick={() => setSelectedFilter(f.id)}
              >
                {f.tone && <i className={`dot dot--${f.tone}`} />}
                {f.label}
                <span className="count">{loading ? '·' : counts[f.id]}</span>
              </button>
            ))}
          </div>

          <div className="toolbar-right">
            <label className="sort">
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <Icon name="chevron" size={15} />
            </label>
            <div className="view-toggle" role="group" aria-label="Layout">
              <button className={viewMode === 'grid' ? 'is-active' : ''} onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} aria-label="Grid view">
                <Icon name="grid" size={17} />
              </button>
              <button className={viewMode === 'list' ? 'is-active' : ''} onClick={() => setViewMode('list')} aria-pressed={viewMode === 'list'} aria-label="List view">
                <Icon name="list" size={17} />
              </button>
            </div>
            <button
              className={`map-toggle ${showMap ? 'is-active' : ''}`}
              onClick={() => setShowMap(!showMap)}
              aria-pressed={showMap}
              aria-label={showMap ? 'Hide map' : 'Show map'}
            >
              <Icon name="map" size={16} /> <span>{showMap ? 'Hide map' : 'Show map'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="page-shell listing-body">
        {showMap && (
          <div className="listing-map">
            <AccommodationMap />
          </div>
        )}

        {error && (
          <div className="listing-error" role="alert">
            <span className="listing-error__icon"><Icon name="alert" size={20} /></span>
            <div>
              <strong>We couldn't load properties</strong>
              <p>{error}. Check your connection and try again.</p>
            </div>
            <button
              className="button button--dark button--small"
              onClick={() => {
                setError('');
                setLoading(true);
                fetchAccommodations();
              }}
            >
              <Icon name="refresh" size={15} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <p className="results-meta" aria-live="polite">
            Showing <strong>{results.length}</strong> of {accommodations.length} properties
            {searchTerm && <> for “<strong>{searchTerm}</strong>”</>}
            {(searchTerm || selectedFilter !== 'all') && (
              <button className="text-action" onClick={resetFilters}>Clear filters</button>
            )}
          </p>
        )}

        {loading ? (
          <div className="prop-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : results.length === 0 && !error ? (
          <div className="listing-empty">
            <span className="listing-empty__icon"><Icon name="search" size={26} /></span>
            <h3>{accommodations.length === 0 ? 'No properties listed yet' : 'No matches for these filters'}</h3>
            <p>
              {accommodations.length === 0
                ? 'Know a PG or hostel that should be here? Owners can register for free.'
                : 'Try a different area, or widen the Trust Score filter.'}
            </p>
            <div className="listing-empty__actions">
              {accommodations.length > 0 && (
                <button className="button button--dark" onClick={resetFilters}>Clear filters</button>
              )}
              <Link className="text-action" to="/owner/register">
                Register a property <Icon name="arrow" size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'prop-grid' : 'prop-list'}>
            {results.map((acc) => <PropertyCard key={acc._id} acc={acc} view={viewMode} />)}
          </div>
        )}
      </div>
    </div>
  );
};
