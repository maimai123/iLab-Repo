import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Space, Button } from 'antd';
import { FormProps, FormItemProps } from 'antd/lib/form';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import Select from './Select';
import TreeSelect from './TreeSelect';
import Input from './Input';
import DatePicker from './DatePicker';
import DateRangePicker from './DateRangePicker';
import Cascader from './Cascader';
import './index.less';

export type ValueType =
  | 'text'
  | 'select'
  | 'treeSelect'
  | 'date'
  | 'dateRange'
  | 'cascader'
  | 'option'
  | 'custom';

export interface ActionType {
  getFieldsValue: () => any;
  setFieldsValue: (val: any) => void;
  resetFields: () => void;
}

export interface IField extends FormItemProps {
  name: string;
  valueType?: ValueType;
  valueEnum?: Map<any, any>;
  fieldProps?: any; // 透穿给表单项内的组件的 props
  order?: number; // 排序
  show?: boolean; // 是否展示该字段
}

export interface TableFilterProps {
  formProps?: FormProps;
  fields: IField[];
  onSearch: (values: any) => void;
  onReset: () => void;
  className?: string;
  style?: React.CSSProperties;
  actionRef?:
  | React.MutableRefObject<ActionType | undefined>
  | ((actionRef: ActionType) => void);
  mode?: 'fixed' | 'static';
  defaultCollapsed?: boolean;
}

const GUTTER = 16;
const SPAN = 6;
// 收起时展示字段数
const LINE_COUNT = 3;

const TableFilter: React.FC<TableFilterProps> = ({
  formProps,
  fields,
  onSearch,
  onReset,
  className,
  style,
  actionRef,
  mode = 'fixed',
  defaultCollapsed = true,
}) => {
  const [form] = Form.useForm();
  // 是否收起
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  // 是否需要展开收起按钮
  const needCollapsedButton = fields.length > LINE_COUNT;

  useEffect(() => {
    const userAction: ActionType = {
      getFieldsValue: () => form.getFieldsValue(),
      setFieldsValue: (val) => form.setFieldsValue(val),
      resetFields: () => form.resetFields(),
    };

    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue(formProps?.initialValues || {});
  }, [formProps?.initialValues]);


  const matchItem = (field: IField) => {
    switch (field.valueType) {
      case 'select':
        return field.valueEnum ? (
          <Select placeholder="请选择" options={field.valueEnum} {...field.fieldProps} />
        ) : null;
      case 'treeSelect':
        return <TreeSelect placeholder="请选择" {...field.fieldProps} />;
      case 'date':
        return <DatePicker placeholder="请选择" {...field.fieldProps} />;
      case 'dateRange':
        return <DateRangePicker placeholder={['开始时间', '结束时间']} {...field.fieldProps} />;
      case 'cascader':
        return <Cascader {...field.fieldProps} />;
      default:
        return <Input placeholder="请输入" {...field.fieldProps} />;
    }
  };

  // 实际渲染字段
  const renderFields = (data: IField[]) => {
    return data
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((item, index) => ({
        ...item,
        show: index < LINE_COUNT || !collapsed,
      }));
  };

  // 搜索
  const search = () => {
    const values = form.getFieldsValue();
    onSearch && onSearch(values);
  };

  // 重置
  const reset = async () => {
    await form.resetFields();
    onReset && onReset();
  };

  if (!(fields instanceof Array && fields.length)) return null;

  return (
    <div
      className={classnames(
        'iLab-table-filter',
        collapsed
          ? 'iLab-table-filter-collapsed'
          : 'iLab-table-filter-expanded',
        `iLab-table-filter-${mode}`,
        className,
      )}
      style={style}
    >
      <Form
        className="iLab-table-filter-form"
        layout="vertical"
        form={form}
        {...formProps}
      >
        <Row gutter={GUTTER}>
          {renderFields(fields).map((filed) => {
            const {
              valueEnum,
              valueType,
              fieldProps,
              order,
              show,
              ...rest
            } = filed;
            return (
              <Col
                span={SPAN}
                key={filed.name}
                style={{ display: filed.show ? 'block' : 'none' }}
              >
                <Form.Item {...rest}>{matchItem(filed)}</Form.Item>
              </Col>
            );
          })}
          <Col span={SPAN} key="actions">
            <Form.Item
              label=" "
              noStyle={
                renderFields(fields).filter((item) => item.show).length %
                  (LINE_COUNT + 1) ===
                0
              }
            >
              <Space>
                <Button
                  className="iLab-table-filter-btn"
                  type="primary"
                  onClick={search}
                >
                  搜索
                </Button>
                <Button className="iLab-table-filter-btn" onClick={reset}>
                  重置
                </Button>
                {needCollapsedButton && (
                  <Button
                    icon={
                      collapsed ? <DownOutlined /> : <UpOutlined />
                    }
                    onClick={() => {
                      setCollapsed(!collapsed);
                    }}
                  />
                )}
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TableFilter;
