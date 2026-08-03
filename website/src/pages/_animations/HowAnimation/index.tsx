import { cn } from "@site/src/utils/twUtils";
import useReducedMotion from "@site/src/utils/useReducedMotion";
import SvgGlowFilter from "@site/src/utils/visual-effects/SvgGlowFilter";
import { Fragment, useEffect, useId, useState } from "react";
import { DASH_ARRAY, DASH_OFFSET_DURATION } from "../constants";
import SourceDocument from "./SourceDocument";
import PipelinePanel, { PANEL_DEFS, PANEL_H } from "./PipelinePanel";
import OutputTarget from "./OutputTarget";
import CogAnimation from "@site/src/components/CogAnimation";
import IconBox from "@site/src/components/IconBox";
import ParserData from "./ParserData";

// ─── Layout (viewBox 0 0 998 400) ───────────────────────────────────────────
//   Parser (x=250) ──> Template (x=410) ──> 5 panels (x=569) ──> Indexer (x=791) ──> AI agents (x=934)
const TEMPLATE_X = 410;
const INDEXER_X = 791;

// ─── Timing (seconds) ───────────────────────────────────────────────────────
// Full left-to-right cycle:
//   Parse icon border -> Cog rotation -> Parse-to-Parser dot ->
//   ParserData animation -> Parser dot -> Template highlight ->
//   Template dots -> Panel highlights -> Panel dots ->
//   Indexer highlight -> Indexer dot -> Output highlight -> Flow end fade-out.
const PARSER_DOT_DELAY = 3;
const PARSER_DOT_DURATION = 1.5; // straight Parser -> Template
const TEMPLATE_DOT_DELAY = 2;
const TEMPLATE_DOT_DURATION = 2.5; // Template -> panels (curved)
const PANEL_DOT_DELAY = 1;
const PANEL_DOT_DURATION = 2.5; // panels -> Indexer
const INDEXER_DOT_DELAY = 1;
const INDEXER_DOT_DURATION = 2.0; // Indexer -> output

// ─── Stage 0: Parse icon -> ParserData (new) ──────────────────────────────────
const PARSE_ICON_BORDER_BEGIN = "1s";
const PARSE_ICON_BORDER_DURATION = 0.5; // fade-in duration
const PARSE_TO_PARSER_DOT_DELAY = 0.5; // delay after cog starts
const PARSE_TO_PARSER_DOT_DURATION = 1.0; // dot travel duration
const OUTPUT_HOLD_DURATION = 5; // AI agents highlight holds before fade-out

// Panel highlight stagger: outer panels (longer curved paths) light up a touch later.
const PANEL_HIGHLIGHT_STAGGER = 0.18;

// ─── Motion paths (all drawn left -> right) ──────────────────────────────────
// Stage 0: Parse icon right edge -> ParserData left edge (straight horizontal).
// Parse icon is at translate(30, 195) scale(0.6) with box w=110; right edge = 30 + 55*0.6 = 63.
const PARSE_TO_PARSER_PATH = "M64 195 L130 195";

// Stage 1: Parser right edge -> Template left edge (straight horizontal).
const PARSER_TO_TEMPLATE_PATH = "M339 195L408 195";

// Stage 2: Template right edge (499,192) -> panel left edges (x=569), fanning out.
// Drawn left -> right (Template -> panels) so dots and dash-flow travel in the
// correct direction.
const TEMPLATE_TO_PANEL_PATHS: string[] = [
  "M485 192H490C493.745 192 504.491 181.255 504.491 168V72C504.491 58.7452 515.236 48 528.491 48H570",
  "M485 192H490C499.523 192 510.268 181.255 510.268 168V141C510.268 127.745 521.013 117 534.268 117H570",
  "M485 191H570",
  "M485 192H490C499.523 192 510.268 202.745 510.268 216V237C510.268 250.255 521.013 261 534.268 261H570",
  "M485 192H490C493.745 192 504.491 202.745 504.491 216V307C504.491 320.255 515.236 331 528.491 331H570",
];

// Stage 4: Indexer right edge -> Output card left edge (straight).
const INDEXER_TO_OUTPUT_PATH = "M861 192L934 192";

// Stage 3: Panel right edges (725, y) -> Indexer left edge (791, 192), converging.
// One path per panel so all 5 panel dots can travel to the Indexer.
const PANEL_TO_INDEXER_PATHS: string[] = [
  "M725 50H765C778 50 786 62 786 76V172C786 184 789 192 791 192",
  "M725 120H765C778 120 786 132 786 146V178C786 186 789 192 791 192",
  "M725 192L791 192",
  "M725 260H765C778 260 786 248 786 234V202C786 194 789 192 791 192",
  "M725 330H765C778 330 786 318 786 304V208C786 196 789 192 791 192",
  INDEXER_TO_OUTPUT_PATH,
];

// ─── Visible connector paths ────────────────────────────────────────────────
// Dashed (flowing stroke offset) for the upstream legs, solid for the downstream legs.
// Dashed connectors drawn left -> right so the dash-offset flow matches the
// left-to-right data flow.
const DASHED_PATHS = [
  "M64 195L133 195",

  PARSER_TO_TEMPLATE_PATH,
  ...TEMPLATE_TO_PANEL_PATHS,
];
const SOLID_PATHS = [...PANEL_TO_INDEXER_PATHS];

function offsetBegin(base: string, offset: number): string {
  if (!base || base === "0s") return `${offset}s`;
  // If base already has an offset (e.g. "id.end+0.18s"), combine the offsets
  // to avoid invalid SMIL like "id.end+0.18s+0.5s".
  if (base.includes("+")) {
    const plusIdx = base.lastIndexOf("+");
    const event = base.substring(0, plusIdx);
    const prevOffset = parseFloat(base.substring(plusIdx + 1));
    return `${event}+${prevOffset + offset}s`;
  }
  return `${base}+${offset}s`;
}

function HowAnimation({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  const shouldReduceMotion = useReducedMotion();
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  // Loop: restart the full animation 3 s after the flow ends.
  // Total animation ≈ 17 s, so the cycle fires at ~20 s.
  const [loopKey, setLoopKey] = useState(0);
  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setTimeout(() => setLoopKey((k) => k + 1), 20000);
    return () => clearTimeout(timer);
  }, [loopKey, shouldReduceMotion]);

  const shapeDot = `${id}ShapeDot`;
  const shapeSparkle = `${id}ShapeSparkle`;
  const filterGlow = `${id}FilterGlow`;
  const gradientLine = `${id}GradientLine`;

  // Hidden motion path IDs.
  const mpathParseToParser = `${id}ParseToParser`;
  const mpathParserToTemplate = `${id}ParserToTemplate`;
  const mpathTemplateToPanel = TEMPLATE_TO_PANEL_PATHS.map(
    (_, i) => `${id}TemplateToPanel${i}`,
  );
  const mpathPanelToIndexer = PANEL_TO_INDEXER_PATHS.map(
    (_, i) => `${id}PanelToIndexer${i}`,
  );
  const mpathIndexerToOutput = `${id}IndexerToOutput`;

  // Parse icon glow filter for border highlight.
  const parseIconGlowFilter = `${id}ParseIconGlow`;

  // ─── Stage timing chain ───────────────────────────────────────────────────
  // Stage 0a: Parse icon border highlight fades in at 1s (stays on, fill="freeze").
  const parseIconBorderBegin = PARSE_ICON_BORDER_BEGIN;
  // Stage 0b: Cog starts rotating when border highlight completes.
  const cogBegin = `${id}ParseIconBorder.end`;
  // Stage 0c: Dot travels from parse icon to ParserData.
  const parseToParserDotBegin = offsetBegin(
    cogBegin,
    PARSE_TO_PARSER_DOT_DELAY,
  );
  const parseToParserDotEndRef = `${id}ParseToParserDot.end`;
  // Stage 1: ParserData internal animation starts when dot arrives.
  const parserDataBegin = parseToParserDotEndRef;
  // Stage 2: Parser-to-Template dot travels after ParserData has been active.
  const parserDotBegin = offsetBegin(parserDataBegin, PARSER_DOT_DELAY);
  const parserDotEndRef = `${id}ParserDot.end`;
  // Stage 3: Template highlights when parser dot arrives.
  const templateHighlightBegin = parserDotEndRef;
  const templateDotBegin = offsetBegin(
    templateHighlightBegin,
    TEMPLATE_DOT_DELAY,
  );
  const templateDotEndRef = `${id}TemplateDot0.end`;
  // Stage 4: Panels highlight (staggered) when template dots arrive.
  const panelHighlightBegins = PANEL_DEFS.map((_, i) =>
    offsetBegin(
      templateDotEndRef,
      Math.abs(PANEL_DEFS[i].y + PANEL_H / 2 - 192) < 4
        ? 0
        : PANEL_HIGHLIGHT_STAGGER * (2 - Math.abs(2 - i)),
    ),
  );
  // Stage 5: Panel dots travel to Indexer.
  const firstPanelDotEndRef = `${id}PanelDot0.end`;
  // Stage 6: Indexer highlights when panel dots arrive.
  const indexerHighlightBegin = firstPanelDotEndRef;
  const indexerDotBegin = offsetBegin(indexerHighlightBegin, INDEXER_DOT_DELAY);
  const indexerDotEndRef = `${id}IndexerDot.end`;
  // Stage 7: Output highlights when indexer dot arrives.
  const outputHighlightBegin = indexerDotEndRef;
  // Flow end: all module highlights fade out after the AI agents highlight holds.
  const flowEndRef = offsetBegin(outputHighlightBegin, OUTPUT_HOLD_DURATION);

  return (
    <div
      className={cn("ragflow-animation-root relative", className)}
      {...restProps}
    >
      <svg
        key={loopKey}
        className="absolute inset-0 size-full pointer-events-none"
        viewBox="0 0 998 400"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          {/* Hidden motion paths for traveling dots (left -> right). */}
          <path id={mpathParseToParser} d={PARSE_TO_PARSER_PATH} />
          <path id={mpathParserToTemplate} d={PARSER_TO_TEMPLATE_PATH} />
          {TEMPLATE_TO_PANEL_PATHS.map((d, i) => (
            <path
              key={mpathTemplateToPanel[i]}
              id={mpathTemplateToPanel[i]}
              d={d}
            />
          ))}
          {PANEL_TO_INDEXER_PATHS.map((d, i) => (
            <path
              key={mpathPanelToIndexer[i]}
              id={mpathPanelToIndexer[i]}
              d={d}
            />
          ))}
          <path id={mpathIndexerToOutput} d={INDEXER_TO_OUTPUT_PATH} />

          {/* Reusable traveling dot. */}
          <circle
            id={shapeDot}
            cx="0"
            cy="0"
            r="3"
            filter={`url(#${filterGlow})`}
          />

          {/* Reusable sparkle (used for the final leg into the output). */}
          <path
            id={shapeSparkle}
            d="M0 -9 C1 -2 2 -1 9 0 C2 1 1 2 0 9 C-1 2 -2 1 -9 0 C-2 -1 -1 -2 0 -9 Z"
            filter={`url(#${filterGlow})`}
          />

          {/* Horizontal line gradient (fades in from the left edge). */}
          <linearGradient
            id={gradientLine}
            x1="0"
            y1="0"
            x2="998"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00BEB4" stopOpacity="0" />
            <stop offset="0.2" stopColor="#00BEB4" />
            <stop offset="1" stopColor="#00BEB4" />
          </linearGradient>

          <SvgGlowFilter id={filterGlow} />
          <SvgGlowFilter
            id={parseIconGlowFilter}
            stdDeviation={3}
            extrude={0}
          />
        </defs>

        {/* Dashed connectors (Parser -> Template, Template -> panels). */}
        {DASHED_PATHS.map((d, i) => (
          <path
            key={`dashed-${i}`}
            d={d}
            stroke={`url(#${gradientLine})`}
            strokeWidth="1"
            strokeDasharray={DASH_ARRAY}
            opacity={0.85}
          >
            <animate
              attributeName="stroke-dashoffset"
              values="100%; 0%"
              dur={DASH_OFFSET_DURATION}
              repeatCount="indefinite"
            />
          </path>
        ))}

        {/* Solid connectors (panels -> Indexer -> output). */}
        {SOLID_PATHS.map((d, i) => (
          <path
            key={`solid-${i}`}
            d={d}
            stroke={`url(#${gradientLine})`}
            strokeWidth="1"
            opacity={0.85}
          />
        ))}

        {/* Parse icon (CogAnimation inside IconBox). Cog begins after border
            highlight completes; border fades in at 1s and stays on. */}
        <g transform="translate(30, 195) scale(0.6)">
          <IconBox
            background="rgba(var(--ragflow-text-secondary), 0.1)"
            textColor={{ from: "#fff", to: "#888" }}
            gradientDirection="vertical"
            box={{ x: -55, y: -55, w: 110, h: 110 }}
            text="Parser"
            textSize={24}
            textOffset={32}
          >
            <CogAnimation
              bodyColor={{ from: "#fff", to: "#999" }}
              innerColor={{
                from: "rgba(var(--ragflow-color-primary), 0.8)",
                to: "rgba(var(--ragflow-color-primary), 0.5)",
              }}
              animated={!shouldReduceMotion}
              begin={cogBegin}
            />
          </IconBox>
        </g>

        <g transform="translate(130, 75) scale(1)">
          <ParserData begin={!shouldReduceMotion ? parserDataBegin : "0s"} />
        </g>

        {/* Parse icon border highlight - in parent SVG space so strokeWidth
            isn't affected by the 0.6 scale. Coordinates derived from
            translate(30, 195) scale(0.6) with box={x:-55, y:-55, w:110, h:110}:
            x = 30 + (-55)*0.6 = -3, y = 195 + (-55)*0.6 = 162, w = 110*0.6 = 66. */}
        {!shouldReduceMotion && (
          <g filter={`url(#${parseIconGlowFilter})`} opacity={0}>
            <animate
              id={`${id}ParseIconBorder`}
              attributeName="opacity"
              values="0;0.9"
              keyTimes="0;1"
              dur={`${PARSE_ICON_BORDER_DURATION}s`}
              begin={parseIconBorderBegin}
              repeatCount="1"
              fill="freeze"
            />
            <rect
              x={-3}
              y={162}
              width={66}
              height={66}
              rx={4.8}
              fill="none"
              stroke="#00BEB4"
              strokeWidth={1}
            />
          </g>
        )}

        {/* Template distributor pill (was "Document"). */}
        <SourceDocument
          x={TEMPLATE_X}
          name="Templates"
          beginRef={!shouldReduceMotion ? templateHighlightBegin : undefined}
          flowEndRef={!shouldReduceMotion ? flowEndRef : undefined}
        />

        {/* Five pipeline panels (Page / Agent / Mind / Tree / Data). */}
        {PANEL_DEFS.map((panel, i) => (
          <PipelinePanel
            key={panel.name}
            y={panel.y}
            name={panel.name}
            icon={panel.icon}
            beginRef={!shouldReduceMotion ? panelHighlightBegins[i] : undefined}
            flowEndRef={!shouldReduceMotion ? flowEndRef : undefined}
          />
        ))}

        {/* Indexer node (was "Index").
        <IndexNode
          beginRef={!shouldReduceMotion ? indexerHighlightBegin : undefined}
          flowEndRef={!shouldReduceMotion ? flowEndRef : undefined}
        /> */}

        <SourceDocument
          x={INDEXER_X}
          name="Indexer"
          beginRef={!shouldReduceMotion ? indexerHighlightBegin : undefined}
          flowEndRef={!shouldReduceMotion ? flowEndRef : undefined}
        />

        {/* Output target: AI agents card. */}
        <IconBox
          background="rgba(var(--ragflow-text-secondary), 0.1)"
          textColor={{ from: "#fff", to: "#888" }}
          gradientDirection="vertical"
          box={{ x: 934, y: 159, w: 64, h: 64 }}
          text="AI agents"
          textSize={13}
          textOffset={22}
        >
          <OutputTarget
            beginRef={!shouldReduceMotion ? outputHighlightBegin : undefined}
            flowEndRef={!shouldReduceMotion ? flowEndRef : undefined}
          />
        </IconBox>

        {/* Traveling dots - skipped when prefers-reduced-motion. */}
        {!shouldReduceMotion && (
          <>
            {/* Stage 0: Parse icon -> ParserData (single dot). */}
            <use href={`#${shapeDot}`} fill="#42FFA4" opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur={PARSE_TO_PARSER_DOT_DURATION}
                begin={parseToParserDotBegin}
                repeatCount="1"
              />
              <animateMotion
                id={`${id}ParseToParserDot`}
                dur={PARSE_TO_PARSER_DOT_DURATION}
                begin={parseToParserDotBegin}
                repeatCount="1"
              >
                <mpath href={`#${mpathParseToParser}`} />
              </animateMotion>
            </use>

            {/* Stage 1: Parser -> Template (single dot). */}
            <use href={`#${shapeDot}`} fill="#42FFA4" opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur={PARSER_DOT_DURATION}
                begin={parserDotBegin}
                repeatCount="1"
              />
              <animateMotion
                id={`${id}ParserDot`}
                dur={PARSER_DOT_DURATION}
                begin={parserDotBegin}
                repeatCount="1"
              >
                <mpath href={`#${mpathParserToTemplate}`} />
              </animateMotion>
            </use>

            {/* Stage 2: Template -> panels (5 dots, all start together). */}
            {PANEL_DEFS.map((_, i) => (
              <use
                key={`template-dot-${i}`}
                href={`#${shapeDot}`}
                fill="#42FFA4"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur={TEMPLATE_DOT_DURATION}
                  begin={templateDotBegin}
                  repeatCount="1"
                />
                <animateMotion
                  id={`${id}TemplateDot${i}`}
                  dur={TEMPLATE_DOT_DURATION}
                  begin={templateDotBegin}
                  repeatCount="1"
                >
                  <mpath href={`#${mpathTemplateToPanel[i]}`} />
                </animateMotion>
              </use>
            ))}

            {/* Stage 3: panels -> Indexer (5 dots, staggered start after panel highlight). */}
            {PANEL_DEFS.map((_, i) => {
              const panelDotBegin = offsetBegin(
                panelHighlightBegins[i],
                PANEL_DOT_DELAY,
              );
              return (
                <Fragment key={`panel-dot-${i}`}>
                  <use href={`#${shapeDot}`} fill="#00BEB4" opacity="0">
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.1;0.9;1"
                      dur={PANEL_DOT_DURATION}
                      begin={panelDotBegin}
                      repeatCount="1"
                    />
                    <animateMotion
                      id={`${id}PanelDot${i}`}
                      dur={PANEL_DOT_DURATION}
                      begin={panelDotBegin}
                      repeatCount="1"
                    >
                      <mpath href={`#${mpathPanelToIndexer[i]}`} />
                    </animateMotion>
                  </use>
                </Fragment>
              );
            })}

            {/* Stage 4: Indexer -> output (single sparkle dot). */}
            <use href={`#${shapeSparkle}`} fill="#42FFA4" opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur={INDEXER_DOT_DURATION}
                begin={indexerDotBegin}
                repeatCount="1"
              />
              <animateMotion
                id={`${id}IndexerDot`}
                dur={INDEXER_DOT_DURATION}
                begin={indexerDotBegin}
                repeatCount="1"
              >
                <mpath href={`#${mpathIndexerToOutput}`} />
              </animateMotion>
            </use>
          </>
        )}
      </svg>
    </div>
  );
}

export default HowAnimation;
