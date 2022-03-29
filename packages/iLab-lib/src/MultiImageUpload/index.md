---
group:
  title: MultiImageUpload 组件
  order: 13
---

## MultiImageUpload 组件

### 基础用法

```tsx
import React from 'react';
import { MultiImageUpload } from 'ilab-lib';

export default () => {
  const handleChange = (url) => {
    console.log(url);
  };
  return (
    <MultiImageUpload
      value={[
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      ]}
      maxCount={3}
      onSet={handleChange}
    />
  );
};
```

### API

| 属性     | 说明              | 类型          | 默认值                                |
| -------- | ----------------- | ------------- | ------------------------------------- |
| params   | 额外传参          | 对象          | -                                     |
| value    | 默认图片地址      | string[]      | -                                     |
| size     | 文件大小限制（M） | number        | 2                                     |
| maxCount | 最多上传几张      | number        | 2                                     |
| url      | 上传接口          | string        | /api/inventory/secure/oss/upload/file |
| onSet    | 上传回调地址      | (url) => void | -                                     |
