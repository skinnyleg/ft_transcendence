'use client';
// pages/VerifyCode.tsx
import React, { useState } from 'react';
import VerificationInput from '../ui/qrCode';
import Image from 'next/image'


const VerifyCode: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (code: string) => {
    try {
      // Send the code to the backend for verification
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Verification successful:', data);
      }
      else if (response.status === 404) {
        setError('Verification failed');
      }
      else {
        console.error('Verification failed');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  return (
    <div className="bg-signin flex flex-col justify-center items-center h-screen">
      <div className={`bg-signin flex flex-col justify-center items-center h-screen ${!error ? 'hidden' : ''} mx-auto`}>
        <h1 className="text-2xl font-bold mb-4 font-serif">Verification failed</h1>
      </div>
      <div className={`${error ? 'hidden' : ''}`}>
        <h1 className="text-2xl font-bold mb-4 font-serif">Enter Verification Code</h1>
        <p className="md:text-sm lg:text-lg mb-1 text-xs">Please enter the 6-digit code from your authenticator app.</p>
        <VerificationInput onSubmit={handleSubmit} />
      </div>
    </div>

      
  );
};

export default VerifyCode;
