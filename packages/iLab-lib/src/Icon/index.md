---
group:
  title: Icon 组件
  order: 1
---

## Icon 组件

### 基础用法

```tsx
import React from 'react';
import { Icon } from 'ilab-lib';

export default () => <Icon type="icontongjibiao" />;
```


### API

| 属性     | 说明     | 类型      | 默认值 |
| -------- | -------- | --------- | ------ |
| type | iconfont图标类型 | string | -      |
| className | 设置图标的样式名 | string | -      |
| className | 设置图标的样式名 | string | -      |
| rotate | 图标旋转角度（IE9 无效） | number | -      |
| spin | 是否有旋转动画 | boolean | false      |
| style | 设置图标的样式，例如 fontSize 和 color | CSSProperties | -      |
