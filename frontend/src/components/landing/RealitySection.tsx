import { useEffect, useState } from 'react';
import { Icon, type IconName } from './Icon';
import { CompareSlider } from './CompareSlider';
import { useInView, usePrefersReducedMotion } from './hooks';

const ROTATE_MS = 7000;

const issues: {
  num: string;
  icon: IconName;
  title: string;
  text: string;
  claim: string;
  finding: string;
  where: string;
  severity: 'High' | 'Medium';
  photo: string;
  alt: string;
}[] = [
  {
    num: '01',
    icon: 'star',
    title: 'Fake reviews',
    text: '5-star ratings bought by landlords, not earned from students.',
    claim: '“4.9★ — best PG near campus”',
    finding: 'Most of the glowing reviews came from accounts that never lived there.',
    where: 'HSR Layout, Bengaluru',
    severity: 'Medium',
    photo: '/landing/reality-reviews.webp',
    alt: 'A hand scrolling reviews on a smartphone',
  },
  {
    num: '02',
    icon: 'home',
    title: 'Hygiene nightmares',
    text: "Kitchens and rooms you wouldn't wish on anyone.",
    claim: '“Hygienic in-house kitchen”',
    finding: 'Dishes left for days, open food containers and pests in the pantry.',
    where: 'Gachibowli, Hyderabad',
    severity: 'High',
    photo: '/landing/reality-hygiene.webp',
    alt: 'A cluttered kitchen counter piled with unwashed dishes',
  },
  {
    num: '03',
    icon: 'water',
    title: 'Water & plumbing',
    text: 'Irregular supply and showers that never work.',
    claim: '“24×7 running water”',
    finding: 'Rusted taps that leak all day, and water only twice a day.',
    where: 'Kota, Rajasthan',
    severity: 'High',
    photo: '/landing/reality-water.webp',
    alt: 'Rusted wall taps with water running down a stained wall',
  },
  {
    num: '04',
    icon: 'lock',
    title: 'Safety risks',
    text: 'Useless locks, dead cameras, and no security.',
    claim: '“Fully secured, CCTV on every floor”',
    finding: 'The main door closes with a rusted latch. No working camera at the entrance.',
    where: 'Koramangala, Bengaluru',
    severity: 'High',
    photo: '/landing/reality-safety.webp',
    alt: 'A rusted latch on an old wooden door',
  },
];

export function RealitySection() {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(58);
  const [paused, setPaused] = useState(false);
  const [touched, setTouched] = useState(false);
  const reduced = usePrefersReducedMotion();
  const [stageRef, inView] = useInView<HTMLDivElement>(0.3, false);
  const autoplay = inView && !paused && !touched && !reduced;
  const issue = issues[active];

  // Rotate through the issues while the section is on screen and untouched.
  useEffect(() => {
    if (!autoplay) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % issues.length), ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [autoplay, active]);

  const select = (i: number) => {
    setActive(i);
    setPos(58);
    setTouched(true);
  };

  return (
    <section className="section reality" id="reality">
      <div className="section-heading page-shell reveal">
        <span className="section-index">01 / THE REALITY</span>
        <div>
          <h2>Stop guessing about<br />where you'll live.</h2>
          <p>Don't let a glossy brochure trap you. Hear from students who lived there before you sign anything.</p>
        </div>
      </div>

      <div
        className="reality-panel page-shell reveal"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="reality-list" role="tablist" aria-label="Common housing problems">
          {issues.map((it, i) => (
            <button
              key={it.title}
              role="tab"
              id={`reality-tab-${i}`}
              aria-selected={active === i}
              aria-controls="reality-stage"
              className={`reality-item ${active === i ? 'is-active' : ''}`}
              onClick={() => select(i)}
            >
              <span className="reality-item__top">
                <span className="reality-item__icon"><Icon name={it.icon} size={20} /></span>
                <span className="reality-item__title">{it.title}</span>
                <span className="reality-item__num">{it.num}</span>
              </span>
              <span className="reality-item__body"><span>{it.text}</span></span>
              <span className="reality-item__bar">
                <i
                  key={`${active}-${autoplay}`}
                  style={{
                    animationDuration: `${ROTATE_MS}ms`,
                    animationPlayState: autoplay && active === i ? 'running' : 'paused',
                  }}
                />
              </span>
            </button>
          ))}
        </div>

        <div className="reality-stage" id="reality-stage" role="tabpanel" aria-labelledby={`reality-tab-${active}`} ref={stageRef}>
          <CompareSlider
            key={active}
            className="reality-compare"
            before={{ src: '/landing/listing-room.webp', alt: 'A spotless, staged bedroom from a property listing', label: 'The listing' }}
            after={{ src: issue.photo, alt: issue.alt, label: 'The reality' }}
            position={pos}
            onPositionChange={setPos}
            onInteract={() => setTouched(true)}
            ariaLabel="Drag to compare the listing with what students found"
          >
            <div className="claim-card" data-no-drag style={{ opacity: pos > 30 ? 1 : 0.25 }}>
              <span className="micro-label">LISTING SAYS</span>
              <p className={pos < 45 ? 'is-struck' : ''}>{issue.claim}</p>
            </div>
            <article className="finding-card" data-no-drag>
              <header>
                <span className="finding-avatar"><Icon name="user" size={14} /></span>
                <span>
                  <strong>Verified resident</strong>
                  <small><Icon name="pin" size={11} /> {issue.where}</small>
                </span>
                <span className={`severity severity--${issue.severity.toLowerCase()}`}>{issue.severity}</span>
              </header>
              <p>{issue.finding}</p>
              <footer>
                <span className="ai-mark"><Icon name="spark" size={12} /> AI verified</span>
                <span className="finding-meta"><Icon name="camera" size={12} /> Photo evidence</span>
              </footer>
            </article>
            {!touched && (
              <span className="drag-hint" aria-hidden="true">
                <Icon name="arrowLeft" size={13} /> Drag to compare <Icon name="arrow" size={13} />
              </span>
            )}
          </CompareSlider>
        </div>
      </div>
    </section>
  );
}
