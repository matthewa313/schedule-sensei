import React from 'react';

import {
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { Autocomplete } from '@mui/material';

import '../App.css';

const useStyles = makeStyles((theme) => ({
  addCourseButton: {
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: useTheme().spacing(2),
    marginBottom: useTheme().spacing(2),
  },
  autocomplete: {
    flex: 1,
    marginRight: useTheme().spacing(1),
  },
  courseChipsStack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px',
    marginBottom: useTheme().spacing(2),
  },
  courseChip: {
    marginBottom: '10px',
  }
}));
export default function SelectCourses(props) {
  const classes = useStyles();
  const [random, setRandom] = React.useState();
  const selectAndRefresh = () => {
    props.onSelect();
    setRandom(Math.random());
  }

  return (
    <div className='SelectCourses'>
      <Typography gutterBottom>
        Select your courses using the drop down below.
      </Typography>
      <div className={classes.addCourseButton}>
        <Autocomplete
          className = {classes.autocomplete}
          key = {random}
          id = 'year'
          options = {
            props.courseOptions
              .sort((a, b) => a.name < b.name ? 1 : -1)
              .sort((a, b) => a.type > b.type ? 1 : -1)
          }
          groupBy = {
            (option) => option.type
          }
          getOptionLabel = {
            (option) => option.name
          }
          renderInput = {
            (params) => <TextField {...params} variant='standard' color='primary' label='Select a course'/>
          }
          blurOnSelect
          onChange = {props.onChange}
        />
        <Button variant='contained' color='primary' onClick={selectAndRefresh}>Add</Button>
      </div>
      <div className={classes.courseChipsStack}>
        {props.selectedCourses.map((course) => (
          <Chip
            className='courseChip'
            variant='filled'
            key={course.name}
            label={course.name}
            onDelete={
              () => props.onDelete(course)
            }
          />
        ))}
      </div>
    </div>
  );
}
