import React from 'react';
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Step,
  Stepper,
  StepLabel,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { Help, Info } from '@mui/icons-material';
import { School, Schedule, Group, Check } from '@mui/icons-material';

import './App.css';
import SelectCourses from './steps/SelectCourses.jsx';
import SelectOffs from './steps/SelectOffs.jsx';
import SelectTeachers from './steps/SelectTeachers.jsx';
import GeneratedSchedules from './steps/GeneratedSchedules.jsx';
import AboutModal from './modals/AboutModal.jsx';
import HelpModal from './modals/HelpModal.jsx';
import { generateSchedules } from './scheduleGenerator.js';

const theme = createTheme({
  // Blue and red for Cherry Creek HS (red currently not used anywhere)
  palette: {
    primary: {
      main: '#2962ff', // blue
    },
    secondary: {
      main: '#e53935', // red
    },
  },
  typography: {
    fontFamily: 'Open Sans'
  }
})

/** The below variables are specific to school/school year.
 * We also have several environment variables specific to school/school year.
 */
export const LIST_OF_COURSES = require('src/files/creekSchedule2425.json');
// .json file link to course selection
export const NUM_PERIODS = 8;
/** Number of periods in the school day
 * This software does not currently support block schedules or periods which go out of order or are lettered
 */
export const REQUIRED_OFF_OVERRIDE_OPTIONS = [
  ['Lunch during 4th, 5th, or 6th', [4,5,6] ],
  ['Lunch during 4th or 6th (Fr/So)', [4,6] ],
  ['Lunch during 5th only (Jr/Sr)', [5] ],
  ['No lunch periods', [] ],
]
/** Off overrides were spawned from the need to honor students' lunch period requirements. Creek requires all students to have a lunch period, either in 4th, 5th, or 6th period. (Typically, the registrar only allows Freshmen/Sophomores to have 4th or 6th lunch and Juniors/Seniors to have 5th lunch.)
 * We want to make sure that we only give students schedules that have a lunch period in either 4th, 5th, or 6th period, as these are the only schedules the registrar will allow them to have.
 * Practically, this means we can only generate schedules with an off in at least one of 4, 5, or 6. During the schedule generation process, we will throw out all schedules with not one of 4th, 5th, or 6th lunch.
 * This criterion would be simple enough to apply, but after conversations with students, it became clear that some wanted more control over the schedule generation process. For instance, Fr/So did not want the system to generate schedules with only 5th off. To honor this, we created the "required off override options."
 * This is a two-dimensional array where the ith entry represents a singular option. The first element of this entry is a String describing the required off override option. The second element is a list of offs which, if at least one is taken, satisfy the required off override option.
 * We also have an option "No lunch periods" that will generate all schedules, even if they don't satisfy the lunch period.
 * Obviously this only solves the lunch period problem, which is not a problem at all schools. There are also other scheduling issues that schools besides Creek face. This code is not especially generalizable and can be complex in areas, so a simpler solution is warmly welcomed.
 */
const numOverrideOptions = REQUIRED_OFF_OVERRIDE_OPTIONS.length;
const terms = ['year', 's1', 's2']
// End of specific to school/school year

function App() {
  // Steps that the user must progress through
  const steps = [
    // Step number, step name, icon
    [1, 'Courses', <School key={1} color='primary'/>],
    [2, 'Offs', <Schedule key={1} color='primary'/>],
    [3, 'Teachers', <Group key={1} color='primary'/>],
  ];

  // Variables to describe where user is in the app
  const [firstPass, setFirstPass] = React.useState(true);
  /** Is this the user's first pass through the app?
   * Starts as true, then turns to false permanently once the student enters the Teachers step (see @function handleNext).
   * If the user returns to the courses page AND adds another course, first pass is reset to true (see handleSelectCourse). This allows the new teachers in the new course to be set as true.
   * Resets to true on page refresh.
   */
  const [activeStep, setActiveStep] = React.useState(0);

  // Variables to be passed to SelectCourses.jsx
  const [selectedCourses, setSelectedCourses] = React.useState([]);
  // Array of all courses that the use has selected to be in their schedule
  const [newCourse, setNewCourse] = React.useState();
  // Course that the user has currently selected to be added to their schedule

  // Variables to be passed to SelectOffs.jsx
  const [selectedOffs, setSelectedOffs] = React.useState(Array(NUM_PERIODS).fill(false));
  // The nth value indicates if the user has selected period n+1 to be off.
  const [requiredOffOverride, setRequiredOffOverride] = React.useState(
    Array(1).fill(true).concat(
      Array(numOverrideOptions-1).fill(false)
    )
  );
  /**
   * We automatically set first element of the requiredOffOverride array to true because we want the default setting to be initially selected.
   */

  // Variables to be passed to SelectTeachers.jsx
  const [selectedTeachers, setSelectedTeachers] = React.useState('');

  // Variables to be passed to GeneratedSchedules.jsx
  const [schedules, setSchedules] = React.useState([]);

  // Variables to keep track of/handle modal states (About/Help)
  const [isAboutModalOpen, setAboutModalOpen] = React.useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = React.useState(true);
  const handleAboutModalOpen = () => setAboutModalOpen(true);
  const handleAboutModalClose = () => setAboutModalOpen(false);
  const handleHelpModalOpen = () => setHelpModalOpen(true);
  const handleHelpModalClose = () => setHelpModalOpen(false);

  /** We have 4 "Stepper handlers:" handlers to user input to move users between different parts of the app.
   * @function handleNext moves us to the next step, performing all necessary tasks before doing so.
   * @function handleBack moves us to the previous step.
   * @function handleReset moves us back to the beginning of the app. This is only accessible to the user from the GeneratedSchedules page.
   * @function isNextDisabled tells us if Next button should be disabled for the user.
   */
  const handleNext = () => {
    if (activeStep === 0) {
      // Coures --> offs
    } else if (activeStep === 1) {
      // Offs --> teachers
      determineTeachersList(); // Based on the offs students selected, determine teachers students can have
      setFirstPass(false);
    } else if (activeStep === 2) {
      // Teachers --> generated schedules
      generateAndSetSchedules(selectedCourses,
        selectedOffs,
        requiredOffOverride,
        selectedTeachers);
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
    /** The next button can be disabled for 2 reasons:
     * 1. On the course selection page, the user hasn't selected any courses.
     * 2. On the teacher selection page, the user hasn't selected at least one teacher per course.
     */
    return (activeStep === 0 && selectedCourses.length < 1)
      || (activeStep === 2 && !atLeastOneTeacherSelectedForAllCourses());
  };

  /** We have 3 "Course handlers:" handlers to user input to interact with course selection.
   * @function handleChangeCourse sets the course currently in the Autocomplete interface to be the newCourse variable. This does not add it to the selectedCourses array, merely queuing it to be added.
   * @function handleSelectCourse adds the course currently selected in the Autocomplete interface (newCourse, which was set by handleChangeCourse).
   * @function handleDeleteCourse removes the specified course.
   */
  const handleChangeCourse = (event, value) => {
    setNewCourse(value);
  };

  const handleSelectCourse = () => {
    if (newCourse != null && !selectedCourses.some((course) => course.name === newCourse.name)) {
      setSelectedCourses(selectedCourses.concat(newCourse));
    }
    setFirstPass(true);
  };

  /** @param removeCourse -- course to be removed.
   */
  const handleDeleteCourse = (removeCourse) => {
    setSelectedCourses(
      selectedCourses.filter((course) =>
        course.name !== removeCourse.name)
    );
  };

  /** We have 2 "Offs handlers:" handlers to user input to interact with off/off override selection.
   * @function handleChangeOffs (NOT like change-off) updates the selectedOffs array based on user input.
   * @function handleChangeOffOverride updates the off override choice (represented as an array of all but) based on user input.
   */
  const selectsOff = (period) => selectedOffs[period - 1];
  // Although this is in the offs handlers, this will not be used by SelectOffs.jsx, only to determine the teachers list and generate schedules.

  const handleChangeOffs = (event) => {
    let offs = [...selectedOffs];
    offs[event.target.name] = event.target.checked;
    setSelectedOffs(offs);
  };

  const handleChangeOffOverride = (event) => {
    let overrides = Array(numOverrideOptions).fill(false);
    overrides[event.target.name] = event.target.checked;
    setRequiredOffOverride(overrides);
  };
  /** One problem we currently have with offs is that the app allows students to select offs for singleton classes. By singleton, we mean a class that is only offered one period (e.g., specialized debate classes, some high level classes, etc.)
   * TODO: remove offs that overlap with singleton classes as an option.
   */

  /** We have 4 "Teacher handlers:" handlers to user input to interact with teacher selection for various courses.
   * @function determineTeachersList determines a list of teachers for each course.
   * @function handleChangeTeacher updates the selected list of teachers based on user input.
   * @function atLeastOneTeacherSelectedForCourse determines if the user has selected at least one teacher for a given course.
   * @function atLeastOneTeacherSelectedForAllCourses determines if the user has selected at least one teacher for all courses.
   */
  const checkOffsConflictsInTeachersList = true;
  /** When we generate the list of teachers the student can select from, we have two options. First, we can show them all teachers for every course they have selected. The problem with this is that teachers only teach courses in certain periods, and if the user has selected an off period when that teacher is teaching, they won't have the option to take that teacher. Therefore, giving users the opportunity to select all teachers can mislead users about what teachers they are able to take.
   * Setting checkOffsConflictsInTeachersList to true will not allow students to select teachers who we know are not compatible with their schedule.
   */
  const firstPassTeacherSelectionDefault = true;
  /** When the user first enters the teacher selection page (i.e., on the user's first pass), all teachers can either be selected or unselected.
   * The value of firstPassTeacherSelectionDefault represents whether teachers will be selected or unselected when the user first enters the teacher selection page.
   * We think it makes more sense for this value to be true because false requires user input (because, if they have no teachers selected, they will not be able to generate any schedules). Moreover, it seems to be the norm for students to select a plurality of teachers.
   * After the first pass, this setting is completely disregarded (see teacherSelectionDefault), and user's previous input is preferred.
   */

  const determineTeachersList = () => {
    let teachersForCourses = {};
    // The teachersForCourse dictionary has keys corresponding to course with respective array values holding another dictionary of teachers for that course.

    selectedCourses.forEach((course) => { // Loop through all courses the students selects
      let teachers = {}; // Make a list of teachers who the student can take for this course

      Object.keys(course).forEach((term) => {
        if (terms.includes(term)) {
          Object.keys(course[term]).forEach((period) => {
            course[term][period].forEach((instance) => {
              if (!(instance.teacher in teachers)) {
                if(!checkOffsConflictsInTeachersList || !selectsOff(instance.period)) {
                  let teacherSelectionDefault = firstPass && firstPassTeacherSelectionDefault;
                  teachers[instance.teacher] = (selectedTeachers[course.name] && selectedTeachers[course.name][instance.teacher]) || teacherSelectionDefault;
                }
              }
            })
          })
        }
      })
      // if(Object.keys(teachers).length != 1) {
      // Do not give the user the option of selecting a teacher if there is only one option. This wastes the user's time.
      teachersForCourses[course.name] = teachers;
      // }
    })
    setSelectedTeachers(teachersForCourses);
    /** Double period classes complicates determining the teachers list. Consider the following example. The user selects 4th off and taking AP Biology. AP Biology is offered 1-2 with Mr. Bailey and 3-4 with Mr. Smith. If a student enrolls in AP Biology, they have the second half of period 2/4 (usually, but not always, e.g. if a test runs long). Should we give the student Mr. Smith as an option?
     * Currently (and we think it should stay this way, but we aren't sure), the code allows Mr. Smith as an option. In general, we prefer to give the user as many REASONABLE options as possible.
     */
  };

  const handleChangeTeacher = (event, course) => {
    setSelectedTeachers({
      ...selectedTeachers,
      [course]: {
        ...selectedTeachers[course],
        [event.target.name]: event.target.checked
      }
    });
  };

  const atLeastOneTeacherSelectedForCourse = (course) => {
    return Object.keys(selectedTeachers[course]).some((teacher) => selectedTeachers[course][teacher]);
  };

  const atLeastOneTeacherSelectedForAllCourses = () => {
    return Object.keys(selectedTeachers).every((course) => atLeastOneTeacherSelectedForCourse(course));
  };

  /** @function generateAndSetSchedules generates a list of schedules using a function exported scheduleGenerator.js and the requirements given by the user.
   */
  const generateAndSetSchedules = (courses, offs, offOverride, teachers) => {
    const startTime = Date.now();
    const generatedSchedules = generateSchedules(courses, offs, offOverride, teachers);
    const timeElapsed = Date.now() - startTime;
    console.log('Time elapsed for computation: ' + timeElapsed + 'ms');
    setSchedules(generatedSchedules);
  }

  // Stepper content
  const getContent = (stepIndex) => {
    switch (stepIndex) {
    case 0:
      return ( <SelectCourses
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
        onChangeOverride={handleChangeOffOverride}
      /> );
    case 2:
      return ( <SelectTeachers
        options={selectedTeachers}
        onChange={handleChangeTeacher}
        error={atLeastOneTeacherSelectedForCourse}
      /> );
    case 3:
      return ( <GeneratedSchedules
        schedules={schedules}
      /> );
    default:
      return 'na';
    }
  }

  // App content
  return (
    <div className='App'>
      <ThemeProvider theme={theme}>

        {/* AppBar container */}
        <AppBar position='static'>
          <Toolbar>
            <Tooltip title='Help'>
              <IconButton onClick={handleHelpModalOpen} color='inherit'>
                <Help />
              </IconButton>
            </Tooltip>
            <Typography style={{fontFamily: 'Kaushan Script'}} className='title' variant='h4'>
              Schedule Sensei
            </Typography>
            <Tooltip title='About'>
              <IconButton onClick={handleAboutModalOpen} color='inherit'>
                <Info />
              </IconButton>
            </Tooltip>
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
            {steps.map((step) => (
              <Step key={step[0]}>
                <StepLabel
                  icon={step[0]>activeStep ? step[2] : <Check color='primary'/>}
                >
                  {step[1]}
                </StepLabel>
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
                <Button
                  disabled={isNextDisabled()}
                  onClick={activeStep === steps.length-1 ? handleNext : handleNext}
                  variant='contained'
                  color='primary'
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            )
            }
          </div>
          <div style={{marginBottom: '16px'}}>
            <Typography style={{fontSize: '12px', color: '#555'}}>
              {activeStep === steps.length ? 'Disclaimer: If (1) you are taking a class which is repeatable twice, (2) this class is offered at least two periods, and (3) you are taking at least three semester long classes, Schedule Sensei will find most, but not all, of your schedules.' : ''}
            </Typography>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
