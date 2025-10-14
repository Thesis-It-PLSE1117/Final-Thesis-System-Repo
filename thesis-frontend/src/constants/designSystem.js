export const SPACING_SCALE = {
  section: {
    vertical: "py-16 md:py-20",
    horizontal: "px-4 md:px-8 lg:px-12",
    maxWidth: "max-w-7xl",
  },

  container: {
    desktop: "48px",
    tablet: "32px",
    mobile: "16px",
    gutter: "20px",
  },

  margin: {
    xl: "mb-10", // Reduced from mb-12
    lg: "mb-6", // Reduced from mb-8
    md: "mb-4", // Same
    sm: "mb-3", // Reduced from mb-4
    xs: "mb-2", // Same
  },

  gap: {
    xl: "gap-6", // Reduced from gap-8
    lg: "gap-4", // Reduced from gap-6
    md: "gap-3", // Reduced from gap-4
    sm: "gap-2", // Reduced from gap-3
    xs: "gap-1.5", // Reduced from gap-2
  },

  padding: {
    xl: "p-6", // Reduced from p-8
    lg: "p-5", // Reduced from p-6
    md: "p-4", // Same
    sm: "p-3", // Same
    xs: "p-2", // Same
    button: {
      lg: "px-6 py-3", // Reduced from px-8 py-4
      md: "px-5 py-2.5", // Reduced from px-6 py-3
      sm: "px-4 py-2", // Same
    },
  },
};

export const TYPOGRAPHY_SCALE = {
  desktop: {
    h1: "text-4xl md:text-5xl font-bold leading-tight", // Responsive sizing
    h2: "text-3xl md:text-4xl font-bold leading-tight", // Reduced from text-4xl
    h3: "text-2xl md:text-3xl font-semibold leading-snug", // Reduced from text-3xl
    h4: "text-xl md:text-2xl font-semibold leading-snug", // Reduced from text-2xl
    h5: "text-lg md:text-xl font-semibold leading-normal", // Reduced from text-xl
    h6: "text-base md:text-lg font-semibold leading-normal", // Reduced from text-lg
    body: "text-sm md:text-base font-normal leading-relaxed",
    bodyLarge: "text-base md:text-lg font-normal leading-relaxed",
    caption: "text-xs md:text-sm font-medium leading-normal",
    small: "text-xs font-normal leading-normal",
  },

  mobile: {
    h1: "text-3xl font-bold leading-tight", // Reduced from text-4xl
    h2: "text-2xl font-bold leading-tight", // Reduced from text-3xl
    h3: "text-xl font-semibold leading-snug", // Reduced from text-2xl
    h4: "text-lg font-semibold leading-snug", // Reduced from text-xl
    h5: "text-base font-semibold leading-normal", // Reduced from text-lg
    h6: "text-sm font-semibold leading-normal", // Reduced from text-base
    body: "text-sm font-normal leading-relaxed",
    bodyLarge: "text-base font-normal leading-relaxed",
    caption: "text-xs font-medium leading-normal",
    small: "text-xs font-normal leading-normal",
  },

  weights: {
    bold: "font-bold",
    semibold: "font-semibold",
    medium: "font-medium",
    normal: "font-normal",
  },

  lineHeight: {
    tight: "leading-tight",
    snug: "leading-snug",
    normal: "leading-normal",
    relaxed: "leading-relaxed",
    loose: "leading-loose",
  },
};

// ICON SIZES - Standardized icon dimensions
export const ICON_SIZES = {
  xs: 14,
  sm: 16,
  md: 18, // Reduced from 20
  lg: 20, // Reduced from 24
  xl: 24, // Reduced from 32
  xxl: 32, // Reduced from 40
};

// FONT CONFIGURATION - Typography settings
export const FONT_CONFIG = {
  family: "font-sans",
  sizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },
  lineHeights: {
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
  },
  features: {
    tabularNums: "font-variant-numeric: tabular-nums",
    alternates: "font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'",
  },
  optimization: {
    antialiased: "antialiased",
    subpixelAntialiased: "subpixel-antialiased",
  },
};

export const COLOR_SYSTEM = {
  primary: {
    dark: "#267b79",
    medium: "#319694",
    light: "#4fd1c5",
  },

  backgrounds: {
    gradient: {
      primary: "bg-gradient-to-r from-[#319694] to-[#4fd1c5]",
      primaryHover: "hover:from-[#267b79] hover:to-[#319694]",
      surface: "bg-gradient-to-br from-[#f0fdfa] to-[#e0f7f6]",
      hero: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
    },
    solid: {
      white: "bg-white",
      surface: "bg-white/90",
    },
  },

  text: {
    primary: "text-[#267b79]",
    secondary: "text-[#319694]",
    accent: "text-[#4fd1c5]",
    dark: "text-gray-900",
    body: "text-gray-700",
    muted: "text-gray-600",
    light: "text-gray-500",
    white: "text-white",
  },

  borders: {
    primary: "border-[#319694]/20",
    primaryStrong: "border-2 border-[#267b79]/20",
    light: "border-white/20",
  },
};

export const ANIMATION_TIMING = {
  durations: {
    instant: 150, // Reduced from 200
    fast: 250, // Reduced from 300
    normal: 400, // Reduced from 600
    slow: 600, // Reduced from 800
  },

  delays: {
    none: 0,
    short: 0.05, // Reduced from 0.1
    medium: 0.15, // Reduced from 0.2
    long: 0.3, // Reduced from 0.4
    extraLong: 0.5, // Reduced from 0.6
  },

  stagger: {
    fast: 0.05, // Reduced from 0.1
    normal: 0.1, // Reduced from 0.2
    slow: 0.2, // Reduced from 0.3
  },

  easings: {
    default: "easeInOut",
    smooth: "easeOut",
    bounce: "spring",
  },
};

// SHADOW SCALE - Elevation system
export const SHADOW_SCALE = {
  small: "shadow-sm",
  medium: "shadow-md",
  large: "shadow-lg",
  xl: "shadow-xl",
  xxl: "shadow-2xl",

  hover: {
    medium: "hover:shadow-lg",
    large: "hover:shadow-xl",
    xl: "hover:shadow-2xl",
  },
};

// BORDER RADIUS - Rounded corners
export const BORDER_RADIUS = {
  sm: "rounded-lg", // Added for smaller elements
  default: "rounded-xl",
  large: "rounded-2xl",
  full: "rounded-full",
};

export const INTERACTION_STATES = {
  scale: {
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
    subtle: { scale: 1.01 },
  },

  boxShadow: {
    primary: "0 15px 35px -8px rgba(49, 150, 148, 0.35)", // Reduced spread
    secondary: "0 15px 35px -8px rgba(49, 150, 148, 0.18)", // Reduced spread
    light: "0 8px 20px -4px rgba(49, 150, 148, 0.25)", // Reduced spread
  },
};

export const VIEWPORT_CONFIG = {
  once: { once: true },
  repeat: { once: false },
};

export const INPUT_SIZES = {
  sm: {
    padding: "px-3 py-1.5",
    text: "text-sm",
    icon: ICON_SIZES.sm,
  },
  md: {
    padding: "px-4 py-2.5",
    text: "text-base",
    icon: ICON_SIZES.md,
  },
  lg: {
    padding: "px-5 py-3",
    text: "text-lg",
    icon: ICON_SIZES.lg,
  },
};

export const CARD_SIZES = {
  compact: "p-3",
  default: "p-4", // Reduced from p-5
  comfortable: "p-5", // Reduced from p-6
  spacious: "p-6", // Reduced from p-8
};

export const MODAL_SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
};
