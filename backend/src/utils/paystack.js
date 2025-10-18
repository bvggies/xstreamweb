import axios from "axios";

export const initializePaystack = async (email, amount, callback_url) => {
  try {
    const res = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { 
        email, 
        amount: amount * 100, // Convert to kobo
        callback_url,
        currency: 'NGN'
      },
      { 
        headers: { 
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(`Paystack initialization failed: ${error.response?.data?.message || error.message}`);
  }
};

export const verifyPaystack = async (reference) => {
  try {
    const res = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { 
        headers: { 
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` 
        } 
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(`Paystack verification failed: ${error.response?.data?.message || error.message}`);
  }
};

export const verifyWebhookSignature = (payload, signature, secret) => {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');
  return hash === signature;
};
