import { useId } from "react";

import "./BrainAnimation.css";

export interface BrainAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible label for screen readers. Defaults to "Animated cube and stack". */
  "aria-label"?: string;
}

/**
 * BrainAnimation
 *
 * Renders the composition from `src/assets/svg/brain.svg` as an animated
 * React component:
 *  - Top: a CSS 3D cube that slowly rotates on the Y axis.
 *  - Bottom: the 3 stacked isometric cubes from the original SVG, each
 *    animated with a compress-and-bounce (spring) effect with a slight
 *    staggered delay so the stack appears to ripple.
 *  - A small teal connector dot between the cube and the stack.
 *
 * The SVG paths and gradient definitions are preserved verbatim from the
 * source file; only the brain-head paths at the top are removed (replaced
 * by the CSS cube). Gradient IDs are namespaced via useId so multiple
 * instances can coexist on the same page.
 */
function BrainAnimation({
  className,
  "aria-label": ariaLabel = "Animated cube and stack",
  ...rest
}: BrainAnimationProps) {
  const uid = useId().replace(/[:]/g, "");

  const radBottom = `${uid}paint0`; // paint0_radial_4527_5767
  const linBottomStroke = `${uid}paint1`; // paint1_linear_4527_5767
  const linMiddle = `${uid}paint2`; // paint2_linear_4527_5767
  const radTop = `${uid}paint3`; // paint3_radial_4527_5767
  const linTopStroke = `${uid}paint4`; // paint4_linear_4527_5767
  const linDot = `${uid}paint5`; // paint5_linear_4527_5767
  const linBeam = `${uid}paint6`; // paint6_linear_4527_5767 (light cone above the dot)

  return (
    <div
      className={["brain-animation", className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
      role="img"
      {...rest}
    >
      {/* Top: CSS 3D rotating cube (replaces the original brain-head art).
          Wrapped in a frame that matches the SVG's rendered area so the cube
          stays aligned with the light cone regardless of container size. */}
      <div className="brain-svg-frame" aria-hidden="true">
        <div className="brain-cube-stage">
          <div className="brain-cube">
            <div className="cube-face cube-front"></div>
            <div className="cube-face cube-back "></div>
            <div className="cube-face cube-right"></div>
            <div className="cube-face cube-left flex items-center justify-center">
              <p className="-rotate-45 text-center font-bold text-base text-[rgb(var(--ragflow-color-primary))]">
                Company <br /> brain
              </p>
            </div>
            <div className="cube-face cube-top" />
            <div className="cube-face cube-bottom" />
          </div>
        </div>
      </div>

      {/* Bottom: SVG with 3 stacked isometric cubes + connector dot. */}
      <svg
        className="brain-svg"
        viewBox="-40 -145 250 555"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Bottom cube body fill - radial white highlight. */}
          <radialGradient
            id={radBottom}
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(169 -0.000161844 -51.5723 117.428 0 277)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.4" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Bottom cube stroke - subtle white edge. */}
          <linearGradient
            id={linBottomStroke}
            x1="0"
            y1="277"
            x2="112.026"
            y2="352.997"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#EEEDED" stopOpacity="0.5" />
          </linearGradient>

          {/* Middle cube body - the bright teal/green gradient (focal layer). */}
          <linearGradient
            id={linMiddle}
            x1="21.5"
            y1="224.5"
            x2="126.75"
            y2="281.25"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#01BEB4" />
            <stop offset="1" stopColor="#42FFA4" />
          </linearGradient>

          {/* Top cube body fill - radial white highlight. */}
          <radialGradient
            id={radTop}
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(169 -0.000161844 -51.5723 117.428 0 201)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.4" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Top cube stroke. */}
          <linearGradient
            id={linTopStroke}
            x1="0"
            y1="201"
            x2="112.026"
            y2="276.997"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#EEEDED" stopOpacity="0.5" />
          </linearGradient>

          {/* Connector dot. */}
          <linearGradient
            id={linDot}
            x1="82.8333"
            y1="172.055"
            x2="87.8889"
            y2="178.667"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#01BEB3" />
            <stop offset="1" stopColor="#3FFCA5" />
          </linearGradient>

          {/* Light cone above the dot - widens upward toward the cube. */}
          <linearGradient
            id={linBeam}
            x1="46.875"
            y1="77.9102"
            x2="134.49"
            y2="139.974"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#82FFF8" />
            <stop offset="1" stopColor="#2BFFB9" />
          </linearGradient>
        </defs>
        <g transform="translate(84 176) scale(1.5) translate(-84 -176)">
          {/* Bottom cube (drawn first so the others stack on top of it). */}
          <g className="box box-3" transform="scale(1)">
            <path
              d="M5.68746 280.466C3.11016 278.896 3.1346 275.145 5.73217 273.608L82.4631 228.205C83.7194 227.462 85.2808 227.462 86.5371 228.205L163.268 273.608C165.866 275.145 165.89 278.895 163.313 280.466L86.5818 327.231C85.3033 328.01 83.6968 328.01 82.4184 327.231L5.68746 280.466Z"
              fill={`url(#${radBottom})`}
            />
            <path
              d="M5.4276 280.893C2.52813 279.126 2.55574 274.907 5.47801 273.178L82.2088 227.775C83.622 226.939 85.3786 226.938 86.7918 227.775L163.523 273.177C166.445 274.906 166.472 279.125 163.573 280.893L86.8422 327.658C85.404 328.535 83.5966 328.534 82.1583 327.658L5.4276 280.893Z"
              stroke={`url(#${linBottomStroke})`}
              strokeOpacity="0.6"
            />
          </g>

          {/* Middle cube (focal, brightest). */}
          <g className="box box-2">
            <path
              d="M5.68746 242.466C3.11016 240.896 3.1346 237.145 5.73217 235.608L82.4631 190.205C83.7194 189.462 85.2808 189.462 86.5371 190.205L163.268 235.608C165.866 237.145 165.89 240.895 163.313 242.466L86.5818 289.231C85.3033 290.01 83.6968 290.01 82.4184 289.231L5.68746 242.466Z"
              fill={`url(#${linMiddle})`}
            />
          </g>

          {/* Top cube. */}
          <g className="box box-1">
            <path
              d="M5.68746 204.466C3.11016 202.896 3.1346 199.145 5.73217 197.608L82.4631 152.205C83.7194 151.462 85.2808 151.462 86.5371 152.205L163.268 197.608C165.866 199.145 165.89 202.895 163.313 204.466L86.5818 251.231C85.3033 252.01 83.6968 252.01 82.4184 251.231L5.68746 204.466Z"
              fill={`url(#${radTop})`}
            />
            <path
              d="M5.4276 204.893C2.52813 203.126 2.55574 198.907 5.47801 197.178L82.2088 151.775C83.622 150.939 85.3786 150.938 86.7918 151.775L163.523 197.177C166.445 198.906 166.472 203.125 163.573 204.893L86.8422 251.658C85.404 252.535 83.5966 252.534 82.1583 251.658L5.4276 204.893Z"
              stroke={`url(#${linTopStroke})`}
              strokeOpacity="0.6"
            />
          </g>
        </g>

        {/* Connector dot between the cube and the stack. */}
        <circle cx="84" cy="176" r="7" fill={`url(#${linDot})`} />

        {/* Light cone tapering from the cube down to the dot.
            Preserved verbatim from brain.svg (paint6_linear, fill-opacity 0.2). */}
        <path
          d="M36 61C63.75 74.0078 76.66 172 76.66 172C78.5 168.5 80.6383 167.563 84 167.5C87.4688 167.435 89.5 169 91.66 172C91.66 172 105.75 74.0078 132 61L36 61Z"
          fill={`url(#${linBeam})`}
          fillOpacity="0.2"
        />
      </svg>
    </div>
  );
}

export default BrainAnimation;
