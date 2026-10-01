import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { CompareSlider } from './CompareSlider';
import { useInView, usePrefersReducedMotion } from './hooks';

/* ------------------------------------------------------------------ */
/* Verified photo proof                                                */
/* ------------------------------------------------------------------ */

const evidence = [
  {
    src: '/landing/evidence-ceiling.webp',
    alt: 'A collapsed, water-damaged ceiling',
    label: 'Ceiling water damage',
    box: { left: '8%', top: '22%', width: '78%', height: '40%' },
    meta: ['Room 204', 'Taken 2 days ago'],
  },
  {
    src: '/landing/evidence-wall.webp',
    alt: 'Paint peeling off a damp wall',
    label: 'Damp, peeling wall',
    box: { left: '12%', top: '8%', width: '62%', height: '58%' },
    meta: ['Common hall', 'Taken 5 days ago'],
  },
  {
    src: '/landing/fix-before.webp',
    alt: 'A tap dripping water',
    label: 'Leaking tap',
    box: { left: '40%', top: '14%', width: '42%', height: '62%' },
    meta: ['Bathroom, floor 2', 'Taken today'],
  },
];

const checks = [
  { title: 'Vision check', detail: 'The damage is clearly visible in the photo' },
  { title: 'Context check', detail: 'The photo matches what the student wrote' },
  { title: 'Cross-check', detail: 'Location and time are consistent' },
];

const STEP_MS = 900;

export function PhotoProof() {
  const [photo, setPhoto] = useState(0);
  const [stage, setStage] = useState(0); // 0 = scanning, 1..3 = checks passed
  const [run, setRun] = useState(0);
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLElement>(0.35);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setStage(checks.length);
      return;
    }
    setStage(0);
    const timers = checks.map((_, i) => window.setTimeout(() => setStage(i + 1), 1300 + i * STEP_MS));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, run, photo, reduced]);

  const done = stage >= checks.length;
  const current = evidence[photo];

  return (
    <article className="proof feature reveal" ref={ref} aria-labelledby="proof-title">
      <div className="proof-visual">
        <div className={`evidence-viewer ${done ? 'is-done' : 'is-scanning'}`}>
          <img key={current.src} src={current.src} alt={current.alt} loading="lazy" />
          <span className="scan-line" aria-hidden="true" />
          <span className="detect-box" style={current.box} aria-hidden="true">
            <span>{current.label}</span>
          </span>
          <div className="evidence-meta">
            <span><Icon name="pin" size={12} /> {current.meta[0]}</span>
            <span><Icon name="clock" size={12} /> {current.meta[1]}</span>
          </div>
          <div className="evidence-status" aria-live="polite">
            {done ? (
              <><Icon name="check" size={14} /> Evidence confirmed</>
            ) : (
              <><Icon name="scan" size={14} /> Checking evidence…</>
            )}
          </div>
        </div>
        <div className="evidence-thumbs" role="group" aria-label="Choose an evidence photo">
          {evidence.map((e, i) => (
            <button
              key={e.src}
              className={photo === i ? 'is-active' : ''}
              onClick={() => setPhoto(i)}
              aria-pressed={photo === i}
              aria-label={`Show evidence: ${e.label}`}
            >
              <img src={e.src} alt="" loading="lazy" />
            </button>
          ))}
          <span className="thumbs-note"><Icon name="camera" size={14} /> Uploaded by verified residents</span>
        </div>
      </div>

      <div className="proof-copy">
        <span className="feature-num">02</span>
        <h3 id="proof-title">Verified photo proof</h3>
        <p>Real photos from real residents. Every photo is checked by three AI models before a report can affect a property's score.</p>

        <ol className="check-list">
          {checks.map((c, i) => {
            const state = stage > i ? 'passed' : stage === i ? 'running' : 'waiting';
            return (
              <li key={c.title} className={`check check--${state}`}>
                <span className="check-dot">{state === 'passed' ? <Icon name="check" size={14} /> : <i />}</span>
                <span>
                  <strong>{c.title}</strong>
                  <small>{c.detail}</small>
                </span>
                <em>{state === 'passed' ? 'Agrees' : state === 'running' ? 'Checking' : 'Waiting'}</em>
              </li>
            );
          })}
        </ol>

        <div className="consensus">
          <div className="consensus-meter" aria-hidden="true">
            {checks.map((_, i) => <span key={i} className={stage > i ? 'on' : ''} />)}
          </div>
          <p>
            <strong>{Math.min(stage, 3)} of 3 agree</strong>
            <small>At least 2 must agree before a report counts.</small>
          </p>
          <button className="replay" onClick={() => setRun((r) => r + 1)} disabled={!done}>
            <Icon name="refresh" size={15} /> Replay
          </button>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Owner accountability                                                */
/* ------------------------------------------------------------------ */

const steps = [
  { title: 'Issue reported', detail: 'Leaking tap · Room 204 · Day 0', pos: 88 },
  { title: 'Owner uploads proof', detail: 'Photo of the new fitting · Day 2', pos: 50 },
  { title: 'Student confirms the fix', detail: 'The original reporter checks it', pos: 22 },
  { title: 'Score recovers', detail: 'Trust Score goes from 64 to 86', pos: 0 },
];

const AUTO_MS = 2600;

export function OwnerAccountability() {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState(88);
  const [auto, setAuto] = useState(true);
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLElement>(0.4);

  useEffect(() => {
    if (!inView || !auto || reduced || step >= steps.length - 1) return;
    const t = window.setTimeout(() => goTo(step + 1), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [inView, auto, step, reduced]);

  function goTo(i: number) {
    setStep(i);
    setPos(steps[i].pos);
  }

  const resolved = step === steps.length - 1;
  const score = resolved ? 86 : 64;

  return (
    <article className="accountability feature reveal" id="owners" ref={ref} aria-labelledby="owners-title">
      <div className="accountability-copy">
        <span className="feature-num">03</span>
        <h3 id="owners-title">Owner accountability</h3>
        <p>Owners can't just say it's fixed. They upload proof, and an issue only counts as resolved when the student who reported it confirms the fix.</p>

        <ol className="timeline">
          {steps.map((s, i) => (
            <li key={s.title} className={i < step ? 'is-done' : i === step ? 'is-current' : ''}>
              <button
                onClick={() => {
                  setAuto(false);
                  goTo(i);
                }}
                aria-current={i === step ? 'step' : undefined}
              >
                <span className="timeline-dot">{i < step || (resolved && i === step) ? <Icon name="check" size={13} /> : i + 1}</span>
                <span>
                  <strong>{s.title}</strong>
                  <small>{s.detail}</small>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="accountability-actions">
          <Link className="button button--dark" to="/owner/register">
            Register your property <Icon name="arrow" size={17} />
          </Link>
          <button
            className="text-action"
            onClick={() => {
              setAuto(true);
              goTo(0);
            }}
          >
            <Icon name="refresh" size={15} /> Replay
          </button>
        </div>
      </div>

      <div className="accountability-visual">
        <CompareSlider
          className="fix-compare"
          before={{ src: '/landing/fix-before.webp', alt: 'The leaking tap as reported', label: 'Reported · Day 0' }}
          after={{ src: '/landing/fix-after.webp', alt: 'The new tap installed by the owner', label: 'Fixed · Day 2' }}
          position={pos}
          onPositionChange={setPos}
          onInteract={() => setAuto(false)}
          ariaLabel="Drag to compare the reported issue with the owner's fix"
        >
          <div className={`fix-score ${resolved ? 'is-good' : ''}`} data-no-drag aria-live="polite">
            <span className="micro-label">TRUST SCORE</span>
            <strong>{score}</strong>
            <small>{resolved ? 'Excellent' : 'Fair'}</small>
          </div>
          <div className={`fix-status ${resolved ? 'is-resolved' : ''}`} data-no-drag>
            {resolved ? (
              <><Icon name="check" size={14} /> Resolved · confirmed by student</>
            ) : step === 2 ? (
              <><Icon name="user" size={14} /> Student confirmed · updating score</>
            ) : step === 1 ? (
              <><Icon name="clock" size={14} /> Waiting for student confirmation</>
            ) : (
              <><Icon name="alert" size={14} /> Open issue · score lowered</>
            )}
          </div>
        </CompareSlider>
      </div>
    </article>
  );
}
