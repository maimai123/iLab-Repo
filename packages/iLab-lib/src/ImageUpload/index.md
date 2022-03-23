---
group:
  title: ImageUpload 组件
  order: 12
---

## ImageUpload 组件

### 基础用法，默认只上传一张

```tsx
import React from 'react';
import { ImageUpload } from 'ilab-lib';

export default () => {
  const handleChange = (url) => {
    console.log(url)
  }
  return (
    <ImageUpload
      params={{a: 1}}
      value={['https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png']}
      onSet={handleChange}
    />
  )
};
```

### 多张

```tsx
import React from 'react';
import { ImageUpload } from 'ilab-lib';

export default () => {
  const handleChange = (url) => {
    // console.log(url)
  }
  return (
    <ImageUpload
      value={['https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png']}
      multiple
      maxCount={2}
      onSet={handleChange}
    />
  )
};
```

### API

| 属性     | 说明     | 类型      | 默认值 |
| -------- | -------- | --------- | ------ |
| children | 标题内容 | ReactNode | -      |
