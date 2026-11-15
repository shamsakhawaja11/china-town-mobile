import { colors } from './colors';

// Shadows are tinted with the warm brown text color, not pure black,
// so they blend into the cream background. 8-digit hex = color + alpha.
export const shadows = {
  // Resting inputs and outline buttons
  soft: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 8,
        color: `${colors.textPrimary}14`, // ~8% opacity
      },
    ],
  },
  // Cards (menu items, restaurant cards)
  card: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 16,
        color: `${colors.textPrimary}1A`, // ~10% opacity
      },
    ],
  },
  // Red glow under the primary button
  glow: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 6,
        blurRadius: 16,
        color: `${colors.primary}59`, // ~35% opacity
      },
    ],
  },
};