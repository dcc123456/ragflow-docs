import { useId } from "react";

import { cn } from "@site/src/utils/twUtils";

export interface NodeConnectorProps {
  /** Large node circle. */
  circle: { cx: number; cy: number; r: number };
  /** Small dot sitting on the circle's edge (the polyline's start anchor). */
  dot: { cx: number; cy: number; r: number };
  /** Polyline path data. Drawn from the dot outward to the label.
   *  Use `M ... L ... H ...` style; the path is normalized via pathLength=1
   *  so the draw-on effect works regardless of geometry. */
  path: string;
  /** Label text rendered below the polyline's far end. */
  label: string;
  /** Label anchor position (the polyline's far end). */
  labelX: number;
  labelY: number;
  /** Text anchor for the label. Left-going polylines should use "start",
   *  right-going should use "end". Default: "start". */
  labelAnchor?: "start" | "middle" | "end";
  /** Vertical offset from `labelY` to the text baseline. Default: 14. */
  labelOffset?: number;
  /** Custom icon rendered inside the circle (centered on `circle.cx/cy`).
   *  Pass any SVG/HTML node; for lucide icons use `<FileText size={36} />`. */
  icon?: React.ReactNode;
  /** Icon size used to center the icon. Must match the icon's rendered size. */
  iconSize?: number;
  /** Entrance timeline offset (seconds). Use to stagger multiple nodes. */
  begin?: number;
  /** Polyline stroke (color or `url(#grad)`). */
  stroke?: string;
  /** Circle radial fill stops. */
  circleFrom?: string;
  circleTo?: string;
  /** Dot linear fill stops. */
  dotFrom?: string;
  dotTo?: string;
  /** Ring stroke color around the circle. */
  ringStroke?: string;
  /** Label text gradient stops (left -> right). */
  labelFrom?: string;
  labelTo?: string;
  className?: string;
}

// Entrance timeline (per node), all in seconds, offset by `begin`:
//   0.00 - 0.50  circle grows from 0 + fades in
//   0.35 - 0.75  icon fades in (overlaps the circle grow)
//   0.70 - 1.00  dot grows + fades in
//   0.95 - 1.75  polyline draws outward (stroke-dashoffset 1 -> 0)
//   1.50 - 1.90  label fades in (after polyline is mostly drawn)
const T_CIRCLE_DUR = 0.5;
const T_ICON_START = 0.35;
const T_ICON_DUR = 0.4;
const T_DOT_START = 0.7;
const T_DOT_DUR = 0.3;
const T_PATH_START = 0.95;
const T_PATH_DUR = 0.8;
const T_LABEL_START = 1.5;
const T_LABEL_DUR = 0.4;

// Spline ease-out: fast start, slow settle.
const EASE_OUT = "0.2 0.8 0.2 1";

/**
 * NodeConnector
 *
 * A single "feature node" of the homepage-right diagram: a glowing circle with
 * a custom icon inside, a dot on its edge, a connector polyline drawn outward
 * to a text label. The entrance animation runs the five-stage sequence
 * (circle -> icon -> dot -> polyline -> label) using SVG SMIL, with `begin`
 * as the stagger offset.
 *
 * Extracted from homepage-right.svg (the four 36.02-radius circles with their
 * edge dots, polylines, and edge labels). All gradients/filters are
 * instance-scoped via useId so multiple NodeConnectors can coexist.
 */
export default function NodeConnector({
  circle,
  dot,
  path,
  label,
  labelX,
  labelY,
  labelAnchor = "start",
  labelOffset = 14,
  icon,
  iconSize = 36,
  begin = 0,
  stroke = "#03AEA2",
  circleFrom = "#01BCB5",
  circleTo = "#00C177",
  dotFrom = "#00BEB4",
  dotTo = "#2BF795",
  ringStroke = "#00BEB4",
  labelFrom = "#00BEB4",
  labelTo = "#42FFA4",
  className,
}: NodeConnectorProps) {
  // useId returns ":"-prefixed strings that are invalid inside url() refs in
  // some browsers; strip them so the gradient/filter ids are safe to reference.
  const uid = useId().replace(/[:]/g, "");
  const gradCircle = `${uid}-circle`;
  const gradDot = `${uid}-dot`;
  const gradLabel = `${uid}-label`;
  const filterGlow = `${uid}-glow`;

  // Place the icon's top-left so it is centered on the circle.
  const iconX = circle.cx - iconSize / 2;
  const iconY = circle.cy - iconSize / 2;

  return (
    <g className={cn(className)}>
      <defs>
        {/* Circle fill: radial teal with a transparent core fading to a
            translucent edge — the "bubble" look. Reversed from the original
            paint5/7/9/11 gradient so the center reads as see-through. */}
        <radialGradient id={gradCircle} cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop stopColor={circleFrom} stopOpacity={0} />
          <stop offset={0.5} stopColor={circleTo} stopOpacity={0} />
          <stop offset={1} stopColor={circleFrom} stopOpacity={0.15} />
        </radialGradient>
        {/* Dot fill: linear teal -> green (matches paint6/8/10/12). */}
        <linearGradient id={gradDot} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={dotFrom} />
          <stop offset={1} stopColor={dotTo} />
        </linearGradient>
        {/* Soft glow for the edge dot (matches filter3/5/7/9_d drop shadow). */}
        <filter
          id={filterGlow}
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        {/* Label text fill: left -> right linear gradient. */}
        <linearGradient
          id={gradLabel}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="objectBoundingBox"
        >
          <stop stopColor={labelFrom} />
          <stop offset={1} stopColor={labelTo} />
        </linearGradient>
      </defs>

      {/* 1. Circle: scale 0 -> 1 from its center + fade in. The translate
            moves the origin to the circle center so scale grows radially. */}
      <g transform={`translate(${circle.cx} ${circle.cy})`}>
        <g opacity={0}>
          <circle r={circle.r} fill={`url(#${gradCircle})`} stroke={ringStroke} strokeWidth={0.5} />
          <animateTransform
            attributeName="transform"
            type="scale"
            values="0;1"
            dur={`${T_CIRCLE_DUR}s`}
            begin={`${begin}s`}
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines={EASE_OUT}
          />
          <animate
            attributeName="opacity"
            values="0;1"
            dur={`${T_CIRCLE_DUR}s`}
            begin={`${begin}s`}
            fill="freeze"
          />
        </g>
      </g>

      {/* 2. Icon inside the circle (centered). Fades in just after the circle
            starts growing so the icon "lands" with the circle. */}
      {icon && (
        <g transform={`translate(${iconX} ${iconY})`} opacity={0}>
          {icon}
          <animate
            attributeName="opacity"
            values="0;1"
            dur={`${T_ICON_DUR}s`}
            begin={`${begin + T_ICON_START}s`}
            fill="freeze"
          />
        </g>
      )}

      {/* 3. Dot on the circle's edge: blurred glow + crisp core, both scaling
            from 0 at the dot center. */}
      <g transform={`translate(${dot.cx} ${dot.cy})`}>
        <g opacity={0}>
          <circle r={dot.r * 2.4} fill={dotFrom} opacity={0.25} filter={`url(#${filterGlow})`} />
          <circle r={dot.r} fill={`url(#${gradDot})`} />
          <animateTransform
            attributeName="transform"
            type="scale"
            values="0;1.15;1"
            keyTimes="0;0.6;1"
            dur={`${T_DOT_DUR}s`}
            begin={`${begin + T_DOT_START}s`}
            fill="freeze"
            calcMode="spline"
            keySplines="0.2 0.8 0.2 1;0.4 0 0.2 1"
          />
          <animate
            attributeName="opacity"
            values="0;1"
            dur={`${T_DOT_DUR}s`}
            begin={`${begin + T_DOT_START}s`}
            fill="freeze"
          />
        </g>
      </g>

      {/* 4. Polyline: draws from the dot outward. pathLength=1 normalizes the
            path so dasharray=1/dashoffset=1 hides it and animating dashoffset
            to 0 reveals it end-to-end. */}
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      >
        <animate
          attributeName="stroke-dashoffset"
          values="1;0"
          dur={`${T_PATH_DUR}s`}
          begin={`${begin + T_PATH_START}s`}
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.4 0 0.2 1"
        />
      </path>

      {/* 5. Label: fades in below the polyline's far end. */}
      <text
        x={labelX}
        y={labelY + labelOffset}
        textAnchor={labelAnchor}
        style={{ fill: `url(#${gradLabel})` }}
        fontSize={14}
        fontWeight={500}
        fontFamily="sans-serif"
        opacity={0}
      >
        {label}
        <animate
          attributeName="opacity"
          values="0;1"
          dur={`${T_LABEL_DUR}s`}
          begin={`${begin + T_LABEL_START}s`}
          fill="freeze"
        />
      </text>
    </g>
  );
}
