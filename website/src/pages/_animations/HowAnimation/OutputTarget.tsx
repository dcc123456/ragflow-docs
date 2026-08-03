import { useId } from "react";
import useReducedMotion from "@site/src/utils/useReducedMotion";
import SvgGlowFilter from "@site/src/utils/visual-effects/SvgGlowFilter";

// Output target geometry from how.svg: rounded card at x=934..998, y=160..224.
const CARD_X = 934;
const CARD_Y = 160;
const CARD_W = 64;
const CARD_H = 64;
const CARD_RX = 10.667;

// Hexagon icon path (centered near (966, 192)) — matches how.svg hexagon.
const HEX_PATH =
  "M968.35 178.956C969.53 178.271 971 178.271 972.18 178.956L976.48 181.439C976.88 181.67 977.02 182.182 976.79 182.582C976.56 182.982 976.05 183.12 975.65 182.889L971.35 180.406C970.68 180.02 969.85 180.02 969.18 180.406L960.59 185.371C959.92 185.758 959.5 186.472 959.5 187.244V197.174C959.5 197.947 959.92 198.661 960.59 199.047L969.18 204.012C969.85 204.398 970.68 204.398 971.35 204.012L979.99 199.025C980.64 198.647 981.05 197.955 981.07 197.2L981.1 195.934L981.13 194.458C981.14 193.996 981.52 193.63 981.99 193.64C982.45 193.65 982.81 194.034 982.8 194.496L982.74 197.239C982.71 198.578 981.98 199.804 980.82 200.474L972.18 205.462C971 206.147 969.53 206.147 968.35 205.462L959.75 200.497C958.56 199.812 957.83 198.545 957.83 197.174V187.244C957.83 185.873 958.56 184.606 959.75 183.921L968.35 178.956ZM973.82 189.183C974.22 188.951 974.74 189.088 974.97 189.489C975.2 189.888 975.06 190.401 974.66 190.632L973.34 191.4L971.1 192.692V198.348C971.1 198.81 970.73 199.185 970.27 199.185C969.8 199.185 969.43 198.81 969.43 198.348V192.692L967.2 191.4L965.87 190.632C965.47 190.401 965.33 189.888 965.57 189.489C965.8 189.089 966.31 188.952 966.71 189.183L968.04 189.95L970.27 191.241L972.5 189.95L973.82 189.183Z";

// Sparkle accent path — matches how.svg.
const SPARKLE_PATH =
  "M979.74 182.867C979.83 182.591 980.22 182.591 980.31 182.867L981.22 185.636C981.25 185.726 981.32 185.797 981.41 185.827L984.18 186.738C984.45 186.828 984.45 187.217 984.18 187.308L981.41 188.218C981.32 188.248 981.25 188.319 981.22 188.41L980.31 191.179C980.22 191.454 979.83 191.454 979.74 191.179L978.83 188.41C978.8 188.319 978.73 188.248 978.64 188.218L975.87 187.308C975.59 187.217 975.59 186.828 975.87 186.738L978.64 185.827C978.73 185.797 978.8 185.726 978.83 185.636L979.74 182.867Z";

interface Props {
  /** SMIL begin reference - highlight fires when the final dot arrives (default: "0s"). */
  beginRef?: string;
  /** SMIL begin reference for the fade-out at flow end (default: undefined). */
  flowEndRef?: string;
}

// Right-side output target: a rounded card with hexagon logo + sparkle +
// "AI agents" label. Dims initially, lights up when `beginRef` triggers.
export default function OutputTarget({ beginRef = "0s", flowEndRef }: Props) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const reduced = useReducedMotion();

  const filterGlow = `${id}OutGlow`;
  const filterBgGlow = `${id}OutBgGlow`;
  const gradCard = `${id}OutCard`;
  const gradHex = `${id}OutHex`;
  const gradSparkle = `${id}OutSparkle`;
  const gradNotActiveFill = `${id}OutNotActiveFill`;

  const activated = reduced || beginRef !== "0s";

  return (
    <g>
      {!reduced && activated && (
        <animate
          attributeName="opacity"
          values="0.3;1"
          keyTimes="0;1"
          dur="0.5s"
          begin={beginRef}
          repeatCount="1"
          fill="freeze"
        />
      )}
      {!reduced && activated && flowEndRef && (
        <animate
          attributeName="opacity"
          values="1;0.3"
          keyTimes="0;1"
          dur="1s"
          begin={flowEndRef}
          repeatCount="1"
          fill="freeze"
        />
      )}
      <defs>
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
        <linearGradient
          id={gradCard}
          x1={CARD_X}
          y1={CARD_Y}
          x2={CARD_X + CARD_W}
          y2={CARD_Y + CARD_H}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#42B6FF" />
          <stop offset={1} stopColor="#2BE8AA" />
        </linearGradient>
        <linearGradient
          id={gradHex}
          x1={960}
          y1={180}
          x2={980}
          y2={205}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B9F9F5" />
          <stop offset={1} stopColor="#629794" />
        </linearGradient>
        <linearGradient
          id={gradSparkle}
          x1={979}
          y1={184}
          x2={982}
          y2={189}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#01BEB3" />
          <stop offset={1} stopColor="#01C48D" />
        </linearGradient>
        <linearGradient id={gradNotActiveFill} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="rgba(33, 33, 35, 1)" />
          <stop offset={0.2} stopColor="rgba(33, 33, 35, 1)" />
          <stop offset="1" stopColor="rgba(33, 33, 35, 1)" />
        </linearGradient>
      </defs>

      {/* Blurred glow background */}
      {/* <g>
        <rect
          x={CARD_X}
          y={CARD_Y}
          width={CARD_W}
          height={CARD_H}
          rx={CARD_RX}
          fill={`url(#${gradCard})`}
          fillOpacity={0.5}
        />
      </g> */}

      {/* Card background (semi-transparent surface) */}
      {/* <rect
        x={CARD_X}
        y={CARD_Y}
        width={CARD_W}
        height={CARD_H}
        rx={CARD_RX}
        fill={`url(#${gradNotActiveFill})`}
        fillOpacity={1}
      /> */}

      {/* Card border */}
      <rect
        x={CARD_X}
        y={CARD_Y}
        width={CARD_W}
        height={CARD_H}
        rx={CARD_RX}
        fill="none"
        stroke={`rgba(107, 114, 128, 1.0)`}
        strokeOpacity={0.4}
        strokeWidth={0.5}
      />
      <g transform="translate(-295, -57) scale(1.3)">
        {/* Hexagon icon */}
        <path d={HEX_PATH} fill={`url(#${gradHex})`} />

        {/* Sparkle accent */}
        <g>
          <path d={SPARKLE_PATH} fill={`url(#${gradSparkle})`} />
          <animateTransform
            attributeName="transform"
            values="0 980 187;360 980 187"
            type="rotate"
            keyTimes="0;1"
            dur="1s"
            begin={beginRef}
            repeatCount="1"
            fill="freeze"
          />
        </g>
      </g>

      {/* Label */}
      {/* <text
        x={CARD_X + CARD_W / 2}
        y={CARD_Y + CARD_H + 22}
        fill="#B2B5B7"
        fontSize={12}
        fontFamily="Inter, Poppins, sans-serif"
        textAnchor="middle"
      >
        AI agents
      </text> */}

      {/* Highlight glow ring - fades in when flow arrives, fades out at flow end */}
      {!reduced && activated && (
        <g filter={`url(#${filterGlow})`} opacity={0}>
          <animate
            attributeName="opacity"
            values="0;0.9"
            keyTimes="0;1"
            dur="0.5s"
            begin={beginRef}
            repeatCount="1"
            fill="freeze"
          />
          {flowEndRef && (
            <animate
              attributeName="opacity"
              values="0.9;0"
              keyTimes="0;1"
              dur="1s"
              begin={flowEndRef}
              repeatCount="1"
              fill="freeze"
            />
          )}
          <rect
            x={CARD_X}
            y={CARD_Y}
            width={CARD_W}
            height={CARD_H}
            rx={CARD_RX}
            fill="none"
            stroke="#00BEB4"
            strokeWidth={1}
          />
        </g>
      )}
    </g>
  );
}
