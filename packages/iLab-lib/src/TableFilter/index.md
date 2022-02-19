---
group:
  title: TableFilter 组件
  order:
---

## TableFilter 组件

### 基础用法

```tsx
import React from 'react';
import { TableFilter } from 'ilab-lib';

export default () => {
  const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      isLeaf: false,
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      isLeaf: false,
    },
  ];
  const fields = [
    { name: 'field1', label: '字段1' },
    {
      name: 'field2',
      valueType: 'select',
      label: '字段2',
      valueEnum: new Map([
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ]),
    },
    { name: 'field3', valueType: 'date', label: '字段3' },
    { name: 'field4', valueType: 'dateRange', label: '字段4' },
    {
      name: 'field5',
      valueType: 'cascader',
      label: '字段5',
      fieldProps: {
        options,
      },
    },
    {
      name: 'field6',
      valueType: 'treeSelect',
      label: '字段6',
      fieldProps: {
        treeData: [
          {
            title: 'Node1',
            value: '0-0',
            children: [
              {
                title: 'Child Node1',
                value: '0-0-1',
              },
              {
                title: 'Child Node2',
                value: '0-0-2',
              },
            ],
          },
          {
            title: 'Node2',
            value: '0-1',
          },
        ],
      },
    },
  ];

  return <TableFilter fields={fields} onSearch={console.log} />;
};
```

### API

#### TableFilter

| 属性             | 说明                                                            | 类型                | 默认值  |
| ---------------- | --------------------------------------------------------------- | ------------------- | ------- |
| fields           | 收起时单行展示列数(含操作列)                                    | IField[]            | 3       |
| onSearch         | 搜索事件                                                        | (values) => void    | -       |
| onReset          | 重置事件                                                        | (values) => void    | -       |
| formProps        | 同 antd [Form 组件](https://ant.design/components/form-cn/#API) | object              | -       |
| mode             | 筛选项展开的展示模式                                            | `fixed` \| `static` | `fixed` |
| defaultCollapsed | 默认收起状态                                                    | boolean             | true    |

#### IField

| 属性        | 说明                                                                     | 类型                                                | 默认值 |
| ----------- | ------------------------------------------------------------------------ | --------------------------------------------------- | ------ |
| valueType   | 字段展示类型                                                             | `text \| select \| treeSelect \| date \| dateRange` | `text` |
| valueEnum   | 当 valueType 为 select 时，配置可选项                                    | Map                                                 | -      |
| fieldProps | 透传给查询组件的属性                                                     | object                                              | -      |
| order       | 筛选项权重，权重大的在前                                                 | number                                              | 0      |
| -           | 其他属性同 [Form.Item](https://ant.design/components/form-cn/#Form.Item) |                                                     | -      |

#### ActionRef 手动触发

有时我们要手动触发 TableFilter 的 getFieldsValue 等操作，可以使用 actionRef，可编辑表格也提供了一些操作来帮助我们更快的实现需求。

```ts
interface ActionType {
  getFieldsValue: () => object;
  setFieldsValue: (val: any) => void;
  resetFields: () => void;
}

const ref = useRef<ActionType>();

<TableFilter actionRef={ref} />;
// 获取表单对象
ref.current.getFieldsValue();
// 设置表单内容
ref.current.setFieldsValue(val);
// 重置表单
ref.current.resetFields();
```
