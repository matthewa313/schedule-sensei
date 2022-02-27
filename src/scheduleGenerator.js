import {
  NUM_PERIODS,
  REQUIRED_OFF_OVERRIDE_OPTIONS,
} from './App.js';

/** For certain schedule combinations, there may be as many as 100 million possible schedules. That takes a very long time to compute. This warrants making this an async function with a loading screen.
 * TODO: Make this an async function
 * TODO: Make a loading screen
 * Sometimes we know beforehand that there are no possible schedules for a student. For example, if they register for 8 classes and a lunch period. We can throw an error immediately (and explain why there is an error!), saving computational resources and helping the user.
 * TODO: Leverage the above
 * There are a number of tricks we can use to cut down the number of schedules we have to check.
 * Singleton classes (classes only offered once) clearly have a single spot in the schedule. We could treat them as forced off periods, dramatically cutting down on the size of the tree.
 * TODO: Improve performance by leveraging singleton classes
 * Sometimes we know beforehand if this cannot actually be a wildcard off. For instance, if the user has registered for 7 classes and wants a lunch, etc...
 * TODO: Improve performance by leveraging the above fact
 * This currently only works for a two semester system. We should generalize this so it works for any number of terms.
 * TODO: Fix code so it works for any number of terms: not only semesters but also trimesters, quarters, etc.
 */

export function generateSchedules(selectedCourses, selectedOffs,  requiredOffOverride, selectedTeachers) {
  let results = [];

  const doublePer = (period) => period + '-' + (period + 1);

  const selectsOff = (period) => selectedOffs[period - 1];

  const alreadyContains = (schedule, course) => (
    schedule.some((period) =>
      period.some((instance) =>
        instance && instance.name === course.name))
  );

  let numClasses = 0;
  selectedCourses.forEach((selectedCourse) => {
    if (selectedCourse.year) numClasses += 1;
    else if (selectedCourse.s1) numClasses += 0.5;
    else if (selectedCourse.s2) numClasses += 0.5;
  });
  const maxNumOffs = NUM_PERIODS - numClasses;
  // maxNumOffs is how many offs a student will have (in decimal units, where off for a semester is 0.5 offs), and the maximum number of offs that the schedule can count.

  const computeForPeriod = (schedule, period, offsTaken) => {
    // If we have taken too many offs in the schedule, delete this schedule.
    if(offsTaken > maxNumOffs) return;

    // If the user wants this period to be an off period, always skip to the next period.
    if (selectsOff(period)) {
      if(offsTaken + 1 > maxNumOffs) return; // If we are about to take too many offs in the schedule, delete this schedule.
      let newSchedule = [...schedule];
      newSchedule[period] = [];
      computeForPeriod(newSchedule, period + 1, offsTaken+1);
      return;
    }

    // If this schedule is complete, add it to the schedule.
    if (period > NUM_PERIODS) {
      schedule.shift(); // For a reason I cannot identify, there is an empty element in the list that we must remove. Fixing this this may nominally improve performance.
      results.push(schedule);
      return;
    }

    /** Sometimes this may be a 'wildcard' off.
     * Sometimes we know beforehand if this cannot actually be a wildcard off. For instance, if the user has registered for 7 classes and wants a lunch, etc...
     * TODO: Improve performance by leveraging the above fact
     * This may tremendously improve performance. After all, every time we pretend this is a 'wildcard off', we open up a whole new tree. Consider the example that students register for 8 year-long classes (not generally permitted, but consider it). Then the system tests 2^8=256 schedule "templates,"" one for each possible set of wildcard offs (all 8, 7 of the 8, 6 of the 8, etc.) However, only 1 of these 256 templates works. This means we could reduce our search space by 256x.
     */
    if(offsTaken+1 <= maxNumOffs) {
      let newSchedule = [...schedule];
      newSchedule[period] = [];
      computeForPeriod(newSchedule, period + 1, offsTaken+1);
      // If first semester is off, then we can have second semester on
      solveSecondSemester(schedule, period, null, offsTaken+0.5);
    } else if(offsTaken+0.5 <= maxNumOffs) {
      // If first semester is off, then we can have second semester on
      solveSecondSemester(schedule, period, null, offsTaken+0.5);
    }

    // Loop through the courses the user selected
    selectedCourses.forEach((selectedCourse) => {
      if (!alreadyContains(schedule, selectedCourse)) {
        if (selectedCourse.year) { // is it a year long?
          // Check if it's 1 period long and available this period
          if (selectedCourse.year[period]) { // is it 1 period?
            selectedCourse.year[period].forEach((course) => {
              if (selectedTeachers[course.name][course.teacher]) {
                let newSchedule = [...schedule];
                newSchedule[period] = [course];
                computeForPeriod(newSchedule, period + 1, offsTaken);
              }
            });
          }
          else if (selectedCourse.year[doublePer(period)]) { // is it 2 periods?
            // Historically, two period courses have only been offered 1-2, 3-4, and 6-7.
            selectedCourse.year[doublePer(period)].forEach((course) => {
              if (selectedTeachers[course.name][course.teacher]) {
                let newSchedule = [...schedule];
                newSchedule[period] = [course];
                newSchedule[period + 1] = [course]; // Occupy two slots
                computeForPeriod(newSchedule, period + 2, offsTaken);
              }
            });
          }
        }
        /** When it comes to double period courses, we have an interesting question. Consider AP Physics C in periods 1-2. If the user wants period 2 off, should the system AP Physics C in periods 1-2 from the schedule?
         * We prefer to give students too many schedules over not enough, so we do not bother to remove it.
         */
        else if (selectedCourse.s1 && selectedCourse.s1[period]) {
          selectedCourse.s1[period].forEach((s1) => {
            if (selectedTeachers[s1.name][s1.teacher]) {
              solveSecondSemester(schedule, period, s1, offsTaken); // Send to figure out s2
            }
          });
        }
      }
    });
  }

  const solveSecondSemester = (schedule, period, s1, offsTaken) => {
    // Second semester for a given period can be empty if first semester was full for that period (otherwise this is just a normal off period)
    if (s1 != null) {
      let newSchedule = [...schedule];
      newSchedule[period] = [s1, null];
      computeForPeriod(newSchedule, period + 1, offsTaken+0.5);
    }
    // Loop through semester two courses
    selectedCourses.forEach((selectedCourse) => {
      if (!alreadyContains(schedule, selectedCourse) && selectedCourse.s2
      && selectedCourse.s2[period] && (s1 === null || s1.name !== selectedCourse.name)) {
        selectedCourse.s2[period].forEach((s2) => {
          if (selectedTeachers[s2.name][s2.teacher]) {
            let newSchedule = [...schedule];
            newSchedule[period] = [s1, s2];
            computeForPeriod(newSchedule, period + 1, offsTaken);
          }
        });
      }
    });
  }

  const makeSchedules = () => {
    computeForPeriod([[]], 1, 0);
    return results;
  }

  return makeSchedules();
}
