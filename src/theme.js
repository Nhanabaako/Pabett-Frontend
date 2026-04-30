import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:   { main: '#2BB5A8', dark: '#1F9A8E', light: '#4FCFC2', contrastText: '#fff' },
    secondary: { main: '#1E2D4F', dark: '#141f38', light: '#3A4B70', contrastText: '#fff' },
    background:{ default: '#FFFFFF', paper: '#FFFFFF' },
    text:      { primary: '#1E2D4F', secondary: '#7E8AA8' },
    divider:   '#D6E5E2',
    error:     { main: '#f44336' },
    success:   { main: '#4caf50' },
    warning:   { main: '#ff9800' },
    info:      { main: '#2BB5A8' },
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, letterSpacing: '-0.03em' },
    h2: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, letterSpacing: '-0.025em' },
    h3: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, letterSpacing: '-0.02em' },
    h4: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, letterSpacing: '-0.015em' },
    h5: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 },
    h6: { fontFamily: "'Inter', sans-serif",         fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontFamily: "'Inter', sans-serif", fontWeight: 600 },
    subtitle2: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' },
    body1:     { fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', lineHeight: 1.6 },
    body2:     { fontFamily: "'Inter', sans-serif", fontSize: '0.875rem',  lineHeight: 1.55 },
    caption:   { fontFamily: "'Inter', sans-serif", fontSize: '0.75rem',   color: '#7E8AA8' },
    button:    { fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none' },
  },

  shape: { borderRadius: 10 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': { boxSizing: 'border-box' },
        body: {
          margin: 0,
          padding: 0,
          background: '#FFFFFF',
          color: '#1E2D4F',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::-webkit-scrollbar': { width: 6 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': { background: '#D6E5E2', borderRadius: 999 },
        '::-webkit-scrollbar-thumb:hover': { background: '#7E8AA8' },
        a: { color: 'inherit', textDecoration: 'none' },
        img: { maxWidth: '100%', display: 'block' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2BB5A8 0%, #1F9A8E 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #1F9A8E 0%, #178078 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #D6E5E2',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'Inter', sans-serif", fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': { borderColor: '#2BB5A8' },
            '&.Mui-focused fieldset': { borderColor: '#2BB5A8' },
          },
          '& label.Mui-focused': { color: '#2BB5A8' },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 999 } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#D6E5E2' } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none', borderBottom: '1px solid #D6E5E2' },
      },
    },
  },
});

export default theme;
