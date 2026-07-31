import { useId } from "react";
import { cn } from "@site/src/utils/twUtils";
import useReducedMotion from "@site/src/utils/useReducedMotion";
import SvgGlowFilter from "@site/src/utils/visual-effects/SvgGlowFilter";
import SvgStatusDotLabel from "@site/src/utils/visual-effects/SvgStatusDotLabel";

interface TreeNode {
  id: string;
  x: number;
  y: number;
  size: number;
  rx: number;
  label: string;
  /** 0 = root (top), 1 = middle, 2 = bottom */
  level: number;
}

interface LeafBox {
  id: string;
  x: number;
  y: number;
  size: number;
  rx: number;
  label: string;
  /** Target opacity after reveal */
  opacity: number;
  /** Parent tree level (used to stagger reveal) */
  parentLevel: number;
}

interface ContentBar {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
}

// Tree hierarchy boxes (all "H1" in original artwork, representing heading chunks)
const TREE_NODES: TreeNode[] = [
  { id: "tn-root", x: 47, y: 18, size: 16, rx: 2.66667, label: "H1", level: 0 },
  { id: "tn-mid", x: 36, y: 49, size: 16, rx: 2.66667, label: "H1", level: 1 },
  { id: "tn-bot", x: 37, y: 101, size: 16, rx: 2.66667, label: "H1", level: 2 },
];

// Leaf chunk boxes - "2" (level-2 chunks, 14x14) and "3" (level-3 chunks, 12x12)
const LEAF_BOXES: LeafBox[] = [
  { id: "lb-1", x: 83, y: 38, size: 14, rx: 2.33333, label: "2", opacity: 0.6, parentLevel: 0 },
  { id: "lb-2", x: 82, y: 73, size: 14, rx: 2.33333, label: "2", opacity: 0.6, parentLevel: 1 },
  { id: "lb-3", x: 78, y: 97, size: 14, rx: 2.33333, label: "2", opacity: 0.6, parentLevel: 1 },
  { id: "lb-4", x: 82, y: 120, size: 14, rx: 2.33333, label: "2", opacity: 0.6, parentLevel: 2 },
  { id: "lb-5", x: 119, y: 59, size: 12, rx: 2, label: "3", opacity: 0.4, parentLevel: 0 },
  { id: "lb-6", x: 119, y: 74, size: 12, rx: 2, label: "3", opacity: 0.4, parentLevel: 1 },
  { id: "lb-7", x: 119, y: 89, size: 12, rx: 2, label: "3", opacity: 0.4, parentLevel: 2 },
];

// Decorative content bars (faded placeholders for content)
const CONTENT_BARS: ContentBar[] = [
  { x: 64, y: 24, w: 26, h: 4, rx: 1 },
  { x: 99, y: 43, w: 26, h: 4, rx: 1 },
  { x: 98, y: 125, w: 33, h: 4, rx: 1 },
  { x: 132, y: 64, w: 10, h: 2, rx: 1 },
  { x: 132, y: 79, w: 10, h: 2, rx: 1 },
  { x: 132, y: 94, w: 10, h: 2, rx: 1 },
];

// Connector paths (coordinates shifted to local viewBox 0 0 149 154)
const CONNECTORS: string[] = [
  // Root -> bottom (long vertical spine on the left)
  "M46 25.571L28 25.571C26.895 25.571 26 26.467 26 27.571L26 147.5",
  // Middle -> bottom (left spine segment)
  "M66 57L28 57C26.895 57 26 57.895 26 59L26 107C26 108.105 26.895 109 28 109L37 109",
  // Top-right bracket (leaf-1 area)
  "M82 80L68 80C66.895 80 66 79.105 66 78L66 73.714L66 47C66 45.895 66.895 45 68 45L82.5 45",
  // Bottom-right bracket (leaf-4 area)
  "M81.516 127L68 127C66.896 127 66 126.105 66 125L66 122.869L66 106C66 104.895 66.896 104 68 104L78 104",
  // Horizontal connector to "3" boxes
  "M119.5 80L96.5 80",
  // Short horizontal connector
  "M65.5 109L53.5 109",
];

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
  /** SMIL begin reference - tree reveal starts after this (default: "0s") */
  beginRef?: string;
}

export default function TreeAnimation({
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
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const reduced = useReducedMotion();
  const glowId = `${id}-glow`;

  // Timing
  const nodeStagger = duration * 0.5;
  const nodeAppear = 0.4;
  const connectorDraw = duration * 0.4;
  const leafDelay = duration * 0.4;
  const leafStagger = duration * 0.3;
  const barDelay = duration * 0.6;
  const barStagger = duration * 0.2;
  const pulseBegin = offsetBegin(beginRef, duration + 0.3);
  const panelFadeIn = 0.3;
  const activated = reduced || beginRef !== "0s";

  return (
    <svg
      viewBox="0 0 149 154"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(x === undefined && "w-full h-full", className)}
      x={x}
      y={y}
      width={width}
      height={height}
      role="img"
      aria-label="Tree hierarchy"
    >
      <defs>
        <SvgGlowFilter id={glowId} stdDeviation={1.2} extrude={0.2} />
      </defs>

      {backgroundColor !== "transparent" && (
        <rect width="149" height="154" rx="8" fill={backgroundColor} />
      )}

      {showBorder && (
        <rect
          x="0.25"
          y="0.25"
          width="148.5"
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

      {/* Connectors - draw progressively after their parent node appears */}
      <g
        stroke="white"
        strokeOpacity={0.1}
        strokeWidth={0.5}
        fill="none"
      >
        {CONNECTORS.map((d, i) => {
          const connectorDelay = (i / CONNECTORS.length) * (duration * 0.4);
          return (
            <path
              key={`connector-${i}`}
              d={d}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={reduced ? 0 : 1}
            >
              {!reduced && (
                <animate
                  attributeName="stroke-dashoffset"
                  values="1; 0"
                  dur={`${connectorDraw}s`}
                  begin={offsetBegin(beginRef, connectorDelay)}
                  fill="freeze"
                />
              )}
            </path>
          );
        })}
      </g>

      {/* Tree nodes (H1 boxes) - appear progressively top to bottom */}
      {TREE_NODES.map((node, i) => {
        const nodeDelayTime = (i / TREE_NODES.length) * nodeStagger;
        const pulseDur = 2.5 + i * 0.4;
        const fontSize = 7;
        const textX = node.x + node.size / 2;
        const textY = node.y + node.size / 2 + 0.5;
        const borderStrokeWidth = node.size === 16 ? 0.333333 : 0.291667;

        return (
          <g key={node.id}>
            {/* Box background */}
            <rect
              x={node.x}
              y={node.y}
              width={node.size}
              height={node.size}
              rx={node.rx}
              fill="#1A2325"
            />
            {/* Box border */}
            <rect
              x={node.x + 0.167}
              y={node.y + 0.167}
              width={node.size - 0.333}
              height={node.size - 0.333}
              rx={node.rx - 0.167}
              fill="none"
              stroke={accentColor}
              strokeOpacity={reduced ? 0.8 : 0}
              strokeWidth={borderStrokeWidth}
            >
              {!reduced && (
                <animate
                  attributeName="stroke-opacity"
                  values="0; 0.8"
                  dur={`${nodeAppear}s`}
                  begin={offsetBegin(beginRef, nodeDelayTime)}
                  fill="freeze"
                />
              )}
            </rect>
            {/* Label */}
            <text
              x={textX}
              y={textY}
              fill={accentColor}
              fontSize={fontSize}
              fontWeight={600}
              fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
              textAnchor="middle"
              dominantBaseline="middle"
              opacity={reduced ? 1 : 0}
            >
              {!reduced && (
                <animate
                  attributeName="opacity"
                  values="0; 1"
                  dur={`${nodeAppear}s`}
                  begin={offsetBegin(beginRef, nodeDelayTime + 0.1)}
                  fill="freeze"
                />
              )}
              {node.label}
            </text>
            {/* Continuous subtle pulse on the border */}
            {!reduced && (
              <rect
                x={node.x + 0.167}
                y={node.y + 0.167}
                width={node.size - 0.333}
                height={node.size - 0.333}
                rx={node.rx - 0.167}
                fill="none"
                stroke={accentColor}
                strokeWidth={borderStrokeWidth}
                filter={`url(#${glowId})`}
                opacity={0}
              >
                <animate
                  attributeName="opacity"
                  values="0; 0.4; 0"
                  dur={`${pulseDur}s`}
                  begin={pulseBegin}
                  repeatCount="indefinite"
                />
              </rect>
            )}
          </g>
        );
      })}

      {/* Leaf boxes (numbered chunks) - fade in after their parent tree level */}
      {LEAF_BOXES.map((box, i) => {
        const leafDelayTime =
          leafDelay + box.parentLevel * 0.4 + (i % 3) * leafStagger * 0.3;
        const fontSize = box.size === 14 ? 6 : 5;
        const textX = box.x + box.size / 2;
        const textY = box.y + box.size / 2 + 0.3;
        const borderStrokeWidth = box.size === 14 ? 0.291667 : 0.25;

        return (
          <g key={box.id} opacity={reduced ? box.opacity : 0}>
            {!reduced && (
              <animate
                attributeName="opacity"
                values={`0; ${box.opacity}`}
                dur="0.5s"
                begin={offsetBegin(beginRef, leafDelayTime)}
                fill="freeze"
              />
            )}
            {/* Box background */}
            <rect
              x={box.x}
              y={box.y}
              width={box.size}
              height={box.size}
              rx={box.rx}
              fill="#1A2325"
            />
            {/* Box border */}
            <rect
              x={box.x + 0.146}
              y={box.y + 0.146}
              width={box.size - 0.292}
              height={box.size - 0.292}
              rx={box.rx - 0.146}
              fill="none"
              stroke={accentColor}
              strokeOpacity={0.8}
              strokeWidth={borderStrokeWidth}
            />
            {/* Label */}
            <text
              x={textX}
              y={textY}
              fill={accentColor}
              fontSize={fontSize}
              fontWeight={600}
              fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {box.label}
            </text>
          </g>
        );
      })}

      {/* Content bars - fade in last */}
      {CONTENT_BARS.map((bar, i) => {
        const barDelayTime = barDelay + (i / CONTENT_BARS.length) * barStagger;
        return (
          <rect
            key={`bar-${i}`}
            x={bar.x}
            y={bar.y}
            width={bar.w}
            height={bar.h}
            rx={bar.rx}
            fill="white"
            fillOpacity={reduced ? 0.1 : 0}
          >
            {!reduced && (
              <animate
                attributeName="fill-opacity"
                values="0; 0.1"
                dur="0.4s"
                begin={offsetBegin(beginRef, barDelayTime)}
                fill="freeze"
              />
            )}
          </rect>
        );
      })}
      </g>
      )}

      {/* "Tree" label with status dot - always visible, lights up at beginRef */}
      <SvgStatusDotLabel
        x={11}
        y={13}
        label="Tree"
        activeColor={accentColor}
        beginRef={activated ? beginRef : "indefinite"}
      />
    </svg>
  );
}
