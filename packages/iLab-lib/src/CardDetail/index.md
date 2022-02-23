---
group:
  title: CardDetail 组件
  order: 10
---

## CardDetail 组件

### 基础用法

```tsx
import React from 'react';
import { Button } from 'antd'
import { CardDetail } from 'ilab-lib';

export default () => {
  const list = [{label: '姓名', value: '麦麦'}, {label: '姓名', value: '麦麦'}, {label: '姓名', value: '麦麦'}, {label: '姓名', value: '麦麦'}, {label: '姓名', value: '麦麦'}]
  return (
    <CardDetail title="标题" extra={<Button>基础信息</Button>} list={list}>其他信息</CardDetail>
  )
};
```

### API

| 属性     | 说明     | 类型      | 默认值 |
| -------- | -------- | --------- | ------ |
| list | 列项list | Item数组 | -      |
| column | 展示几列 | number | 4      |
| listProps | 自定义列属性，属性同Descriptions，详见 antd [Descriptions 组件](https://ant.design/components/descriptions-cn/#Descriptions)  | - | -      |
| ... | 其余属性同Card，详见 antd [Card 组件](https://ant.design/components/card-cn/#Card)  | - | -      |

