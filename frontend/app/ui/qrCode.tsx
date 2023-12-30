'use client';
import Image from 'next/image';
import { useState, useRef } from 'react';
import React from 'react';
// import useInputRefs from './useInputRefs';

interface VerificationInputProps {
  onSubmit: (code: string) => void;
  inputRefs: React.RefObject<HTMLInputElement>[];
}


const VerificationInput: React.FC<VerificationInputProps> = ({ inputRefs, onSubmit }) => {

  const [code, setCode] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let newCode = code;
    newCode = newCode.substring(0, index) + e.target.value + newCode.substring(index + 1);
    setCode(newCode);
    if (newCode.length < 6 && e.target.value !== '') {
      inputRefs[index + 1]?.current?.focus();
    }
    if (newCode.length === 6) {
      onSubmit(newCode);
    }
  };

  // Handle Delete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === '46' || e.key === '8' && index > 0) {
      console.log("im here")
      let newCode = code;
      newCode = newCode.substring(0, index - 1) + newCode.substring(index);
      setCode(newCode);
      inputRefs[index - 1]?.current?.focus();
    }
  };

  return (
    <div className="flex space-x-2 justify-center">
      {[...Array(6)].map((_, index) => (
        <input
          key={index}
          type="text"
          value={code[index] || ''}
          onKeyDown={(e) => handleKeyDown}
          onChange={(e) => handleChange(e, index)}
          ref={inputRefs[index]}
          className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 hover:border-blue-500"
        />
      ))}
    </div>
  );
};

export default VerificationInput;
