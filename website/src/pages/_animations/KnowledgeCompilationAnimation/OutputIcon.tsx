import { useId } from "react";
import useReducedMotion from "@site/src/utils/useReducedMotion";

// Output target icon matching demo.svg: blurred glow rect + dark inner rect
// + hexagon icon + sparkle + connector line + "AI agents" label.
// Coordinates are in the parent animation's coordinate space (viewBox 0 0 1151 353).

const HEX_PATH =
  "M1108.35 146.956C1109.53 146.271 1111 146.271 1112.18 146.956L1116.48 149.439C1116.88 149.67 1117.02 150.182 1116.79 150.582C1116.56 150.982 1116.05 151.12 1115.65 150.889L1111.35 148.406C1110.68 148.02 1109.85 148.02 1109.18 148.406L1100.59 153.371C1099.92 153.758 1099.5 154.472 1099.5 155.244V165.174C1099.5 165.947 1099.92 166.661 1100.59 167.047L1109.18 172.012C1109.85 172.398 1110.68 172.398 1111.35 172.012L1119.99 167.025C1120.64 166.647 1121.05 165.955 1121.07 165.2L1121.1 163.934L1121.13 162.458C1121.14 161.996 1121.52 161.63 1121.99 161.64C1122.45 161.65 1122.81 162.034 1122.8 162.496L1122.74 165.239C1122.71 166.578 1121.98 167.804 1120.82 168.474L1112.18 173.462C1111 174.147 1109.53 174.147 1108.35 173.462L1099.75 168.497C1098.56 167.812 1097.83 166.545 1097.83 165.174V155.244C1097.83 153.874 1098.56 152.607 1099.75 151.921L1108.35 146.956ZM1113.82 157.183C1114.22 156.951 1114.74 157.088 1114.97 157.489C1115.2 157.888 1115.06 158.401 1114.66 158.632L1113.34 159.4L1111.1 160.692V166.348C1111.1 166.81 1110.73 167.185 1110.27 167.185C1109.8 167.185 1109.43 166.81 1109.43 166.348V160.692L1107.2 159.4L1105.87 158.632C1105.47 158.401 1105.33 157.888 1105.57 157.489C1105.8 157.089 1106.31 156.952 1106.71 157.183L1108.04 157.95L1110.27 159.241L1112.5 157.95L1113.82 157.183Z";

const SPARKLE_PATH =
  "M1119.74 150.867C1119.83 150.591 1120.22 150.591 1120.31 150.867L1121.22 153.636C1121.25 153.726 1121.32 153.797 1121.41 153.827L1124.18 154.738C1124.45 154.828 1124.45 155.217 1124.18 155.308L1121.41 156.218C1121.32 156.248 1121.25 156.319 1121.22 156.41L1120.31 159.179C1120.22 159.454 1119.83 159.454 1119.74 159.179L1118.83 156.41C1118.8 156.319 1118.73 156.248 1118.64 156.218L1115.87 155.308C1115.59 155.217 1115.59 154.828 1115.87 154.738L1118.64 153.827C1118.73 153.797 1118.8 153.726 1118.83 153.636L1119.74 150.867Z";

interface Props {
  className?: string;
  /** SMIL begin reference - highlight fires when this triggers (default: "0s") */
  beginRef?: string;
}

export default function OutputIcon({ className, beginRef = "0s" }: Props) {
  const reduced = useReducedMotion();
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  const blurId = `${id}-blur`;
  const gradGlow = `${id}-glow`;
  const gradHex = `${id}-hex`;
  const gradSparkle = `${id}-sparkle`;
  const gradLine = `${id}-line`;
  const activated = reduced || beginRef !== "0s";

  return (
    <g className={className} opacity={reduced ? 1 : 0.3}>
      {!reduced && activated && (
        <animate
          attributeName="opacity"
          values="0.3;1;1;0.3"
          keyTimes="0;0.1;0.9;1"
          dur="2.5s"
          begin={beginRef}
          repeatCount="1"
          fill="freeze"
        />
      )}
      <defs>
        <filter
          id={blurId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <linearGradient
          id={gradGlow}
          x1="1093.53"
          y1="138.344"
          x2="1131.16"
          y2="184.281"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#42B6FF" />
          <stop offset={1} stopColor="#2BE8AA" />
        </linearGradient>
        <linearGradient
          id={gradHex}
          x1="1103.57"
          y1="147.512"
          x2="1122.79"
          y2="170.629"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#01BEB3" />
          <stop offset={1} stopColor="#01C48D" />
        </linearGradient>
        <linearGradient
          id={gradSparkle}
          x1="1119.19"
          y1="152.192"
          x2="1122.81"
          y2="156.936"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#01BEB3" />
          <stop offset={1} stopColor="#01C48D" />
        </linearGradient>
        <linearGradient
          id={gradLine}
          x1="981.812"
          y1="157.116"
          x2="1210.17"
          y2="320.277"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00BEB4" />
          <stop offset={0.768299} stopColor="#00BEB4" stopOpacity={0.472859} />
          <stop offset={1} stopColor="#00BEB4" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Blurred glow background */}
      <g filter={`url(#${blurId})`}>
        <rect
          x={1085}
          y={132}
          width={56}
          height={56}
          rx={2}
          fill={`url(#${gradGlow})`}
          fillOpacity={0.6}
        />
      </g>

      {/* Dark inner rect */}
      <rect x={1090} y={136} width={48} height={48} rx={2} fill="#161618" />

      {/* Hexagon icon */}
      <path d={HEX_PATH} fill={`url(#${gradHex})`} />

      {/* Sparkle */}
      <path d={SPARKLE_PATH} fill={`url(#${gradSparkle})`} />

      {/* Label */}
      <text
        x={1115}
        y={210}
        fill="#B2B5B7"
        fontSize={12}
        fontFamily="Inter, Poppins, sans-serif"
        textAnchor="middle"
      >
        AI agents
      </text>
    </g>
  );
}
