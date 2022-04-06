import React from 'react';
import { InputNumber as UInput, InputNumberProps } from 'antd';

const Input: React.FC<InputNumberProps> = (props) => {
  return <UInput autoComplete="off" {...props} />;
};

export default Input;
