export const AppLogo = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: 'pointer',
      }}
    >
      {/* Simple card icon */}
      <svg
        width='40'
        height='40'
        viewBox='0 0 100 100'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        {/* Stylized card with Pokeball */}
        <rect
          x='15'
          y='10'
          width='70'
          height='80'
          rx='8'
          fill='url(#cardGradient)'
          stroke='url(#borderGradient)'
          strokeWidth='2'
        />

        {/* Mini Pokeball */}
        <circle cx='50' cy='45' r='18' fill='#fff' opacity='0.9' />
        <path
          d='M 32 45 A 18 18 0 0 1 68 45 L 59 45 A 9 9 0 0 0 41 45 Z'
          fill='#FF4444'
        />
        <path
          d='M 32 45 A 18 18 0 0 0 68 45 L 59 45 A 9 9 0 0 1 41 45 Z'
          fill='#fff'
        />
        <line x1='32' y1='45' x2='68' y2='45' stroke='#333' strokeWidth='2' />
        <circle cx='50' cy='45' r='6' fill='#333' />
        <circle cx='50' cy='45' r='4' fill='#fff' />

        {/* Sparkle effect */}
        <circle cx='25' cy='25' r='2' fill='#667eea' opacity='0.8' />
        <circle cx='75' cy='75' r='2' fill='#764ba2' opacity='0.8' />
        <circle cx='70' cy='20' r='1.5' fill='#667eea' opacity='0.6' />

        <defs>
          <linearGradient id='cardGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#667eea' />
            <stop offset='100%' stopColor='#764ba2' />
          </linearGradient>
          <linearGradient
            id='borderGradient'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#fff' stopOpacity='0.8' />
            <stop offset='100%' stopColor='#fff' stopOpacity='0.4' />
          </linearGradient>
        </defs>
      </svg>

      {/* App name */}
      <div
        style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}
      >
        <span
          style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
          }}
        >
          PTCG Seeker
        </span>
        <span
          style={{
            fontSize: '0.7rem',
            color: '#a0a0c0',
            fontWeight: '500',
            letterSpacing: '0.5px',
            marginTop: '-2px',
          }}
        >
          CARD COLLECTOR
        </span>
      </div>
    </div>
  );
};
