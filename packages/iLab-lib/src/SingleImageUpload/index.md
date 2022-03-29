---
group:
  title: SingleImageUpload 组件
  order: 12
---

## SingleImageUpload 组件

### 基础用法

```tsx
import React from 'react';
import { SingleImageUpload } from 'ilab-lib';

export default () => {
  const handleChange = (url) => {
    console.log(url);
  };
  return (
    <SingleImageUpload
      params={{ a: 1 }}
      value={
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      }
      onSet={handleChange}
    />
  );
};
```

### API

| 属性   | 说明              | 类型          | 默认值                                |
| ------ | ----------------- | ------------- | ------------------------------------- |
| params | 额外传参          | 对象          | -                                     |
| value  | 默认图片地址      | string        | -                                     |
| size   | 文件大小限制（M） | number        | 2                                     |
| url    | 上传接口          | string        | /api/inventory/secure/oss/upload/file |
| onSet  | 上传回调地址      | (url) => void | -                                     |
