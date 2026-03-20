const COD_ALIASES = new Set([
    'cod',
    'cash on delivery',
    'cash_on_delivery',
    'cashondelivery',
]);

const normalizePaymentMethodInput = (paymentMethod) =>
    String(paymentMethod || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

const normalizePaymentMethod = (paymentMethod) =>
    COD_ALIASES.has(normalizePaymentMethodInput(paymentMethod))
        ? 'COD'
        : 'RAZORPAY';

const toPaymentOrderMethod = (paymentMethod) =>
    normalizePaymentMethod(paymentMethod) === 'COD' ? 'cod' : 'razorpay';

const isCashOnDelivery = (paymentMethod) =>
    normalizePaymentMethod(paymentMethod) === 'COD';

module.exports = {
    isCashOnDelivery,
    normalizePaymentMethod,
    toPaymentOrderMethod,
};
