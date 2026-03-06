// src/hooks/usePayment.js
import { useState } from 'react';

export const usePayment = (onClearCart) => {
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({ title: '', body: '' });

  const handlePayCard = () => {
    onClearCart();
    setShowCreditCardModal(true);
  };

  const handlePayEfecty = () => {
    onClearCart();
    const codigo = Math.floor(100000 + Math.random() * 900000);
    setConfirmationData({
      title: 'Consignación en Efecty seleccionada',
      body: `Guarde este código de consignación: ${codigo}`
    });
    setShowConfirmationModal(true);
  };

  const handlePayCardConfirm = () => {
    setShowCreditCardModal(false);
  };

  const closeModals = () => {
    setShowCreditCardModal(false);
    setShowConfirmationModal(false);
  };

  return {
    showCreditCardModal,
    showConfirmationModal,
    confirmationData,
    handlePayCard,
    handlePayEfecty,
    handlePayCardConfirm,
    closeModals
  };
};
