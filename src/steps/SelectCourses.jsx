import React from 'react';

import {
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Autocomplete } from '@mui/material';

import '../App.css';

export default function SelectCourses(props) {
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
      <div className='addCourseInterface'>
        <Autocomplete
          className = 'autocompleteBar'
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
      {/* We need to add some spacing between course chips. */}
      <div className='courseChipsStack'>
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
