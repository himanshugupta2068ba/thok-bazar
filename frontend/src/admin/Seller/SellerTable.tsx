import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useState } from 'react';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const accountStatus = [
    {
        status: 'PENDING_VERIFICATION',
        title: 'Pending Verification',
        color: 'warning',
        description: 'Seller is waiting for verification'
    },
    {
        status: 'ACTIVE',
        title: 'Active',
        color: 'success',
        description: 'Seller is active'
    },
    {
        status: 'INACTIVE',
        title: 'Inactive',
        color: 'error',
        description: 'Seller is inactive'
    },
    {
        status: 'SUSPENDED',
        title: 'Suspended',
        color: 'error',
        description: 'Seller is suspended'
    },
    {
        status: 'BLOCKED',
        title: 'Blocked',
        color: 'error',
        description: 'Seller is blocked'
    },
    {
        status: 'CLOSED',
        title: 'Closed',
        color: 'error',
        description: 'Seller is closed'
    }
]


export const SellerTables = () => {

    const [accountStatusValue, setAccountStatusValue] = useState<string>('null');
    const handleAccountStatusChange = (event: SelectChangeEvent<string>) => {
        setAccountStatusValue(event.target.value);
    }
  return (

    <>
    <div className='pb-3'>
        <FormControl>
                <InputLabel id="demo-simple-select-label">{'Account Status'}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={accountStatusValue}
              label="Account Status"
              onChange={handleAccountStatusChange}
            >
                <MenuItem value="null">Select Account Status</MenuItem>
              {accountStatus.map((status: any) => (
                <MenuItem key={status.status} value={status.status}>{status.title}</MenuItem>
              ))}
            </Select>
        </FormControl>
    </div>
              
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Seller Name    </StyledTableCell>
            <StyledTableCell align="right">Mobile</StyledTableCell>
            <StyledTableCell align="right">Email</StyledTableCell>
            <StyledTableCell align="right">Business Name</StyledTableCell>
            <StyledTableCell align="right">Business Address</StyledTableCell>
            <StyledTableCell align="right">Account Status</StyledTableCell>
            <StyledTableCell align="right">Update</StyledTableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                <div className='flex gap-1 flex-wrap'>
                    <span>12-2-2026</span>
                    <p>12:55:41</p>
                </div>
              </StyledTableCell>
              <StyledTableCell align="right">{row.calories}</StyledTableCell>
              <StyledTableCell align="right">{row.fat}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
          

            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
