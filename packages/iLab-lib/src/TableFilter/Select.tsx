import React from 'react';
import { Select as USelect } from 'antd';

const { Option } = USelect;

export type SelectProps = Omit<
  typeof USelect,
'SECRET_COMBOBOX_MODE_DO_NOT_USE' | 'Option' | 'OptGroup'
> & {
  options: Map<any, any>;
  [x: string]: any;
};

const Select: React.FC<SelectProps> = ({ options, ...rest }) => {
  return (
    <USelect {...rest} allowClear>
      {Array.from(options).map((option) => (
        <Option value={option[0]} key={option[0]}>
          {option[1]}
        </Option>
      ))}
    </USelect>
  );
};

export default Select;
