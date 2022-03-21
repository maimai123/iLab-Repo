import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';


interface Props {
  type: string;
  urls?: string[];
  style?: React.CSSProperties;
  className?: string;
  rotate?: number;
  spin?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onBlur?: () => void;
}

export default function Icon(props: Props): JSX.Element {
  const { urls = [] } = props;
  const IconFont = createFromIconfontCN({
    scriptUrl: urls.concat(['//at.alicdn.com/t/font_2601113_v4hbrtqz9s.js']),
  });

  return <IconFont {...props} />;
}
