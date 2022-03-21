import React from 'react';
import { DatePicker as UDatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';

const { RangePicker } = UDatePicker;

const DateRangePicker: React.FC<RangePickerProps> = (props) => {
  return <RangePicker {...props} />;
};

export default DateRangePicker;
