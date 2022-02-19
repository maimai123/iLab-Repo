---
title: 快速上手
order: 0
---

## 引用组件

```sh
yarn add ilab-lib
```

## 使用组件

```javascript
import React from 'react';
import { Caption } from 'ilab-lib';

const Wrapper: React.SF = () => {
  return (
    <div>
      <Caption title="快速上手" />
    </div>
  );
};

export default Wrapper;
```
