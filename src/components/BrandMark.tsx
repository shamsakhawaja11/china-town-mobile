import React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

interface BrandMarkProps {
  size?: number;
}

const INK = colors.textPrimary;

function roofPath(
  cx: number,
  apexY: number,
  eaveY: number,
  halfWidth: number,
): string {
  const left = cx - halfWidth;
  const right = cx + halfWidth;
  const tipY = eaveY - 2;
  const inner = halfWidth * 0.35;
  const reach = halfWidth * 0.7;

  return [
    `M ${left} ${tipY}`,
    `Q ${cx - inner} ${eaveY - 1} ${cx} ${apexY}`,
    `Q ${cx + inner} ${eaveY - 1} ${right} ${tipY}`,
    `Q ${cx + reach} ${eaveY + 3} ${cx} ${eaveY + 3}`,
    `Q ${cx - reach} ${eaveY + 3} ${left} ${tipY}`,
    'Z',
  ].join(' ');
}

export function BrandMark({ size = 96 }: BrandMarkProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      accessibilityRole="image"
      accessibilityLabel="China Town logo"
    >
      <Defs>
        <ClipPath id="brandMarkClip">
          <Circle cx={50} cy={50} r={44} />
        </ClipPath>
      </Defs>

      {/* White disc with a gold ring */}
      <Circle
        cx={50}
        cy={50}
        r={47.5}
        fill={colors.white}
        stroke={colors.gold}
        strokeWidth={3}
      />

      {/* Everything inside is cut to the disc, so nothing pokes past the ring */}
      <G clipPath="url(#brandMarkClip)">
        {/* The red sun behind the pagoda */}
        <Circle cx={50} cy={46} r={30} fill={colors.primary} />

        {/* Ground: a low hill that fills the bottom of the disc */}
        <Path d="M 10 84 Q 50 52 90 84 L 90 100 L 10 100 Z" fill={INK} />

        {/* Tower bodies, top to bottom */}
        <Rect x={42} y={30} width={16} height={9} fill={INK} />
        <Rect x={39} y={46} width={22} height={10} fill={INK} />
        <Rect x={36} y={63} width={28} height={12} fill={INK} />

        {/* Roofs, top to bottom */}
        <Path d={roofPath(50, 19, 30, 14)} fill={INK} />
        <Path d={roofPath(50, 34, 46, 20)} fill={INK} />
        <Path d={roofPath(50, 51, 63, 27)} fill={INK} />

        {/* Spire */}
        <Path d="M 50 10 L 51.8 21 L 48.2 21 Z" fill={INK} />

        {/* Lit window and doorway */}
        <Rect x={48} y={50.5} width={4} height={3.5} fill={colors.gold} />
        <Rect x={47} y={66} width={6} height={10} rx={1} fill={colors.gold} />
      </G>
    </Svg>
  );
}