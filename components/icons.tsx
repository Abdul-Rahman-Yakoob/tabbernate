const base = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const MoonIcon = () => (
  <svg {...base} strokeWidth={2.2}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const CloseIcon = () => (
  <svg {...base} strokeWidth={2.4}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
