import './Landscape.css'

const pine = (x, y, s = 1) =>
  `M${x} ${y} l${-10 * s} ${26 * s} h${20 * s}z M${x} ${y + 12 * s} l${-13 * s} ${26 * s} h${26 * s}z`

const PINES = [
  [60, 338, 1],
  [122, 328, 1.1],
  [152, 332, 0.9],
  [244, 340, 1],
  [1182, 284, 1.1],
  [1216, 292, 0.9],
  [1256, 295, 1],
  [1312, 290, 1.1],
  [1352, 282, 0.9],
  [1400, 292, 1],
]

const CLOUDS = [
  { top: '8vh', w: 200, dur: 150, delay: -40, rx: '8vw' },
  { top: '19vh', w: 130, dur: 200, delay: -120, rx: '62vw' },
  { top: '29vh', w: 170, dur: 170, delay: -15, rx: '30vw' },
  { top: '13vh', w: 100, dur: 230, delay: -170, rx: '86vw' },
]

export default function Landscape() {
  return (
    <div className="landscape" aria-hidden="true">
      <div className="hero-sun" />

      {CLOUDS.map((c, i) => (
        <svg
          className="cloud"
          key={i}
          viewBox="0 0 160 60"
          style={{
            top: c.top,
            width: c.w,
            '--dur': `${c.dur}s`,
            '--delay': `${c.delay}s`,
            '--rx': c.rx,
          }}
        >
          <g fill="#fff">
            <ellipse cx="45" cy="40" rx="40" ry="18" />
            <ellipse cx="85" cy="30" rx="38" ry="24" />
            <ellipse cx="118" cy="40" rx="34" ry="17" />
            <rect x="14" y="38" width="130" height="20" rx="10" />
          </g>
        </svg>
      ))}

      <svg className="layer layer-far" viewBox="0 0 1440 500">
        <g transform="translate(0 24)">
        <path
          className="far"
          d="M-1500 500 V300 H0 C80 280 140 250 220 262 C300 274 340 240 420 250 C500 260 560 300 640 270 C720 240 780 160 860 120 L900 92 C930 110 960 150 1000 175 C1040 130 1090 100 1130 80 C1180 110 1230 160 1280 190 C1330 170 1390 150 1440 175 H2940 V500Z"
        />
        <path className="cap" d="M868 122 L900 92 L930 112 L912 108 L898 124 L884 110Z" />
        <path className="cap" d="M1100 108 L1130 80 L1160 104 L1142 100 L1128 116 L1114 102Z" />
        </g>
      </svg>

      <svg className="layer layer-mid" viewBox="0 0 1440 500">
        <path
          className="mid"
          d="M-1500 500 V350 H0 C100 320 200 330 300 345 C420 362 480 330 580 320 C700 308 760 340 860 330 C980 318 1060 270 1160 285 C1260 300 1350 270 1440 290 H2940 V500Z"
        />
        <path className="tree" d={PINES.map(([x, y, s]) => pine(x, y, s)).join(' ')} />
      </svg>

      <svg className="layer layer-near" viewBox="0 0 1440 500">
        <path
          className="near"
          d="M-1500 500 V420 H0 C140 395 260 410 400 430 C560 452 700 420 860 410 C1040 398 1200 425 1320 410 C1380 403 1410 405 1440 410 H2940 V500Z"
        />
        <path
          className="river"
          d="M684 325 C700 340 690 352 676 366 C640 392 700 410 664 428 C620 450 520 452 400 500 L500 500 C560 472 690 466 722 432 C752 404 690 392 712 366 C726 350 722 340 696 325Z"
        />
        <g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="3" opacity="0.65">
          <path className="shimmer" d="M692 334 C705 356 668 380 686 405 C702 428 600 445 560 468 C520 486 480 494 450 500" />
          <path className="shimmer shimmer-b" d="M700 338 C714 358 680 384 698 408 C712 430 620 452 585 474" />
        </g>
      </svg>
    </div>
  )
}
