import React from 'react';
import classnames from 'classnames';
import './index.less';

export interface FooterBarProps {
  className?: string;
  style?: React.CSSProperties;
  collapsed?: boolean;
  normalPadding?: number;
  collapsedPadding?: number;
  zIndex?: number | 'auto';
}

const FooterBar: React.FC<FooterBarProps> = props => {
  const {
    className,
    style,
    collapsed = false,
    normalPadding = 200,
    collapsedPadding = 48,
    zIndex = 1,
    children,
  } = props;

  return (
    <div
      className={classnames(
        'uniubi-footer-bar',
        { 'uniubi-footer-bar-collapsed': collapsed },
        className,
      )}
      style={{
        paddingLeft: collapsed ? collapsedPadding : normalPadding,
        zIndex,
        ...style,
      }}
    >
      <div className="uniubi-footer-bar-content">{children}</div>
    </div>
  );
};

export default FooterBar;
