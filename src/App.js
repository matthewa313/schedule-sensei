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
    primary: {
      main: '#2979ff',
    },
    secondary: {
      main: '#f44336'
    },
  }
})

const useStyles = makeStyles((creekTheme) => ({
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
    marginTop: 12,
    marginLeft: 12,
  },
  stepper: {
    marginTop: useTheme().spacing(3),
    marginBottom: useTheme().spacing(3),
  },
  contentContainer: {
    marginBottom: useTheme().spacing(3),
  }
}));

function App() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const steps = ['Courses', 'Offs', 'Teachers'];

  // Specific to school/school year
  const allCourses = require('./files/creekSchedule2122.json');
  const numberOfPeriods = 8;
  const requiredOffOverrideOptions = [
    ['Lunch during 4th, 5th, or 6th', [4,5,6] ],
    ['Lunch during 4th or 6th (Fr/So)', [4,6] ],
    ['Lunch during 5th only (Jr/Sr)', [5] ],
    ['No lunch periods', [] ],
  ]
  const numOverrideOptions = requiredOffOverrideOptions.length;

  const [newCourse, setNewCourse] = React.useState();
  const [selectedCourses, setSelectedCourses] = React.useState([]);

  const [selectedOffs, setSelectedOffs] = React.useState(Array(numberOfPeriods).fill(false));
  const [requiredOffOverride, setRequiredOffOverride] = React.useState(
    Array(1).fill(true).concat(
      Array(numOverrideOptions-1).fill(false)
    )
  );
  {/* Automatically set the first element of the required off over array to true */}

  const [isAboutModalOpen, setAboutModalOpen] = React.useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = React.useState(true);
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

  const handleChangeCourse = (event, value) => {
    setNewCourse(value);
  };

  const handleSelectCourse = () => {
    if (newCourse != null && !selectedCourses.some((course) => course.name === newCourse.name)) {
      setSelectedCourses(selectedCourses.concat(newCourse));
    }
  };

  const handleDeleteCourse = (removeCourse) => {
    setSelectedCourses(selectedCourses.filter((course) => course.name !== removeCourse.name));
  };

  const selectsOff = (period) => selectedOffs[period - 1];

  const handleChangeOffs = (event) => {
    let offs = [...selectedOffs];
    offs[event.target.name] = event.target.checked;
    setSelectedOffs(offs);
  };

  const handleChangeOffOverride = (event) => {
    let overrides = Array(numOverrideOptions).fill(false);
    overrides[event.target.name] = event.target.checked;
    setRequiredOffOverride(overrides);
    console.log(requiredOffOverride);
  };

  // is going to the next page disabled?
  const isNextDisabled = () => {
    return false; // boilerplate, needs to be extended later
  };

  const getContent = (stepIndex) => {
    switch (stepIndex) {
    case 0:
      return ( <SelectCourses
        courseOptions={allCourses}
        selectedCourses={selectedCourses}
        onChange={handleChangeCourse}
        onSelect={handleSelectCourse}
        onDelete={handleDeleteCourse}
      /> );
    case 1:
      return ( <SelectOffs
        periods={selectedOffs}
        onChange={handleChangeOffs}
        requiredOffOverride={requiredOffOverride}
        requiredOffOverrideOptions={requiredOffOverrideOptions}
        onChangeOverride={handleChangeOffOverride}
      /> );
    case 2:
      return ( <SelectTeachers/> );
    case 3:
      return ( <GeneratedSchedules/> );
    default:
      return 'na';
    }
  }


  return (
    <div className='App'>
      <ThemeProvider theme={creekTheme}>

        {/* AppBar container */}
        <AppBar position='static'>
          <Toolbar>
            <IconButton onClick={handleHelpModalOpen} color='inherit'>
              <Help />
            </IconButton>
            <Typography style={{fontFamily: 'Kaushan Script'}} className='title' variant='h4'>
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
          institutionShortName={process.env.REACT_APP_INSTITUTION_SHORT_NAME}
        />

        <AboutModal
          isOpen={isAboutModalOpen}
          handleClose={handleAboutModalClose}
        />

        {/* Steps container */}
        <Container maxWidth='sm'>
          <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>

        {/* Content container */}
        <Container maxWidth={activeStep === steps.length ? 'xl' : 'sm'} className={classes.contentContainer}>
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
