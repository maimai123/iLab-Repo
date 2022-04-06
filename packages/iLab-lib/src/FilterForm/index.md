---
group:
  title: FilterForm 组件
  order: 4
---

## FilterForm 组件

Demo: 展示操作项

```tsx
import React from 'react';
import { FilterForm } from 'ilab-lib';
import { Input } from 'antd';

export default () => {
  const options = [
    {
      label: '姓名',
      name: 'name',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      label: '生日',
      name: 'date',
      valueType: 'date',
    },
    {
      label: '爱好',
      name: 'hobby',
      valueType: 'select',
      valueEnum: new Map([
        [1, '篮球'],
        [2, '台球'],
        [3, '排球'],
      ]),
    },
    {
      label: '活动时间',
      name: 'datetime',
      valueType: 'dateRange',
    },
    {
      label: '地区',
      name: 'address',
      valueType: 'cascader',
      fieldProps: {
        options: [
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [
              {
                value: 'hangzhou',
                label: 'hangzhou',
              },
            ],
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
          },
        ],
      },
    },
    {
      label: '组织',
      name: 'org',
      valueType: 'treeSelect',
      fieldProps: {
        treeData: [
          {
            title: '研发部',
            value: '0-0',
            children: [
              {
                title: '前端',
                value: '0-0-1',
              },
              {
                title: '后端',
                value: '0-0-2',
              },
            ],
          },
          {
            title: '设计部',
            value: '0-1',
          },
        ],
      },
    },
    {
      label: '自定义',
      name: 'custom',
      valueType: 'custom',
      customRender: <Input placeholder="请输入内容" />,
    },
  ];
  return (
    <FilterForm
      options={options}
      showAction
      onSearch={(values) => {
        console.log(values);
      }}
      onReset={() => {
        console.log('重置了');
      }}
    />
  );
};
```

Demo: 自定义操作项

```tsx
import React, { useRef } from 'react';
import { FilterForm } from 'ilab-lib';
import { Button } from 'antd';

export default () => {
  const filterRef = useRef();
  const options = [
    {
      label: '姓名',
      name: 'name',
      valueType: 'text',
    },
  ];

  const handleSubmit = () => {
    console.log(filterRef.current.getFieldsValue());
  };

  return (
    <FilterForm
      options={options}
      ref={filterRef}
      renderCustomAction={() => (
        <Button type="primary" onClick={handleSubmit}>
          自定义按钮
        </Button>
      )}
    />
  );
};
```

### API

#### FilterForm

| 属性               | 说明                                                            | 类型             | 默认值 |
| ------------------ | --------------------------------------------------------------- | ---------------- | ------ |
| className          | 自定义类名                                                      | string           | -      |
| style              | 自定义样式                                                      | CSSProperties    | -      |
| options            | 列                                                              | IField[]         | []     |
| onSearch           | 搜索事件                                                        | (values) => void | -      |
| onReset            | 重置事件                                                        | () => void       | -      |
| formProps          | 同 antd [Form 组件](https://ant.design/components/form-cn/#API) | object           | -      |
| rowProps           | 同 antd [Grid 组件](https://ant.design/components/grid-cn/#Row) | object           | -      |
| colProps           | 同 antd [Grid 组件](https://ant.design/components/grid-cn/#Col) | object           | -      |
| column             | 一行展示几个                                                    | number           | 2      |
| showAction         | 是否展示操作按钮                                                | boolean          | false  |
| renderCustomAction | 自定义操作按钮                                                  | ReactNode        |        |

#### IField

| 属性         | 说明                                                                     | 类型                                                                               | 默认值 |
| ------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------ |
| valueType    | 字段展示类型                                                             | `text \| select \| treeSelect \| date \| dateRange \| radio \| cascader \| custom` |
| valueEnum    | 当 valueType 为 select 时，配置可选项                                    | Map                                                                                | -      |
| fieldProps   | 透传给查询组件的属性                                                     | object                                                                             | -      |
| order        | 筛选项权重，权重大的在前                                                 | number                                                                             | 0      |
| customRender | 自定义元素（valueType 为 custom 时有效）                                 | React.reactNode                                                                    | 0      |
| -            | 其他属性同 [Form.Item](https://ant.design/components/form-cn/#Form.Item) |                                                                                    | -      |

#### ref 手动触发

有时我们要手动触发 FilterForm 的 getFieldsValue 等操作，可以使用 ref。

```ts
const formRef = useRef<ActionType>();

<TableFilter ref={formRef} />;
// 获取表单对象
formRef.current.getFieldsValue();
// 设置表单内容
formRef.current.setFieldsValue(val);
// 重置表单
formRef.current.resetFields();
```
