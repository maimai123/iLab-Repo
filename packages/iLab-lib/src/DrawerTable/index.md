---
group:
  title: DrawerTable 组件
  order:
---

## DrawerTable 组件

### 基础用法

```tsx
import React, { useRef } from 'react';
import { DrawerTable } from 'ilab-lib';
import { ActionType } from 'ilab-lib/lib/ProTable';
import { Tag, Button, Space, Input } from 'antd';
import moment from 'moment';

export default () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'DateRange',
      dataIndex: 'dateRange',
      key: 'dateRange',
      search: true,
      valueType: 'dateRange',
    },
    {
      title: 'PersonName',
      dataIndex: 'personName',
      key: 'personName',
      search: true,
      searchProps: {
        placeholder: '请输入 Name',
      },
      render: text => <a>{text}</a>,
      sorter: (a, b) => a.personName.length - b.personName.length,
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      key: 'sex',
      search: true,
      valueType: 'select',
      valueEnum: new Map([
        [1, 'male'],
        [2, 'female'],
      ]),
      searchProps: {
        showSearch: true,
        filterOption: (input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      search: true,
      valueType: 'select',
      valueEnum: new Map([
        [1, { text: 'online', status: 'success' }],
        [2, { text: 'offline', status: 'error' }],
      ]),
    },
    {
      title: 'Tree',
      dataIndex: 'tree',
      key: 'tree',
      search: true,
      valueType: 'treeSelect',
      searchProps: {
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
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
      search: true,
      valueType: 'cascader',
      searchProps: {
        options: [
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
        ],
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      fixed: 'right',
      width: 80,
    },
  ];

  const dataSource = new Array(40).fill('').map((_, index) => ({
    id: index,
    personName: 'name',
    sex: 1,
    status: 1,
    address: 'address',
    tags: ['tag1', 'tag2'],
    area: ['zhejiang'],
  }));

  const toolbar = {
    options: {
      columnSetting: true,
    },
    showFilter: true
  };

  const actionRef = useRef<ActionType>();

  return (
    <DrawerTable
      actionRef={actionRef}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      toolbar={toolbar}
      showFilter
      formProps={{
        initialValues: {
          dateRange: [moment(), moment()],
        },
      }}
      formMode='static'
    />
  );
};
```

### API

#### DrawerTable

| 属性              | 说明                                                                            | 类型                                                                | 默认值                         |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------ |
| request           | 获取 `dataSource` 的方法                                                        | `(params?: {pageSize,current},sort,filter) => {data,success,total}` | -                              |
| params            | 用于 request 查询的额外参数，一旦变化会触发重新加载                             | object                                                              | -                              |
| columns           | 列定义，[ProColumn](#procolumn-列定义)                                          |                                                                     | --                             |
| tableClassName    | 表格类名                                                                        | string                                                              | --                             |
| tableStyle        | 表格样式                                                                        | `React.CSSProperties`                                               | --                             |
| formClassName     | 搜索表单类名                                                                    | string                                                              | --                             |
| formStyle         | 搜索表单样式                                                                    | `React.CSSProperties`                                               | --                             |
| formProps         | 搜索表单属性，详见 antd [Form 组件](https://ant.design/components/form-cn/#API) | object                                                              | --                             |
| toolbar           | 工具栏                                                                          | [Toolbar](#toolbar-props-定义)                                      | --                             |
| actionRef         | Table action 的引用，便于自定义触发，[ActionRef 手动触发](#actionref-手动触发)  | `MutableRefObject<FormInstance>`                                    | --                             |
| defaultPagination | 默认分页方式                                                                    | `{ current: number, pageSize: number }`                             | `{ current: 1, pageSize: 10 }` |
| formMode          | 搜索项展开的展示模式                                                            | `fixed` \| `static`                                                 | `fixed`                        |
| defaultCollapsed  | 搜索表单默认收起状态                                                            | boolean                                                             | true                           |
| showFilter  | 是否默认展示筛选按钮                                                            | boolean                                                             | false                           |
| drawerProps  | 筛选组件props                                                            | drawerProps                                                             |                            |
| onFilterSearch    | 搜索回调                                                                        | (values: any) => void                                               | --                             |
| onFilterReset     | 重置回调                                                                        | () => void                                                          | --                             |

> **注意**
>
> 组件中 `pagination` 属性中配置项 `current`、`pageSize`、`total`、`showQuickJumper`、`showSizeChanger`、`showTotal`、`onChange`、`onShowSizeChange` 已根据业务内容进行重写，重复配置无效， `current`、`pageSize` 属性可在 `defaultPagination` 中进行修改

#### ProColumn 列定义

| 属性           | 说明                                                | 类型                                                                      | 默认值                |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------------------- | --------------------- |
| dataIndex      | 列数据在数据项中对应的路径                          | string                                                                    | --                    |
| valueType      | 渲染值类型                                          | `text \| select \| treeSelect \| date \| dateRange \| cascader \| option` | `custom`                |
| valueEnum      | 值的枚举，会自动转化把值当成 key 来取出要显示的内容 | [ValueEnum](#valueEnum-定义)                                              | -                     |
| search         | 是否在搜索栏中显示                                  | boolean                                                                   | false                 |
| searchProps    | 透传给查询组件的属性                                | object                                                                    | -                     |
| hideInTable    | 是否在表格中隐藏                                    | boolean                                                                   | false                 |
| dateTimeFormat | 时间类型数据显示格式                                | string                                                                    | `yyyy-MM-DD HH:mm:ss` |
| order          | 筛选项权重，权重大的在前                            | number                                                                    | 0                     |

#### ValueEnum 定义

```ts
type PresetStatusColorType =
  | 'success'
  | 'processing'
  | 'default'
  | 'error'
  | 'warning';

type IValueEnum = Map<
  any,
  | string
  | {
      text: string;
      status: PresetStatusColorType;
    }
>;
```
#### drawerProps

| 属性             | 说明                                                            | 类型                | 默认值  |
| ---------------- | --------------------------------------------------------------- | ------------------- | ------- |
| title           | 自定义标题                                    | ReactNode            | -       |
| width           | 宽度                                    | string | number            | 520       |
| filterProps         | 搜索 prop                              |  FilterFormProps  | -       |
| onChange          | 确定回调                                                        | (values) => void    | -       |
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
| valueType   | 字段展示类型                                                             | `text \| select \| treeSelect \| date \| dateRange`  | `custom`
| valueEnum   | 当 valueType 为 select 时，配置可选项                                    | Map                                                 | -      |
| fieldProps | 透传给查询组件的属性                                                     | object                                              | -      |
| order       | 筛选项权重，权重大的在前                                                 | number                                              | 0      |
| -           | 其他属性同 [Form.Item](https://ant.design/components/form-cn/#Form.Item) |

#### toolbar Props 定义

| 属性    | 说明                                 | 类型                                             | 默认值 |
| ------- | ------------------------------------ | ------------------------------------------------ | ------ |
| actions | 左侧操作栏                           | `React.ReactNode[]`                              | --     |
| options | 右侧操作栏，包括刷新、列展示选择功能 | `{ refresh?: boolean, columnSetting?: boolean }` |        | -- |
| slot    | 右侧操作栏，功能插槽                 | `React.ReactNode[]`                              |        | -- |
| showFilter    | 右侧操作栏前插入筛选，筛选项根据column配置 | Boolean                              |        | -- |
| drawerProps  | 筛选组件props                                                            | drawerProps                                                             |                            |


#### ActionRef 手动触发

有时我们要手动触发 table 的 reload 等操作，可以使用 actionRef，可编辑表格也提供了一些操作来帮助我们更快的实现需求。

```ts
interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  getFilterValue: () => object;
  setFilterValue: (val: any) => void;
  resetFilter: () => void;
}

const ref = useRef<ActionType>();

<DrawerTable actionRef={ref} />;
// 刷新
ref.current.reload();
// 获取搜索框数据
ref.current.getFilterValue();
// 设置搜索框数据
ref.current.setFilterValue(val);
// 重置搜索框数据
ref.current.resetFilter();
```
