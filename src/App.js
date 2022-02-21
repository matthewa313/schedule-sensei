import React from 'react';
//import logo from './logo.svg';
import './App.css';

import { AppBar,
  Typography,
  Toolbar,
  ThemeProvider,
  Container
} from '@mui/material';

import { createTheme } from '@mui/material/styles';
import { red, blue } from '@mui/material/colors';

const creekTheme = createTheme({
  palette: {
    primary: blue,
    secondary: red,
  }
})

function App() {
  return (
    <ThemeProvider theme={creekTheme}>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography style={{fontWeight: "bold"}} variant="h5">
              Schedule Sensei
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
