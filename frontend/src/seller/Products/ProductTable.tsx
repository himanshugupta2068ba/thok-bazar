import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useAppSelector } from '../../Redux Toolkit/store';

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

export default function ProductTables() {
  const { products } = useAppSelector((state) => state.sellerProducts);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Images</StyledTableCell>
            <StyledTableCell align="right">Title</StyledTableCell>
            <StyledTableCell align="right">MRP Price</StyledTableCell>
            <StyledTableCell align="right">Selling Price</StyledTableCell>
            <StyledTableCell align="right">Update stock</StyledTableCell>
            <StyledTableCell align="right">Update</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((row: any) => (
            <StyledTableRow key={row._id || row.id}>
              <StyledTableCell component="th" scope="row">
                <div className='flex items-center gap-2'>
                    {(row.images?.length ? row.images : ["https://via.placeholder.com/40"]).slice(0, 3).map((img: string, index: number) => (
                        <img key={`${row._id || row.id}-${index}`} src={img} alt="product" className='w-10 h-10 rounded-full object-cover'/>
                    ))}
                </div>
              </StyledTableCell>
              <StyledTableCell align="right">{row.title || "-"}</StyledTableCell>
              <StyledTableCell align="right">{row.mrpPrice ?? "-"}</StyledTableCell>
              <StyledTableCell align="right">{row.sellingPrice ?? "-"}</StyledTableCell>
              <StyledTableCell align="right">
                <Button size='small'>
                    {row.stock > 0 ? "in_stock" : "out_of_stock"}
                </Button>
              </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton color='primary' className='bg-teal-500'>
                        <Edit/>
                    </IconButton>
                  </StyledTableCell>
            </StyledTableRow>
          ))}
          {!products.length && (
            <StyledTableRow>
              <StyledTableCell colSpan={6} align="center">
                No products found
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
