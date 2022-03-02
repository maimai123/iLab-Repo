---
group:
  title: DrawerFilter 组件
  order: 5
---
### DrawerFilter 组件

抽屉式筛选

Demo: 默认

```tsx
import React from 'react';
import { DrawerFilter } from 'ilab-lib';
import { Input, Button } from 'antd';

export default () => {
  const options = [
    {
      label: '姓名',
      name: 'name',
      valueType: 'text',
    },
    {
      label: '活动时间',
      name: 'datetime',
      valueType: 'dateRange',
    },
  ]
  return (
    <>
      <DrawerFilter
        options={options}
        okText="确定"
        cancelText="取消"
        filterProps={{
          column: 1
        }}
        onSubmit={(values) => {
          console.log(values)
        }}
      />
    </>
  )
};
```
Demo: 自定义

```tsx
import React from 'react';
import { DrawerFilter } from 'ilab-lib';
import { Input, Button } from 'antd';

export default () => {
  const options = [
    {
      label: '姓名',
      name: 'name',
      valueType: 'text',
      rules: [{ required: true, message: '请输入姓名' }],
    },
    {
      label: '活动时间',
      name: 'datetime',
      valueType: 'dateRange',
    },
  ]
  return (
    <>
      <DrawerFilter
        options={options}
        title="新增"
        okText="确定"
        cancelText="取消"
        onSubmit={(values) => {
          console.log(values)
        }}
      >
        <Button>点击弹出</Button>
      </DrawerFilter>
    </>
  )
};
```

### API

#### DrawerFilter

| 属性             | 说明                                                            | 类型                | 默认值  |
| ---------------- | --------------------------------------------------------------- | ------------------- | ------- |
| title           | 自定义标题                                    | ReactNode            | -       |
| width           | 宽度                                    | string | number            | 520       |
| filterProps         | 搜索 prop                              |  FilterFormProps  | -       |
| onSubmit          | 确定回调                                                        | (values) => void    | -       |
| onReset          | 重置回调                                                        | () => void    | -       |
| okText         | 确定文案                                            | ReactNode |  查询 |
| cancelText | 取消文案                                                    | ReactNode             | 重置    |
| children         | 自定义点击区域                                            | ReactNode | button |
| -           | 其他属性同 [Drawer](https://ant.design/components/drawer-cn/#API)

#### FilterFormProps
| 属性             | 说明                                                            | 类型                | 默认值  |
| ---------------- | --------------------------------------------------------------- | ------------------- | ------- |
| className           | 自定义类名                                    | string            | -       |
| style           | 自定义样式                                    | CSSProperties            | -       |
| options           | 列                                    | IField[]            | []       |
| onSearch         | 搜索事件                                                        | (values) => void    | -       |
| onReset          | 重置事件                                                        | () => void    | -       |
| formProps        | 同 antd [Form 组件](https://ant.design/components/form-cn/#API) | object              | -       |
| rowProps        | 同 antd [Grid 组件](https://ant.design/components/grid-cn/#Row) | object              | -       |
| colProps        | 同 antd [Grid 组件](https://ant.design/components/grid-cn/#Col) | object              | -       |
| column         | 一行展示几个                                            | number | 2 |
| showAction | 是否展示操作按钮                                                    | boolean             | false    |
| renderCustomAction | 自定义操作按钮                                                    | ReactNode             |     |


#### IField

| 属性        | 说明                                                                     | 类型                                                | 默认值 |
| ----------- | ------------------------------------------------------------------------ | --------------------------------------------------- | ------ |
| valueType   | 字段展示类型                                                             | `text \| select \| treeSelect \| date \| dateRange \| custom`  | `text`
| valueEnum   | 当 valueType 为 select 时，配置可选项                                    | Map                                                 | -      |
| fieldProps | 透传给查询组件的属性                                                     | object                                              | -      |
| order       | 筛选项权重，权重大的在前                                                 | number                                              | 0      |
| -           | 其他属性同 [Form.Item](https://ant.design/components/form-cn/#Form.Item) |                                                     | -      |
