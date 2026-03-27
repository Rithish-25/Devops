import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', style = {}, ...props }) => {
  const baseStyles = "btn-base";

  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: 'var(--color-white)',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
      lineHeight: '1',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-white)',
      border: '2px solid var(--color-white)',
      lineHeight: '1',
    }
  };

  return (
    <motion.button
      className={`${baseStyles} ${className}`}
      style={{ ...variants[variant], ...style, opacity: props.disabled ? 0.7 : 1, cursor: props.disabled ? 'not-allowed' : 'pointer' }}
      onClick={!props.disabled ? onClick : undefined}
      whileHover={!props.disabled ? { scale: 1.05 } : {}}
      whileTap={!props.disabled ? { scale: 0.95 } : {}}
      {...props}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  );
};

export default Button;
