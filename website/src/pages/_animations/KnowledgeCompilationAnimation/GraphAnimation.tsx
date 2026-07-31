import { useId } from "react";
import { cn } from "@site/src/utils/twUtils";
import useReducedMotion from "@site/src/utils/useReducedMotion";
import SvgGlowFilter from "@site/src/utils/visual-effects/SvgGlowFilter";
import SvgStatusDotLabel from "@site/src/utils/visual-effects/SvgStatusDotLabel";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  r: number;
  hub?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
}

const NODES: GraphNode[] = [
  // Hub nodes - center cluster
  { id: "h1", x: 88, y: 62, r: 3.5, hub: true },
  { id: "h2", x: 70, y: 48, r: 3, hub: true },
  { id: "h3", x: 106, y: 46, r: 3, hub: true },
  { id: "h4", x: 82, y: 80, r: 3.5, hub: true },
  { id: "h5", x: 64, y: 84, r: 2.8, hub: true },
  { id: "h6", x: 106, y: 80, r: 2.8, hub: true },
  { id: "h7", x: 96, y: 38, r: 2.5, hub: true },
  { id: "h8", x: 78, y: 68, r: 2.8, hub: true },
  { id: "h9", x: 100, y: 66, r: 2.5, hub: true },
  // Medium nodes - mid ring (pulled inward for margin)
  { id: "m1", x: 56, y: 28, r: 2 },
  { id: "m2", x: 38, y: 40, r: 2 },
  { id: "m3", x: 120, y: 32, r: 2 },
  { id: "m4", x: 138, y: 50, r: 2 },
  { id: "m5", x: 142, y: 76, r: 2 },
  { id: "m6", x: 134, y: 102, r: 2 },
  { id: "m7", x: 112, y: 116, r: 2 },
  { id: "m8", x: 74, y: 118, r: 2 },
  { id: "m9", x: 42, y: 114, r: 2 },
  { id: "m10", x: 28, y: 96, r: 2 },
  { id: "m11", x: 26, y: 70, r: 2 },
  { id: "m12", x: 34, y: 44, r: 2 },
  // Small peripheral nodes (generous margin from edges)
  { id: "s1", x: 18, y: 36, r: 1.5 },
  { id: "s2", x: 18, y: 86, r: 1.5 },
  { id: "s3", x: 32, y: 124, r: 1.5 },
  { id: "s4", x: 60, y: 126, r: 1.5 },
  { id: "s5", x: 96, y: 126, r: 1.5 },
  { id: "s6", x: 128, y: 120, r: 1.5 },
  { id: "s7", x: 156, y: 98, r: 1.5 },
  { id: "s8", x: 158, y: 60, r: 1.5 },
  { id: "s9", x: 154, y: 30, r: 1.5 },
  { id: "s10", x: 126, y: 18, r: 1.5 },
  { id: "s11", x: 88, y: 18, r: 1.5 },
  { id: "s12", x: 46, y: 18, r: 1.5 },
];

const EDGES: GraphEdge[] = [
  // Central hub cluster (dense)
  { from: "h1", to: "h2" },
  { from: "h1", to: "h3" },
  { from: "h1", to: "h4" },
  { from: "h1", to: "h5" },
  { from: "h1", to: "h6" },
  { from: "h1", to: "h7" },
  { from: "h1", to: "h8" },
  { from: "h1", to: "h9" },
  { from: "h2", to: "h3" },
  { from: "h2", to: "h4" },
  { from: "h2", to: "h5" },
  { from: "h2", to: "h7" },
  { from: "h2", to: "h8" },
  { from: "h3", to: "h4" },
  { from: "h3", to: "h6" },
  { from: "h3", to: "h7" },
  { from: "h3", to: "h9" },
  { from: "h4", to: "h5" },
  { from: "h4", to: "h6" },
  { from: "h4", to: "h7" },
  { from: "h4", to: "h8" },
  { from: "h4", to: "h9" },
  { from: "h5", to: "h6" },
  { from: "h5", to: "h8" },
  { from: "h6", to: "h7" },
  { from: "h6", to: "h9" },
  { from: "h7", to: "h8" },
  { from: "h7", to: "h9" },
  { from: "h8", to: "h9" },
  // Center hubs connect broadly to periphery
  { from: "h1", to: "m1" },
  { from: "h1", to: "m3" },
  { from: "h1", to: "m7" },
  { from: "h1", to: "m8" },
  { from: "h1", to: "s11" },
  { from: "h1", to: "s4" },
  { from: "h1", to: "s5" },
  { from: "h4", to: "m7" },
  { from: "h4", to: "m8" },
  { from: "h4", to: "m9" },
  { from: "h4", to: "s4" },
  { from: "h4", to: "s5" },
  { from: "h4", to: "s3" },
  { from: "h8", to: "m2" },
  { from: "h8", to: "m9" },
  { from: "h8", to: "m10" },
  { from: "h8", to: "s2" },
  { from: "h9", to: "m3" },
  { from: "h9", to: "m6" },
  { from: "h9", to: "m7" },
  { from: "h9", to: "s6" },
  // Other hubs to periphery
  { from: "h2", to: "m1" },
  { from: "h2", to: "m12" },
  { from: "h2", to: "s1" },
  { from: "h2", to: "s12" },
  { from: "h3", to: "m3" },
  { from: "h3", to: "m4" },
  { from: "h3", to: "s9" },
  { from: "h3", to: "s10" },
  { from: "h5", to: "m8" },
  { from: "h5", to: "m9" },
  { from: "h5", to: "s3" },
  { from: "h5", to: "s4" },
  { from: "h6", to: "m6" },
  { from: "h6", to: "m7" },
  { from: "h6", to: "s5" },
  { from: "h6", to: "s6" },
  { from: "h7", to: "m1" },
  { from: "h7", to: "m3" },
  { from: "h7", to: "s10" },
  { from: "h7", to: "s11" },
  { from: "h7", to: "s12" },
  // Peripheral ring connections
  { from: "m1", to: "s11" },
  { from: "m1", to: "s12" },
  { from: "m1", to: "m12" },
  { from: "m2", to: "m11" },
  { from: "m2", to: "m12" },
  { from: "m2", to: "s1" },
  { from: "m3", to: "m4" },
  { from: "m3", to: "s10" },
  { from: "m4", to: "m5" },
  { from: "m4", to: "s8" },
  { from: "m4", to: "s9" },
  { from: "m5", to: "m6" },
  { from: "m5", to: "s7" },
  { from: "m5", to: "s8" },
  { from: "m6", to: "m7" },
  { from: "m6", to: "s6" },
  { from: "m6", to: "s7" },
  { from: "m7", to: "m8" },
  { from: "m7", to: "s5" },
  { from: "m7", to: "s6" },
  { from: "m8", to: "m9" },
  { from: "m8", to: "s3" },
  { from: "m8", to: "s4" },
  { from: "m9", to: "m10" },
  { from: "m9", to: "s2" },
  { from: "m9", to: "s3" },
  { from: "m10", to: "m11" },
  { from: "m10", to: "s1" },
  { from: "m10", to: "s2" },
  { from: "m11", to: "m12" },
  { from: "m11", to: "s1" },
  { from: "m12", to: "s12" },
  // Cross-peripheral connections through center
  { from: "m1", to: "m6" },
  { from: "m2", to: "m7" },
  { from: "m3", to: "m8" },
  { from: "m4", to: "m9" },
  { from: "m5", to: "m10" },
  { from: "m6", to: "m11" },
  { from: "m12", to: "m5" },
  // Small node chain
  { from: "s1", to: "s2" },
  { from: "s3", to: "s4" },
  { from: "s5", to: "s6" },
  { from: "s7", to: "s8" },
  { from: "s9", to: "s10" },
  { from: "s11", to: "s12" },
];

const NODE_MAP: Record<string, GraphNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
);

const CENTER = { x: 88, y: 62 };

// Scale factor to concentrate nodes/edges toward center (1 = original spread)
const POSITION_SCALE = 0.7;

function scaleX(node: GraphNode): number {
  return CENTER.x + (node.x - CENTER.x) * POSITION_SCALE;
}
function scaleY(node: GraphNode): number {
  return CENTER.y + (node.y - CENTER.y) * POSITION_SCALE;
}

function distFromCenter(node: GraphNode): number {
  return Math.hypot(node.x - CENTER.x, node.y - CENTER.y);
}

const MAX_DIST = Math.max(...NODES.map(distFromCenter));

const SORTED_NODE_ORDER = [...NODES.keys()].sort(
  (a, b) => distFromCenter(NODES[a]) - distFromCenter(NODES[b]),
);

const SORTED_EDGE_ORDER = [...EDGES.keys()].sort((a, b) => {
  const ea = EDGES[a];
  const eb = EDGES[b];
  const da = Math.max(
    distFromCenter(NODE_MAP[ea.from]),
    distFromCenter(NODE_MAP[ea.to]),
  );
  const db = Math.max(
    distFromCenter(NODE_MAP[eb.from]),
    distFromCenter(NODE_MAP[eb.to]),
  );
  return da - db;
});

// Offset helper: combines a SMIL begin reference with a time offset
function offsetBegin(base: string, offset: number): string {
  if (!base || base === "0s") return `${offset}s`;
  return `${base}+${offset}s`;
}

// Larger floating motion for visible movement
const MOTION_SETS = [
  { dx: "0;2.5;0;-2.5;0", dy: "0;-2.5;0;2.5;0", dur: 6 },
  { dx: "0;-2;0;2;0", dy: "0;2;0;-2;0", dur: 7.5 },
  { dx: "0;3;0;-3;0", dy: "0;3;0;-3;0", dur: 5.5 },
  { dx: "0;-2.5;0;2.5;0", dy: "0;-2.5;0;2.5;0", dur: 8 },
  { dx: "0;2;0;-2;0", dy: "0;3;0;-3;0", dur: 6.5 },
  { dx: "0;2.5;0;-2.5;0", dy: "0;-2;0;2;0", dur: 7 },
];

const NODE_MOTION: Record<string, (typeof MOTION_SETS)[0]> = Object.fromEntries(
  NODES.map((node, i) => [node.id, MOTION_SETS[i % MOTION_SETS.length]]),
);

interface Props {
  className?: string;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  nodeColor?: string;
  lineColor?: string;
  glowColor?: string;
  backgroundColor?: string;
  showBorder?: boolean;
  duration?: number;
  /** SMIL begin reference - graph drawing starts after this (default: "0s") */
  beginRef?: string;
}

export default function GraphAnimation({
  className,
  x,
  y,
  width,
  height,
  nodeColor = PRIMARY_COLOR,
  lineColor = SECONDARY_COLOR,
  glowColor,
  backgroundColor = "transparent",
  showBorder = false,
  duration = 4,
  beginRef = "0s",
}: Props) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const reduced = useReducedMotion();
  const glowId = `${id}-glow`;
  const shadowId = `${id}-shadow`;
  const sphereGradId = `${id}-sphere`;
  const lineGlowId = `${id}-lineglow`;

  const lineStagger = duration * 0.6;
  const lineDraw = duration * 0.35;
  const nodeDelay = duration * 0.15;
  const nodeStagger = duration * 0.5;
  const nodeAppear = 0.4;
  const floatBegin = duration + 0.5;

  return (
    <svg
      viewBox="0 0 176 141"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(x === undefined && "w-full h-full", className)}
      x={x}
      y={y}
      width={width}
      height={height}
      role="img"
      aria-label="Knowledge graph"
    >
      <defs>
        <SvgGlowFilter id={glowId} stdDeviation={1.5} extrude={0.3} />
        <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="0.8"
            stdDeviation="0.6"
            floodColor="#000000"
            floodOpacity="0.7"
          />
        </filter>
        <radialGradient id={sphereGradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="30%" stopColor={nodeColor} stopOpacity="1" />
          <stop offset="100%" stopColor={nodeColor} stopOpacity="0.25" />
        </radialGradient>
        <SvgGlowFilter
          id={lineGlowId}
          stdDeviation={0.4}
          extrude={0}
          colorMatrix={false}
        />
      </defs>

      {backgroundColor !== "transparent" && (
        <rect width="176" height="141" rx="8" fill={backgroundColor} />
      )}

      {showBorder && (
        <rect
          x="0.25"
          y="0.25"
          width="175.5"
          height="140.5"
          rx="7.75"
          fill="none"
          stroke={nodeColor}
          strokeOpacity={0.1}
          strokeWidth={0.5}
        />
      )}

      {/* "Graph" label with status dot - top-left corner.
          Dot is dark before animation begins, lights up at beginRef. */}
      <SvgStatusDotLabel
        x={8}
        y={15}
        label="Graph"
        activeColor={nodeColor}
        beginRef={beginRef}
      />

      {/* Edges - drawn progressively after beginRef, then follow node floating motion */}
      <g stroke={lineColor} strokeWidth={0.3} filter={`url(#${lineGlowId})`}>
        {EDGES.map((edge, i) => {
          const from = NODE_MAP[edge.from];
          const to = NODE_MAP[edge.to];
          if (!from || !to) return null;
          const sortedIdx = SORTED_EDGE_ORDER.indexOf(i);
          const edgeDelay = (sortedIdx / EDGES.length) * lineStagger;
          const fromMotion = NODE_MOTION[edge.from];
          const toMotion = NODE_MOTION[edge.to];
          const floatStart = offsetBegin(beginRef, floatBegin);
          return (
            <line
              key={`edge-${i}`}
              x1={scaleX(from)}
              y1={scaleY(from)}
              x2={scaleX(to)}
              y2={scaleY(to)}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={reduced ? 0 : 1}
              strokeOpacity={0.5}
            >
              {!reduced && (
                <>
                  <animate
                    attributeName="stroke-dashoffset"
                    values="1; 0"
                    dur={`${lineDraw}s`}
                    begin={offsetBegin(beginRef, edgeDelay)}
                    fill="freeze"
                  />
                  <animate
                    attributeName="x1"
                    values={fromMotion.dx}
                    dur={`${fromMotion.dur}s`}
                    begin={floatStart}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <animate
                    attributeName="y1"
                    values={fromMotion.dy}
                    dur={`${fromMotion.dur}s`}
                    begin={floatStart}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <animate
                    attributeName="x2"
                    values={toMotion.dx}
                    dur={`${toMotion.dur}s`}
                    begin={floatStart}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <animate
                    attributeName="y2"
                    values={toMotion.dy}
                    dur={`${toMotion.dur}s`}
                    begin={floatStart}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </>
              )}
            </line>
          );
        })}
      </g>

      {/* Nodes - all hidden until beginRef, then appear progressively from center outward */}
      <g fill={`url(#${sphereGradId})`} filter={`url(#${shadowId})`}>
        {NODES.map((node, i) => {
          const sortedIdx = SORTED_NODE_ORDER.indexOf(i);
          const nodeDelayTime =
            nodeDelay + (sortedIdx / NODES.length) * nodeStagger;
          const pulseDur = 2.5 + (i % 3) * 0.5;
          const depthOpacity = 1 - (distFromCenter(node) / MAX_DIST) * 0.4;
          const motion = NODE_MOTION[node.id];
          const pulseStart = offsetBegin(beginRef, floatBegin - 0.5);
          const floatStart = offsetBegin(beginRef, floatBegin);
          return (
            <circle
              key={node.id}
              cx={scaleX(node)}
              cy={scaleY(node)}
              r={reduced ? node.r : 0}
              opacity={depthOpacity}
              filter={node.hub ? `url(#${glowId})` : undefined}
            >
              {!reduced && (
                <>
                  {/* Progressive appear - all nodes start hidden until beginRef */}
                  <animate
                    attributeName="r"
                    values={`0; ${node.r}`}
                    dur={`${nodeAppear}s`}
                    begin={offsetBegin(beginRef, nodeDelayTime)}
                    fill="freeze"
                  />
                  {/* Continuous scale pulse - starts after generation */}
                  <animate
                    attributeName="r"
                    values={`${node.r};${node.r * 1.2};${node.r}`}
                    dur={`${pulseDur}s`}
                    begin={pulseStart}
                    repeatCount="indefinite"
                  />
                  {/* Floating motion */}
                  <animate
                    attributeName="cx"
                    values={motion.dx}
                    dur={`${motion.dur}s`}
                    begin={floatStart}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <animate
                    attributeName="cy"
                    values={motion.dy}
                    dur={`${motion.dur}s`}
                    begin={floatStart}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  {/* Hub opacity pulse */}
                  {node.hub && (
                    <animate
                      attributeName="opacity"
                      values="1; 0.6; 1"
                      dur={`${pulseDur}s`}
                      begin={pulseStart}
                      repeatCount="indefinite"
                    />
                  )}
                </>
              )}
            </circle>
          );
        })}
      </g>
    </svg>
  );
}
