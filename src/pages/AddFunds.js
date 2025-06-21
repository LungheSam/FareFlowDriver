import React, { useState } from 'react';
import '../styles/addFunds.css'; // Optional styling
import DriverHeader from '../components/DriverHeader';

const AddFunds = () => {
  const [cardUID, setCardUID] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {

      const response = await fetch('https://fareflowserver-production.up.railway.app/add-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cardUID,
            amount: parseInt(amount),
        }),
        });

        // You need to extract the response body:
        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
        }

        setMessage(data.message);
        setCardUID('');
        setAmount('');

    } catch (err) {
    //   console.log(err);
      setError(err.response?.data?.error || 'Failed to add funds');
    }
  };

  return (
    <div className="add-funds-container">
      <DriverHeader title='Recharge a Card'/>
      <h2>Add Funds to Card</h2>
      <div className='add-funds-main-container'>
        <form onSubmit={handleAddFunds}>
        <div>
          <label><strong>Card UID:</strong></label>
          <input 
            type="text" 
            value={cardUID} 
            onChange={(e) => setCardUID(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label><strong>Amount (UGX):</strong></label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="action-button secondary">Recharge Card</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      </div>
      
    </div>
  );
};

export default AddFunds;
