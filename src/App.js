import React from 'react';
//import logo from './logo.svg';
import './App.css';

import { AppBar,
  Button,
  CircularProgress,
  Container,
  Toolbar,
  Typography,
  Step,
  Stepper,
  StepLabel,
} from '@mui/material';

import { ThemeProvider, useTheme } from '@mui/material/styles'
import { createTheme } from '@mui/material';
import { red, blue } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';

import SelectCourses from './steps/SelectCourses.js';
import SelectOffs from './steps/SelectOffs.js';
import SelectTeachers from './steps/SelectTeachers.js';
import GeneratedSchedules from './steps/GeneratedSchedules.js';

const creekTheme = createTheme({
  palette: {
    primary: blue,
    secondary: red,
  }
})

const useStyles = makeStyles((creekTheme) => ({
   backButton: {
     marginRight: useTheme().spacing(1),
   },
 }));

function getContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return (
          <SelectCourses/>
        );
      case 1:
        return (
          <SelectOffs/>
        );
      case 2:
        return (
          <SelectTeachers/>
        );
      case 3:
        return (
          <GeneratedSchedules/>
        );
      default:
        return "na";
    }
  }

function App() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const steps = ["Courses", "Offs", "Teachers"];

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
    <div className="App">
      <ThemeProvider theme={creekTheme}>

        {/* AppBar container */}
        <AppBar position="static">
          <Toolbar>
            <Typography style={{fontWeight: "bold"}} variant="h5">
              Schedule Sensei
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">

        {/* Steps container */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        </Container>

        {/* Content container */}
        <Container maxWidth={activeStep === steps.length ? "xl" : "sm"}>
          {getContent(activeStep)}
        </Container>

        {/* Button container */}
        <Container maxWidth="sm">
          <div className={classes.buttonWrapper}>
            <Button className={classes.backButton} disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length ? (
              <Button onClick={handleReset}>
                Start Over
              </Button>
            ) : (
                <div className={classes.nextButtonWrapper}>
                  <Button disabled={isNextDisabled()} onClick={handleNext} variant="contained" color="primary">
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
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
