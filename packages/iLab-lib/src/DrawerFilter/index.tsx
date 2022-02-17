import React, { useRef, useState, memo } from 'react'
import FilterForm from '../FilterForm'
import { Drawer, Button, Space, FormItemProps, ColProps } from 'antd'
import { DrawerProps } from 'antd/lib/drawer'
import { IField, FilterFormProps } from '../FilterForm'
import './index.less'

export interface OptionsType extends FormItemProps {
  colProps?: ColProps
}

export interface IProps extends DrawerProps {
  options: IField[]
  filterProps?: FilterFormProps
  okText?: React.ReactNode
  cancelText?: React.ReactNode
  onChange: (value: any) => void
  children?: React.ReactNode
}

const Index: React.FC<IProps> = (props: IProps) => {
  const {
    title = '筛选',
    width = 500,
    options,
    filterProps,
    onChange,
    onClose,
    okText = '查询',
    cancelText = '重置',
    children = <Button>筛选</Button>,
    ...rest
  } = props
  const formRef = useRef(null)
  const [visible, setVisible] = useState<boolean>(false);

  const handleSubmit = () => {
    // @ts-ignore
    const fields = formRef?.current?.getFieldsValue() || {}
    onChange(fields)
    setVisible(false)
  }

  const handleReset = async () => {
    // @ts-ignore
    formRef.current && (await formRef?.current?.resetFields())
    // @ts-ignore
    const fields = formRef?.current?.getFieldsValue() || {}
    onChange(fields)
    setVisible(false)
  }

  return (
    <>
      <Drawer
        title={title}
        width={width}
        onClose={() => setVisible(false)}
        visible={visible}
        footer={
            <Space className="fr">
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
