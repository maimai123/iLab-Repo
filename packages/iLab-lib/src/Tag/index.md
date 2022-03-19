---
group:
  title: Tag 组件
  order: 11
---

## Tag 组件

### 基础用法

```tsx
import React from 'react';
import { Tag, Icon } from 'ilab-lib';

export default () => <div>
  <Tag text="成功" status="success" icon={<Icon type="icon-ziduanshezhi" />} />
  <Tag text="失败" status="error" />
  <Tag text="警告" status="warning" />
  <Tag text="禁止" status="stop" />
  <Tag text="禁止" status="disable" />
  <Tag text="自定义" status="#3d62d2" />
</div>;
```

### API

| 属性     | 说明     | 类型      | 默认值 |
| -------- | -------- | --------- | ------ |
| icon | 图标 | ReactNode | -      |
| text | 内容 | ReactNode | -      |
| status | 状态 | `success \| error \| warning \| disable \| stop` 或 color | -      |
