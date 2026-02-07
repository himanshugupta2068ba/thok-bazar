import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Chip, Menu, MenuItem } from '@mui/material';
import React from 'react';

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

const OrderStatus: { label: string; color: "primary" | "success" | "warning" | "info" | "error" }[] = [
  {
    label:"In Progress",
    color:"primary"
  },
  {
    label:"Delivered",
    color:"success"   
  },
  {
    label:"Pending",
    color:"warning"
  },
  {
    label:"Shipped",
    color:"info"
  },
  {
    label:"Cancelled",
    color:"error"
  }
]

export default function OrderTables() {
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateStatus=(id:any,status:any)=>{
        handleClose()
        console.log(id,status)
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Order Id</StyledTableCell>
            <StyledTableCell >Products</StyledTableCell>
            <StyledTableCell align="right">Shopping Address</StyledTableCell>
            <StyledTableCell align="right">Order Status</StyledTableCell>
            <StyledTableCell align="right">Update Button</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell >
                <div>
               {[1,1,1].map((item,index) =>    <div className='flex gap-2 flex-wrap'>
                    <img src="https://avatars.githubusercontent.com/u/196467988?v=4" alt="" className='w-10 h-10 rounded-full' />
            <div className='flex flex-col justify-content py-2'>
              <h1>Blazer</h1>
                  <h1>Price: 1299</h1>
                  <h1>Qty: 2</h1>
                  <h1>Total Price: 2598</h1>
                  <h1>Color: Red</h1>
                  <h1>Size: M</h1>
            </div>
                  </div>)}
                  
                </div>
              </StyledTableCell>
              <StyledTableCell align="right">{row.fat}</StyledTableCell>
              <StyledTableCell align="right">
                <Chip label="In Progress" color="primary" size='small' />
              </StyledTableCell>
              <StyledTableCell align="right">
                <Button variant='contained' size='small' onClick={handleClick}>
                Status
                </Button>
     <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        {OrderStatus.map((status) => (
          <MenuItem key={status.label} onClick={()=>handleUpdateStatus(1,status.label)}>
            <Chip label={status.label} color={status.color} size='small' />
          </MenuItem>
        ))}
        
      </Menu>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
