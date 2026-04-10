import React from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { RemoveCircle } from '@mui/icons-material';

import '../App.css';
import {
  LIST_OF_COURSES
} from '../App.js';
import Bubble from '../custom_components/Bubble.jsx'

export default function SelectCourses(props) {
  const [random, setRandom] = React.useState();
  const selectAndRefresh = () => {
    props.onSelect();
    setRandom(Math.random());
  }

  return (
    <div className='SelectCourses'>
      <Bubble
        bearAlign='right'
        text='Select your courses from the dropdown below. All course names appear exactly as they do in the master schedule.'
      />
      <div className='addCourseInterface'>
        <Autocomplete
          className = 'autocompleteBar'
          key = {random}
          id = 'year'
          options = {
            LIST_OF_COURSES
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
            (params) => <TextField {...params}
              variant='standard'
              color='primary'
              label='Select a course'
            />
          }
          blurOnSelect
          onChange = {props.onChange}
        />
        <Button variant='contained' color='primary' onClick={selectAndRefresh}>Add</Button>
      </div>
      <div className='courseChipsStack'>
        {props.selectedCourses.map((course) => (
          <Chip
            className='courseChip'
            key={course.name}
            label={course.name}
            style={{marginTop: '8px'}}
            onDelete={
              () => props.onDelete(course)
            }
            deleteIcon={<RemoveCircle />}
          />
        ))}
      </div>
    </div>
  );
}
