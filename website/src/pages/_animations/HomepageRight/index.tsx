import { useId } from "react";

import { cn } from "@site/src/utils/twUtils";

import NodeConnector, { type NodeConnectorProps } from "./NodeConnector";
import {
  AgenticSearchIcon,
  DocumentParsingIcon,
  HybridSearchIcon,
  KnowledgeCompilationIcon,
} from "./icons";

type ringType = {
  r: number;
  fill?: string;
  dur?: number;
  begin?: number;
  strokeWidth?: number;
  stroke?: string;
};
// The two elliptical orbit paths from homepage-right.svg (lines 20-21).
// Dots travel along these via <animateMotion><mpath/></animateMotion>.
const RING_PATH_1 =
  "M288.444 30.3313C270.029 37.5773 258.352 56.9895 254.431 82.6391C250.511 108.279 254.358 140.08 266.921 171.956C279.483 203.832 298.371 229.716 318.734 245.801C339.106 261.892 360.894 268.136 379.309 260.89C397.746 253.636 411.962 234.079 418.424 208.312C424.883 182.555 423.578 150.645 411.022 118.787C398.466 86.927 377.041 61.1646 354.13 45.1944C331.205 29.214 306.865 23.0831 288.444 30.3313Z";
const RING_PATH_2 =
  "M408.563 76.6693C394.483 62.7686 371.996 59.9479 346.937 66.7378C321.889 73.5252 294.343 89.9031 270.255 114.277C246.167 138.651 230.121 166.382 223.639 191.499C217.154 216.627 220.254 239.066 234.334 252.966C248.414 266.867 270.9 269.688 295.959 262.898C321.008 256.111 348.554 239.734 372.642 215.36C396.73 190.986 412.776 163.254 419.258 138.137C425.742 113.009 422.643 90.57 408.563 76.6693Z";

// Center "RAGFlow" wordmark as a single path (line 19 of the source SVG).
const RAGFLOW_TEXT_PATH =
  "M299.428 190.685L297.508 187.349H296.464V190.685H295.096V182.345H297.976C298.616 182.345 299.156 182.457 299.596 182.681C300.044 182.905 300.376 183.205 300.592 183.581C300.816 183.957 300.928 184.377 300.928 184.841C300.928 185.385 300.768 185.881 300.448 186.329C300.136 186.769 299.652 187.069 298.996 187.229L301.06 190.685H299.428ZM296.464 186.257H297.976C298.488 186.257 298.872 186.129 299.128 185.873C299.392 185.617 299.524 185.273 299.524 184.841C299.524 184.409 299.396 184.073 299.14 183.833C298.884 183.585 298.496 183.461 297.976 183.461H296.464V186.257ZM307.706 188.981H304.214L303.614 190.685H302.186L305.174 182.333H306.758L309.746 190.685H308.306L307.706 188.981ZM307.322 187.865L305.966 183.989L304.598 187.865H307.322ZM317.082 184.745C316.866 184.329 316.566 184.017 316.182 183.809C315.798 183.593 315.354 183.485 314.85 183.485C314.298 183.485 313.806 183.609 313.374 183.857C312.942 184.105 312.602 184.457 312.354 184.913C312.114 185.369 311.994 185.897 311.994 186.497C311.994 187.097 312.114 187.629 312.354 188.093C312.602 188.549 312.942 188.901 313.374 189.149C313.806 189.397 314.298 189.521 314.85 189.521C315.594 189.521 316.198 189.313 316.662 188.897C317.126 188.481 317.41 187.917 317.514 187.205H314.382V186.113H318.978V187.181C318.89 187.829 318.658 188.425 318.282 188.969C317.914 189.513 317.43 189.949 316.83 190.277C316.238 190.597 315.578 190.757 314.85 190.757C314.066 190.757 313.35 190.577 312.702 190.217C312.054 189.849 311.538 189.341 311.154 188.693C310.778 188.045 310.59 187.313 310.59 186.497C310.59 185.681 310.778 184.949 311.154 184.301C311.538 183.653 312.054 183.149 312.702 182.789C313.358 182.421 314.074 182.237 314.85 182.237C315.738 182.237 316.526 182.457 317.214 182.897C317.91 183.329 318.414 183.945 318.726 184.745H317.082ZM325.235 182.345V183.461H321.695V185.921H324.455V187.037H321.695V190.685H320.327V182.345H325.235ZM327.871 181.805V190.685H326.503V181.805H327.871ZM332.535 190.793C331.911 190.793 331.347 190.653 330.843 190.373C330.339 190.085 329.943 189.685 329.655 189.173C329.367 188.653 329.223 188.053 329.223 187.373C329.223 186.701 329.371 186.105 329.667 185.585C329.963 185.065 330.367 184.665 330.879 184.385C331.391 184.105 331.963 183.965 332.595 183.965C333.227 183.965 333.799 184.105 334.311 184.385C334.823 184.665 335.227 185.065 335.523 185.585C335.819 186.105 335.967 186.701 335.967 187.373C335.967 188.045 335.815 188.641 335.511 189.161C335.207 189.681 334.791 190.085 334.263 190.373C333.743 190.653 333.167 190.793 332.535 190.793ZM332.535 189.605C332.887 189.605 333.215 189.521 333.519 189.353C333.831 189.185 334.083 188.933 334.275 188.597C334.467 188.261 334.563 187.853 334.563 187.373C334.563 186.893 334.471 186.489 334.287 186.161C334.103 185.825 333.859 185.573 333.555 185.405C333.251 185.237 332.923 185.153 332.571 185.153C332.219 185.153 331.891 185.237 331.587 185.405C331.291 185.573 331.055 185.825 330.879 186.161C330.703 186.489 330.615 186.893 330.615 187.373C330.615 188.085 330.795 188.637 331.155 189.029C331.523 189.413 331.983 189.605 332.535 189.605ZM346.199 184.073L344.147 190.685H342.707L341.375 185.801L340.043 190.685H338.603L336.539 184.073H337.931L339.311 189.389L340.715 184.073H342.143L343.487 189.365L344.855 184.073H346.199Z";

// Center RAGFlow logo (mask + 9 dark paths, lines 5-18). Built as a markup
// string so the mask id can be namespaced per instance via `uid`.
const centerLogoMarkup = (maskId: string) => `
  <mask id="${maskId}" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="298" y="124" width="39" height="39">
    <rect x="298.546" y="124.458" width="38.4213" height="38.4214" fill="white"/>
  </mask>
  <g mask="url(#${maskId})">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M305.88 147.312C306.561 148.009 306.561 149.137 305.88 149.834L305.845 149.869C305.164 150.566 304.061 150.566 303.38 149.869C302.699 149.173 302.699 148.044 303.38 147.348L303.415 147.312C304.095 146.616 305.199 146.616 305.88 147.312Z" fill="#161618"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M314.2 147.8C314.887 148.504 314.885 149.643 314.196 150.344L309.315 155.311C308.626 156.012 307.51 156.01 306.823 155.306C306.137 154.602 306.139 153.463 306.828 152.761L311.709 147.795C312.398 147.094 313.514 147.096 314.2 147.8Z" fill="#161618"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M320.851 156.319C321.387 155.49 322.472 155.266 323.276 155.819L323.38 155.891C324.184 156.444 324.401 157.564 323.865 158.393C323.33 159.223 322.244 159.447 321.441 158.894L321.336 158.822C320.533 158.269 320.316 157.149 320.851 156.319Z" fill="#161618"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M332.447 147.153C333.135 147.851 333.135 148.982 332.447 149.679L330.05 152.109C329.362 152.807 328.246 152.807 327.557 152.109C326.869 151.411 326.869 150.28 327.557 149.583L329.954 147.153C330.643 146.455 331.759 146.455 332.447 147.153Z" fill="#161618"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M332.45 138.11C333.138 138.811 333.138 139.946 332.45 140.647L314.759 158.672C314.071 159.372 312.957 159.372 312.269 158.672C311.582 157.971 311.582 156.836 312.269 156.135L329.961 138.11C330.648 137.41 331.763 137.41 332.45 138.11Z" fill="#161618"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M329.168 132.587C329.855 133.286 329.855 134.419 329.168 135.119L318.999 145.466C318.312 146.165 317.198 146.165 316.511 145.466C315.824 144.767 315.824 143.633 316.511 142.934L326.68 132.587C327.367 131.888 328.481 131.888 329.168 132.587Z" fill="#161618"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M323.802 129.143C324.492 129.842 324.493 130.974 323.804 131.674L310.686 144.985C309.997 145.684 308.879 145.685 308.189 144.986C307.499 144.288 307.498 143.155 308.187 142.456L321.305 129.145C321.994 128.446 323.112 128.445 323.802 129.143Z" fill="#161618"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M310.76 133.391C311.447 134.094 311.445 135.231 310.756 135.932L305.632 141.143C304.944 141.844 303.829 141.842 303.142 141.139C302.456 140.436 302.458 139.298 303.147 138.597L308.27 133.386C308.959 132.686 310.074 132.688 310.76 133.391Z" fill="#161618"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M313.915 128.141C314.887 128.141 315.676 128.943 315.676 129.932V130.111C315.676 131.1 314.887 131.902 313.915 131.902C312.943 131.902 312.154 131.1 312.154 130.111V129.932C312.154 128.943 312.943 128.141 313.915 128.141Z" fill="#161618"/>
  </g>
`;

// The four corner nodes. Geometry is taken straight from homepage-right.svg
// (circle/dot centers, polyline path data). Labels + icons are configurable
// defaults; pass your own `nodes` to override.
const DEFAULT_NODES: NodeConnectorProps[] = [
  {
    // Top-left -> polyline exits left.
    circle: { cx: 210.654, cy: 41.6411, r: 36.02 },
    dot: { cx: 186.641, cy: 29.134, r: 3.00122 },
    path: "M186.141 29.635L171.633 8.12305H39.5592",
    label: "Document Parsing",
    labelX: 39.5592,
    labelY: 13.12305,
    labelAnchor: "start",
    icon: <DocumentParsingIcon size={36} color="#00BEB4" />,
    begin: 0.6,
  },
  {
    // Top-right -> polyline exits right.
    circle: { cx: 391.809, cy: 42.1323, r: 36.02 },
    dot: { cx: 411.834, cy: 27.137, r: 3.00122 },
    path: "M412.835 27.1373L427.347 5.63086H533.433",
    label: "Agentic Search",
    labelX: 533.433,
    labelY: 10.63086,
    labelAnchor: "end",
    icon: <AgenticSearchIcon size={36} color="#00BEB4" />,
    begin: 0.85,
  },
  {
    // Bottom-left -> polyline exits left.
    circle: { cx: 205.614, cy: 256.706, r: 36.02 },
    dot: { cx: 181.6, cy: 244.198, r: 3.00122 },
    path: "M181.101 244.699L166.593 223.188H0",
    label: "Knowledge compilation",
    labelX: 0,
    labelY: 227.188,
    labelAnchor: "start",
    icon: <KnowledgeCompilationIcon size={36} color="#00BEB4" />,
    begin: 1.1,
  },
  {
    // Bottom-right -> polyline exits right.
    circle: { cx: 450.857, cy: 230.189, r: 36.02 },
    dot: { cx: 470.882, cy: 215.194, r: 3.00122 },
    path: "M471.883 215.193L486.395 193.687L616 193.687",
    label: "Hybrid search",
    labelX: 616,
    labelY: 197.687,
    labelAnchor: "end",
    icon: <HybridSearchIcon size={36} color="#00BEB4" />,
    begin: 1.35,
  },
];

// Traveling dots on each ring. Negative `begin` offsets start each dot partway
// through the loop so they're spread around the ring instead of clumped.
const RING1_TRAVELERS: ringType[] = [
  { r: 2.4, fill: "#ADFFFB", dur: 50, begin: 0 },
  { r: 3, fill: "#00BEB4", dur: 50, begin: -35 },
  { r: 2.0, fill: "#00BEB4", dur: 50, begin: -10 },
  { r: 1.8, fill: "#5AF6EE", dur: 50, begin: -20 },
];
const RING2_TRAVELERS: ringType[] = [
  { r: 2.4, fill: "#ADFFFB", dur: 40, begin: 0 },
  { r: 5.4, stroke: "#ADFFFB", dur: 40, begin: 0, strokeWidth: 0.5 },
  { r: 3, fill: "#00BEB4", dur: 40, begin: 1 },
  { r: 2.4, fill: "#ADFFFB", dur: 40, begin: -10 },
  { r: 5.4, stroke: "#ADFFFB", dur: 40, begin: -10, strokeWidth: 0.5 },
  { r: 2.0, fill: "#00BEB4", dur: 40, begin: -18 },
  { r: 1.8, fill: "#5AF6EE", dur: 40, begin: -36 },
];

// Background fade-in for rings + decorative dots (entrance).
const T_BG_FADE = 0.6;
// Travelers fade in after the rings appear.
const T_TRAVELER_FADE_START = 0.4;

export interface HomepageRightAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the four corner nodes (geometry + icon + label + timing). */
  nodes?: NodeConnectorProps[];
}

/**
 * HomepageRightAnimation
 *
 * Converts homepage-right.svg into an animated React component.
 *
 * Composition (back-to-front, matching the source SVG):
 *   - big orbit ring + soft elliptical blob (background)
 *   - 2 elliptical ring paths with traveling dots (animateMotion)
 *   - decorative static dots
 *   - center RAGFlow circle + logo + wordmark
 *   - 4 NodeConnector instances (circle -> icon -> dot -> polyline -> label),
 *     staggered around the center
 *
 * Entrance timeline:
 *   0.0s - 0.6s   background (rings, blob, dots, center) fades in
 *   0.6s+         4 nodes appear in sequence (stagger 0.25s), each running
 *                 circle -> icon -> dot -> polyline -> label (~1.9s)
 *   0.4s+         travelers fade in and loop indefinitely along the rings
 */
export default function HomepageRightAnimation({
  className,
  nodes = DEFAULT_NODES,
  ...restProps
}: HomepageRightAnimationProps) {
  const uid = useId().replace(/[:]/g, "");

  // Shared gradient / filter / path ids (namespaced per instance).
  const gradCenter = `${uid}-center`; // paint0: center circle fill
  const gradRing1 = `${uid}-ring1`; // paint1: ring 1 stroke
  const gradRing2 = `${uid}-ring2`; // paint2: ring 2 stroke
  const gradBlob = `${uid}-blob`; // paint3: blob fill
  const gradOrbit = `${uid}-orbit`; // paint4: orbit fill
  const filterCenter = `${uid}-centerShadow`; // filter0_d: center drop shadow
  const maskCenter = `${uid}-centerMask`; // center logo mask
  const ringPath1Id = `${uid}-ringPath1`;
  const ringPath2Id = `${uid}-ringPath2`;

  return (
    <div className={cn("ragflow-animation-root", className)} {...restProps}>
      <svg
        className="block size-full absolute inset-0 pointer-events-none"
        viewBox="0 0 616 304"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          {/* Center circle fill (paint0). */}
          <linearGradient
            id={gradCenter}
            x1="317.758"
            y1="111.65"
            x2="317.758"
            y2="175.686"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00BEB4" />
            <stop offset={1} stopColor="#2BF795" />
          </linearGradient>
          {/* Ring 1 stroke (paint1). */}
          <linearGradient
            id={gradRing1}
            x1="298.684"
            y1="223.076"
            x2="392.856"
            y2="112.623"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00BEB4" stopOpacity={0.83} />
            <stop offset={1} stopColor="#42FFA4" stopOpacity={0.04} />
          </linearGradient>
          {/* Ring 2 stroke (paint2). */}
          <linearGradient
            id={gradRing2}
            x1="344.78"
            y1="237.2"
            x2="257.256"
            y2="145.128"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00BEB4" stopOpacity={0.83} />
            <stop offset={1} stopColor="#42FFA4" stopOpacity={0.04} />
          </linearGradient>
          {/* Blob fill (paint3). */}
          <linearGradient
            id={gradBlob}
            x1="367.636"
            y1="248.7"
            x2="245.7"
            y2="94.6587"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#01BCB5" stopOpacity={0.15} />
            <stop offset={0.745776} stopColor="#00C087" stopOpacity={0.0381336} />
            <stop offset={1} stopColor="#00C177" stopOpacity={0} />
          </linearGradient>
          {/* Orbit fill (paint4). */}
          <linearGradient
            id={gradOrbit}
            x1="284.111"
            y1="219.102"
            x2="345.923"
            y2="98.4799"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#01BCB5" />
            <stop offset={1} stopColor="#00C177" stopOpacity={0} />
          </linearGradient>
          {/* Center circle drop shadow (filter0_d). */}
          <filter
            id={filterCenter}
            x="269.74"
            y="102.05"
            width="96.0352"
            height="96.0361"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={6.4} />
            <feGaussianBlur stdDeviation={8} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.410081 0 0 0 0 1 0 0 0 0 0.968952 0 0 0 0.25 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>

          {/* Ring paths: defined once with ids so <animateMotion><mpath/> can
              reference them. They are also stroked below (same geometry). */}
          <path id={ringPath1Id} d={RING_PATH_1} />
          <path id={ringPath2Id} d={RING_PATH_2} />
        </defs>

        {/* --- Background layer (fades in 0 -> 0.6s) --- */}
        <g opacity={0}>
          {/* Big orbit ring (line 36). */}
          <path
            d="M182.887 77.7513C207.028 26.0621 294.159 9.20147 377.501 40.0921C460.842 70.9828 508.834 137.927 484.693 189.617C460.552 241.306 373.421 258.166 290.08 227.276C206.738 196.385 158.747 129.441 182.887 77.7513ZM371.857 52.1722C299.272 25.2682 222.646 41.5338 200.711 88.5023C178.775 135.471 219.835 195.356 292.42 222.26C365.005 249.164 441.63 232.898 463.566 185.93C485.502 138.962 444.442 79.0762 371.857 52.1722Z"
            fill={`url(#${gradOrbit})`}
          />
          {/* Soft elliptical blob (line 23). */}
          <path
            d="M339.817 228.491C408.098 210.205 455.365 165.218 445.39 128.011C435.415 90.8036 361.7 64.2861 293.42 82.5726C225.139 100.859 188.148 157.025 198.123 194.232C208.097 231.439 271.536 246.778 339.817 228.491Z"
            fill={`url(#${gradBlob})`}
          />
          <animate
            attributeName="opacity"
            values="0;1"
            dur={`${T_BG_FADE}s`}
            begin="0s"
            fill="freeze"
          />
        </g>

        {/* --- Ring paths (fades in with background) --- */}
        <g opacity={0}>
          <path
            d={RING_PATH_1}
            stroke={`url(#${gradRing1})`}
            strokeOpacity={0.9}
            strokeWidth={0.695989}
          />
          <path
            d={RING_PATH_2}
            stroke={`url(#${gradRing2})`}
            strokeOpacity={0.9}
            strokeWidth={0.695989}
          />
          <animate
            attributeName="opacity"
            values="0;1"
            dur={`${T_BG_FADE}s`}
            begin="0s"
            fill="freeze"
          />
        </g>

        {/* --- Center RAGFlow circle + logo + wordmark --- */}
        <g opacity={0}>
          {/* Teal circle with drop shadow. */}
          <ellipse
            cx={317.758}
            cy={143.668}
            rx={32.0177}
            ry={32.0179}
            fill={`url(#${gradCenter})`}
            filter={`url(#${filterCenter})`}
          />
          {/* RAGFlow logo (mask + 9 dark paths). */}
          <g dangerouslySetInnerHTML={{ __html: centerLogoMarkup(maskCenter) }} />
          {/* "RAGFlow" wordmark below the circle. */}
          <path d={RAGFLOW_TEXT_PATH} fill="#F6F6F7" />
          <animate
            attributeName="opacity"
            values="0;1"
            dur={`${T_BG_FADE}s`}
            begin="0s"
            fill="freeze"
          />
        </g>

        {/* --- Four corner nodes (staggered entrance) --- */}
        {nodes.map((node, i) => (
          <NodeConnector key={`node-${i}`} {...node} />
        ))}

        {/* --- Traveling dots on the rings (loop indefinitely) ---
            Each dot uses <animateMotion> with <mpath> to follow a ring path.
            Negative `begin` offsets spread them around the loop. */}
        <g>
          {RING1_TRAVELERS.map((t, i) => (
            <circle
              key={`r1-t${i}`}
              r={t.r}
              // fill={t.fill}
              fill={t.fill ?? "none"}
              stroke={t.stroke ?? "none"}
              strokeWidth={t.strokeWidth ?? 0}
              opacity={0}
            >
              <animateMotion dur={`${t.dur}s`} begin={`${t.begin}s`} repeatCount="indefinite">
                <mpath href={`#${ringPath1Id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.9"
                dur="0.6s"
                begin={`${T_TRAVELER_FADE_START}s`}
                fill="freeze"
              />
            </circle>
          ))}
          {RING2_TRAVELERS.map((t, i) => (
            <circle
              key={`r2-t${i}`}
              r={t.r}
              fill={t.fill ?? "none"}
              stroke={t.stroke ?? "none"}
              strokeWidth={t.strokeWidth ?? 0}
              opacity={0}
            >
              <animateMotion dur={`${t.dur}s`} begin={`${t.begin}s`} repeatCount="indefinite">
                <mpath href={`#${ringPath2Id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.9"
                dur="0.6s"
                begin={`${T_TRAVELER_FADE_START}s`}
                fill="freeze"
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
}
