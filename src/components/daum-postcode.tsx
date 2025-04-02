// components/DaumPostcode.tsx
import { AddressData } from '@/interface/user';
import React, { useEffect } from 'react';




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
    <button type='button' onClick={handleClick} className="p-2 bg-blue-500 text-white rounded">
      우편번호 검색
    </button>
  );
};

export default DaumPostcode;
