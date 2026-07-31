import useReducedMotion from '@site/src/utils/useReducedMotion';

interface Props {
  /** Dot center X */
  x: number;
  /** Dot center Y (text is vertically centered to this via dominantBaseline=middle) */
  y: number;
  /** Text label displayed to the right of the dot */
  label: string;
  /** Highlight color when active */
  activeColor: string;
  /** Dark color before activation (default: "#3d4a4a") */
  inactiveColor?: string;
  /** SMIL begin reference - when the dot lights up (default: "0s") */
  beginRef?: string;
  /** Dot radius (default: 2) */
  dotRadius?: number;
  /** Gap between dot edge and text start (default: 5) */
  textGap?: number;
  /** Text color (default: rgba(var(--ragflow-text-standard),1)) */
  textColor?: string;
  /** Text opacity (default: 0.75) */
  textOpacity?: number;
  /** Font size (default: 12) */
  fontSize?: number;
  /** Font weight (default: 500) */
  fontWeight?: number | string;
  /** Letter spacing (default: 0.3) */
  letterSpacing?: number | string;
  /** Font family */
  fontFamily?: string;
}

/**
 * A status dot + text label for SVG panels. The dot is dark before `beginRef`
 * triggers and transitions to `activeColor` (highlight) afterwards.
 */
export default function SvgStatusDotLabel({
  x,
  y,
  label,
  activeColor,
  inactiveColor = '#3d4a4a',
  beginRef = '0s',
  dotRadius = 2,
  textGap = 5,
  textColor = 'rgba(var(--ragflow-text-standard),1)',
  textOpacity = 0.75,
  fontSize = 12,
  fontWeight = 500,
  letterSpacing = 0.3,
  fontFamily = 'ui-sans-serif, system-ui, -apple-system, sans-serif',
}: Props) {
  const reduced = useReducedMotion();

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={dotRadius}
        fill={reduced ? activeColor : inactiveColor}
      >
        {!reduced && (
          <animate
            attributeName="fill"
            values={`${inactiveColor};${activeColor}`}
            dur="0.4s"
            begin={beginRef}
            fill="freeze"
          />
        )}
      </circle>
      <text
        x={x + dotRadius + textGap}
        y={y}
        fill={textColor}
        fillOpacity={textOpacity}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  );
}
