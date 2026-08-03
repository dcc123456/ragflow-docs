import { useId } from "react";
import type { FC, SVGProps } from "react";
import useReducedMotion from "@site/src/utils/useReducedMotion";
import SvgGlowFilter from "@site/src/utils/visual-effects/SvgGlowFilter";
import ExtractorIcon from "@site/src/assets/svg/how/extractor.svg?react";
import ParserIcon from "@site/src/assets/svg/how/parser.svg?react";
import DocumentationIcon from "@site/src/assets/svg/how/documentation.svg?react";

// --- Geometry (from demo.svg coordinates) ---
const CONTAINER = { x: -10, y: -10, w: 240, h: 256, rx: 4 };
const BG_RECT = { x: 5, y: -15, w: 206, h: 256, rx: 8, ry: 8 };

interface ButtonDef {
  name: string;
  y: number;
  h: number;
  Icon: FC<SVGProps<SVGSVGElement>>;
  iconX: number;
  iconY: number;
  iconW: number;
  iconH: number;
}

const BTN_Y = 9;
const BTN_H = 42;
const arrow_H = 36;
const gap = 10;
const BUTTONS: ButtonDef[] = [
  {
    name: "Extractor",
    y: BTN_Y,
    h: BTN_H,
    Icon: ExtractorIcon,
    iconX: 40,
    iconY: BTN_Y + BTN_H / 2 - 13.5,
    iconW: 24,
    iconH: 26,
  },
  {
    name: "Reconciliation",
    y: BTN_Y + BTN_H + arrow_H + gap / 2,
    h: BTN_H,
    Icon: ParserIcon,
    iconX: 40,
    iconY: BTN_Y + BTN_H + arrow_H + gap,
    iconW: 28,
    iconH: 28,
  },
  {
    name: "Synthesis",
    y: BTN_Y + BTN_H * 2 + arrow_H * 2 + gap,
    h: BTN_H,
    Icon: DocumentationIcon,
    iconX: 40,
    iconY: BTN_Y + 2 * BTN_H + 2 * arrow_H + 2 * gap,
    iconW: 25,
    iconH: 25,
  },
];

const BTN_X = 30;
const BTN_W = 158;
const BTN_RX = 4;

interface ArrowDef {
  y1: number;
  y2: number;
  arrowY: number;
}
const ARROWS: ArrowDef[] = [
  {
    y1: BTN_Y + BTN_H + gap / 2,
    y2: BTN_Y + arrow_H * 2,
    arrowY: BTN_Y + arrow_H * 2,
  },
  {
    y1: BTN_Y + BTN_H * 2 + arrow_H + gap / 2,
    y2: BTN_Y + BTN_H * 2 + arrow_H * 2,
    arrowY: BTN_Y + BTN_H * 2 + arrow_H * 2,
  },
];
const ARROW_X = BTN_X + BTN_W / 2;

// --- Animation timing (seconds) ---
const BG_HIGHLIGHT_DURATION = 13;
const BUTTON_FADE_DURATION = 0.5;
const ARROW_DRAW_DURATION = 0.4;
const BTN_DELAYS = [0.3, 1.0, 1.7] as const;
const ARROW_DELAYS = [0.8, 1.5] as const;

export const TotalParserDataDuration =
  BUTTON_FADE_DURATION + ARROW_DRAW_DURATION;

function offsetBegin(base: string, offset: number): string {
  if (!base || base === "0s") return `${offset}s`;
  return `${base}+${offset}s`;
}

interface ParserDataProps {
  /** SMIL begin reference anchoring the pipeline animation. */
  begin?: string;
  className?: string;
}

function ParserData({ begin = "0s", className }: ParserDataProps) {
  const uid = useId();
  const shouldReduceMotion = useReducedMotion();

  const filterGlow = `${uid}PdGlow`;
  const filterBgGlow = `${uid}PdBgGlow`;
  const gradContainer = `${uid}PdContainer`;
  const gradBorder = `${uid}PdBorder`;
  const gradIcon = `${uid}PdIcon`;
  const notActiveGradIcon = `${uid}PdNotActiveIcon`;
  const gradText = `${uid}PdText`;
  const gradArrow = `${uid}PdArrow`;

  return (
    <g className={className}>
      <defs>
        <filter
          id="filter9_f_4279_25670"
          x="302"
          y="29"
          width="296"
          height="296"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        ></filter>
        <linearGradient
          id={gradContainer}
          x1="361"
          y1="78"
          x2="533"
          y2="288"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#42B6FF" />
          <stop offset={1} stopColor="#2BE8AA" />
        </linearGradient>

        <linearGradient id={gradBorder} x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#B9F9F5" />
          <stop offset={1} stopColor="#629794" />
        </linearGradient>

        <linearGradient id={notActiveGradIcon} x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="rgba(178, 181, 183, 1)" />
          <stop offset={0.2} stopColor="rgba(178, 181, 183, 1)" />
          <stop offset="1" stopColor="rgba(178, 181, 183, 1)" />
        </linearGradient>

        <linearGradient id={gradIcon} x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#01BEB4" />
          <stop offset={1} stopColor="#42FFA4" />
        </linearGradient>

        <linearGradient id={gradText} x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#00BEB4" />
          <stop offset={1} stopColor="#42FFA4" />
        </linearGradient>

        <linearGradient id={gradArrow} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0.16" stopColor="#00BEB4" />
          <stop offset={1} stopColor="#00BEB4" stopOpacity="0" />
        </linearGradient>

        <SvgGlowFilter id={filterGlow} stdDeviation={4} extrude={0} />
        <filter
          id={filterBgGlow}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>

      {/* Background glow container - always visible, pulses at start */}
      <g filter={`url(#${filterBgGlow})`}>
        <rect
          x={CONTAINER.x}
          y={CONTAINER.y}
          width={CONTAINER.w}
          height={CONTAINER.h}
          rx={CONTAINER.rx}
          fill={`url(#${gradContainer})`}
          fillOpacity={0}
          opacity={0.3}
        >
          {!shouldReduceMotion && (
            <animate
              id={`${uid}PdBg`}
              attributeName="opacity"
              values="0.3; 1; 0.3"
              keyTimes="0; 0.4; 1"
              dur={`${BG_HIGHLIGHT_DURATION}s`}
              begin={offsetBegin(begin, 0)}
              repeatCount="1"
              fill="freeze"
            />
          )}
        </rect>
      </g>

      {/* Dark background rect - always visible */}
      <rect
        x={BG_RECT.x}
        y={BG_RECT.y}
        width={BG_RECT.w}
        height={BG_RECT.h}
        rx={BG_RECT.rx}
        ry={BG_RECT.ry}
        fill="#161618"
        fillOpacity={0}
        stroke="#00BEB4"
        strokeOpacity={0.6}
        strokeDasharray="6 6"
      />

      {/* Buttons - always visible, icons/text dim then highlight sequentially */}
      {BUTTONS.map((btn, i) => {
        const btnBegin = offsetBegin(begin, BTN_DELAYS[i]);
        return (
          <g key={`pd-btn-${i}`}>
            {/* Button background - always visible */}
            <rect
              x={BTN_X}
              y={btn.y}
              width={BTN_W}
              height={btn.h}
              rx={BTN_RX}
              fill="#1B1B1D"
            />
            <rect
              x={BTN_X}
              y={btn.y}
              width={BTN_W}
              height={btn.h}
              rx={BTN_RX}
              fill="none"
              stroke={`url(#${gradBorder})`}
              strokeOpacity={0.4}
              strokeWidth={0.3}
            />
            {/* Icon + text: dim initially, brighten when highlighted */}
            <g opacity={1}>
              <btn.Icon
                x={btn.iconX}
                y={btn.iconY}
                width={btn.iconW}
                height={btn.iconH}
                overflow="visible"
                fill={`url(#${notActiveGradIcon})`}
              />
              <text
                x={BTN_X + BTN_W / 2 - 24}
                y={btn.y + 25}
                fill={`url(#${notActiveGradIcon})`}
                fontSize={12}
                fontWeight={600}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {btn.name}
              </text>
            </g>

            {/* Highlight glow border - activates sequentially, stays on */}
            {!shouldReduceMotion && (
              <g filter={`url(#${filterGlow})`} opacity={0}>
                <animate
                  attributeName="opacity"
                  values="0; 1"
                  dur={`${BUTTON_FADE_DURATION}s`}
                  begin={btnBegin}
                  repeatCount="1"
                  fill="freeze"
                />
                <rect
                  x={BTN_X}
                  y={btn.y}
                  width={BTN_W}
                  height={btn.h}
                  rx={BTN_RX}
                  fill="none"
                  stroke="#00BEB4"
                  strokeWidth={1}
                />
              </g>
            )}
          </g>
        );
      })}

      {/* Arrows - vertical line + triangle, dim then brighten sequentially */}
      {ARROWS.map((arrow, i) => {
        const arrowBegin = offsetBegin(begin, ARROW_DELAYS[i]);
        const triBegin = offsetBegin(
          begin,
          ARROW_DELAYS[i] + ARROW_DRAW_DURATION,
        );
        const lineLen = arrow.y2 - arrow.y1;
        const triD = `M${ARROW_X + 1.042} ${arrow.arrowY + 7.971}C${ARROW_X + 0.642} ${arrow.arrowY + 8.491} ${ARROW_X - 0.192} ${arrow.arrowY + 8.491} ${ARROW_X - 0.592} ${arrow.arrowY + 7.971}L${ARROW_X - 5.489} ${arrow.arrowY + 1.61}C${ARROW_X - 5.995} ${arrow.arrowY + 0.952} ${ARROW_X - 5.526} ${arrow.arrowY} ${ARROW_X - 4.696} ${arrow.arrowY}L${ARROW_X + 4.896} ${arrow.arrowY}C${ARROW_X + 5.726} ${arrow.arrowY} ${ARROW_X + 6.195} ${arrow.arrowY + 0.952} ${ARROW_X + 5.689} ${arrow.arrowY + 1.61}L${ARROW_X + 1.042} ${arrow.arrowY + 7.971}Z`;
        return (
          <g key={`pd-arrow-${i}`} opacity={0.3}>
            {/* Dim -> brighten when activated */}
            {!shouldReduceMotion && (
              <animate
                attributeName="opacity"
                values="0.3; 1"
                dur="0.4s"
                begin={arrowBegin}
                repeatCount="1"
                fill="freeze"
              />
            )}
            {/* Vertical line (solid stroke matching original SVG) */}
            <line
              x1={ARROW_X}
              y1={arrow.y1}
              x2={ARROW_X}
              y2={arrow.y2}
              stroke="#00BEB4"
              strokeWidth={1.5}
              strokeDasharray={lineLen}
              strokeDashoffset={shouldReduceMotion ? 0 : lineLen}
            >
              {!shouldReduceMotion && (
                <animate
                  attributeName="stroke-dashoffset"
                  from={lineLen}
                  to={0}
                  dur={`${ARROW_DRAW_DURATION}s`}
                  begin={arrowBegin}
                  repeatCount="1"
                  fill="freeze"
                />
              )}
            </line>
            {/* Down arrow triangle - appears after line draw completes */}
            <path d={triD} fill="#00BEB4" opacity={shouldReduceMotion ? 1 : 0}>
              {!shouldReduceMotion && (
                <animate
                  attributeName="opacity"
                  values="0;1"
                  dur="0.2s"
                  begin={triBegin}
                  repeatCount="1"
                  fill="freeze"
                />
              )}
            </path>
          </g>
        );
      })}
    </g>
  );
}

export default ParserData;
