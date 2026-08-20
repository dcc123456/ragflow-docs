import { useId } from 'react';
import useReducedMotion from '@site/src/utils/useReducedMotion';
import SvgGlowFilter from '@site/src/utils/visual-effects/SvgGlowFilter';

// Pill geometry. `x` is configurable so the same component renders both the
// leftmost Parser pill and the Template distributor pill.
const PILL_Y = 180;
const PILL_W = 89;
const PILL_H = 24;
const PILL_RX = 12;

interface Props {
  /** Pill left edge x (default 410 - the Template position). */
  x?: number;
  /** Label text (default "Template"). */
  name?: string;
  /** SMIL begin reference - highlight fires when this triggers (default: "0s"). */
  beginRef?: string;
  /** SMIL begin reference for the fade-out at flow end (default: undefined). */
  flowEndRef?: string;
}

// A flow pill: blurred glow + dark inner rect + icon + label.
// Used for the leftmost Parser source and the Template distributor.
export default function SourceDocument({
  x = 410,
  name = 'Template',
  beginRef = '0s',
  flowEndRef,
}: Props) {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const reduced = useReducedMotion();
  const gradPill = `${id}SrcPill`;
  const gradFill = `${id}SrcFill`;
  const gradNotActiveFill = `${id}SrcNotActiveFill`;
  const gradText = `${id}SrcText`;
  const gradNotActiveText = `${id}SrcNotActiveText`;
  const activated = reduced || beginRef !== '0s';

  return (
    <g opacity={1}>
      <defs>
        <linearGradient
          id={gradPill}
          x1={x}
          y1={PILL_Y}
          x2={x}
          y2={PILL_Y + PILL_H}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#42B6FF' />
          <stop offset={1} stopColor='#00E8AA' />
        </linearGradient>

        <linearGradient id={gradText} x1='0' y1='0' x2='1' y2='0'>
          <stop stopColor='rgba(22, 22, 24, 1)' />
          <stop offset={0.2} stopColor='rgba(22, 22, 24, 1)' />
          <stop offset='1' stopColor='rgba(0,0,0, 1)' />
        </linearGradient>

        <linearGradient id={gradFill} x1='0' y1='0' x2='1' y2='0'>
          <stop stopColor='#01BEB4' />
          <stop offset={0.2} stopColor='#01BEB4' />
          <stop offset='1' stopColor='#42FFA4' />
        </linearGradient>

        <linearGradient id={gradNotActiveFill} x1='0' y1='0' x2='1' y2='0'>
          <stop stopColor='rgba(33, 33, 35, 1)' />
          <stop offset={0.2} stopColor='rgba(33, 33, 35, 1)' />
          <stop offset='1' stopColor='rgba(33, 33, 35, 1)' />
        </linearGradient>
        <linearGradient id={gradNotActiveText} x1='0' y1='0' x2='1' y2='0'>
          <stop stopColor='rgba(178, 181, 183, 1)' />
          <stop offset={0.2} stopColor='rgba(178, 181, 183, 1)' />
          <stop offset='1' stopColor='rgba(178, 181, 183, 1)' />
        </linearGradient>
      </defs>

      {/* Pill border */}
      <rect
        x={x}
        y={PILL_Y}
        width={PILL_W}
        height={PILL_H}
        rx={PILL_RX}
        fill={`url(#${gradNotActiveFill})`}
        stroke={`url(#${gradPill})`}
        strokeOpacity={0.6}
        strokeWidth={0.6}
      />

      {/* Label */}
      <text
        x={x + 12}
        y={PILL_Y + PILL_H / 2}
        style={{ fill: `url(#${gradNotActiveText})` }}
        // fill='#0f0'
        fontSize={13}
        fontWeight={600}
        fontFamily='system-ui, -apple-system, sans-serif'
        dominantBaseline='middle'
      >
        {name}
      </text>

      {/* Highlight glow ring */}
      {!reduced && activated && (
        <g opacity={0}>
          <animate
            attributeName='opacity'
            values='0;1'
            keyTimes='0;1'
            dur='0.5s'
            begin={beginRef}
            repeatCount='1'
            fill='freeze'
          />
          {flowEndRef && (
            <animate
              attributeName='opacity'
              values='1;0'
              keyTimes='0;1'
              dur='1s'
              begin={flowEndRef}
              repeatCount='1'
              fill='freeze'
            />
          )}
          <rect
            x={x}
            y={PILL_Y}
            width={PILL_W}
            height={PILL_H}
            rx={PILL_RX}
            fill={`url(#${gradFill})`}
            stroke='#00BEB4'
            strokeOpacity={0.6}
            strokeWidth={1}
          />

          {/* Label */}
          <text
            x={x + 12}
            y={PILL_Y + PILL_H / 2}
            // style={{fill: `url(#${gradText})`}}
            // fill='#000'
            style={{ fill: '#000' }}
            fontSize={13}
            fontWeight={600}
            fontFamily='system-ui, -apple-system, sans-serif'
            dominantBaseline='middle'
          >
            {name}
          </text>
        </g>
      )}
    </g>
  );
}
