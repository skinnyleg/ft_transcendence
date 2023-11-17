'use client';
import Image from 'next/image';
import { useState, useRef } from 'react';
import React from 'react';
import UseInputRefs from './useInputRefs';

interface VerificationInputProps {
  onSubmit: (code: string) => void;
}



const VerificationInput: React.FC<VerificationInputProps> = ({ onSubmit }) => {

  const [code, setCode] = useState<string>('');
  const inputRefs = UseInputRefs(6);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let newCode = code;
    newCode = newCode.substring(0, index) + e.target.value + newCode.substring(index + 1);
    setCode(newCode);
    console.log(newCode);
    if (newCode.length < 6 && e.target.value !== '') {
      inputRefs[index + 1]?.current?.focus();
    }
    if (newCode.length === 6) {
      onSubmit(newCode);
    }
  };

  // Handle Delete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0) {
      let newCode = code;
      newCode = newCode.substring(0, index - 1) + newCode.substring(index);
      setCode(newCode);
      inputRefs[index - 1]?.current?.focus();
    }
  };

  return (
    <div className="bg-signin flex justify-center items-center h-1/2">
      <div className="flex space-x-2">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={code[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={inputRefs[index]}
            className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 hover:border-blue-500"
          />
        ))}
      </div>
    </div>
  );
};

export default VerificationInput;
