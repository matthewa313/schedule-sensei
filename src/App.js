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

import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { Help, Info } from '@mui/icons-material';
import { red, blue } from '@mui/material/colors';
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

function App() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const steps = ['Courses', 'Offs', 'Teachers'];

  /* Specific to school/school year */
  const allCourses = require('./files/creekSchedule2122.json');
  const numPeriods = 8;
  const requiredOffOverrideOptions = [
    ['Lunch during 4th, 5th, or 6th', [4,5,6] ],
    ['Lunch during 4th or 6th (Fr/So)', [4,6] ],
    ['Lunch during 5th only (Jr/Sr)', [5] ],
    ['No lunch periods', [] ],
  ]
  const numOverrideOptions = requiredOffOverrideOptions.length;
  /* End of specific to school/school year */

  // variables to be passed to SelectCourses.jsx
  const [newCourse, setNewCourse] = React.useState();
  const [selectedCourses, setSelectedCourses] = React.useState([]);

  // variables to be passed to SelectOffs.jsx
  const [selectedOffs, setSelectedOffs] = React.useState(Array(numPeriods).fill(false));
  const [requiredOffOverride, setRequiredOffOverride] = React.useState(
    Array(1).fill(true).concat(
      Array(numOverrideOptions-1).fill(false)
    )
  ); // Automatically set first element of the requiredOffOverride array to true

  // variables to be passed to SelectTeachers.jsx
  const [availableTeachers, setAvailableTeachers] = React.useState('');

  // Modal variables
  const [isAboutModalOpen, setAboutModalOpen] = React.useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = React.useState(true);
  const handleAboutModalOpen = () => setAboutModalOpen(true);
  const handleAboutModalClose = () => setAboutModalOpen(false);
  const handleHelpModalOpen = () => setHelpModalOpen(true);
  const handleHelpModalClose = () => setHelpModalOpen(false);

  // Stepper handlers
  const handleNext = () => {
    if (activeStep === 0) {
      // nothing?
    } else if (activeStep === 1) {
      determineTeachersList();
    } else if (activeStep === 2) {
      // generate schedule
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const isNextDisabled = () => {
    return false; // boilerplate, needs to be extended later
  };

  // Course handlers
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

  // Offs handlers
  const selectsOff = (period) => selectedOffs[period - 1]; // will be used in teacher handling only

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

  // Teachers handlers
  const checkOffsConflictsInTeachersList = true;
  const teacherSelectionDefault = true;
  const terms = ['year', 's1', 's2']

  const determineTeachersList = () => {
    /* The teachersForCourse dictionary has keys corresponding to course with respective array values holding another dictionary of teachers for that course. */
    let teachersForCourses = {};

    // Loop through all courses the students selects
    selectedCourses.forEach((course) => {
      let teachers = {}; // teachers for this course only

      Object.keys(course).forEach((term) => {
        if (terms.includes(term)) {
          Object.keys(course[term]).forEach((period) => {
            course[term][period].forEach((instance) => {
              if (!(instance.teacher in teachers)) {
                if(!checkOffsConflictsInTeachersList || !selectsOff(instance.period)) {
                  teachers[instance.teacher] = (availableTeachers[course.name] && availableTeachers[course.name][instance.teacher]) || teacherSelectionDefault;
                  // issue: This does not yet work for multiperiod courses.
                  // issue: Does not save user's answers when switching between tabs if teacherSelectionDefault === true
                }
              }
            })
          })
        }
      })
      teachersForCourses[course.name] = teachers;
    })
    setAvailableTeachers(teachersForCourses);
  };

  const availableTeachersAtLeastOneFor = (course) => {
    return Object.keys(availableTeachers[course]).some((teacher) => availableTeachers[course][teacher]);
  };

  const availableTeachersAtLeastOneAll = () => {
    return Object.keys(availableTeachers).every((course) => availableTeachersAtLeastOneFor(course));
  };

  const handleChangeTeacher = (event, course) => {
    setAvailableTeachers({
      ...availableTeachers,
      [course]: {
        ...availableTeachers[course],
        [event.target.name]: event.target.checked
      }
    });
  };

  // Stepper content
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
      return ( <SelectTeachers
        options={availableTeachers}
        onChange={handleChangeTeacher}
        error={availableTeachersAtLeastOneFor}
      /> );
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
            <IconButton onClick={handleAboutModalOpen} color='inherit'>
              <Info />
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
          <Stepper activeStep={activeStep} alternativeLabel className='stepper'>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>

        {/* Content container */}
        <Container maxWidth={activeStep === steps.length ? 'xl' : 'sm'} className='contentContainer'>
          {getContent(activeStep)}
        </Container>

        {/* Button container */}
        <Container maxWidth='sm'>
          <div className='progressButtonsWrapper'>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length ? (
              <Button onClick={handleReset}>
                Start Over
              </Button>
            ) : (
              <div className='nextButtonWrapper'>
                <Button disabled={isNextDisabled()} onClick={handleNext} variant='contained' color='primary'>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
                {loading && <CircularProgress className='nextButtonProgress' size={24} />}
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
