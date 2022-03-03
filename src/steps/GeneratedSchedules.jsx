import React from 'react';

import {
  Collapse,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';

import {
  NUM_PERIODS
} from '../App.js'

// TODO: allow user to export results to pdf/csv/print

const RESULTS_STRINGS = [
  'Schedule Sensei chopped together',
  'Schedule Sensei sliced together',
  'After hours of meditation, Schedule Sensei found',
  'After black belt training, Schedule Sensei uncovered',
  'Mr. Miyagi helped Schedule Sensei build',
  'After defeating Johnny Lawrence, Schedule Sensei built',
]

function resultsMessage(numSchedules) {
  if(numSchedules === 0) {
    return 'After hours of meditation, the Schedule Sensei could not find a single schedule with your classes, offs, and teachers. Try tweaking the settings to find a schedule (remove offs, add teachers).'
  }
  let randomString = RESULTS_STRINGS[
    Math.floor(Math.random() * RESULTS_STRINGS.length)
  ];
  return randomString + ' ' + numSchedules.toLocaleString() + ' schedules for you...'
}

const basicCellRep = (period) => {
  switch (period.length) {
  case 0: {
    return '—'
  }
  case 1: {
    return period[0].name
  }
  case 2: {
    const s1 = (period[0] && period[0].name) || '—';
    const s2 = (period[1] && period[1].name) || '—';
    return s1 + ', ' + s2;
  }
  default:
    return 'Invalid length of period array!'
  }
};

const expandedCellRep = (course) => {
  if (course === null) {
    return '—'
  } else {
    return course.name + ' — ' + course.teacher + ' — ' + course.room
  }
};

function ExpandedRow(props) {
  const expandPeriod = (periodCourses) => {
    let s1 = '—', s2 = '—';
    if (periodCourses.length === 1) {
      s1 = expandedCellRep(periodCourses[0]);
      s2 = s1;
    } else if (periodCourses.length === 2) {
      s1 = expandedCellRep(periodCourses[0]);
      s2 = expandedCellRep(periodCourses[1]);
    }
    return (
      <React.Fragment>
        <TableCell>{s1}</TableCell>
        <TableCell>{s2}</TableCell>
      </React.Fragment>
    )
  };

  return (
    <TableRow>
      <TableCell variant='head'>{props.periodNum + 1}</TableCell>
      {expandPeriod(props.periodCourses)}
    </TableRow>
  )
}

function ResultsRow(props) {
  // TODO: make results columns evenly spaced
  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <React.Fragment>
      <TableRow onClick={toggleOpen}>
        <TableCell className='noBorderBottom'>
          <IconButton size='small' onClick={toggleOpen}>
            {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </IconButton>
        </TableCell>
        {props.schedule.map((period) => (
          <TableCell className='noBorderBottom' key={3}>
            {basicCellRep(period)}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell></TableCell>
        <TableCell colSpan={7}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Typography variant='h6' gutterBottom>
              Schedule {(props.page * props.rowsPerPage + props.number).toLocaleString()}/{props.total.toLocaleString()}
            </Typography>
            <Table className='detailTable' size='small'>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>S1</TableCell>
                  <TableCell>S2</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.schedule.map((periodCourses, periodNum) => (
                  <ExpandedRow periodCourses={periodCourses} periodNum={periodNum} key={3}/>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function GeneratedSchedules(props) {
  const headers = Array(NUM_PERIODS).fill(0).map((v, i) => 'Pd. ' + (i + 1));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.schedules.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className='GeneratedSchedules'>
      <Container maxWidth='sm' className='contentContainerSchedules'>
        <Typography gutterBottom>
          {resultsMessage(props.schedules.length)}
        </Typography>
      </Container>
      <Container maxWidth='xl'>
        <TableContainer component={Paper}>
          <Table size='small' padding='none' stickyHeader={true}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {headers.map((heading) => (
                  <TableCell className='periodHeaderCell' key={heading}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.schedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((schedule, index) => (
                <ResultsRow
                  schedule={schedule}
                  number={index+1}
                  total={props.schedules.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  key={3}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableFooter>
          <TablePagination
            rowsPerPageOptions={[100, 200, 500, { label: 'All', value: -1 }]}
            colSpan={3}
            count={props.schedules.length}
            rowsPerPage={rowsPerPage}
            page={page}
            componentsProps={{
              select: {
                'aria-label': 'rows per page',
              },
              actions: {
                showFirstButton: true,
                showLastButton: true,
              },
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableFooter>
      </Container>
    </div>
  );
}
