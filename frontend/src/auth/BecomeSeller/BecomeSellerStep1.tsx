import { Box, TextField } from "@mui/material"

export const BecomeSellerStep1=({formik}:any)=>{
    return(
       <Box>
        <p className="text-xl font-bold text-center pb-9">Contact Details</p>
        <div className="space-y-9">
            <div>
                <TextField
            fullWidth
            id="mobile"
            label="Mobile"
            name="mobile"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
            />
            </div>
          <div>
              <TextField
            fullWidth
            id="GSTIN"
            label="GSTIN"
            name="GSTIN"
            value={formik.values.GSTIN}
            onChange={formik.handleChange}
            error={formik.touched.GSTIN && Boolean(formik.errors.GSTIN)}
            helperText={formik.touched.GSTIN && formik.errors.GSTIN}
            />
          </div>
        </div>
       </Box>
    )
}