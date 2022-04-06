import React, { useState, memo } from 'react';
import { Modal, Button, Space, ModalProps } from 'antd';
import Icon from '@/Icon';
import classnames from 'classnames';
import './index.less';

interface IProps extends ModalProps {
  className?: string;
  style?: React.CSSProperties;
  render: React.ReactNode;
  children: React.ReactNode;
}

const Index: React.FC<IProps> = (props: IProps) => {
  const {
    className,
    style,
    children,
    render,
    okText,
    cancelText,
    onOk,
    onCancel,
    ...rest
  } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setLoading(true);
    try {
      onOk && (await onOk(e));
      setVisible(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onCancel && (await onCancel(e));
    setVisible(false);
  };

  return (
    <>
      <Modal
        className={classnames('iLab-modal', className)}
        style={style}
        destroyOnClose
        closeIcon={
          <Icon
            className="iLab-modal-close"
            type="icon-biaoge-quxiao"
            onClick={() => setVisible(false)}
          />
        }
        onCancel={() => setVisible(false)}
        visible={visible}
        footer={
          <Space className="iLab-modal-footer">
            <Button onClick={handleReset}>{cancelText}</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              {okText}
            </Button>
          </Space>
        }
        {...rest}
      >
        {render}
      </Modal>
      <div style={{ display: 'inline-block' }} onClick={() => setVisible(true)}>
        {children}
      </div>
    </>
  );
};
export default memo(Index);
