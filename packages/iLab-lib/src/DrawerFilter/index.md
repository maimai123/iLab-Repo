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
  ];
  return (
    <>
      <DrawerFilter
        options={options}
        okText="确定"
        cancelText="取消"
        width={320}
        filterProps={{
          column: 1,
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      />
    </>
  );
};
```

Demo: 自定义,可通过 actionRef 手动设置字段值, 如需等数据提交完成后关闭抽屉可使用 promise 返回，如下操作 3 秒后关调抽屉

```tsx
import React, { useRef } from 'react';
import { DrawerFilter } from 'ilab-lib';
import { Input, Button } from 'antd';
import { ActionType } from './index';

export default () => {
  const ref = useRef<ActionType>();
  const options = [
    {
      label: '姓名',
      name: 'name',
      rules: [{ required: true, message: '请输入姓名' }],
    },
    {
      label: '活动时间',
      name: 'datetime',
      valueType: 'dateRange',
    },
    {
      label: '设置',
      name: 'setting',
      valueType: 'custom',
      customRender: (
        <Button
          onClick={() =>
            ref.current.setFieldsValue({ setting: '我是手动设置的' })
          }
        >
          手动设置值
        </Button>
      ),
    },
  ];
  return (
    <>
      <DrawerFilter
        options={options}
        actionRef={ref}
        title="新增"
        okText="确定"
        cancelText="取消"
        onSubmit={(values) => {
          console.log(values);
          return new Promise((r, j) => {
            setTimeout(() => {
              r();
            }, 3000);
          });
        }}
      >
        <Button>点击弹出</Button>
      </DrawerFilter>
    </>
  );
};
```

### API

#### DrawerFilter

| 属性        | 说明                                                              | 类型             | 默认值 |
| ----------- | ----------------------------------------------------------------- | ---------------- | ------ | --- |
| title       | 自定义标题                                                        | ReactNode        | -      |
| width       | 宽度                                                              | string           | number | 520 |
| filterProps | 搜索 prop                                                         | FilterFormProps  | -      |
| onSubmit    | 确定回调                                                          | (values) => void | -      |
| onReset     | 重置回调                                                          | () => void       | -      |
| okText      | 确定文案                                                          | ReactNode        |   查询 |
| cancelText  | 取消文案                                                          | ReactNode        | 重置   |
| children    | 自定义点击区域                                                    | ReactNode        | button |
| -           | 其他属性同 [Drawer](https://ant.design/components/drawer-cn/#API) |

#### FilterFormProps

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

| 属性         | 说明                                                                     | 类型                                                          | 默认值 |
| ------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------- | ------ |
| valueType    | 字段展示类型                                                             | `text \| select \| treeSelect \| date \| dateRange \| custom` | `text` |
| valueEnum    | 当 valueType 为 select 时，配置可选项                                    | Map                                                           | -      |
| fieldProps   | 透传给查询组件的属性                                                     | object                                                        | -      |
| order        | 筛选项权重，权重大的在前                                                 | number                                                        | 0      |
| customRender | 自定义元素（valueType 为 custom 时有效）                                 | React.reactNode                                               | 0      |
| -            | 其他属性同 [Form.Item](https://ant.design/components/form-cn/#Form.Item) |                                                               | -      |

#### ActionRef 手动触发

有时我们要手动触发 DrawerFilter 的 getFieldsValue 等操作，可以使用 actionRef，提供了一些操作来帮助我们更快的实现需求。

```ts
interface ActionType {
  getFieldsValue: () => object;
  setFieldsValue: (val: any) => void;
  resetFields: () => void;
}

const ref = useRef<ActionType>();

<DrawerFilter actionRef={ref} />;
// 获取表单对象
ref.current.getFieldsValue();
// 设置表单内容
ref.current.setFieldsValue(val);
// 重置表单
ref.current.resetFields();
```
