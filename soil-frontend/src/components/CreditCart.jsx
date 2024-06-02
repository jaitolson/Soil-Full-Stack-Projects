import React from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const CreditCard = ({ cardNumber, cardHolder, expiryDate, cvv, focused }) => {
  return (
    <div className="card-container">
      <Cards
        number={cardNumber}
        name={cardHolder}
        expiry={expiryDate}
        cvc={cvv}
        focused={focused}
      />
    </div>
  );
};

export default CreditCard;
