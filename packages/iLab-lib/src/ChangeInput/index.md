---
group:
  title: ChangeInput 组件
  order: 10
---

## ChangeInput 组件

### 基础用法

```tsx
import React, { useState } from 'react';
import { ChangeInput } from 'ilab-lib';

export default () => {
const [text, setText] = useState('基础信息')

  return(<ChangeInput value={text} onOk={(val) => setText(val)} />)
};
```

### API

| 属性     | 说明     | 类型      | 默认值 |
| -------- | -------- | --------- | ------ |
| value | 默认文本 | string | -      |
| maxLength | 最大字数限制 | number | -      |
| onOk | 回调 | (value: string)=>void | -      |
