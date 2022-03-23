---
group:
  title: ProTable 组件
  order: 7
---

## ProTable 组件

### 基础用法

```tsx
import React, { useRef } from 'react';
import { ProTable, Icon } from 'ilab-lib';
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
      order: 3,
      key: 'dateRange',
      search: true,
      valueType: 'dateRange',
    },
    {
      title: 'DateTime',
      order: 2,
      dataIndex: 'date',
      key: 'date',
      search: true,
      valueType: 'date',
    },
    {
      title: 'PersonName',
      dataIndex: 'personName',
      order: 1,
      key: 'personName',
      width: 200,
      search: true,
      fieldProps: {
        label: '姓名',
        placeholder: '请输入 Name',
      },
      render: text => <a>{text}</a>,
    },
    {
      title: 'Sex',
      width: 100,
      dataIndex: 'sex',
      order: 4,
      key: 'sex',
      search: true,
      valueType: 'select',
      valueEnum: new Map([
        [1, 'male'],
        [2, 'female'],
      ]),
      fieldProps: {
        showSearch: true,
        filterOption: (input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      order: 5,
      width: 100,
      key: 'status',
      search: true,
      valueType: 'select',
      valueEnum: new Map([
        [1, { text: '成功', status: 'success' }],
        [2, { text: '失败', status: 'error' }],
        [3, { text: '警报', status: 'warning' }],
        [4, { text: '禁止', status: 'disable' }],
        [5, { text: '阻止', status: 'stop' }],
      ]),
      fieldProps: {
        title: '网络'
      }
    },
    {
      title: 'Tree',
      order: 6,
      dataIndex: 'tree',
      key: 'tree',
      search: true,
      width: 100,
      valueType: 'treeSelect',
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
    {
      title: 'Address',
      dataIndex: 'address',
      width: 100,
      key: 'address',
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
      order: 7,
      search: true,
      width: 500,
      valueType: 'cascader',
      fieldProps: {
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
      width: 100,
    },
  ];

  const dataSource = new Array(40).fill('').map((_, index) => ({
    id: index+1,
    personName: `name${index+1}`,
    sex: 1,
    status: index > 4 ? 1: index + 1,
    address: 'address',
    tags: ['tag1', 'tag2'],
    area: ['zhejiang'],
  }));

  const toolbar = {
    actions: [
      <div key="title" style={{ color: '#344563', fontSize: 20 }}>示例：</div>,
      <Button
        onClick={() => {
          actionRef.current.reload();
        }}
        key="reload"
      >
        reload
      </Button>,
      <Button
        onClick={() => {
          console.log(actionRef.current.getFilterValue());
        }}
        key="getFilterValue"
      >
        getFilterValue
      </Button>,
      <Button
        onClick={() => {
          actionRef.current.setFilterValue({ personName: 'PersonName' });
        }}
        key="setFilterValue"
      >
        setFieldsValue
      </Button>,
      <Button
        onClick={() => {
          console.log(actionRef.current.resetFilter());
        }}
        key="resetFilter"
      >
        resetFilter
      </Button>,
    ],
    options: {
      columnSetting: true,
    },
    slot: [<Input style={{ borderRadius: 4 }} suffix={<Icon type="icon-biaoge-sousuo" style={{ color: '#8791A3' }} />} key="slot-input" placeholder="请搜索" />],
  };

  const actionRef = useRef<ActionType>();

  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      toolbar={toolbar}
      scroll={{ x: 'max-content' }}
      formProps={{
        initialValues: {
          personName: 'asa',
          sex: 1,
        },
      }}
      formMode='static'
    />
  );
};
```

### 筛选抽屉用法

```tsx
import React, { useState, useRef } from 'react';
import { ProTable } from 'ilab-lib';
import { ActionType } from 'ilab-lib/lib/ProTable';
import { Tag, Button, Space, Input, message } from 'antd';

export default () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 200,
      order: 2,
      search: true,
      fieldProps: {
        placeholder: '请输入姓名'
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: true,
      valueType: 'select',
      fieldProps: {
        label: '网络',
        placeholder: '请选择状态'
      },
      order: 1,
      valueEnum: new Map([
        [1, { text: '在线', status: 'success' }],
        [2, { text: '离线', status: 'error' }],
      ]),
    },
  ];

  const dataSource = new Array(12).fill('').map((_, index) => ({
    id: index,
    status: index % 2 === 0 ? 1: 2,
    name: `mm-${index+1}`
  }));

  const toolbar = {
    options: {
      columnSetting: true,
    },
    actions: [
      <Button
        onClick={() => {
          console.log(actionRef.current.getFilterValue());
        }}
        key="getFilterValue"
      >
        getFilterValue
      </Button>,
      <Button
        onClick={() => {
          actionRef.current.setFilterValue({ name: '麦麦' });
        }}
        key="setFilterValue"
      >
        setFieldsValue
      </Button>,
      <Button
        onClick={() => {
          actionRef.current.resetFilter()
        }}
        key="resetFilter"
      >
        resetFilter
      </Button>,
    ],
    slot:[<Button key="del" onClick={() => { message.info(`删除id为${selectedRows.join(',')}的数据`)}} disabled={selectedRows.length === 0}>删除</Button>],
    showFilter: true
  };

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: selectedRows,
    onChange: (keys) => {
      setSelectedRows(keys)
    },
    getCheckboxProps: record => ({ // id为2的不可选
      disabled: record.id === 2,
    }),
  };

  const actionRef = useRef<ActionType>();

  return (
    <ProTable
      id='setting'
      actionRef={actionRef}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      remember
      pagination={false}
      rowSelection={rowSelection}
      toolbar={toolbar}
      formProps={{
        initialValues: {
          status: 1
        },
      }}
      drawerProps={{
        width: 328,
        filterProps: {
          column: 1
        }
      }}
      formMode='static'
    />
  );
};
```

### API

#### ProTable
tips: 开启表格右上角设置配置展示字段时，一个页面有多个表格可能导致存取localStorage冲突，可使用传递不同id避免

| 属性              | 说明                                                                            | 类型                                                                | 默认值                         |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------ |
| id     | 表格唯一标识符                                                                    | string                                                              | 'basic'                             |
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
| remember | 是否记住搜索参数和分页（需要在详情页面配合，详情的路由需包含列表路由）          | boolean           | false |
| drawerProps           | 开启toolbar.showFilter后，透传抽屉组件配置  |    详情见DrawerFilter组件        | --      |
| onFilterSearch    | 搜索回调                                                                        | (values: any) => void                                               | --                             |
| onFilterReset     | 重置回调                                                                        | () => void                                                          | --                             |

> **注意**
>
> 组件中 `pagination` 属性中配置项 `current`、`pageSize`、`total`、`showQuickJumper`、`showSizeChanger`、`showTotal`、`onChange`、`onShowSizeChange` 已根据业务内容进行重写，重复配置无效， `current`、`pageSize` 属性可在 `defaultPagination` 中进行修改

> 开启`remember`以后，需要在详情页配合，具体配置如下：
```javascript
// import React, { useEffect } from 'react';
// import { useHistory } from "react-router-dom";

// const history = useHistory();
// const { pathname } = history.location;
// let UNLISTEN: () => void;

// useEffect(() => {
//   UNLISTEN = history.listen((location: any) => {
//     if (!pathname.includes(location.pathname)) { // 跳转到除列表页的其他页面清空localStorage
//       localStorage.removeItem(`[列表页pathname]-[列表页table的id，默认为basic]-Page`)
//       localStorage.removeItem(`[列表页pathname]-[列表页table的id，默认为basic]-Params`)
//     }
//   })
//   return () => {
//     UNLISTEN && UNLISTEN()
//   }
// }, [])

```


#### ProColumn 列定义

| 属性           | 说明                                                | 类型                                                                      | 默认值                |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------------------- | --------------------- |
| title     | 列头显示文字，如搜索名称和表格名称不一致 可配置fieldProps.label指定搜索名称    | ReactNode | ({ sortOrder, sortColumn, filters }) => ReactNode  | -- （函数用法 3.10.0 后支持）                 |
| dataIndex      | 列数据在数据项中对应的路径                          | string  | --                    |
| key      | React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性    | string  | --      |
| valueType      | 渲染值类型                                          | `text \| select \| treeSelect \| date \| dateRange \| cascader \| option` | `text`                |
| valueEnum      | 值的枚举，会自动转化把值当成 key 来取出要显示的内容 | [ValueEnum](#valueenum-定义)                                              | -                     |
| search         | 是否在搜索栏中显示                                  | boolean                                                                   | false                 |
| fieldProps    | 透传给查询组件的属性                                | object                                                                    | -                     |
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
      color: React.ReactNode
    }
>;
```

#### toolbar Props 定义

| 属性    | 说明                                 | 类型                                             | 默认值 |
| ------- | ------------------------------------ | ------------------------------------------------ | ------ |
| actions | 左侧操作栏                           | `React.ReactNode[]`                              | --     |
| options | 右侧操作栏，包括刷新、列展示选择功能 | `{ refresh?: boolean, columnSetting?: boolean }` |        | -- |
| showFilter    | 右侧操作栏功能插槽前显示筛选按钮（开启则不展示表格上方筛选）| boolean                              |        | false |
| slot    | 右侧操作栏，功能插槽                 | `React.ReactNode[]`                              |        | -- |

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

<ProTable actionRef={ref} />;
// 刷新
ref.current.reload();
// 获取搜索框数据
ref.current.getFilterValue();
// 设置搜索框数据
ref.current.setFilterValue(val);
// 重置搜索框数据
ref.current.resetFilter();
```
