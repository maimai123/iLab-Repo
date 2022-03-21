import React from 'react';
import { Cascader as UCascader } from 'antd';
import { CascaderProps } from 'antd/lib/cascader';

const Cascader: React.FC<CascaderProps<any>> = (props) => {
  return <UCascader {...props} />;
};

export default Cascader;
