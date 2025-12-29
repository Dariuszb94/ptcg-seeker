export const PokemonLogo = ({ size = 40 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* Pokeball design */}
      <circle cx='50' cy='50' r='45' fill='url(#gradient1)' />
      <circle cx='50' cy='50' r='42' fill='#1a1a2e' />

      {/* Top half - red */}
      <path
        d='M 5 50 A 45 45 0 0 1 95 50 L 70 50 A 20 20 0 0 0 30 50 Z'
        fill='#FF4444'
      />

      {/* Bottom half - white */}
      <path
        d='M 5 50 A 45 45 0 0 0 95 50 L 70 50 A 20 20 0 0 1 30 50 Z'
        fill='#f0f0f0'
      />

      {/* Middle line */}
      <rect x='5' y='47' width='90' height='6' fill='#333' />

      {/* Center circle */}
      <circle cx='50' cy='50' r='15' fill='#333' />
      <circle cx='50' cy='50' r='12' fill='#f0f0f0' />
      <circle cx='50' cy='50' r='8' fill='#1a1a2e' />

      {/* Gradient definition */}
      <defs>
        <linearGradient id='gradient1' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#667eea' stopOpacity='0.3' />
          <stop offset='100%' stopColor='#764ba2' stopOpacity='0.3' />
        </linearGradient>
      </defs>
    </svg>
  );
};
