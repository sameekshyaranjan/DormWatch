import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from '../components/landing/Icon';
import { Logo, dashboardPath } from '../components/landing/SiteHeader';
import { DemoQuickStart } from '../components/landing/DemoLogin';
import { RealitySection } from '../components/landing/RealitySection';
import { PhotoProof, OwnerAccountability } from '../components/landing/ProofFeatures';
import { useInView, usePrefersReducedMotion } from '../components/landing/hooks';

const scoreMeta = (score: number) => {
  if (score >= 80) return { label: 'Excellent', detail: 'High standards, few reports, and quick fixes.', color: 'var(--green)' };
  if (score >= 50) return { label: 'Fair', detail: 'Some recurring issues. Read the latest reports.', color: 'var(--amber)' };
  return { label: 'Critical', detail: 'Unresolved safety problems. Consider other options.', color: 'var(--red)' };
};

const scoreTone = (score: number) => (score >= 80 ? 'green' : score >= 50 ? 'amber' : 'red');

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const suggestions = ['Koramangala, Bengaluru', 'Gachibowli, Hyderabad', 'Kota, Rajasthan', 'North Campus, Delhi', 'Viman Nagar, Pune'];

function SearchBox() {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(-1);
  const matches = suggestions.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase()));

  const go = (value: string) => {
    const q = value.trim();
    navigate(q ? `/accommodations?q=${encodeURIComponent(q.split(',')[0])}` : '/accommodations');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!matches.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocused(true);
      setHighlight((h) => (h + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? matches.length - 1 : h - 1));
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  };

  return (
    <div className="search-shell">
      <form
        className={`search-box ${focused ? 'is-focused' : ''}`}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(highlight >= 0 && matches[highlight] ? matches[highlight] : query);
        }}
      >
        <Icon name="pin" size={22} />
        <label className="sr-only" htmlFor="location">Where are you studying?</label>
        <input
          id="location"
          placeholder="Where are you studying?"
          autoComplete="off"
          value={query}
          role="combobox"
          aria-expanded={focused && matches.length > 0}
          aria-controls="location-suggestions"
          aria-activedescendant={highlight >= 0 ? `suggestion-${highlight}` : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(-1);
            setFocused(true);
          }}
        />
        <button className="button button--dark" type="submit">
          <Icon name="search" size={18} /> <span>Search</span>
        </button>
      </form>
      {focused && matches.length > 0 && (
        <div className="suggestions" id="location-suggestions" role="listbox">
          <span>Popular areas</span>
          {matches.map((s, i) => (
            <button
              key={s}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={highlight === i}
              className={highlight === i ? 'is-highlighted' : ''}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => {
                setQuery(s);
                go(s);
              }}
            >
              <Icon name="pin" size={16} />
              {s}
              <Icon name="arrow" size={14} className="suggestion-go" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductVisual() {
  const [activePin, setActivePin] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const pins = [
    { name: 'Sunshine PG', area: 'Koramangala', score: 88, x: '62%', y: '31%' },
    { name: 'Lakeview House', area: 'Ejipura', score: 72, x: '28%', y: '46%' },
    { name: 'City Nest', area: 'BTM Layout', score: 43, x: '74%', y: '69%' },
  ];

  // Subtle depth: cards drift with the pointer.
  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${((e.clientX - r.left) / r.width - 0.5).toFixed(3)}`);
    ref.current.style.setProperty('--my', `${((e.clientY - r.top) / r.height - 0.5).toFixed(3)}`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty('--mx', '0');
    ref.current?.style.setProperty('--my', '0');
  };

  return (
    <div className="product-visual reveal" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="map-card">
        <div className="map-top">
          <span><Icon name="map" size={16} /> Near Koramangala</span>
          <span className="live-dot">Live</span>
        </div>
        <div className="map-grid">
          <span className="road road-a" />
          <span className="road road-b" />
          <span className="road road-c" />
          {pins.map((pin, i) => (
            <button
              key={pin.name}
              className={`map-pin score-${scoreTone(pin.score)} ${activePin === i ? 'active' : ''}`}
              style={{ left: pin.x, top: pin.y }}
              onMouseEnter={() => setActivePin(i)}
              onFocus={() => setActivePin(i)}
              onClick={() => setActivePin(i)}
              aria-label={`${pin.name}, ${pin.area}, Trust Score ${pin.score}`}
            >
              <Icon name="pin" size={22} />
            </button>
          ))}
          <div className="map-popover" style={{ left: pins[activePin].x, top: pins[activePin].y }}>
            <strong>{pins[activePin].name}</strong>
            <span>{pins[activePin].area}</span>
            <b className={`score-${scoreTone(pins[activePin].score)}`}>{pins[activePin].score}</b>
          </div>
        </div>
      </div>
      <article className="property-card">
        <div className="property-photo">
          <img src="/landing/building.webp" alt="Sunshine PG building exterior" />
          <span className="verified-tag"><Icon name="check" size={13} /> Verified property</span>
          <span className="photo-count"><Icon name="camera" size={12} /> 24 resident photos</span>
        </div>
        <div className="property-body">
          <div>
            <span className="micro-label">KORAMANGALA, BENGALURU</span>
            <h3>Sunshine PG</h3>
          </div>
          <div className="score-orbit" style={{ '--p': '88' } as React.CSSProperties}>
            <strong>88</strong>
            <span>Excellent</span>
          </div>
        </div>
        <div className="report-row">
          <img className="report-thumb" src="/landing/fix-after.webp" alt="" />
          <p>
            <strong>Water issue fixed in 24 hrs</strong>
            <span>Confirmed by a verified resident</span>
          </p>
          <span className="ai-mark"><Icon name="spark" size={13} /> AI verified</span>
        </div>
      </article>
      <div className="trust-note">
        <span><Icon name="shield" size={16} /></span>
        <p>
          <strong>3-model verification</strong>
          <small>2 of 3 must agree</small>
        </p>
      </div>
    </div>
  );
}

function Hero() {
  const { user } = useAuth();
  return (
    <section className="hero page-shell" id="top">
      <div className="hero-copy reveal">
        <span className="hero-kicker">Safer student housing, together</span>
        <h1>
          Find safe housing.
          <br />
          Zero surprises. <Icon name="spark" size={38} />
        </h1>
        <p>Verified safety reports from students who actually lived there. No fake photos. No bought ratings. Just the truth.</p>
        <SearchBox />
        <div className="hero-links">
          {user ? (
            <Link to={dashboardPath(user.role)}>
              Go to your dashboard <Icon name="arrow" size={17} />
            </Link>
          ) : (
            <Link to="/register">
              Have a safety issue to report? <Icon name="arrow" size={17} />
            </Link>
          )}
          <span>
            <i>10k+</i> Trusted by 10,000+ students across India
          </span>
        </div>
        {!user && <DemoQuickStart />}
      </div>
      <ProductVisual />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduced]);
  return (
    <span ref={ref}>
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

function Stats() {
  const stats = [
    [50, '+', 'cities'],
    [10000, '+', 'students protected'],
    [500, '+', 'verified PGs & hostels'],
    [2500, '+', 'safety reports'],
    [95, '%', 'issues resolved'],
    [100, '%', 'anonymous reporting'],
  ] as const;
  return (
    <section className="stats page-shell" aria-label="DormWatch by the numbers">
      {stats.map(([n, suffix, label]) => (
        <div key={label}>
          <strong><CountUp value={n} suffix={suffix} /></strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    ['Explore', 'Browse housing near your college on the live map.', '/accommodations'],
    ['Investigate', 'Check the Trust Score for safety and hygiene.', '#trust-score'],
    ['Uncover', 'Read verified reports and see real photo evidence.', '#proof'],
    ['Decide', 'Choose with data, not broker marketing.', '/accommodations'],
  ];
  return (
    <section className="section how-section page-shell" id="how">
      <div className="how-intro reveal">
        <span className="section-index">02 / HOW IT WORKS</span>
        <h2>Four steps to a<br />safer front door.</h2>
        <Link className="button button--lime" to="/accommodations">
          Start searching <Icon name="arrow" size={17} />
        </Link>
      </div>
      <ol className="steps">
        {steps.map(([title, text, href], i) => {
          const inner = (
            <>
              <span>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <Icon name="arrow" />
            </>
          );
          return (
            <li className="step reveal" key={title} style={{ transitionDelay: `${i * 80}ms` }}>
              {href.startsWith('#') ? <a href={href}>{inner}</a> : <Link to={href}>{inner}</Link>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

function MapFeature() {
  const [active, setActive] = useState(1);
  const data = [
    { name: 'Greenwood PG', area: 'HSR Layout', score: 91, pos: ['17%', '30%'] },
    { name: 'Campus Corner', area: 'Koramangala', score: 76, pos: ['61%', '38%'] },
    { name: 'Metro Stay', area: 'BTM Layout', score: 38, pos: ['39%', '68%'] },
    { name: 'Lotus Residency', area: 'Jayanagar', score: 84, pos: ['82%', '62%'] },
  ];
  const current = data[active];
  return (
    <div className="feature-map">
      <div className="map-search"><Icon name="search" size={16} /> Housing near Christ University</div>
      <span className="road road-a" />
      <span className="road road-b" />
      <span className="road road-c" />
      <span className="zone zone--safe" aria-hidden="true" />
      <span className="zone zone--risk" aria-hidden="true" />
      {data.map((p, i) => (
        <button
          key={p.name}
          className={`feature-pin score-${scoreTone(p.score)} ${active === i ? 'active' : ''}`}
          style={{ left: p.pos[0], top: p.pos[1] }}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onClick={() => setActive(i)}
          aria-label={`${p.name}, ${p.area}, Trust Score ${p.score}`}
        >
          <Icon name="pin" size={28} />
          <span>{p.score}</span>
        </button>
      ))}
      <div className="feature-popover" key={current.name}>
        <span className={`score-dot score-${scoreTone(current.score)}`} />
        <div>
          <strong>{current.name}</strong>
          <small>{current.area} · {scoreMeta(current.score).label}</small>
        </div>
        <b className={`score-${scoreTone(current.score)}`}>{current.score}</b>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="section features page-shell" id="proof">
      <div className="features-heading reveal">
        <span className="section-index">03 / BUILT FOR THE TRUTH</span>
        <h2>Everything polished listings leave out.</h2>
      </div>
      <article className="feature feature--map reveal">
        <div className="feature-copy">
          <span className="feature-num">01</span>
          <h3>Neighborhood<br />safety map</h3>
          <p>See if a place is in a safe zone before you visit. Every pin shows a live Trust Score.</p>
          <Link className="text-action" to="/accommodations">
            Explore the map <Icon name="arrow" size={17} />
          </Link>
        </div>
        <MapFeature />
      </article>
      <PhotoProof />
      <OwnerAccountability />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust Score                                                         */
/* ------------------------------------------------------------------ */

function TrustScore() {
  const [score, setScore] = useState(88);
  const meta = scoreMeta(score);
  const presets = [
    [92, 'Excellent'],
    [64, 'Fair'],
    [31, 'Critical'],
  ] as const;
  return (
    <section className="section score-section" id="trust-score">
      <div className="page-shell score-layout">
        <div className="score-copy reveal">
          <span className="section-index">04 / TRUST SCORE</span>
          <h2>One number.<br />The full story.</h2>
          <p>Every property gets a live, tamper-proof score from 0 to 100, built from verified reports, how fast issues get fixed, and resident feedback.</p>
          <div className="score-legend">
            {presets.map(([value, label]) => (
              <button key={label} onClick={() => setScore(value)} className={meta.label === label ? 'is-active' : ''}>
                <i className={scoreTone(value)} />
                {label === 'Excellent' ? '80–100' : label === 'Fair' ? '50–79' : '0–49'}
                <b>{label}</b>
                <Icon name="arrow" size={15} />
              </button>
            ))}
          </div>
        </div>
        <div className="score-demo reveal" style={{ '--score-color': meta.color } as React.CSSProperties}>
          <div className="gauge" style={{ '--score': `${score * 3.6}deg` } as React.CSSProperties}>
            <div>
              <strong>{score}</strong>
              <span>/ 100</span>
            </div>
          </div>
          <div className="score-status" aria-live="polite">
            <span style={{ background: meta.color }} />
            <div>
              <strong>{meta.label}</strong>
              <p>{meta.detail}</p>
            </div>
          </div>
          <label htmlFor="score-slider">Drag to try the live score</label>
          <input
            id="score-slider"
            type="range"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            aria-valuetext={`${score}, ${meta.label}`}
          />
          <div className="range-labels">
            <span>Critical</span>
            <span>Fair</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Audience                                                            */
/* ------------------------------------------------------------------ */

const audiences = {
  Students: {
    title: 'Choose your next room with open eyes.',
    items: ['Report anonymously without fear', 'Find safe places near campus', 'Avoid catfish listings with real photos', 'Hold landlords to their promises'],
    action: 'Report an issue',
    to: '/register',
    photo: '/landing/aud-students.webp',
    alt: 'A student working on a laptop in a quiet common room',
  },
  Parents: {
    title: 'Peace of mind, even from 500 km away.',
    items: ["Check your child's building yourself", 'Compare properties side by side', 'Get alerts when safety drops', 'Rely on honest student experiences'],
    action: 'Search accommodations',
    to: '/accommodations',
    photo: '/landing/aud-parents.webp',
    alt: 'A parent checking a location on their phone',
  },
  Owners: {
    title: 'Make good maintenance your advantage.',
    items: ['Turn fast maintenance into trust', 'Document every fix', 'Stand apart from bad landlords', 'Fill rooms by proving you care'],
    action: 'Register property',
    to: '/owner/register',
    photo: '/landing/aud-owners.webp',
    alt: 'A well-kept residential building on a city street',
  },
};

type AudienceKey = keyof typeof audiences;

function Audience() {
  const [active, setActive] = useState<AudienceKey>('Students');
  const keys = Object.keys(audiences) as AudienceKey[];
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = keys.indexOf(active);
    let next: AudienceKey;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = keys[(i + 1) % keys.length];
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = keys[(i - 1 + keys.length) % keys.length];
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`aud-tab-${next}`)?.focus();
  };

  return (
    <section className="section audience page-shell">
      <div className="audience-top reveal">
        <span className="section-index">05 / MADE FOR EVERYONE</span>
        <h2>Safety works when<br />everyone can see it.</h2>
      </div>
      <div className="audience-panel reveal">
        <div className="audience-tabs" role="tablist" aria-label="Choose audience" onKeyDown={onKeyDown}>
          {keys.map((key, i) => (
            <button
              key={key}
              role="tab"
              id={`aud-tab-${key}`}
              aria-selected={active === key}
              aria-controls={`aud-panel-${key}`}
              tabIndex={active === key ? 0 : -1}
              className={active === key ? 'active' : ''}
              onClick={() => setActive(key)}
            >
              {key}
              <span>0{i + 1}</span>
            </button>
          ))}
        </div>
        {/* All panels share one grid cell, so the box is always as tall as the
            tallest panel and never jumps when switching tabs. */}
        <div className="audience-stack">
          {keys.map((key) => {
            const c = audiences[key];
            const isActive = active === key;
            return (
              <div
                key={key}
                className={`audience-content ${isActive ? 'is-active' : ''}`}
                id={`aud-panel-${key}`}
                role="tabpanel"
                aria-labelledby={`aud-tab-${key}`}
                aria-hidden={!isActive}
                inert={!isActive}
              >
                <figure className="audience-photo">
                  <img src={c.photo} alt={c.alt} loading="lazy" />
                </figure>
                <div className="audience-text">
                  <h3>{c.title}</h3>
                  <ul>
                    {c.items.map((item) => (
                      <li key={item}><Icon name="check" size={18} />{item}</li>
                    ))}
                  </ul>
                  <Link className="button button--dark" to={c.to}>
                    {c.action} <Icon name="arrow" size={17} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

const testimonials = [
  { quote: 'I avoided a leasing nightmare because a previous student uploaded photos of black mold in the bathroom.', name: 'Priya S.', role: 'Student · Bengaluru', initials: 'PS' },
  { quote: "My daughter moved 500 km away for college. Checking her building's safety score myself gives me real peace of mind.", name: 'Rajesh K.', role: 'Parent · Chennai', initials: 'RK' },
  { quote: 'Fixing issues quickly raised our score and filled our vacancies. Finally, a way to prove we take safety seriously.', name: 'Venkat R.', role: 'Property manager · Bengaluru', initials: 'VR' },
];

const TESTIMONIAL_MS = 7000;

function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const running = !paused && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setActive((v) => (v + 1) % testimonials.length), TESTIMONIAL_MS);
    return () => window.clearTimeout(t);
  }, [active, running]);

  const go = (d: number) => setActive((v) => (v + d + testimonials.length) % testimonials.length);
  const t = testimonials[active];

  return (
    <section className="testimonials" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="page-shell testimonial-layout reveal">
        <div className="testimonial-side">
          <span className="section-index">06 / LIVED EXPERIENCE</span>
          <p>Stories from the people choosing better.</p>
          <div className="testimonial-controls">
            <button onClick={() => go(-1)} aria-label="Previous story"><Icon name="arrowLeft" size={18} /></button>
            <button onClick={() => go(1)} aria-label="Next story"><Icon name="arrow" size={18} /></button>
            <span className="testimonial-count">0{active + 1} / 0{testimonials.length}</span>
          </div>
          <div className="testimonial-nav">
            {testimonials.map((_, i) => (
              <button key={i} className={active === i ? 'active' : ''} onClick={() => setActive(i)} aria-label={`Show story ${i + 1}`}>
                {active === i && <i key={`${active}-${running}`} style={{ animationDuration: `${TESTIMONIAL_MS}ms`, animationPlayState: running ? 'running' : 'paused' }} />}
              </button>
            ))}
          </div>
        </div>
        <blockquote key={active} aria-live="polite">
          <span className="quote-mark" aria-hidden="true">“</span>
          <p>{t.quote}</p>
          <footer>
            <span>{t.initials}</span>
            <div>
              <strong>{t.name}</strong>
              <small>{t.role}</small>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ, CTA, footer                                                    */
/* ------------------------------------------------------------------ */

function FAQ() {
  const items = [
    ['Is DormWatch free?', 'Yes, always free for students and parents.'],
    ['Is my report anonymous?', "Yes. We verify you're a real student, but owners never see who reported."],
    ['How do you stop fake reports?', 'College-email verification, plus 3 AI models must agree the evidence is genuine.'],
    ['Can owners respond?', 'Yes. Owners upload proof of the fix, and the reporting student confirms it before the score recovers.'],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq page-shell" id="faq">
      <div className="faq-title reveal">
        <span className="section-index">07 / QUESTIONS</span>
        <h2>Good to know.</h2>
        <p>Still curious? <a href="mailto:hello@dormwatch.in">Talk to us</a>.</p>
      </div>
      <div className="faq-list reveal">
        {items.map(([q, a], i) => (
          <article className={open === i ? 'open' : ''} key={q}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} aria-controls={`faq-${i}`}>
              <span>0{i + 1}</span>
              {q}
              <i><Icon name="chevron" /></i>
            </button>
            <div id={`faq-${i}`} role="region">
              <p>{a}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="cta-wrap page-shell" id="cta">
      <div className="final-cta reveal">
        <div className="cta-eye"><Icon name="eye" size={34} /></div>
        <h2>Rent with confidence.</h2>
        <p>Join thousands of students making safer housing choices.</p>
        <div className="cta-actions">
          <Link className="button button--dark" to="/accommodations">
            Search accommodations <Icon name="arrow" size={17} />
          </Link>
          <Link className="text-action" to="/register">
            Report an issue <Icon name="arrow" size={17} />
          </Link>
        </div>
        <span className="cta-note">
          <Icon name="check" size={15} /> Always free <i /> <Icon name="check" size={15} /> Verified reports
        </span>
      </div>
    </section>
  );
}

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="footer">
      <div className="page-shell footer-grid">
        <div className="footer-brand">
          <Logo inverse />
          <p>Honest, verified safety information for student housing across India.</p>
        </div>
        <div>
          <h3>Platform</h3>
          <Link to="/accommodations">Find housing</Link>
          <Link to="/report">Report a hazard</Link>
          <Link to="/dashboard">Student dashboard</Link>
          <Link to="/owner/dashboard">Owner portal</Link>
        </div>
        <div>
          <h3>Support</h3>
          <a href="#faq">Safety guides</a>
          <a href="#faq">Help center</a>
          <a href="#faq">Privacy</a>
          <a href="#faq">Terms</a>
        </div>
        <form
          className="newsletter"
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setSubscribed(true);
          }}
        >
          <h3>Weekly safety alerts for your area</h3>
          {subscribed ? (
            <p className="newsletter-done"><Icon name="check" size={16} /> You're on the list.</p>
          ) : (
            <>
              <label className="sr-only" htmlFor="email">Email address</label>
              <div>
                <input id="email" type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button aria-label="Subscribe"><Icon name="arrow" size={18} /></button>
              </div>
            </>
          )}
        </form>
      </div>
      <div className="page-shell footer-bottom">
        <span>© 2026 DormWatch</span>
        <span>English · हिंदी · తెలుగు</span>
        <span>Made for students, across India.</span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

export const Home: React.FC = () => {
  const location = useLocation();

  // Arriving from another page via /#how etc. — scroll once the section exists.
  useEffect(() => {
    if (!location.hash) return;
    const t = window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }), 80);
    return () => window.clearTimeout(t);
  }, [location.hash]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.dw .reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="dw">
      <div className="dw-main">
        <Hero />
        <Stats />
        <RealitySection />
        <HowItWorks />
        <Features />
        <TrustScore />
        <Audience />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </div>
      <Footer />
    </div>
  );
};
