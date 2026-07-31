import { CSSProperties, ReactNode, useMemo } from 'react';

import { cn } from '@site/src/utils/twUtils';

import styles from './DualRowScrollingCards.module.scss';


export type ScrollDirection = 'left' | 'right';

export interface DualRowCardItem {
  /** Optional avatar image source. When omitted, a generated monogram is rendered. */
  avatar?: string;
  /** Display name shown next to the avatar. */
  name: string;
  /** Handle / username shown below the display name. */
  username: string;
  /** Testimonial content. Plain text or React node. */
  content: ReactNode;
}

export interface DualRowScrollRowConfig {
  /** Cards to render in this row. */
  items: DualRowCardItem[];
  /** Scroll direction for this row only. Defaults to `'left'`. */
  direction?: ScrollDirection;
  /**
   * Per-cycle duration in seconds. The cycle length is derived from the row's
   * own item count so two rows with different lengths stay in sync visually.
   * Defaults to `40`.
   */
  duration?: number;
}

export interface DualRowScrollingCardsProps {
  /** Exactly two row configurations. The first is the top row, the second the bottom row. */
  rows: [DualRowScrollRowConfig, DualRowScrollRowConfig];
  /** Width of each card. Accepts a CSS string or a number (px). */
  cardWidth?: string | number;
  /** Horizontal gap between cards. Accepts a CSS string or a number (px). */
  gap?: string | number;
  /** Vertical gap between the two rows. Accepts a CSS string or a number (px). */
  rowGap?: string | number;
  /** Whether the animation should pause on hover. Defaults to `true`. */
  pauseOnHover?: boolean;
  /** Width of the left/right edge gradient fade. Accepts a CSS string or a number (px). */
  edgeFadeWidth?: string | number;
  /** Optional extra class for the root container. */
  className?: string;
}


function toCssSize(value: string | number | undefined, fallback: string): string {
  if (value == null) return fallback;
  return typeof value === 'number' ? `${value}px` : value;
}


function getMonogram(name: string): string {
  const trimmed = (name || '').trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}


function DualRowCard({ item }: { item: DualRowCardItem }) {
  return (
    <div className={cn(styles.card, 'flex flex-col gap-3')}>
      <header className="flex items-center gap-3">
        {item.avatar ? (
          <img
            src={item.avatar}
            alt={item.name}
            className={styles.avatar}
            loading="lazy"
            draggable={false}
          />
        ) : (
          <span
            className={cn(styles.avatar, styles.avatarFallback)}
            aria-hidden="true"
          >
            {getMonogram(item.name)}
          </span>
        )}
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-semibold text-standard truncate">{item.name}</span>
          <span className="text-secondary text-sm truncate">@{item.username}</span>
        </div>
      </header>
      <div className="text-secondary leading-relaxed whitespace-pre-line">
        {item.content}
      </div>
    </div>
  );
}


function ScrollingRow({
  row,
  cssVars,
  pauseOnHover,
}: {
  row: DualRowScrollRowConfig;
  cssVars: CSSProperties;
  pauseOnHover: boolean;
}) {
  // Render the row twice so a -50% translateX produces a seamless loop.
  const cards = useMemo(
    () => row.items.map((item, index) => (
      <DualRowCard key={`card-${index}`} item={item} />
    )),
    [row.items],
  );

  return (
    <div
      className={cn(
        styles.row,
        row.direction === 'right' ? styles.rowRight : styles.rowLeft,
        pauseOnHover && styles.pauseOnHover,
      )}
      style={cssVars}
    >
      {cards}
      {cards}
    </div>
  );
}


/**
 * DualRowScrollingCards
 * ----------------------------------------------------------------------------
 * Two horizontally scrolling rows of cards. Each row's direction and duration
 * are independent. The component duplicates its children and animates
 * `translateX` from `0` to `-50%` so the loop is seamless. Left/right edges
 * are masked with a soft gradient fade.
 */
export default function DualRowScrollingCards({
  rows,
  cardWidth = '320px',
  gap = '1.5rem',
  rowGap = '1.5rem',
  pauseOnHover = true,
  edgeFadeWidth = '6rem',
  className,
}: DualRowScrollingCardsProps) {
  const cardWidthCss = toCssSize(cardWidth, '320px');
  const gapCss = toCssSize(gap, '1.5rem');
  const rowGapCss = toCssSize(rowGap, '1.5rem');
  const fadeWidthCss = toCssSize(edgeFadeWidth, '6rem');

  return (
    <div
      className={cn(styles.root, className)}
      style={{
        // Cast through unknown to keep TS happy with custom CSS properties.
        ['--drsc-card-width' as string]: cardWidthCss,
        ['--drsc-card-gap' as string]: gapCss,
        ['--drsc-row-gap' as string]: rowGapCss,
        ['--drsc-fade-width' as string]: fadeWidthCss,
      } as CSSProperties}
    >
      <ScrollingRow
        row={rows[0]}
        pauseOnHover={pauseOnHover}
        cssVars={{
          ['--drsc-row-duration' as string]: `${rows[0].duration ?? 40}s`,
        } as CSSProperties}
      />
      <ScrollingRow
        row={rows[1]}
        pauseOnHover={pauseOnHover}
        cssVars={{
          ['--drsc-row-duration' as string]: `${rows[1].duration ?? 40}s`,
        } as CSSProperties}
      />
    </div>
  );
}
