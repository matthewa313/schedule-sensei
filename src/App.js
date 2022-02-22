import React from 'react';
//import logo from './logo.svg';
import './App.css';

import { AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Step,
  Stepper,
  StepLabel,
} from '@mui/material';

import { ThemeProvider, useTheme } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { Help, Info } from '@mui/icons-material';
import { red, blue } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';

import SelectCourses from './steps/SelectCourses.jsx';
import SelectOffs from './steps/SelectOffs.jsx';
import SelectTeachers from './steps/SelectTeachers.jsx';
import GeneratedSchedules from './steps/GeneratedSchedules.jsx';
import AboutModal from './modals/AboutModal.jsx';
import HelpModal from './modals/HelpModal.jsx';

const creekTheme = createTheme({
  palette: {
    primary: blue,
    secondary: red,
  }
})

const useStyles = makeStyles((creekTheme) => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    display: 'flex',
    marginBottom: useTheme().spacing(4),
  },
  backButton: {
    marginRight: useTheme().spacing(1),
  },
  nextButtonWrapper: {
    position: 'relative',
  },
  nextButtonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

function getContent(stepIndex) {
  switch (stepIndex) {
  case 0:
    return ( <SelectCourses/> );
  case 1:
    return ( <SelectOffs/> );
  case 2:
    return ( <SelectTeachers/> );
  case 3:
    return ( <GeneratedSchedules/> );
  default:
    return 'na';
  }
}

function App() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const steps = ['Courses', 'Offs', 'Teachers'];

  const [isAboutModalOpen, setAboutModalOpen] = React.useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = React.useState(false);
  const handleAboutModalOpen = () => setAboutModalOpen(true);
  const handleAboutModalClose = () => setAboutModalOpen(false);
  const handleHelpModalOpen = () => setHelpModalOpen(true);
  const handleHelpModalClose = () => setHelpModalOpen(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // is going to the next page disabled?
  const isNextDisabled = () => {
    return false; // boilerplate, needs to be extended later
  };


  return (
    <div className='App'>
      <ThemeProvider theme={creekTheme}>

        {/* AppBar container */}
        <AppBar position='static'>
          <Toolbar>
            <IconButton onClick={handleHelpModalOpen} color='inherit'>
              <Help />
            </IconButton>
            <Typography style={{fontWeight: 'bold'}} variant='h4' className={classes.title}>
              Schedule Sensei
            </Typography>
            <IconButton color='inherit'>
              <Info onClick={handleAboutModalOpen} />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Modals */}
        <HelpModal
          isOpen={isHelpModalOpen}
          handleClose={handleHelpModalClose}
        />

        <AboutModal
          isOpen={isAboutModalOpen}
          handleClose={handleAboutModalClose}
        />

        {/* Steps container */}
        <Container maxWidth='sm'>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>

        {/* Content container */}
        <Container maxWidth={activeStep === steps.length ? 'xl' : 'sm'}>
          {getContent(activeStep)}
        </Container>

        {/* Button container */}
        <Container maxWidth='sm'>
          <div className={classes.buttonWrapper}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length ? (
              <Button onClick={handleReset}>
                Start Over
              </Button>
            ) : (
              <div className={classes.nextButtonWrapper}>
                <Button disabled={isNextDisabled()} onClick={handleNext} variant='contained' color='primary'>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
                {loading && <CircularProgress className={classes.nextButtonProgress} size={24} />}
              </div>
            )
            }
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
