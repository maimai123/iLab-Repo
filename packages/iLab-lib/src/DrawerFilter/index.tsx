import React, { useRef, useEffect, useState, memo } from 'react';
import { Drawer, Button, Space, FormItemProps, ColProps } from 'antd';
import FilterForm from '../FilterForm';
import { IField } from '../TableFilter';
import Icon from '@/Icon';
import { DrawerProps } from 'antd/lib/drawer';
import { FormProps } from 'antd/lib/form';
import './index.less';

export interface OptionsType extends FormItemProps {
  colProps?: ColProps;
}

export interface IProps extends DrawerProps {
  options: IField[];
  filterProps?: any;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  onSubmit: (value: any) => void;
  onReset?: () => void;
  actionRef?:
    | React.MutableRefObject<ActionType | undefined>
    | ((actionRef: ActionType) => void);
  formProps?: FormProps;
  children?: React.ReactNode;
}
export interface ActionType {
  getFieldsValue: () => any;
  setFieldsValue: (val: any) => void;
  resetFields: () => void;
}

const Index: React.FC<IProps> = (props: IProps) => {
  const {
    title = '筛选',
    width = 500,
    options,
    filterProps,
    onSubmit,
    onReset,
    onClose,
    actionRef,
    okText = '查询',
    cancelText = '重置',
    formProps,
    children = (
      <Button>
        <Icon type={'icon-biaoge-shaixuan1'} />
        筛选
      </Button>
    ),
    ...rest
  } = props;
  const formRef = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const userAction: ActionType = {
      // @ts-ignore
      getFieldsValue: () => formRef?.current?.getFieldsValue(),
      // @ts-ignore
      setFieldsValue: (val) => formRef?.current?.setFieldsValue(val),
      // @ts-ignore
      resetFields: () => formRef?.current?.resetFields(),
    };

    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, []);

  const handleSubmit = async () => {
    // @ts-ignore
    await formRef?.current?.validateFields();
    // @ts-ignore
    const fields = formRef?.current?.getFieldsValue() || {};
    setLoading(true);
    try {
      onSubmit && (await onSubmit(fields));
      setVisible(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    // @ts-ignore
    formRef.current && (await formRef?.current?.handleReset());
    onReset && onReset();
    setVisible(false);
  };

  return (
    <>
      <Drawer
        title={title}
        width={width}
        destroyOnClose
        closable={false}
        extra={
          <Icon
            className="drawer-close"
            type="icon-biaoge-quxiao"
            onClick={() => setVisible(false)}
          />
        }
        onClose={() => setVisible(false)}
        visible={visible}
        footer={
          <Space className="drawer-fr">
            <Button onClick={handleReset}>{cancelText}</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              {okText}
            </Button>
          </Space>
        }
        {...rest}
      >
        <FilterForm
          ref={formRef}
          options={options}
          formProps={formProps}
          {...filterProps}
        />
      </Drawer>
      <div style={{ display: 'inline-block' }} onClick={() => setVisible(true)}>
        {children}
      </div>
    </>
  );
};
export default memo(Index);
