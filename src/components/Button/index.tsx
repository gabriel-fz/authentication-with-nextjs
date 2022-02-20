import React, { ButtonHTMLAttributes } from 'react';

import styles from './button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button className={styles.container} type="button" {...rest}>
      {children}
    </button>
  );
};

export default Button;
