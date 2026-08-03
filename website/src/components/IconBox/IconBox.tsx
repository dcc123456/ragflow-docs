import { useId } from 'react';

type IconSize = { width: number; height: number };
type Box = { x: number; y: number; w: number; h: number };
type Background = { from: string; to: string } | string;

export interface IconBoxProps extends React.SVGAttributes<SVGGElement> {
  children?: React.ReactNode;
  text?: string;
  /** Original size of the children's content (in its own coordinate space).
   *  When provided, children are wrapped in a translate+scale so they fit
   *  inside `box`. Pass the exported `ICON_BBOX` from the icon's module. */
  iconSize?: IconSize;
  /** Box position and size in the parent SVG's coordinate space.
   *  Defaults to the DocParsing slot (top-left corner) so existing callers
   *  that don't pass it keep working unchanged. */
  box?: Box;
  /** Background fill. Pass `{ from, to }` for a linear gradient or a string
   *  for a solid color / `'none'`. Default: `{ from: '#00BEB4', to: '#42FFA4' }`. */
  background?: Background;
  /** Show a border around the box. Default: `false`. */
  bordered?: boolean;
  /** Border color (used when `bordered` is `true`). Default: `'currentColor'`. */
  borderColor?: string;
  /** Border width in SVG user units. Default: `1`. */
  borderWidth?: number;
  /** Corner radius. Default: `8`. */
  radius?: number;
  /** Text label fill. Accepts `{ from, to }` for a gradient or a string for a
   *  solid color. Defaults to the same value as `background` (gradient url
   *  or solid color) so the label visually matches the box. */
  textColor?: Background;
  /** Text font size in SVG user units. Default: `10`. */
  textSize?: number;
  /** Text font weight. Default: `600`. */
  textWeight?: number | string;
  /** Text font family. Default: `'sans-serif'`. */
  textFontFamily?: string;
  /** Distance from the box's bottom edge to the text baseline. Default: `14`. */
  textOffset?: number;
  /** Direction of the background gradient. Default: `'horizontal'`. */
  gradientDirection?: 'horizontal' | 'vertical';
}

const DEFAULT_BOX: Box = { x: 74, y: 21.4, w: 64, h: 64 };

const isGradient = (bg: Background): bg is { from: string; to: string } =>
  typeof bg === 'object' && bg !== null;

/**
 * IconBox
 *
 * A rounded rectangle "slot" that frames an SVG icon graphic and renders a
 * text label below it. Extracted from the Relation animation so it can be
 * reused across compositions with custom colors, borders, and typography.
 *
 * The box fill defaults to the original teal gradient (`#00BEB4 -> #42FFA4`)
 * and the text label uses the same fill by default - pass `textColor` to
 * decouple them. Set `bordered` to add a stroke, and pass `background='none'`
 * to render only the icon (no fill).
 *
 * Extra SVG attributes (transform, opacity, ...) are forwarded to the root
 * `<g>`, so callers can position or animate the whole slot.
 */
export default function IconBox({
  children,
  text,
  iconSize,
  box = DEFAULT_BOX,
  background = { from: '#00BEB4', to: '#42FFA4' },
  bordered = false,
  borderColor = 'currentColor',
  borderWidth = 1,
  radius = 8,
  textColor,
  textSize = 10,
  textWeight = 600,
  textFontFamily = 'sans-serif',
  textOffset = 14,
  gradientDirection = 'horizontal',
  ...restProps
}: IconBoxProps) {
  const id = useId();
  const gradientId = `${id}-bg`;
  const textGradientId = `${id}-text`;

  const bgIsGradient = isGradient(background);
  const bgFill = bgIsGradient ? `url(#${gradientId})` : background;

  const textIsGradient = textColor !== undefined && isGradient(textColor);
  const textFill =
    textColor === undefined
      ? bgFill
      : textIsGradient
        ? `url(#${textGradientId})`
        : textColor;

  // If iconSize is provided, translate children to the box origin and scale
  // them to fit the box. Children are assumed to already start at (0, 0)
  // (the generator script normalizes them via a translate).
  const content = iconSize ? (
    <g
      transform={`translate(${box.x} ${box.y}) scale(${box.w / iconSize.width} ${box.h / iconSize.height})`}
    >
      {children}
    </g>
  ) : (
    children
  );

  const gradientCoords =
    gradientDirection === 'horizontal'
      ? {
          x1: box.x,
          y1: box.y + box.h / 2,
          x2: box.x + box.w,
          y2: box.y + box.h / 2,
        }
      : {
          x1: box.x + box.w / 2,
          y1: box.y,
          x2: box.x + box.w / 2,
          y2: box.y + box.h,
        };

  // Text gradient uses objectBoundingBox units so it always spans the text's
  // own bbox, regardless of where the text sits relative to the box.
  const textGradientCoords =
    gradientDirection === 'horizontal'
      ? { x1: 0, y1: 0, x2: 1, y2: 0 }
      : { x1: 0, y1: 0, x2: 0, y2: 1 };

  return (
    <g {...restProps}>
      <defs>
        {bgIsGradient && (
          <linearGradient
            id={gradientId}
            {...gradientCoords}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={background.from} />
            <stop offset="1" stopColor={background.to} />
          </linearGradient>
        )}
        {textIsGradient && (
          <linearGradient id={textGradientId} {...textGradientCoords}>
            <stop stopColor={(textColor as { from: string; to: string }).from} />
            <stop offset="1" stopColor={(textColor as { from: string; to: string }).to} />
          </linearGradient>
        )}
      </defs>

      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={radius}
        fill={bgFill}
        stroke={bordered ? borderColor : 'none'}
        strokeWidth={bordered ? borderWidth : 0}
      />

      {content}

      {text && (
        <text
          x={box.x + box.w / 2}
          y={box.y + box.h + textOffset}
          textAnchor="middle"
          fill={textFill}
          fontSize={textSize}
          fontWeight={textWeight}
          fontFamily={textFontFamily}
        >
          {text}
        </text>
      )}
    </g>
  );
}
