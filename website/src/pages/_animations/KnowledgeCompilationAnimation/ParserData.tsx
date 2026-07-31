import { useId } from "react";
import type { ComponentType, SVGProps } from "react";
import useReducedMotion from "@site/src/utils/useReducedMotion";
import SvgGlowFilter from "@site/src/utils/visual-effects/SvgGlowFilter";
import ExtractorIcon from "@site/src/assets/svg/how/extractor.svg";
import ParserIcon from "@site/src/assets/svg/how/parser.svg";
import DocumentationIcon from "@site/src/assets/svg/how/documentation.svg";

// --- Geometry (from demo.svg coordinates) ---
const CONTAINER = { x: 322, y: 49, w: 256, h: 256, rx: 4 };
const BG_RECT = { x: 332, y: 59, w: 236, h: 236, rx: 4 };

interface ButtonDef {
  name: string;
  y: number;
  h: number;
  Icon: ComponentType<
    SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  iconX: number;
  iconY: number;
  iconW: number;
  iconH: number;
}

const BUTTONS: ButtonDef[] = [
  {
    name: "Extractor",
    y: 69,
    h: 48,
    Icon: ExtractorIcon,
    iconX: 384,
    iconY: 80,
    iconW: 24,
    iconH: 26,
  },
  {
    name: "Parser",
    y: 153,
    h: 48,
    Icon: ParserIcon,
    iconX: 381,
    iconY: 161,
    iconW: 30,
    iconH: 32,
  },
  {
    name: "Documentation",
    y: 237,
    h: 48,
    Icon: DocumentationIcon,
    iconX: 384,
    iconY: 249,
    iconW: 25,
    iconH: 25,
  },
];

const BTN_X = 370;
const BTN_W = 158;
const BTN_RX = 4;

interface ArrowDef {
  y1: number;
  y2: number;
  arrowY: number;
}
const ARROWS: ArrowDef[] = [
  { y1: 119, y2: 142, arrowY: 142 },
  { y1: 203, y2: 226, arrowY: 226 },
];
const ARROW_X = 451.75;

// --- Animation timing (seconds) ---
const BG_HIGHLIGHT_DURATION = 13;
const BUTTON_FADE_DURATION = 0.5;
const ARROW_DRAW_DURATION = 0.4;
const BTN_DELAYS = [0.3, 1.0, 1.7] as const;
const ARROW_DELAYS = [0.8, 1.5] as const;

export const TotalParserDataDuration = BUTTON_FADE_DURATION + ARROW_DRAW_DURATION;

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
          fillOpacity={0.6}
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
        fill="#161618"
      />

      {/* Buttons - always visible, icons/text dim then highlight sequentially */}
      {BUTTONS.map((btn, i) => {
        const btnBegin = offsetBegin(begin, BTN_DELAYS[i]);
        return (
          <g key={`pd-btn-${i}`}>
            {/* Button background - always visible */}
            <rect x={BTN_X} y={btn.y} width={BTN_W} height={btn.h} rx={BTN_RX} fill="#1B1B1D" />
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
            <g opacity={0.3}>
              {!shouldReduceMotion && (
                <animate
                  attributeName="opacity"
                  values="0.3; 1"
                  dur={`${BUTTON_FADE_DURATION}s`}
                  begin={btnBegin}
                  repeatCount="1"
                  fill="freeze"
                />
              )}
              <btn.Icon
                x={btn.iconX}
                y={btn.iconY}
                width={btn.iconW}
                height={btn.iconH}
                overflow="visible"
                fill={`url(#${gradIcon})`}
              />
              <text
                x={425}
                y={btn.y + 28}
                fill={`url(#${gradText})`}
                fontSize={10}
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
        const triBegin = offsetBegin(begin, ARROW_DELAYS[i] + ARROW_DRAW_DURATION);
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
