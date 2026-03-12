import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  deleteSellerProduct,
  updateSellerProduct,
} from '../../Redux Toolkit/featurs/seller/sellerProductSlice';
import { useAppDispatch, useAppSelector } from '../../Redux Toolkit/store';

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading } = useAppSelector((state) => state.sellerProducts);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const jwtToken = localStorage.getItem("sellerJwt");

  const handleDelete = async (productId: string) => {
    if (!jwtToken || !productId) return;

    const shouldDelete = window.confirm("Delete this product?");
    if (!shouldDelete) return;

    try {
      setProcessingId(productId);
      await dispatch(deleteSellerProduct({ productId, jwt: jwtToken })).unwrap();
    } catch (error) {
      console.error("Delete product failed:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleStock = async (row: any) => {
    const productId = row?._id || row?.id;
    if (!jwtToken || !productId) return;

    const nextStock = Number(row?.stock) > 0 ? 0 : 1;

    try {
      setProcessingId(productId);
      await dispatch(
        updateSellerProduct({
          productId,
          updates: { stock: nextStock },
          jwt: jwtToken,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Update stock failed:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Images</StyledTableCell>
            <StyledTableCell align="right">Title</StyledTableCell>
            <StyledTableCell align="right">MRP Price</StyledTableCell>
            <StyledTableCell align="right">Selling Price</StyledTableCell>
            <StyledTableCell align="right">Stock</StyledTableCell>
            <StyledTableCell align="right">Update</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
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
                <Button
                  size='small'
                  variant='outlined'
                  disabled={loading || processingId === (row._id || row.id)}
                  onClick={() => handleToggleStock(row)}
                >
                    {row.stock > 0 ? "in_stock" : "out_of_stock"}
                </Button>
              </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      color='primary'
                      className='bg-teal-500'
                      onClick={() => navigate(`/seller/products/${row._id || row.id}/edit`)}
                    >
                        <Edit/>
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      color='error'
                      disabled={loading || processingId === (row._id || row.id)}
                      onClick={() => handleDelete(row._id || row.id)}
                    >
                        <Delete/>
                    </IconButton>
                  </StyledTableCell>
            </StyledTableRow>
          ))}
          {!products.length && (
            <StyledTableRow>
              <StyledTableCell colSpan={7} align="center">
                No products found
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
