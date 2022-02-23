import React from 'react';
import { Card, Descriptions, Divider } from 'antd';
import { CardProps } from 'antd/lib/card'
import { DescriptionsProps } from 'antd/lib/Descriptions'
import classnames from 'classnames';

import './index.less';

interface Item {
  label: React.ReactNode;
  value: React.ReactNode
}

export interface ICardDetailProps extends CardProps {
  list?: Item[]
  column?: number
  listProps?: DescriptionsProps
}

export default function CardDetail(props: ICardDetailProps) {
  const { className, list = [], column = 4, listProps, children } = props;
  return (
    <Card className={classnames('iLab-cardDetail', className)} {...props}>
      <Descriptions column={column} {...listProps}>
        {
          list.map((item: Item, index: number) => (
            <Descriptions.Item key={index} label={item.label}>{item.value}</Descriptions.Item>
          ))
        }
      </Descriptions>
      { children && <Divider /> }
      { children }
    </Card>
  );
}
