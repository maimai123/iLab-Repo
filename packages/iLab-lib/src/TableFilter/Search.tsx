import React from 'react';
import { Input as UInput } from 'antd';
import { InputProps } from 'antd/lib/input';

const Input: React.FC<InputProps> = (props) => {
  return <UInput.Search autoComplete="off" {...props} />;
};

export default Input;
