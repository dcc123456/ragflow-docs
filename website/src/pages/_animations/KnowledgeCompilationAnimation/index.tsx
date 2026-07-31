import { cn } from "@site/src/utils/twUtils";
import useReducedMotion from "@site/src/utils/useReducedMotion";
import { Fragment, useEffect, useId, useState } from "react";
import GmailIcon from "@site/src/assets/svg/knowledge/gmail.svg";
import PdfIcon from "@site/src/assets/svg/knowledge/pdf.svg";
import GithubIcon from "@site/src/assets/svg/knowledge/github.svg";
import NotionIcon from "@site/src/assets/svg/knowledge/notion.svg";
import ConfluenceIcon from "@site/src/assets/svg/knowledge/confluence.svg";
import DiscordIcon from "@site/src/assets/svg/knowledge/discord.svg";
import DriveIcon from "@site/src/assets/svg/knowledge/drive.svg";
import Mp3Icon from "@site/src/assets/svg/knowledge/mp3.svg";
import LogIcon from "@site/src/assets/svg/knowledge/log.svg";
import WebIcon from "@site/src/assets/svg/knowledge/web.svg";

// import DemoSvg from "./DemoSvgBase";

import SvgGlowFilter from "@site/src/utils/visual-effects/SvgGlowFilter";
import { DASH_ARRAY, DASH_OFFSET_DURATION } from "../constants";
import ParserData, { TotalParserDataDuration } from "./ParserData";
import OutputIcon from "./OutputIcon";
import GraphAnimation from "./GraphAnimation";
import WikiAnimation from "./WikiAnimation";
import TimeAnimation from "./TimeAnimation";
import TreeAnimation from "./TreeAnimation";

const totalParserDataDuration = TotalParserDataDuration + 1;
// Animation timing
const DOT_MAIN_DURATION = 4.5;
const DOT_BRANCH_DURATION = 3.5;
const DOT_OUT_DURATION = 4;
// Actual travel time of each dot segment
const ICON_DOT_DURATION = 2.2;
// Highlight: fade in ~0.3s, bright ~1s, fade out ~0.3s
const HIGHLIGHT_DURATION = 1.5;
// Delay between highlight start and source dot emission
const DOT_START_DELAY = 1;
const GRAPH_DELAY = 3;
const WIKI_DELAY = 4;
const TIME_DELAY = 3;
const TREE_DELAY = 3;

// Full cycle: from highlight start to last output dot end
const CYCLE_DURATION =
  DOT_START_DELAY +
  ICON_DOT_DURATION +
  DOT_MAIN_DURATION +
  DOT_BRANCH_DURATION +
  DOT_OUT_DURATION +
  5;
const ICON_HIGHLIGHT_COUNT = 6;

// Main flow paths (reversed where needed so dots travel left -> right naturally).
// Coordinates lifted directly from demo.svg so the overlay matches the artwork.
const PATH_MAIN_IN = "M225 175 L336 175";

const PATH_TO_GRAPH =
  "M567 175 H647.434 C654.061 175 659.434 169.627 659.434 163 V96 C659.434 89.3726 664.807 84 671.434 84 H709";

const PATH_TO_TIME = "M567 174.75 L715 174.75";

const PATH_TO_KB =
  "M567 175 H647.802 C654.429 175 659.802 180.373 659.802 187 V284 C659.802 290.627 665.174 296 671.802 296 H815";

const PATH_GRAPH_TO_OUT =
  "M885 39 H1058.12 C1064.75 39 1070.12 44.3726 1070.12 51 V147 C1070.12 153.627 1075.5 159 1082.12 159 H1105";

const PATH_KB_TO_OUT =
  "M966 296 H1058.06 C1064.69 296 1070.06 290.627 1070.06 284 V171 C1070.06 164.373 1075.43 159 1082.06 159 H1105";

const PATH_WIKI_TO_OUT = "M1050 159 H1105";

// Left-side source connector paths (used both as visible paths and hidden motion paths)
const PATH_SRC_GMAIL =
  "M105 49H155.113C161.741 49 167.113 54.3726 167.113 61V163C167.113 169.627 172.486 175 179.113 175H336";
const PATH_SRC_PDF =
  "M144 84H194.113C200.741 84 206.113 89.3726 206.113 96V163C206.113 169.627 211.486 175 218.113 175H336";
const PATH_SRC_CONFLUENCE =
  "M24 201H167.511C174.138 201 179.511 195.627 179.511 189V187C179.511 180.373 184.884 175 191.511 175H336";
const PATH_SRC_DRIVE =
  "M138 266H180.995C187.623 266 192.995 260.627 192.995 254V187C192.995 180.373 198.368 175 204.995 175H336";
const PATH_SRC_DISCORD =
  "M105 301H155.113C161.741 301 167.113 295.627 167.113 289V187C167.113 180.373 172.486 175 179.113 175H336";
const PATH_SRC_LOG = "M142 176 H200 C206.627 176 212 175 218 175 H336";

// Source icons: 5 on existing left-side paths (emit dots), 5 free-floating
// (highlight only, no dots). Total 10.
const SOURCE_ICONS = [
  // Path-start icons - emit dots along existing paths
  { Icon: GmailIcon, cx: 105, cy: 43, emitsDot: true, size: 22, pathIndex: 0 },
  { Icon: PdfIcon, cx: 144, cy: 84, emitsDot: true, size: 32, pathIndex: 1 },
  { Icon: GithubIcon, cx: 93, cy: 110, emitsDot: false, size: 22 },
  { Icon: NotionIcon, cx: 83, cy: 151, emitsDot: false, size: 22 },
  { Icon: LogIcon, cx: 142, cy: 170, emitsDot: true, size: 32, pathIndex: 5 },
  {
    Icon: ConfluenceIcon,
    cx: 24,
    cy: 201,
    emitsDot: true,
    size: 22,
    pathIndex: 2,
  },
  { Icon: WebIcon, cx: 150, cy: 220, emitsDot: false, size: 22 },
  { Icon: Mp3Icon, cx: 93, cy: 230, emitsDot: false, size: 22 },
  { Icon: DriveIcon, cx: 138, cy: 263, emitsDot: true, size: 32, pathIndex: 3 },
  {
    Icon: DiscordIcon,
    cx: 105,
    cy: 301,
    emitsDot: true,
    size: 22,
    pathIndex: 4,
  },
];

// Hidden motion paths for source-icon dots (same geometry as visible left-side paths)
const LEFT_SIDE_PATHS = [
  PATH_SRC_GMAIL,
  PATH_SRC_PDF,
  PATH_SRC_CONFLUENCE,
  PATH_SRC_DRIVE,
  PATH_SRC_DISCORD,
  PATH_SRC_LOG,
];

interface IconAnimConfig {
  active: boolean;
  emitsDot: boolean;
}

// Dashed connectors from demo.svg that should "draw" themselves
const DASHED_PATHS = [
  "M138 175 L225 175",
  PATH_MAIN_IN,
  "M865 168H907",
  "M964 259H982.5C989.127 259 994.5 253.627 994.5 247V217.5",
  "M886 101H910",
  PATH_SRC_PDF,
  PATH_SRC_DRIVE,
];

const SOLID_PATHS = [
  // "M601 174.75 L715 174.75",
  PATH_TO_TIME,
  PATH_SRC_GMAIL,

  PATH_GRAPH_TO_OUT,
  PATH_TO_GRAPH,
  PATH_SRC_DISCORD,

  PATH_SRC_CONFLUENCE,
  PATH_TO_KB,
  PATH_KB_TO_OUT,
  PATH_WIKI_TO_OUT,
];

function KnowledgeCompilationAnimation({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  const shouldReduceMotion = useReducedMotion();
  const id = useId();

  const mpathMainIn = `${id}MpathMainIn`;
  const mpathToGraph = `${id}MpathToGraph`;
  const mpathToKb = `${id}MpathToKb`;
  const mpathToTime = `${id}MpathToTime`;
  const mpathGraphOut = `${id}MpathGraphOut`;
  const mpathKbOut = `${id}MpathKbOut`;
  const mpathWikiOut = `${id}MpathWikiOut`;

  const shapeDot = `${id}ShapeDot`;
  const shapeSparkle = `${id}ShapeSparkle`;

  const paintLinear = `${id}paintLinear`;
  const gradientLine = `${id}GradientLine`;
  const filterGlow = `${id}FilterGlow`;

  // All icons start inactive on first render (avoids SSR hydration mismatch).
  // The effect randomly selects active icons each cycle and schedules the next.
  const [iconConfigs, setIconConfigs] = useState<IconAnimConfig[]>(() =>
    SOURCE_ICONS.map((icon) => ({
      active: false,
      emitsDot: icon.emitsDot,
    })),
  );

  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    // Randomly select which icons are active this cycle
    const indices = Array.from({ length: SOURCE_ICONS.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const activeSet = new Set(indices.slice(0, ICON_HIGHLIGHT_COUNT));
    setIconConfigs(
      SOURCE_ICONS.map((icon, i) => ({
        active: activeSet.has(i),
        emitsDot: icon.emitsDot,
      })),
    );

    // Schedule next cycle: re-randomize after all dots finish traveling
    const timer = setTimeout(() => {
      setCycleKey((k) => k + 1);
    }, CYCLE_DURATION * 1000);

    return () => clearTimeout(timer);
  }, [cycleKey]);

  // Active dot-emitting icons among the selected set
  const dotIconSequence = iconConfigs
    .map((config, i) => ({ config, i }))
    .filter(({ config }) => config?.active && config.emitsDot);

  // First and last icon indices - used for SMIL begin references so every
  // icon in the same stage starts simultaneously.
  const firstDotI = dotIconSequence[0]?.i ?? -1;

  return (
    <div className={cn("ragflow-animation-root relative", className)} {...restProps}>
      <svg
        key={cycleKey}
        className="absolute inset-0 size-full pointer-events-none"
        viewBox="0 0 1151 353"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          {/* Hidden paths that dots travel along */}
          <path id={mpathMainIn} d={PATH_MAIN_IN} />
          <path id={mpathToGraph} d={PATH_TO_GRAPH} />
          <path id={mpathToKb} d={PATH_TO_KB} />
          <path id={mpathToTime} d={PATH_TO_TIME} />
          <path id={mpathGraphOut} d={PATH_GRAPH_TO_OUT} />
          <path id={mpathKbOut} d={PATH_KB_TO_OUT} />
          <path id={mpathWikiOut} d={PATH_WIKI_TO_OUT} />

          {/* Hidden motion paths for source-icon dots (same as the visible left-side paths) */}
          {LEFT_SIDE_PATHS.map((d, i) => (
            <path key={`left-mpath-${i}`} id={`${id}LeftPath${i}`} d={d} />
          ))}

          {/* Reusable dot */}
          <circle id={shapeDot} cx="0" cy="0" r="3" filter={`url(#${filterGlow})`} />

          {/* Reusable 4-point sparkle */}
          <path
            id={shapeSparkle}
            d="M0 -9 C1 -2 2 -1 9 0 C2 1 1 2 0 9 C-1 2 -2 1 -9 0 C-2 -1 -1 -2 0 -9 Z"
            filter={`url(#${filterGlow})`}
          />
          <linearGradient
            id={paintLinear}
            x1="88"
            y1="24"
            x2="88.1667"
            y2="-1.66667"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B9F9F5" />
            <stop offset="1" stopColor="#629794" />
          </linearGradient>
          <linearGradient
            id={gradientLine}
            x1="0"
            y1="0"
            x2="1151"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00BEB4" stopOpacity="0" />
            <stop offset="0.2" stopColor="#00BEB4" />
            <stop offset="0.2" stopColor="#00BEB4" />
          </linearGradient>

          <SvgGlowFilter id={filterGlow} />
        </defs>
        {DASHED_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={`url(#${gradientLine})`}
            // stroke={`#00BEB4`}
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

        {SOLID_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={`url(#${gradientLine})`}
            // stroke={`#00BEB4`}
            strokeWidth="1"
            // strokeDasharray={DASH_ARRAY}
            opacity={0.85}
          >
            {/* <animate
              attributeName='stroke-dashoffset'
              values='100%; 0%'
              dur={DASH_OFFSET_DURATION}
              repeatCount='indefinite'
            /> */}
          </path>
        ))}

        {/* Output target icon - highlights when output dots arrive, dims after 2s */}
        <OutputIcon
          className="translate-x-4"
          beginRef={!shouldReduceMotion && firstDotI >= 0 ? `${id}KbOut${firstDotI}.end` : "0s"}
        />

        {/* Parser pipeline: Extractor -> Parser -> Documentation
            Synced to start when the main dot begins traveling (enters the
            pipeline area). The full reveal (~2.2s) fits within the main
            dot's 4.5s travel time. */}

        {/* Source icons at the left edge */}
        {SOURCE_ICONS.map((icon, i) => {
          const config = iconConfigs[i];
          const offsetX = icon.cx - icon.size / 2;
          const offsetY = icon.cy + icon.size / 4;
          const showHighlight = config?.active && !shouldReduceMotion;
          const Icon = icon.Icon || GmailIcon;
          const iconSize = icon.size ?? 28;
          const halfIconSize = iconSize / 2;
          const boxSize = iconSize + (iconSize * 2) / 20;
          const boxX = -boxSize / 2 - 5;
          const boxRx = (10 * boxSize) / 36;

          return (
            <g key={`source-icon-${i}-${cycleKey}`}>
              <g transform={`translate(${offsetX} ${offsetY})`}>
                <g>
                  <rect
                    x={boxX}
                    y={boxX}
                    width={boxSize}
                    height={boxSize}
                    rx={boxRx}
                    ry={boxRx}
                    fill={`rgba(var(--ragflow-text-standard),0.05)`}
                    stroke={`rgb(var(--ragflow-border-component))`}
                    strokeWidth="var(--ragflow-global-border-width)"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>

                {/* gradient applied */}
                <foreignObject
                  x={-halfIconSize}
                  y={-halfIconSize}
                  width={iconSize}
                  height={iconSize}
                  transform="translate(-5 -5)"
                >
                  <Icon style={{ width: iconSize, height: iconSize }} />
                </foreignObject>
              </g>

              {/* Highlight layer - all active icons light up together, dim after ~1s */}
              {showHighlight && (
                <g transform={`translate(${offsetX} ${offsetY})`} filter={`url(#${filterGlow})`}>
                  <animate
                    id={`${id}Hl${i}`}
                    attributeName="opacity"
                    values="0; 1; 1; 0"
                    keyTimes="0; 0.2; 0.8; 1"
                    dur={`${HIGHLIGHT_DURATION}s`}
                    begin="0s"
                    repeatCount="1"
                    fill="freeze"
                  />
                  <g>
                    <rect
                      x={boxX}
                      y={boxX}
                      width={boxSize}
                      height={boxSize}
                      rx={boxRx}
                      ry={boxRx}
                      fill={`rgba(var(--ragflow-text-standard),0.05)`}
                      stroke={`rgb(var(--ragflow-border-component))`}
                      strokeWidth="var(--ragflow-global-border-width)"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                  <foreignObject
                    x={-halfIconSize}
                    y={-halfIconSize}
                    width={iconSize}
                    height={iconSize}
                    transform="translate(-5 -5)"
                  >
                    <Icon style={{ width: iconSize, height: iconSize }} />
                  </foreignObject>
                </g>
              )}
            </g>
          );
        })}

        {/* Knowledge graph panel - positioned at (709, 0) matching demo.svg */}
        <GraphAnimation
          x={709}
          y={0}
          width={176}
          height={141}
          nodeColor="#00BEB4"
          lineColor="#00BEB4"
          backgroundColor="#1A2325"
          showBorder
          duration={GRAPH_DELAY}
          beginRef={!shouldReduceMotion && firstDotI >= 0 ? `${id}Kb${firstDotI}.end` : "0s"}
        />

        {/* Time panel - positioned at (715, 97) matching demo.svg */}
        <TimeAnimation
          x={715}
          y={97}
          width={150}
          height={154}
          accentColor="#00BEB4"
          backgroundColor="#1A2325"
          showBorder
          duration={TIME_DELAY}
          beginRef={!shouldReduceMotion && firstDotI >= 0 ? `${id}Kb${firstDotI}.end` : "0s"}
        />

        {/* Wiki panel - positioned at (907, 59) matching demo.svg */}
        <WikiAnimation
          x={907}
          y={59}
          width={150}
          height={154}
          accentColor="#00BEB4"
          backgroundColor="#1A2325"
          showBorder
          duration={WIKI_DELAY}
          beginRef={!shouldReduceMotion && firstDotI >= 0 ? `${id}Kb${firstDotI}.end` : "0s"}
        />

        {/* Tree hierarchy panel - positioned at (816, 199) matching demo.svg */}
        <TreeAnimation
          x={816}
          y={199}
          width={149}
          height={154}
          accentColor="#00BEB4"
          backgroundColor="#1A2325"
          showBorder
          duration={TREE_DELAY}
          beginRef={!shouldReduceMotion && firstDotI >= 0 ? `${id}Kb${firstDotI}.end` : "0s"}
        />

        {/* Traveling dots - skipped when prefers-reduced-motion */}
        {!shouldReduceMotion && (
          <>
            {/* Source dots - all begin 1s after the first highlight, travel to hub */}
            {dotIconSequence.map(({ i }) => (
              <use
                key={`source-dot-${i}-${cycleKey}`}
                href={`#${shapeDot}`}
                fill="#42FFA4"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur={ICON_DOT_DURATION}
                  begin={`${id}Hl${firstDotI}.begin+1s`}
                  repeatCount="1"
                />
                <animateMotion
                  id={`${id}Sd${i}`}
                  dur={ICON_DOT_DURATION}
                  begin={`${id}Hl${firstDotI}.begin+1s`}
                  repeatCount="1"
                >
                  <mpath href={`#${id}LeftPath${SOURCE_ICONS[i].pathIndex ?? i}`} />
                </animateMotion>
              </use>
            ))}

            <ParserData begin={firstDotI >= 0 ? `${id}Sd${firstDotI}.end` : "0s"} />
            {/* Flow chains - stage-synchronized. All dots in the same stage
                start simultaneously (via firstDotI's element). Stages are
                sequential: source -> main -> branch -> output -> repeat. */}
            {dotIconSequence.map(({ i }) => (
              <Fragment key={`flow-${i}-${cycleKey}`}>
                {/* Center -> Graph panel */}
                <use href={`#${shapeDot}`} fill="#00BEB4" opacity="0">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.9;1"
                    dur={DOT_BRANCH_DURATION}
                    begin={`${id}Sd${firstDotI}.end+${totalParserDataDuration}`}
                    repeatCount="1"
                  />
                  <animateMotion
                    id={`${id}Graph${i}`}
                    dur={DOT_BRANCH_DURATION}
                    begin={`${id}Sd${firstDotI}.end+${totalParserDataDuration}`}
                    repeatCount="1"
                  >
                    <mpath href={`#${mpathToGraph}`} />
                  </animateMotion>
                </use>

                <use href={`#${shapeDot}`} fill="#00BEB4" opacity="0">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.9;1"
                    dur={DOT_BRANCH_DURATION}
                    begin={`${id}Sd${firstDotI}.end+${totalParserDataDuration}`}
                    repeatCount="1"
                  />
                  <animateMotion
                    id={`${id}Time${i}`}
                    dur={DOT_BRANCH_DURATION}
                    begin={`${id}Sd${firstDotI}.end+${totalParserDataDuration}`}
                    repeatCount="1"
                  >
                    <mpath href={`#${mpathToTime}`} />
                  </animateMotion>
                </use>

                {/* Center -> Knowledge Base */}
                <use href={`#${shapeDot}`} fill="#00BEB4" opacity="0">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.9;1"
                    dur={DOT_BRANCH_DURATION}
                    begin={`${id}Sd${firstDotI}.end+${totalParserDataDuration}`}
                    repeatCount="1"
                  />
                  <animateMotion
                    id={`${id}Kb${i}`}
                    dur={DOT_BRANCH_DURATION}
                    begin={`${id}Sd${firstDotI}.end+${totalParserDataDuration}`}
                    repeatCount="1"
                  >
                    <mpath href={`#${mpathToKb}`} />
                  </animateMotion>
                </use>

                {/* Graph panel -> output */}
                <use href={`#${shapeSparkle}`} fill="#42FFA4" opacity="0">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.9;1"
                    dur={DOT_OUT_DURATION}
                    begin={`${id}Graph${firstDotI}.end+${GRAPH_DELAY}`}
                    repeatCount="1"
                  />
                  <animateMotion
                    id={`${id}GraphOut${i}`}
                    dur={DOT_OUT_DURATION}
                    begin={`${id}Graph${firstDotI}.end+${GRAPH_DELAY}`}
                    repeatCount="1"
                  >
                    <mpath href={`#${mpathGraphOut}`} />
                  </animateMotion>
                </use>

                {/* Knowledge Base -> output */}
                <use href={`#${shapeSparkle}`} fill="#42FFA4" opacity="0">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.9;1"
                    dur={DOT_OUT_DURATION}
                    begin={`${id}Kb${firstDotI}.end+${TREE_DELAY}`}
                    repeatCount="1"
                  />
                  <animateMotion
                    id={`${id}KbOut${i}`}
                    dur={DOT_OUT_DURATION}
                    begin={`${id}Kb${firstDotI}.end+${TREE_DELAY}`}
                    repeatCount="1"
                  >
                    <mpath href={`#${mpathKbOut}`} />
                  </animateMotion>
                </use>

                {/* wiki Base -> output */}
                <use href={`#${shapeSparkle}`} fill="#42FFA4" opacity="0">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.9;1"
                    dur={DOT_OUT_DURATION / 4}
                    begin={`${id}Kb${firstDotI}.end+${WIKI_DELAY / 2 + TIME_DELAY / 2}`}
                    repeatCount="1"
                  />
                  <animateMotion
                    id={`${id}WikiOut${i}`}
                    dur={DOT_OUT_DURATION / 4}
                    begin={`${id}Kb${firstDotI}.end+${WIKI_DELAY / 2 + TIME_DELAY / 2}`}
                    repeatCount="1"
                  >
                    <mpath href={`#${mpathWikiOut}`} />
                  </animateMotion>
                </use>
              </Fragment>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}

export default KnowledgeCompilationAnimation;
