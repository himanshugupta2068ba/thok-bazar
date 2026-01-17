import { Close } from "@mui/icons-material";
import { Button, Divider, IconButton } from "@mui/material";

export const CartItemCard = () => {
  return (
    <div className="border border-gray-300 rounded-md relative">
      <div className="p-5 flex gap-3">
          <img
            className="w-22.5 rounded-md"
            src="https://images.unsplash.com/photo-1580854898508-4761a9c769a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29tZW4lMjBzYXJlZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="product"
          />
          <div className="space-y-2 space-x-2 p-2">
            <h1 className="font-semibold text-lg">ZARA Clothing</h1>
            <p className="text-gray-600 font-medium text-sm">Tuquoish Marron Stonework Satin Designer Saree</p>
            <p className="text-gray-00 text-xs"><strong>Sold by:</strong>
            Natural Lifestyle Product Private Limited</p>
            <p className="text-xs">
                <strong>7 days replacement avialable </strong>
            </p>
            <p className="text-sm text-gray-500">
                <strong>Quantity</strong>:2
            </p>
          {/* </div> */}
        </div>
      </div>
      <Divider />
      <div className="p-5 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2 w-35 justify-between">
            <Button variant="outlined" size="small" className="border-gray-400 text-gray-600 hover:border-gray-600 hover:text-gray-800 rounded-sm">-</Button>
            <span className="font-semibold text-lg">2</span>
            <Button variant="outlined" size="small" className="border-gray-400 text-gray-600 hover:border-gray-600 hover:text-gray-800 rounded-sm">+</Button>
            </div>
        <div className="font-bold text-teal-800"> ₹2999 </div>
        </div>
        <div className="absolute top-2 right-2 text-gray-500 font-bold cursor-pointer hover:text-gray-800"><IconButton color="primary"><Close/></IconButton></div>
    </div>
  );
};
