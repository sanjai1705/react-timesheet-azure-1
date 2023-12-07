import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { DateCalendar, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import { tokens } from '../themes';

const WeekPicker = ({ onValueChange }) => {
    
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    const [value, setValue] = useState(dayjs(new Date()));
    const [hoveredDay, setHoveredDay] = useState(null);

    const CustomPickersDay = styled(PickersDay, {
        shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
      })(({ theme, isSelected, isHovered, day }) => ({
        borderRadius: 0,
        ...(isSelected && {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.primary.contrastText,
          '&:hover, &:focus': {
            backgroundColor: theme.palette.secondary.main,
          },
        }),
        ...(isHovered && {
          backgroundColor: theme.palette.primary[theme.palette.mode],
          '&:hover, &:focus': {
            backgroundColor: theme.palette.primary[theme.palette.mode],
          },
        }),
        ...(day.day() === 0 && {
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
        }),
        ...(day.day() === 6 && {
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
        }),
      }));
      
      const isInSameWeek = (dayA, dayB) => {
        if (dayB == null) {
          return false;
        }
      
        return dayA.isSame(dayB, 'week');
      };
      
      function Day(props) {
        const { day, selectedDay, hoveredDay, ...other } = props;
        return (
          <CustomPickersDay
            {...other}
            day={day}
            sx={{ px: 2.5 }}
            disableMargin
            selected={false}
            isSelected={isInSameWeek(day, selectedDay)}
            isHovered={isInSameWeek(day, hoveredDay)}
          />
        );
      }
      
      const handleClick=(value) => {
        onValueChange(value);
      }

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
          sx={{
            backgroundColor:  colors.grey[900]
          }}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              handleClick(newValue);
            }}
            showDaysOutsideCurrentMonth
            displayWeekNumber
            slots={{ day: Day }}
            slotProps={{
              day: (ownerState) => ({
                selectedDay: value,
                hoveredDay,
                onPointerEnter: () => setHoveredDay(ownerState.day),
                onPointerLeave: () => setHoveredDay(null),
              }),
            }}
          />
        </LocalizationProvider>
    </div>
  )
}

export default WeekPicker
