export const promoCodes = [
  {
    code: 'SWEET10',
    discount: 10,
    type: 'percentage',
    minOrder: 0,
    maxDiscount: 100,
    description: '10% off on all orders'
  },
  {
    code: 'FIRST20',
    discount: 20,
    type: 'percentage',
    minOrder: 500,
    maxDiscount: 200,
    description: '20% off on orders above ₹500'
  },
  {
    code: 'FLAT100',
    discount: 100,
    type: 'fixed',
    minOrder: 1000,
    maxDiscount: 100,
    description: '₹100 off on orders above ₹1000'
  },
  {
    code: 'MEGA50',
    discount: 50,
    type: 'percentage',
    minOrder: 2000,
    maxDiscount: 500,
    description: '50% off on orders above ₹2000'
  },
  {
    code: 'WELCOME25',
    discount: 25,
    type: 'percentage',
    minOrder: 300,
    maxDiscount: 150,
    description: '25% off for new customers'
  }
];

export function validatePromoCode(code, orderTotal) {
  const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
  
  if (!promo) {
    return { valid: false, message: 'Invalid promo code' };
  }
  
  if (orderTotal < promo.minOrder) {
    return { 
      valid: false, 
      message: `Minimum order value of ₹${promo.minOrder} required` 
    };
  }
  
  let discountAmount = 0;
  if (promo.type === 'percentage') {
    discountAmount = (orderTotal * promo.discount) / 100;
    if (discountAmount > promo.maxDiscount) {
      discountAmount = promo.maxDiscount;
    }
  } else {
    discountAmount = promo.discount;
  }
  
  return {
    valid: true,
    discount: discountAmount,
    code: promo.code,
    message: `${promo.description} applied!`
  };
}
