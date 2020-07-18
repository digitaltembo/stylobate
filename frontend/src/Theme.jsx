// @flow
import React from 'react';

import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    secondary: {
      light: '#5ddef4',
      main: '#00acc1',
      dark: '#007c91',
      contrastText: '#000',
    },
  },
});

type Props = {
    children: React$Node
};

const Theme = ({children}: Props) => (

    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
);

export default Theme;