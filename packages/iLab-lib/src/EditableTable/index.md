---
group:
  title: EditableTable 组件
  order: 15
---

## EditableTable 组件

### 基础用法

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { EditableTable } from 'ilab-lib';
import moment from 'moment';

export default () => {
  const tableRef = useRef();
  const [dataSource, setDataSource] = useState([
    {
      id: 1,
      name: '麦麦',
      age: '18',
      select: 1,
      date: moment('2020-08-20'),
      dateRange: [moment('2020-08-20'), moment('2020-09-20')],
      address: '浙江杭州',
    },
    {
      id: 2,
      name: '婉君',
      age: '12',
      select: 2,
      date: moment('2020-02-20'),
      address: '浙江杭州',
    },
  ]);

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: 200,
      editable: true,
      rules: [
        {
          required: true,
          message: 'name是必填字段',
        },
      ],
    },
    {
      title: 'age',
      dataIndex: 'age',
      editable: true,
      fieldProps: {
        type: 'number',
      },
    },
    {
      title: 'select',
      dataIndex: 'select',
      editable: true,
      fieldProps: {
        type: 'select',
        options: new Map([
          [1, 'select-1'],
          [2, 'select-2'],
        ]),
      },
    },
    {
      title: 'date',
      dataIndex: 'date',
      editable: true,
      width: 180,
      fieldProps: {
        type: 'date',
        // showTime: true
      },
    },
    {
      title: 'dateRange',
      dataIndex: 'dateRange',
      editable: true,
      width: 300,
      fieldProps: {
        type: 'dateRange',
      },
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: 200,
    },
  ];

  const handleSave = (data) => {
    setDataSource(data);
  };

  useEffect(() => {
    tableRef?.current?.refresh(); // 修改DataSource以后需要强制刷新才会生效
  }, []);

  console.log(dataSource);

  return (
    <EditableTable
      rowKey="id"
      actionRef={tableRef}
      dataSource={dataSource}
      columns={columns}
      scroll={{ x: 'max-content' }}
      onSave={handleSave}
    />
  );
};
```

### API

| 属性    | 说明                                                                       | 类型             | 默认值 |
| ------- | -------------------------------------------------------------------------- | ---------------- | ------ |
| columns | 列定义，[ProColumn](#procolumn-列定义)                                     |                  | --     |
| onSave  | 修改回调                                                                   | (values) => void | -      |
|         | 其他属性同 Table [Table 组件](https://ant.design/components/table-cn/#API) | -                | -      |

#### ProColumn 列定义

| 属性       | 说明                                | 类型    | 默认值 |
| ---------- | ----------------------------------- | ------- | ------ |
| editable   | 是否可编辑                          | boolean | false  |
| fieldProps | 组件参数，[FieldProps](#FieldProps) |         | --     |

#### FieldProps 组件参数

| 属性    | 说明                      | 类型                                             | 默认值 |
| ------- | ------------------------- | ------------------------------------------------ | ------ |
| type    | 组件类型                  | `text \| number \| select \| date \| dateRange ` | text   |
| options | type 为 select 时需要传入 | Map 键值对，同 ProTable 的[ValueEnum]            | --     |
