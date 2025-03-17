import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// 自定义主题
const theme = createTheme({
  palette: {
    primary: { main: '#4CAF50' },
    secondary: { main: '#ff4081' }
  },
  typography: {
    fontFamily: 'Arial, sans-serif'
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);