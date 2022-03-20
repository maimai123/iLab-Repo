import React from 'react';
import classnames from 'classnames';
import { removeObjectNull } from '@/utils';

import './index.less';

export interface ITagProps {
  icon?: React.ReactNode;
  status: 'success' | 'error' | 'info' | 'stop' | 'disable' | 'warning' | 'default' | string;
  text: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Tag({ className, style, icon, status, text }: ITagProps) {
  const color = status ? (!['success', 'error', 'info', 'stop', 'disable', 'warning', 'default'].includes(status) && status) : '';
  const custom = {
    ...style,
    color: color && '#fff',
    background: color,
    borderColor: color,
  };
  return (
    <div className={classnames('iLab-tag', className, `iLab-tag_${status}`)} style={removeObjectNull(custom)}>
      {icon}
      {text}
    </div>
  );
}
