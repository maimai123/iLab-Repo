import React from 'react';
import { Input as UInput } from 'antd';
import { InputProps } from 'antd/lib/input';

const Input: React.FC<InputProps> = (props) => {
  return <UInput autoComplete="off" allowClear {...props} />;
};

export default Input;
