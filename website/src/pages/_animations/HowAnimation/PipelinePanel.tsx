import { useId } from 'react';
import useReducedMotion from '@site/src/utils/useReducedMotion';
import SvgGlowFilter from '@site/src/utils/visual-effects/SvgGlowFilter';
import ListIcon from '@site/src/assets/svg/how/list.svg?react';
import HierarchyIcon from '@site/src/assets/svg/how/hierarchy.svg?react';
import BranchIcon from '@site/src/assets/svg/how/branch.svg?react';
import GraphIcon from '@site/src/assets/svg/how/graph.svg?react';
import GestureIcon from '@site/src/assets/svg/how/gesture.svg?react';

// Pipeline panel geometry lifted from how.svg.
// Each panel is a 156x60 rounded rect at x=569, with a dark inner rect at x=573.
export const PANEL_X = 569;
export const PANEL_W = 156;
export const PANEL_H = 60;
const INNER_X = 573;
const INNER_W = 148;
const INNER_H = 56;
const INNER_RX = 4;
const RX = 4;

// Five-panel vertical layout (matching how.svg y positions).
export const PANEL_DEFS = [
  { name: 'PageIndex', y: 20, icon: 'page' as const },
  { name: 'TreeIndex', y: 90, icon: 'agent' as const },
  { name: 'Mindmap', y: 160, icon: 'mind' as const },
  { name: 'TreeGraph', y: 230, icon: 'tree' as const },
  { name: 'Data2skills', y: 300, icon: 'data' as const },
] as const;

export type PanelIcon = (typeof PANEL_DEFS)[number]['icon'];

interface Props {
  y: number;
  name: string;
  icon: PanelIcon;
  /** SMIL begin reference - panel highlight fires when dots arrive. */
  beginRef?: string;
  /** SMIL begin reference for the fade-out at flow end (default: undefined). */
  flowEndRef?: string;
}

// Each glyph is rendered from a standalone SVG asset in src/assets/svg/.
// Color is supplied via the `color` prop so the pipeline gradient (gradIcon)
// is applied to every icon uniformly. Icons are scaled into a 22x22 box;
// the SVG `preserveAspectRatio` keeps each glyph centered on its native
// aspect ratio.
function PanelGlyph({ icon, color }: { icon: PanelIcon; color: string }) {
  switch (icon) {
    case 'page':
      return <ListIcon width={22} height={22} fill={color} />;
    case 'agent':
      return <HierarchyIcon width={22} height={22} fill={color} />;
    case 'mind':
      return <BranchIcon width={22} height={22} fill={color} />;
    case 'tree':
      return <GraphIcon width={22} height={22} fill={color} />;
    case 'data':
      // Gesture icon is a stroked line drawing, so paint via `stroke`.
      return <GestureIcon width={22} height={22} fill='none' stroke={color} />;
    default:
      return null;
  }
}

// A single pipeline panel: glow background + dark inner rect + icon + label.
// The whole group dims initially, then brightens when `beginRef` triggers.
export default function PipelinePanel({ y, name, icon, beginRef = '0s', flowEndRef }: Props) {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const reduced = useReducedMotion();

  const filterGlow = `${id}PPGlow`;
  const filterBgGlow = `${id}PPBgGlow`;
  const gradPanel = `${id}PPPanel`;
  const gradBorder = `${id}PPBorder`;
  const gradIcon = `${id}PPIcon`;
  const gradText = `${id}PPText`;

  const activated = reduced || beginRef !== '0s';
  const iconBox = 22;
  const iconOffsetX = INNER_X + 12;
  const iconOffsetY = y + PANEL_H / 2 - iconBox / 2;
  const labelX = iconOffsetX + iconBox + 8;
  const labelY = y + PANEL_H / 2;

  return (
    <g opacity={reduced ? 1 : 0.3}>
      {!reduced && activated && (
        <animate
          attributeName='opacity'
          values='0.3;1'
          keyTimes='0;1'
          dur='0.5s'
          begin={beginRef}
          repeatCount='1'
          fill='freeze'
        />
      )}
      {!reduced && activated && flowEndRef && (
        <animate
          attributeName='opacity'
          values='1;0.3'
          keyTimes='0;1'
          dur='1s'
          begin={flowEndRef}
          repeatCount='1'
          fill='freeze'
        />
      )}
      <defs>
        <SvgGlowFilter id={filterGlow} stdDeviation={3} extrude={0} />
        <filter
          id={filterBgGlow}
          x='-100%'
          y='-100%'
          width='300%'
          height='300%'
          filterUnits='objectBoundingBox'
          primitiveUnits='userSpaceOnUse'
        >
          <feGaussianBlur stdDeviation={8} />
        </filter>
        <linearGradient
          id={gradPanel}
          x1={PANEL_X}
          y1={y}
          x2={PANEL_X}
          y2={y + PANEL_H}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#42B6FF' />
          <stop offset={1} stopColor='#2BE8AA' />
        </linearGradient>
        <linearGradient id={gradBorder} x1='0' y1='1' x2='0' y2='0'>
          <stop stopColor='#B9F9F5' />
          <stop offset={1} stopColor='#629794' />
        </linearGradient>
        <linearGradient id={gradIcon} x1='0' y1='1' x2='0' y2='0'>
          <stop stopColor='#01BEB4' />
          <stop offset={1} stopColor='#42FFA4' />
        </linearGradient>
        <linearGradient id={gradText} x1='0' y1='1' x2='0' y2='0'>
          <stop stopColor='#00BEB4' />
          <stop offset={1} stopColor='#42FFA4' />
        </linearGradient>
      </defs>

      {/* Blurred glow background */}
      <g filter={`url(#${filterBgGlow})`}>
        <rect
          x={PANEL_X}
          y={y}
          width={PANEL_W}
          height={PANEL_H}
          rx={RX}
          fill={`url(#${gradPanel})`}
          fillOpacity={0.5}
        />
      </g>

      {/* Dark inner rect */}
      <rect x={INNER_X} y={y + 2} width={INNER_W} height={INNER_H} rx={INNER_RX} fill='#161618' />

      {/* Subtle border */}
      <rect
        x={INNER_X}
        y={y + 2}
        width={INNER_W}
        height={INNER_H}
        rx={INNER_RX}
        fill='none'
        stroke={`url(#${gradBorder})`}
        strokeOpacity={0.35}
        strokeWidth={0.3}
      />

      {/* Icon */}
      <g transform={`translate(${iconOffsetX} ${iconOffsetY})`}>
        <PanelGlyph icon={icon} color={`url(#${gradIcon})`} />
      </g>

      {/* Label */}
      <text
        x={labelX}
        y={labelY}
        fill={`url(#${gradText})`}
        fontSize={13}
        fontWeight={600}
        fontFamily='system-ui, -apple-system, sans-serif'
        dominantBaseline='middle'
      >
        {name}
      </text>

      {/* Highlight glow border that fades in when activated, fades out at flow end */}
      {!reduced && activated && (
        <g filter={`url(#${filterGlow})`} opacity={0}>
          <animate
            attributeName='opacity'
            values='0;0.9'
            keyTimes='0;1'
            dur='0.5s'
            begin={beginRef}
            repeatCount='1'
            fill='freeze'
          />
          {flowEndRef && (
            <animate
              attributeName='opacity'
              values='0.9;0'
              keyTimes='0;1'
              dur='1s'
              begin={flowEndRef}
              repeatCount='1'
              fill='freeze'
            />
          )}
          <rect
            x={INNER_X}
            y={y + 2}
            width={INNER_W}
            height={INNER_H}
            rx={INNER_RX}
            fill='none'
            stroke='#00BEB4'
            strokeWidth={1}
          />
        </g>
      )}
    </g>
  );
}
