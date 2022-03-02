import React, { useRef, useState, memo } from 'react'
import { Drawer, Button, Space, FormItemProps, ColProps } from 'antd'
import FilterForm from '../FilterForm'
import Icon from '@/Icon'
import { DrawerProps } from 'antd/lib/drawer'
import { IField, FilterFormProps } from '../FilterForm'
import { FormProps } from 'antd/lib/form';
import './index.less'

export interface OptionsType extends FormItemProps {
  colProps?: ColProps
}

export interface IProps extends DrawerProps {
  options: IField[]
  filterProps?: FilterFormProps
  okText?: React.ReactNode
  cancelText?: React.ReactNode
  onSubmit: (value: any) => void
  onReset?: () => void
  formProps?: FormProps;
  children?: React.ReactNode
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
    okText = '查询',
    cancelText = '重置',
    formProps,
    children = <Button><Icon type={'icon-biaoge-shaixuan1'} />筛选</Button>,
    ...rest
  } = props
  const formRef = useRef(null)
  const [visible, setVisible] = useState<boolean>(false);

  const handleSubmit = async () => {
    // @ts-ignore
    await formRef?.current?.validateFields()
    // @ts-ignore
    const fields = formRef?.current?.getFieldsValue() || {}
    onSubmit && await onSubmit(fields)
    setVisible(false)
  }

  const handleReset = async () => {
    // @ts-ignore
    formRef.current && (await formRef?.current?.handleReset())
    onReset && onReset()
    setVisible(false)
  }

  return (
    <>
      <Drawer
        title={title}
        width={width}
        destroyOnClose
        closable={false}
        extra={<Icon className='drawer-close' type="icon-biaoge-quxiao" onClick={() => setVisible(false)} />}
        onClose={() => setVisible(false)}
        visible={visible}
        footer={
            <Space className="drawer-fr">
            <Button onClick={handleReset}>{cancelText}</Button>
            <Button type="primary" onClick={handleSubmit}>
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
      <div onClick={() => setVisible(true)}>
        {children}
      </div>
    </>
  )
}
export default memo(Index)
