import React from 'react';

import {
  Container,
  Paper,
  Table,
  TableContainer,
  Typography,
} from '@mui/material';

const RESULTS_STRINGS = [
  'Schedule Sensei chopped together',
  'Schedule Sensei sliced together',
  'After hours of meditation, Schedule Sensei found',
  'After black belt training, Schedule Sensei uncovered',
  'Mr. Miyagi helped Schedule Sensei build',
  // 'After defeating Johnny Lawrence, Schedule Sensei built',
]

function resultsMessage(numSchedules) {
  if(numSchedules === 0) {
    return 'After hours of meditation, the Schedule Sensei could not find a single schedule with your classes, offs, and teachers. Try tweaking the settings to find a schedule (remove offs, add teachers).'
  }
  let randomString = RESULTS_STRINGS[
    Math.floor(Math.random() * RESULTS_STRINGS.length)
  ];
  return randomString + ' ' + numSchedules + ' schedules for you...'
}

export default function GeneratedSchedules(props) {
  return (
    <div className="GeneratedSchedules">
      <Container maxWidth='sm'>
        <Typography gutterBottom>
          {resultsMessage(props.schedules.length)}
        </Typography>
      </Container>
      <Container maxWidth='xl'>
        <TableContainer component={Paper}>
          <Table size='small'>

          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}
