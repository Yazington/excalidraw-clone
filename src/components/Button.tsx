import React from 'react';
import '@/components/Button.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function Button({ children, className = '', ...rest }: Props) {
  return (
    <button className={`button ${className}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
