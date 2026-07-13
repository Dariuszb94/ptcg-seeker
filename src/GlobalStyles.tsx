import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* Typography */
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    --base-line-height: 1.6;
    --fw-regular: 400;

    /* Colors */
    --bg-1: #0f1724;
    --bg-2: #111827;
    --surface: rgba(26, 26, 46, 0.85);
    --text-primary: #f8f9fa;
    --text-secondary: #d1d5db;
    --text-muted: #9ca3af;
    --accent: #646cff;
    --accent-2: #764ba2;
    --positive: #4caf50;
    --danger: #ff6b6b;
    --glass: rgba(255, 255, 255, 0.04);

    /* Layout */
    --radius-sm: 6px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --shadow-sm: 0 4px 12px rgba(2, 6, 23, 0.6);
    --shadow-lg: 0 12px 40px rgba(100, 108, 255, 0.18);

    font-family: var(--font-sans);
    line-height: var(--base-line-height);
    font-weight: var(--fw-regular);

    color-scheme: dark;
    color: var(--text-primary);
    background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
    background-attachment: fixed;
  }

  #root {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
    color: var(--text-primary);
  }

  h2,
  h3 {
    color: var(--text-primary);
  }

  a {
    font-weight: 500;
    color: var(--accent);
    text-decoration: inherit;
    
    &:hover {
      color: #535bf2;
    }
  }

  button {
    border-radius: var(--radius-sm);
    border: none;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: var(--surface);
    cursor: pointer;
    transition: transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
    box-shadow: var(--shadow-sm);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:focus-visible {
      outline: 3px solid rgba(100, 108, 255, 0.6);
      outline-offset: 3px;
    }
  }

  *:focus-visible {
    outline: 3px solid rgba(100, 108, 255, 0.6);
    outline-offset: 3px;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    a:nth-of-type(2) .logo {
      animation: logo-spin infinite 20s linear;
    }
  }
`;
