
const calculateDiscountPercentage = (mrpprice,sellingPrice) => {
    if(mrpprice<=0){
        return 0;
        // throw new Error('MRP price must be greater than zero');
    }
    const discount = ((mrpprice - sellingPrice) / mrpprice) * 100;
    return Math.round(discount * 100) / 100; // Round to 2 decimal places
}
module.exports = calculateDiscountPercentage;