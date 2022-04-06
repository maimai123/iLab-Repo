import React from 'react';
import { IField } from './index';
import Select from './Select';
import Radio from './Radio';
import TreeSelect from './TreeSelect';
import Input from './Input';
import Search from './Search';
import DatePicker from './DatePicker';
import DateRangePicker from './DateRangePicker';
import Cascader from './Cascader';
import './index.less';

export default (field: IField) => {
  switch (field.valueType) {
    case 'search':
      return (<Search
        className="default-width"
        placeholder="请输入"
        {...field.fieldProps}
      />);
    case 'select':
      return field.valueEnum ? (
        <Select
          className="default-width"
          placeholder="请选择"
          options={field.valueEnum}
          {...field.fieldProps}
        />
      ) : null;
    case 'treeSelect':
      return (
        <TreeSelect
          className="default-width"
          placeholder="请选择"
          {...field.fieldProps}
        />
      );
    case 'date':
      return (
        <DatePicker
          className="default-width"
          placeholder="请选择"
          {...field.fieldProps}
        />
      );
    case 'dateRange':
      return (
        <DateRangePicker
          className="default-width"
          placeholder={['开始时间', '结束时间']}
          {...field.fieldProps}
        />
      );
    case 'cascader':
      return (
        <Cascader
          className="default-width"
          placeholder="请选择"
          {...field.fieldProps}
        />
      );
    case 'radio':
      return field.valueEnum ? (
        <Radio
          className="default-width"
          options={field.valueEnum}
          {...field.fieldProps}
        />
      ) : null;
    case 'custom':
      return field.customRender;
    default:
      return (
        <Input
          className="default-width"
          placeholder="请输入"
          {...field.fieldProps}
        />
      );
  }
};
