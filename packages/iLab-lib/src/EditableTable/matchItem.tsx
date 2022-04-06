import React from 'react';
import Select from '../TableFilter/Select';
import Input from '../TableFilter/Input';
import InputNumber from '../TableFilter/InputNumber';
import DatePicker from '../TableFilter/DatePicker';
import DateRangePicker from '../TableFilter/DateRangePicker';
import './index.less';

interface IFields {
  type: 'text' | 'number' | 'date' | 'dateRange' | 'select';
  options?: Map<any, any>;
  [x: string]: any;
}

export default (field: IFields) => {
  const { type = 'text', options, className = 'default-width', ...rest } = field;
  switch (type) {
    case 'select':
      return options ? (
        <Select
          placeholder="请选择"
          options={options}
          className={className}
          {...rest}
        />
      ) : null;
    case 'date':
      return (
        <DatePicker
          placeholder="请选择"
          className={className}
          {...rest}
        />
      );
    case 'dateRange':
      return (
        <DateRangePicker
          placeholder={['开始时间', '结束时间']}
          className={className}
          {...rest}
        />
      );
    case 'number':
      return (
        <InputNumber className={className} {...rest} />
      );
    default:
      return (
        <Input placeholder="请输入" className={className} {...rest} />
      );
  }
};
