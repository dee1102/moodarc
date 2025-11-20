import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6C8CD5' },     // soft blue
    secondary: { main: '#B497D6' },   // muted lavender
    background: {
      default: '#F6F9FC',             // very light blue-gray
      paper: 'rgba(255,255,255,0.9)',
    },
    text: {
      primary: '#23314a',             // gentle deep blue for text
      secondary: '#556777',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial',
    h6: { fontWeight: 500 },
    body1: { fontSize: 16, lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 6px 18px rgba(35,49,74,0.06)',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,253,255,0.98))',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
        },
        containedPrimary: {
          backgroundColor: '#6C8CD5',
          color: '#fff',
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          padding: 12,
          background: 'linear-gradient(180deg,#ffffff,#f7fbff)',
        },
      },
    },
  },
});

export default theme;