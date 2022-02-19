import React from 'react'
import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/font_2601113_v4hbrtqz9s.js'],
})

interface Props {
  type: string
  className?: string
  onClick?: any
  id?: string
  title?: string
  style?: any
  rotate?: number,
  spin?: boolean,
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onBlur?: () => void
}

export default function Icon(props: Props): JSX.Element {
  return <IconFont {...props} />
}
