import React, { forwardRef, useImperativeHandle } from 'react'
import { Row, Col, Form, Button, Space, FormProps, FormItemProps, RowProps, ColProps } from 'antd'
import classnames from 'classnames'
import Select from '../TableFilter/Select';
import TreeSelect from '../TableFilter/TreeSelect';
import Input from '../TableFilter/Input';
import DatePicker from '../TableFilter/DatePicker';
import DateRangePicker from '../TableFilter/DateRangePicker';
import Cascader from '../TableFilter/Cascader';

import './index.less'

export type valueType =
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
  label?: React.ReactNode;
  name: string;
  valueType?: valueType;
  valueEnum?: Map<any, any>;
  fieldProps?: any; // 传给内部表单组件的props
  order?: number; // 排序
  show?: boolean; // 是否展示该字段
}

export interface FilterFormProps {
  className?: string
  style?: React.CSSProperties
  formProps?: FormProps
  rowProps?: RowProps
  colProps?: ColProps
  options: IField[]
  column?: number // 一行几个
  showAction?: boolean // 是否展示默认操作按钮
  onSearch?: (values: any) => void;
  onReset?: () => void
  renderCustomAction?: () => React.ReactNode
}

const FilterForm: React.ForwardRefRenderFunction<unknown, FilterFormProps> = (
  props: FilterFormProps,
  parentRef
) => {
  const {
    className,
    style,
    column = 2,
    formProps,
    rowProps,
    colProps,
    options = [],
    renderCustomAction,
    onSearch,
    onReset,
    showAction = false, // 是否显示操作组，默认不显示
  } = props

  const [form] = Form.useForm()

  useImperativeHandle(parentRef, () => {
    return {
      ...form,
    }
  })

  const defaultSpan = 24 / column

  const matchItem = (field: IField) => {
    switch (field.valueType) {
      case 'select':
        return field.valueEnum ? (
          <Select options={field.valueEnum} {...field.fieldProps} />
        ) : null;
      case 'treeSelect':
        return <TreeSelect {...field.fieldProps} />;
      case 'date':
        return <DatePicker {...field.fieldProps} />;
      case 'dateRange':
        return <DateRangePicker {...field.fieldProps} />;
      case 'cascader':
        return <Cascader {...field.fieldProps} />;
      case 'custom':
        return field.children;
      default:
        return <Input {...field.fieldProps} />;
    }
  };

  const handleReset = () => {
    form.resetFields()
    if (onReset) {
      onReset()
    } else if (formProps?.onFinish) {
      const fields = form.getFieldsValue()
      formProps?.onFinish && formProps?.onFinish(fields)
    }
  }

  const handleSubmit = async () => {
    await form.validateFields()
    const values = form.getFieldsValue();
    onSearch && onSearch(values);
  }

  return (
    <Form
      className={classnames('iLab-filter-form', className)}
      style={style}
      form={form}
      colon={false}
      layout="vertical"
      {...formProps}
    >
      <Row gutter={16} className="iLab-filter-form-row" {...rowProps}>
        {options.sort((a, b) => (a.order || 0) - (b.order || 0)).map(
          (
            item: IField,
            index: React.Key | null | undefined
          ) => {
            const { valueType, valueEnum, fieldProps, ...rest } = item
            return (
              <Col key={index} span={defaultSpan} className="iLab-filter-form-col" {...colProps}>
                <Form.Item {...rest} >
                  {matchItem(item)}
                </Form.Item>
              </Col>
            )
          }
        )}
      </Row>
      <Form.Item>
        <Space size={12}>
          {renderCustomAction ? (
            renderCustomAction()
          ) : (
            showAction && <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" onClick={handleSubmit}>
                查询
              </Button>
            </Space>
          )}
        </Space>
      </Form.Item>
    </Form>
  )
}

export default forwardRef(FilterForm)
