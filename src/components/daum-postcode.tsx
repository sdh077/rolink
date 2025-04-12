// components/DaumPostcode.tsx
import { AddressData } from '@/interface/user';
import React, { useEffect } from 'react';
import { Button } from './ui/button';




interface DaumPostcodeProps {
  onComplete: (data: AddressData) => void;
}

const DaumPostcode: React.FC<DaumPostcodeProps> = ({ onComplete }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleClick = () => {
    new window.daum.Postcode({
      oncomplete: onComplete,
    }).open();
  };

  return (
    <Button type='button' onClick={handleClick} >
      우편번호 검색
    </Button>
  );
};

export default DaumPostcode;
