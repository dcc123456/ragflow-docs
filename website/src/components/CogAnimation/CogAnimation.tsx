import { useId } from 'react';

export interface CogAnimationProps {
  /**
   * Outer stroke gradient stops for the cog bodies.
   * Default: { from: 'white', to: '#666666' }.
   */
  bodyColor?: { from: string; to: string };
  /**
   * Inner ring gradient stops (the two circles at the large cog's center).
   * Default: { from: '#00beb4', to: '#37f4a7' }.
   */
  innerColor?: { from: string; to: string };
  /**
   * Whether the rotation animations run. When false, the cogs render statically
   * at their initial angle. Default: true.
   */
  animated?: boolean;
  /**
   * SVG `begin` attribute - controls when the rotation starts.
   * Accepts a clock value (e.g. '0s', '2s'), an event reference
   * (e.g. 'someId.end+1s'), or 'indefinite' to pause until triggered.
   * Default: '0s'.
   */
  begin?: string;
  /**
   * Rotation duration in seconds for a full revolution. Default: 15.
   */
  duration?: number;
  /**
   * Outer transform positioning the whole assembly. Pass any SVG transform
   * string to place the cogs within your composition.
   * Default: 'translate(-12.5, 10)'.
   */
  transform?: string;
  /** Optional className applied to the root <g>. */
  className?: string;
}

/**
 * CogAnimation
 *
 * Three interlocking-style cog wheels rendered as SVG paths with rotation
 * animations. Extracted from IndexFeatureEtlAnimation so the cog system can
 * be reused across compositions.
 *
 *  - Large cog rotates clockwise; the two smaller cogs rotate
 *    counter-clockwise to mimic meshed gears.
 *  - Gradients are namespaced via useId so multiple instances can coexist.
 *  - Set `animated={false}` to render a static cog system.
 *  - Use `begin` to delay start or sync with other SVG animations.
 *
 * Note: this component renders a <g> element. Drop it inside an <svg> with
 * `fill="none"` and `strokeLinecap="round"` for the original look.
 */
function CogAnimation({
  bodyColor = { from: 'white', to: '#666666' },
  innerColor = { from: '#00beb4', to: '#37f4a7' },
  animated = true,
  begin = '0s',
  duration = 15,
  transform = 'translate(-12.5, 10)',
  className,
}: CogAnimationProps) {
  const uid = useId().replace(/[:]/g, '');
  const gradientBody = `${uid}CogBody`;
  const gradientInner = `${uid}CogInner`;
  const dur = `${duration}s`;

  return (
    <g
      transform={transform}
      stroke={`url(#${gradientBody})`}
      className={className}
    >
      <defs>
        <linearGradient id={gradientBody} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={bodyColor.from} />
          <stop offset="1" stopColor={bodyColor.to} />
        </linearGradient>
        <linearGradient id={gradientInner} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={innerColor.from} />
          <stop offset="1" stopColor={innerColor.to} />
        </linearGradient>
      </defs>

      {/* Large cog (clockwise) */}
      <g>
        <path
          strokeWidth="2"
          d="
            M4.8543 -22.186
            C1.6559 -22.8861 -1.6562 -22.8861 -4.8548 -22.186
            C-5.5041 -20.6218 -5.8953 -18.9626 -6.0129 -17.273
            C-8.1914 -16.5149 -10.2068 -15.3513 -11.9527 -13.8438
            C-13.4747 -14.5867 -15.1072 -15.0775 -16.7865 -15.2973
            C-18.9919 -12.8773 -20.6479 -10.0089 -21.641 -6.889
            C-20.6111 -5.5444 -19.3698 -4.3761 -17.9654 -3.4295
            C-18.3979 -1.1637 -18.3979 1.1635 -17.9654 3.4292
            C-19.3697 4.3759 -20.6109 5.5443 -21.641 6.8887
            C-20.6479 10.0087 -18.9919 12.877 -16.7865 15.297
            C-15.1072 15.0772 -13.4747 14.5863 -11.9527 13.8435
            C-10.2067 15.351 -8.1914 16.5146 -6.0129 17.2728
            C-5.8952 18.9623 -5.5041 20.6216 -4.8548 22.1858
            C-1.6562 22.8855 1.6558 22.8855 4.8543 22.1858
            C5.5037 20.6216 5.8949 18.9624 6.0126 17.2728
            C8.1911 16.5143 10.2065 15.3507 11.9525 13.8433
            C13.4745 14.5862 15.1069 15.0771 16.7862 15.2968
            C18.9916 12.8768 20.6476 10.0085 21.6406 6.8885
            C20.6107 5.5441 19.3694 4.3757 17.965 3.429
            C18.3976 1.1633 18.3976 -1.1639 17.965 -3.4297
            C19.3694 -4.3763 20.6108 -5.5446 21.6406 -6.8892
            C20.6476 -10.0091 18.9916 -12.8775 16.7862 -15.2975
            C15.1069 -15.0778 13.4745 -14.5869 11.9525 -13.844
            C10.2065 -15.3515 8.1911 -16.515 6.0126 -17.2732
            C5.8949 -18.9628 5.5037 -20.622 4.8543 -22.186
            Z"
        />

        <g stroke={`url(#${gradientInner})`}>
          <circle cx="0" cy="0" r="11.86645" />
          <circle cx="0" cy="0" r="9.4426" />
        </g>

        {animated && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 0 0;360 0 0"
            dur={dur}
            begin={begin}
            repeatCount="indefinite"
          />
        )}
      </g>

      {/* Right small cog (counter-clockwise) */}
      <g transform="translate(35.908, 0)">
        <path
          strokeOpacity="0.6"
          d="
            M9.60955 -10.54545
            C8.08915 -11.93075 6.28735 -12.97095 4.32755 -13.59495
            C3.48295 -12.94785 2.74895 -12.16805 2.15405 -11.28585
            C0.73075 -11.55755 -0.73115 -11.55755 -2.15445 -11.28585
            C-2.74925 -12.16805 -3.48325 -12.94785 -4.32785 -13.59495
            C-6.28775 -12.97095 -8.08955 -11.93075 -9.60995 -10.54545
            C-9.47195 -9.49045 -9.16345 -8.46485 -8.69675 -7.50865
            C-9.64385 -6.41175 -10.37485 -5.14575 -10.85135 -3.77715
            C-11.91265 -3.70305 -12.95495 -3.45725 -13.93765 -3.04945
            C-14.37725 -1.04005 -14.37725 1.04055 -13.93765 3.04995
            C-12.95495 3.45775 -11.91265 3.70355 -10.85135 3.77765
            C-10.37485 5.14615 -9.64385 6.41225 -8.69675 7.50915
            C-9.16345 8.46525 -9.47195 9.49095 -9.60995 10.54595
            C-8.08955 11.93125 -6.28775 12.97145 -4.32785 13.59545
            C-3.48315 12.94835 -2.74915 12.16855 -2.15445 11.28635
            C-0.73085 11.55795 0.73095 11.55795 2.15455 11.28635
            C2.74925 12.16855 3.48325 12.94835 4.32795 13.59545
            C6.28775 12.97145 8.08955 11.93125 9.60995 10.54595
            C9.47195 9.49095 9.16345 8.46525 8.69675 7.50915
            C9.64385 6.41225 10.37485 5.14615 10.85135 3.77765
            C11.91265 3.70355 12.95495 3.45775 13.93765 3.04995
            C14.37725 1.04055 14.37725 -1.04005 13.93765 -3.04945
            C12.95495 -3.45725 11.91265 -3.70305 10.85135 -3.77715
            C10.37485 -5.14575 9.64385 -6.41175 8.69675 -7.50865
            C9.16345 -8.46485 9.47195 -9.49045 9.60955 -10.54545
            Z
            M-6 0 a6 6 0 0 1 12 0 a6 6 0 0 1 -12 0 z"
        >
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 0;-360 0 0"
              dur={dur}
              begin={begin}
              repeatCount="indefinite"
            />
          )}
        </path>
      </g>

      {/* Top small cog (counter-clockwise) */}
      <g transform="translate(17.893, -30.513)">
        <path
          strokeOpacity="0.4"
          d="
            M12.8987 2.8224
            C13.3057 0.9629 13.3057 -0.9626 12.8987 -2.8221
            C11.9893 -3.1997 11.0247 -3.4272 10.0424 -3.4957
            C9.60155 -4.7622 8.9251 -5.9339 8.0486 -6.9489
            C8.4805 -7.8338 8.766 -8.78286 8.8936 -9.75916
            C7.4866 -11.0414 5.8189 -12.0042 4.0052 -12.5816
            C3.2236 -11.9828 2.5443 -11.2611 1.9938 -10.4447
            C0.6765 -10.6931 -0.6765 -10.6931 -1.9938 -10.4447
            C-2.5443 -11.2611 -3.2236 -11.9828 -4.0052 -12.5816
            C-5.8191 -12.0042 -7.4866 -11.0414 -8.8936 -9.75916
            C-8.7658 -8.78289 -8.4804 -7.8338 -8.0487 -6.9489
            C-8.925  -5.9338 -9.60135 -4.7622 -10.0424 -3.4957
            C-11.0246 -3.4271 -11.9892 -3.1996 -12.8986 -2.8221
            C-13.3053 -0.9626 -13.3053 0.9629 -12.8986 2.8224
            C-11.9892 3.2 -11.0246 3.4274 -10.0424 3.4957
            C-9.6014 4.7622 -8.925 5.9339 -8.0487 6.9486
            C-8.4804 7.8334 -8.7658 8.7825 -8.8936 9.7588
            C-7.4866 11.041  -5.8191 12.004  -4.0052 12.5813
            C-3.2236 11.9826  -2.5443 11.2609  -1.9938 10.4445
            C-0.6765 10.6929  0.6765 10.6929  1.9938 10.4445
            C2.5443 11.2609  3.2236 11.9826  4.0052 12.5813
            C5.8189 12.004  7.4867 11.041  8.8936 9.7588
            C8.766 8.7825  8.4805 7.8334  8.0487 6.9486
            C8.9252 5.9339  9.6016 4.7622  10.0424 3.4957
            C11.0247 3.4274  11.9893 3.2  12.8987 2.8224
            Z
            M-5 0 a5 5 0 0 1 10 0 a5 5 0 0 1 -10 0 z"
        >
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 0;-360 0 0"
              dur={dur}
              begin={begin}
              repeatCount="indefinite"
            />
          )}
        </path>
      </g>
    </g>
  );
}

export default CogAnimation;
