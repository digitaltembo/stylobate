import React from 'react';
import ReactDOM from 'react-dom';

import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import './index.css';
import Routes from './Routes';
import { AuthContextWrapper } from './utils/AuthContext';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthContextWrapper>
        <Routes />
      </AuthContextWrapper>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
