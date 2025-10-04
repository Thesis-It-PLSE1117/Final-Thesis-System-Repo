export const SPACING_SCALE = {
  section: {
    vertical: 'py-24',
    horizontal: 'px-6 md:px-12 lg:px-16',
    maxWidth: 'max-w-7xl'
  },
  
  container: {
    desktop: '60px',
    tablet: '40px', 
    mobile: '24px',
    gutter: '24px'
  },
  
  margin: {
    xl: 'mb-12',
    lg: 'mb-8',
    md: 'mb-6',
    sm: 'mb-4',
    xs: 'mb-2'
  },
  
  gap: {
    xl: 'gap-8',
    lg: 'gap-6',
    md: 'gap-4',
    sm: 'gap-3',
    xs: 'gap-2'
  },
  
  padding: {
    xl: 'p-8',
    lg: 'p-6',
    md: 'p-4',
    sm: 'p-3',
    xs: 'p-2',
    button: {
      lg: 'px-8 py-4',
      md: 'px-6 py-3',
      sm: 'px-4 py-2'
    }
  }
};

export const TYPOGRAPHY_SCALE = {
  desktop: {
    h1: 'text-5xl font-bold leading-tight',
    h2: 'text-4xl font-bold leading-tight',
    h3: 'text-3xl font-semibold leading-snug',
    h4: 'text-2xl font-semibold leading-snug',
    h5: 'text-xl font-semibold leading-normal',
    h6: 'text-lg font-semibold leading-normal',
    body: 'text-base font-normal leading-relaxed',
    bodyLarge: 'text-lg font-normal leading-relaxed',
    caption: 'text-sm font-medium leading-normal',
    small: 'text-xs font-normal leading-normal'
  },
  
  mobile: {
    h1: 'text-4xl font-bold leading-tight',
    h2: 'text-3xl font-bold leading-tight',
    h3: 'text-2xl font-semibold leading-snug',
    h4: 'text-xl font-semibold leading-snug',
    h5: 'text-lg font-semibold leading-normal',
    h6: 'text-base font-semibold leading-normal',
    body: 'text-base font-normal leading-relaxed',
    bodyLarge: 'text-lg font-normal leading-relaxed',
    caption: 'text-sm font-medium leading-normal',
    small: 'text-xs font-normal leading-normal'
  },
  
  weights: {
    bold: 'font-bold',
    semibold: 'font-semibold',
    medium: 'font-medium',
    normal: 'font-normal'
  },
  
  lineHeight: {
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  }
};

export const FONT_CONFIG = {
  family: 'font-sans',
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem'
  },
  lineHeights: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em'
  },
  features: {
    tabularNums: 'font-variant-numeric: tabular-nums',
    alternates: "font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'"
  },
  optimization: {
    antialiased: 'antialiased',
    subpixelAntialiased: 'subpixel-antialiased'
  }
};

export const COLOR_SYSTEM = {
  primary: {
    dark: '#267b79',
    medium: '#319694',
    light: '#4fd1c5'
  },
  
  backgrounds: {
    gradient: {
      primary: 'bg-gradient-to-r from-[#319694] to-[#4fd1c5]',
      primaryHover: 'hover:from-[#267b79] hover:to-[#319694]',
      surface: 'bg-gradient-to-br from-[#f0fdfa] to-[#e0f7f6]',
      hero: 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    },
    solid: {
      white: 'bg-white',
      surface: 'bg-white/90'
    }
  },
  
  text: {
    primary: 'text-[#267b79]',
    secondary: 'text-[#319694]',
    accent: 'text-[#4fd1c5]',
    dark: 'text-gray-900',
    body: 'text-gray-700',
    muted: 'text-gray-600',
    light: 'text-gray-500',
    white: 'text-white'
  },
  
  borders: {
    primary: 'border-[#319694]/20',
    primaryStrong: 'border-2 border-[#267b79]/20',
    light: 'border-white/20'
  }
};

export const ANIMATION_TIMING = {
  durations: {
    instant: 200,
    fast: 300,
    normal: 600,
    slow: 800
  },
  
  delays: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.4,
    extraLong: 0.6
  },
  
  stagger: {
    fast: 0.1,
    normal: 0.2,
    slow: 0.3
  },
  
  easings: {
    default: 'easeInOut',
    smooth: 'easeOut',
    bounce: 'spring'
  }
};

export const SHADOW_SCALE = {
  small: 'shadow-sm',
  medium: 'shadow-md',
  large: 'shadow-lg',
  xl: 'shadow-xl',
  xxl: 'shadow-2xl',
  
  hover: {
    medium: 'hover:shadow-lg',
    large: 'hover:shadow-xl',
    xl: 'hover:shadow-2xl'
  }
};

export const BORDER_RADIUS = {
  default: 'rounded-xl',
  large: 'rounded-2xl',
  full: 'rounded-full'
};

export const INTERACTION_STATES = {
  scale: {
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
    subtle: { scale: 1.02 }
  },
  
  boxShadow: {
    primary: '0 20px 40px -10px rgba(49, 150, 148, 0.4)',
    secondary: '0 20px 40px -10px rgba(49, 150, 148, 0.2)',
    light: '0 10px 25px -5px rgba(49, 150, 148, 0.3)'
  }
};

export const VIEWPORT_CONFIG = {
  once: { once: true },
  repeat: { once: false }
};
