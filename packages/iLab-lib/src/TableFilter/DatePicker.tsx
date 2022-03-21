import React from 'react';
import { DatePicker as UDatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker';

const DatePicker: React.FC<DatePickerProps> = (props) => {
  return <UDatePicker {...props} />;
};

export default DatePicker;
