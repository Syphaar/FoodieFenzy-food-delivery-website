import React, { useEffect, useMemo, useState } from 'react'
import { useCart } from '../../cartContext/useCart'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://foodie-fenzy-delivery-backend.vercel.app';

const VerifyPaymentPage = () => {
  const { clearCart } = useCart();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [statusMsg, setStatusMsg] = useState('Verifying Payment...');

  // GRAB TOKEN
  const token = localStorage.getItem('authToken');
  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const success = params.get('success');
    const session_id = params.get('session_id');

    // MISSING OR CANCELLED
    if (success !== 'true' || !session_id) {
      if (success === 'false') {
        navigate('/checkout', { replace: true });
        return;
      }

      // defer state update
      queueMicrotask(() => {
        setStatusMsg('Payment failed but order placed for completion');
      });

      return;
    }

    axios.get(`${API_URL}/api/orders/confirm`, {
      params: { session_id },
      headers: authHeaders
    })
    .then(() => {
      clearCart();
      navigate('/myorder', { replace: true });
    })
    .catch(err => {
      console.error('Confirmation error:', err);

      // defer state update
      queueMicrotask(() => {
        setStatusMsg('There was an error');
      });

      clearCart(false);
    });

  }, [search, clearCart, navigate, authHeaders]);

  return (
    <div className='min-h-screen flex items-center justify-center text-white'>
      <p>{statusMsg}</p>
    </div>
  );
};

export default VerifyPaymentPage;
