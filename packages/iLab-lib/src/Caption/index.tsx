import React from 'react';
import classnames from 'classnames';

import './index.less';

export interface ICaptionProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Caption({ className, style, children }: ICaptionProps) {
  return (
    <div className={classnames('iLab-caption', className)} style={style}>
      <span className="iLab-caption-sign" />
      {children}
    </div>
  );
}
