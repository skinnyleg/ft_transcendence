'use client';
import { useRef } from "react";
import React from "react";


const UseInputRefs = (length: number) => {
    return Array(length).fill(0).map(() => useRef<HTMLInputElement | null>(null));
  };

export default UseInputRefs;