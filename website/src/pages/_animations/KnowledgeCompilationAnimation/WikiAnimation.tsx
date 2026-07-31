import { cn } from "@site/src/utils/twUtils";
import useReducedMotion from "@site/src/utils/useReducedMotion";
import SvgStatusDotLabel from "@site/src/utils/visual-effects/SvgStatusDotLabel";

interface ContentBar {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "highlight" | "header" | "line";
}

// Content placeholder bars - extracted from demo.svg (offset by -907, -59)
const CONTENT_BARS: ContentBar[] = [
  // Group 1: image preview + title + text lines
  { x: 10, y: 32, w: 130, h: 18, type: "highlight" },
  { x: 10, y: 56, w: 26, h: 4, type: "header" },
  { x: 10, y: 62, w: 130, h: 2, type: "line" },
  { x: 10, y: 66, w: 130, h: 2, type: "line" },
  { x: 10, y: 70, w: 81, h: 2, type: "line" },
  // Group 2: header + text lines
  { x: 10, y: 80, w: 64, h: 4, type: "header" },
  { x: 10, y: 86, w: 130, h: 2, type: "line" },
  { x: 10, y: 90, w: 130, h: 2, type: "line" },
  { x: 10, y: 94, w: 81, h: 2, type: "line" },
  { x: 10, y: 98, w: 130, h: 2, type: "line" },
  { x: 10, y: 102, w: 81, h: 2, type: "line" },
  // Group 3: image preview + header + text lines
  { x: 10, y: 110, w: 130, h: 20, type: "highlight" },
  { x: 10, y: 136, w: 26, h: 4, type: "header" },
  { x: 10, y: 142, w: 130, h: 2, type: "line" },
  { x: 10, y: 146, w: 81, h: 2, type: "line" },
];

// Reveal order: top to bottom
const SORTED_BAR_ORDER = [...CONTENT_BARS.keys()].sort(
  (a, b) => CONTENT_BARS[a].y - CONTENT_BARS[b].y,
);

// Offset helper: combines a SMIL begin reference with a time offset
function offsetBegin(base: string, offset: number): string {
  if (!base || base === "0s") return `${offset}s`;
  return `${base}+${offset}s`;
}

const BAR_FILL_OPACITY = 0.2;

interface Props {
  className?: string;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  accentColor?: string;
  backgroundColor?: string;
  showBorder?: boolean;
  duration?: number;
  /** SMIL begin reference - content reveal starts after this (default: "0s") */
  beginRef?: string;
}

export default function WikiAnimation({
  className,
  x,
  y,
  width,
  height,
  accentColor = "#00BEB4",
  backgroundColor = "#1A2325",
  showBorder = false,
  duration = 3,
  beginRef = "0s",
}: Props) {
  const reduced = useReducedMotion();
  const stagger = duration * 0.6;
  const barAppear = 0.3;
  const panelFadeIn = 0.3;
  const activated = reduced || beginRef !== "0s";

  return (
    <svg
      viewBox="0 0 150 154"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(x === undefined && "w-full h-full", className)}
      x={x}
      y={y}
      width={width}
      height={height}
      role="img"
      aria-label="Wiki panel"
    >
      {backgroundColor !== "transparent" && (
        <rect width="150" height="154" rx="8" fill={backgroundColor} />
      )}

      {showBorder && (
        <rect
          x="0.25"
          y="0.25"
          width="149.5"
          height="153.5"
          rx="7.75"
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.1}
          strokeWidth={0.5}
        />
      )}

      {/* Panel content - only renders when main flow activates */}
      {activated && (
      <g opacity={reduced ? 1 : 0}>
        {!reduced && (
          <animate
            attributeName="opacity"
            values="0; 1"
            dur={`${panelFadeIn}s`}
            begin={beginRef}
            fill="freeze"
          />
        )}

      {/* Content bars - progressive fade-in top to bottom after beginRef */}
      {CONTENT_BARS.map((bar, i) => {
        const sortedIdx = SORTED_BAR_ORDER.indexOf(i);
        const delay = (sortedIdx / CONTENT_BARS.length) * stagger;
        const rx = bar.type === "highlight" ? 2 : 1;
        return (
          <rect
            key={`bar-${i}`}
            x={bar.x}
            y={bar.y}
            width={bar.w}
            height={bar.h}
            rx={rx}
            fill={accentColor}
            fillOpacity={reduced ? BAR_FILL_OPACITY : 0}
          >
            {!reduced && (
              <animate
                attributeName="fill-opacity"
                values={`0; ${BAR_FILL_OPACITY}`}
                dur={`${barAppear}s`}
                begin={offsetBegin(beginRef, delay)}
                fill="freeze"
              />
            )}
          </rect>
        );
      })}
      </g>
      )}

      {/* "Wiki" label with status dot - always visible, lights up at beginRef */}
      <SvgStatusDotLabel
        x={13}
        y={15}
        label="Wiki"
        activeColor={accentColor}
        beginRef={activated ? beginRef : "indefinite"}
      />
    </svg>
  );
}
