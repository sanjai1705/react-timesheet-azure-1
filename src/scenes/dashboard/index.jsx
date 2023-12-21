import { Divider, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { mockDataTeam } from '../../data/mockData';
import axios from 'axios';
import styled from '@emotion/styled';
import { AuthContext } from '../../App';
import NameMenuButton from '../global/NameMenuButton';

const Dashboard = () => {
  const { user, login } = useContext(AuthContext);
  const userId = user.userId;
  console.log(userId)
  const [fetchUserInfo, setfetchUserInfo] = useState([])

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/Timesheet/Users/${userId}`);
        console.log(response)
        setfetchUserInfo(response.data)
    } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    getData();
  }, [userId]);

  return (
    <div className="w-11/12 mx-auto mt-5">
      <div className="flex justify-between align-top mb-4">
        <Typography variant="h2">User Information</Typography>
        <NameMenuButton />
      </div>
      {/* Apply padding/margin to the parent div */}
      <div className="w-9/12 mx-auto p-4 border rounded-lg">
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <StyledTableRow>
                <TableCell>Username:</TableCell>
                <TableCell>{fetchUserInfo.username}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell>userId:</TableCell>
                <TableCell>{fetchUserInfo.userId}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell>Full Name:</TableCell>
                <TableCell>
                  {fetchUserInfo.firstname + " " + fetchUserInfo.lastname}
                </TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell>Email:</TableCell>
                <TableCell>{fetchUserInfo.email}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell>Hire Date:</TableCell>
                <TableCell>{fetchUserInfo.hireDate}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell>Address:</TableCell>
                <TableCell>{fetchUserInfo.address}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell>Qualification:</TableCell>
                <TableCell>{fetchUserInfo.qualification}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell>PassoutYear:</TableCell>
                <TableCell>{fetchUserInfo.passoutYear}</TableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Dashboard
