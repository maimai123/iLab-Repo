import React, { useState, useRef } from 'react'
import { Input } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import styles from './index.module.less'

interface IProps {
  /* 默认值 */
  value: string
  /* 最大字数限制 */
  maxLength?: number
  /* 修改完回调 */
  onOk?: (values: any) => void
}

const Index = (props: IProps) => {
  const [visible, setVisible] = useState(false)
  const { value, maxLength, onOk } = props
  const InputRef = useRef(null)

  const handleOk = () => {
    onOk &&
      onOk(InputRef?.current?.state?.value)
    setVisible(false)
  }
  return (
    <div className={styles.changeInput}>
      {!visible ? (
        <>
          <div className={styles.text}>{value || 0}</div>
          <div className={styles.actions}>
            <EditOutlined onClick={() => setVisible(true)} />
          </div>
        </>
      ) : (
        <>
          <Input
            ref={InputRef}
            placeholder="请输入"
            maxLength={maxLength}
            defaultValue={value === '-' ? '' : value}
          />
          <div className={styles.actions}>
            <CheckOutlined onClick={handleOk} />
            <CloseOutlined onClick={() => setVisible(false)} />
          </div>
        </>
      )}
    </div>
  )
}

export default Index
