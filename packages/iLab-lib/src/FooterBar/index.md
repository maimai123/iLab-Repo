---
group:
  title: FooterBar 组件
  order: 8
---

## FooterBar 组件

### 基础用法

```tsx
import React from 'react';
import { FooterBar } from 'ilab-lib';
import { Space, Button } from 'antd';

export default () => (
  <div>
    <p>效果见页面底部</p>

    <FooterBar collapsed={false}>
      <Space>
        <Button>取消</Button>
        <Button type="primary">确定</Button>
      </Space>
    </FooterBar>
  </div>
);
```

### API

| 属性             | 说明                        | 类型             | 默认值 |
| ---------------- | --------------------------- | ---------------- | ------ |
| collapsed        | 导航是否折叠                | boolean          | false  |
| normalPadding    | 导航不折叠时左侧 padding 值 | number           | 200    |
| collapsedPadding | 导航折叠时左侧 padding 值   | number           | 48     |
| zIndex           | 同原生 `z-index`            | number \| 'auto' | 1      |
