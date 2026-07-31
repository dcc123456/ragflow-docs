import { cn } from "@site/src/utils/twUtils";
import useReducedMotion from "@site/src/utils/useReducedMotion";
import SvgStatusDotLabel from "@site/src/utils/visual-effects/SvgStatusDotLabel";

interface TimelineItem {
  /** Dot center Y (relative to panel) */
  dotCy: number;
  /** Content bar Y (relative to panel) */
  barY: number;
}

// Timeline items - extracted from demo.svg (offset by -715, -97)
const TIMELINE_ITEMS: TimelineItem[] = [
  { dotCy: 37, barY: 35 }, // 134-97, 132-97
  { dotCy: 71, barY: 69 }, // 168-97, 166-97
  { dotCy: 113, barY: 111 }, // 210-97, 208-97
];

const DOT_R = 2.75;
const DOT_CX = 35.25; // 750.25 - 715
const LINE_Y1 = 35; // start at first bar position (not panel top)
const LINE_Y2 = 139; // 236 - 97
const BAR_X = 41; // 756 - 715
const BAR_W = 76;
const BAR_H = 5;
const BAR_FILL_OPACITY = 0.2;

// Offset helper: combines a SMIL begin reference with a time offset
function offsetBegin(base: string, offset: number): string {
  if (!base || base === "0s") return `${offset}s`;
  return `${base}+${offset}s`;
}

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
  /** SMIL begin reference - timeline reveal starts after this (default: "0s") */
  beginRef?: string;
}

export default function TimeAnimation({
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
  const lineDraw = duration * 0.4;
  const itemAppear = 0.4;
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
      aria-label="Time panel"
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

        {/* Timeline line - draws from first bar downward */}
        <line
          x1={DOT_CX}
          y1={LINE_Y1}
          x2={DOT_CX}
          y2={LINE_Y2}
          stroke={accentColor}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={reduced ? 0 : 1}
        >
          {!reduced && (
            <animate
              attributeName="stroke-dashoffset"
              values="1; 0"
              dur={`${lineDraw}s`}
              begin={offsetBegin(beginRef, 0)}
              fill="freeze"
            />
          )}
        </line>

        {/* Timeline items - dots + bars appear as the line reaches them */}
        {TIMELINE_ITEMS.map((item, i) => {
          const lineProgress = (item.dotCy - LINE_Y1) / (LINE_Y2 - LINE_Y1);
          const delay = lineProgress * lineDraw;
          return (
            <g key={`timeline-${i}`}>
              {/* Timeline dot (hollow circle) */}
              <circle
                cx={DOT_CX}
                cy={item.dotCy}
                r={reduced ? DOT_R : 0}
                fill={backgroundColor}
                stroke={accentColor}
                strokeWidth={0.5}
              >
                {!reduced && (
                  <animate
                    attributeName="r"
                    values={`0; ${DOT_R}`}
                    dur={`${itemAppear}s`}
                    begin={offsetBegin(beginRef, delay)}
                    fill="freeze"
                  />
                )}
              </circle>
              {/* Content bar next to dot */}
              <rect
                x={BAR_X}
                y={item.barY}
                width={BAR_W}
                height={BAR_H}
                rx={1}
                fill={accentColor}
                fillOpacity={reduced ? BAR_FILL_OPACITY : 0}
              >
                {!reduced && (
                  <animate
                    attributeName="fill-opacity"
                    values={`0; ${BAR_FILL_OPACITY}`}
                    dur={`${itemAppear}s`}
                    begin={offsetBegin(beginRef, delay)}
                    fill="freeze"
                  />
                )}
              </rect>
            </g>
          );
        })}
      </g>
      )}

      {/* "Time" label with status dot - always visible, lights up at beginRef */}
      <SvgStatusDotLabel
        x={13}
        y={15}
        label="Time line"
        activeColor={accentColor}
        beginRef={activated ? beginRef : "indefinite"}
      />
    </svg>
  );
}
