import React from 'react';
import { Radio as URadio } from 'antd';
import { RadioProps } from 'antd/lib/radio';

const Radio: React.FC<
RadioProps & {
  options: Map<any, any>;
}
> = ({ options, ...rest }) => {
  return (
    <URadio.Group
      {...rest}
      options={Array.from(options).map((item) => ({
        label: item[1],
        value: item[0],
      }))}
    />
  );
};

export default Radio;
