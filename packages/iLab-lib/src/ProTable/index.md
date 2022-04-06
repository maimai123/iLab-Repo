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
import { formatPaginationParams, formatTableRequest } from './utils';
import moment from 'moment';
import qs from 'qs';

// 模拟request方法
const getNameList = (params, query, filter) => {
  return fetch(`https://randomuser.me/api?results=53&${qs.stringify(params)}`, {
    params,
    query,
  })
    .then((res) => res.json())
    .then((res) => {
      return {
        data: res.results.map((item, i) => ({
          ...item,
          status: i > 4 ? 1 : i + 1,
        })),
        success: true,
      };
    });
};

export default () => {
  const getList = (params: { [key: string]: any } = {}, sort, filter) => {
    if (params.dob) {
      // 日期格式转义
      params.startTime = params.dob.format('YYYY-MM-DD');
      delete params.dob;
    }
    return formatTableRequest(
      getNameList,
      formatPaginationParams({ ...params, ...sort, ...filter }),
    );
  };

  const columns = [
    {
      title: 'phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone - b.phone,
    },
    {
      title: 'PersonName',
      dataIndex: 'name',
      order: 1,
      key: 'name',
      width: 200,
      search: true,
      fieldProps: {
        label: '姓名',
        placeholder: '请输入 Name',
      },
      render: (text) => <a>{text.title}</a>,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      search: true,
      width: 80,
    },
    {
      title: 'Color',
      width: 100,
      dataIndex: 'color',
      key: 'color',
      search: true,
      filterType: 'right',
      valueType: 'select',
      valueEnum: new Map([
        [1, '红色'],
        [2, '绿色'],
      ]),
      fieldProps: {
        width: 130,
      },
    },
    {
      title: 'Type',
      width: 140,
      dataIndex: 'type',
      key: 'type',
      search: true,
      valueType: 'radio',
      valueEnum: new Map([
        [1, '会员'],
        [2, '非会员'],
      ]),
      render: (text) => {
        return text || '自定义render优先执行';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      order: 5,
      width: 120,
      key: 'status',
      search: true,
      filterType: 'table',
      filterMultiple: false,
      valueType: 'select',
      valueEnum: new Map([
        [1, { text: '成功', status: 'success' }],
        [2, { text: '失败', status: 'error' }],
        [3, { text: '警报', status: 'warning' }],
        [4, { text: '禁止', status: 'disable' }],
        [5, { text: '阻止', status: 'stop' }],
      ]),
      fieldProps: {
        showSearch: true,
        filterOption: (input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
      },
    },
    {
      title: 'DateTime',
      order: 2,
      dataIndex: 'dob',
      key: 'date',
      search: true,
      valueType: 'date',
      render: (text) => <span>{text.date}</span>,
    },
  ];

  const toolbar = {
    options: {
      columnSetting: true,
    },
    slot: [
      <Input
        style={{ borderRadius: 4 }}
        suffix={<Icon type="icon-biaoge-sousuo" style={{ color: '#8791A3' }} />}
        key="slot-input"
        placeholder="请搜索"
      />,
    ],
  };

  const actionRef = useRef<ActionType>();

  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      request={getList}
      rowKey="email"
      toolbar={toolbar}
      remember
      resetRemember={false}
      formProps={{
        initialValues: {
          name: '默认name',
          color: 1,
        },
      }}
      formMode="static"
    />
  );
};
```

### 筛选抽屉用法

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { ProTable } from 'ilab-lib';
import { ActionType } from 'ilab-lib/lib/ProTable';
import { Tag, Button, Space, Input, message } from 'antd';

export default () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [province, setProvince] = useState(undefined);
  const citys = {
    1: [{ label: '杭州市', value: 1 }],
    2: [{ label: '松江区', value: 12 }],
  };

  useEffect(() => {
    setTimeout(() => {
      // 为了获取到最新的参数
      setProvince(actionRef.current.getFilterValue().province);
    }, 10);
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 200,
      order: 2,
      search: true,
      valueType: 'search',
      filterType: 'right',
      fieldProps: {
        width: 206,
        placeholder: '请输入姓名',
      },
    },
    {
      title: 'date',
      dataIndex: 'date',
      key: 'date',
      valueType: 'date',
      dateTimeFormat: 'yyyy-MM-DD',
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
      title: '状态',
      dataIndex: 'status',
      search: true,
      valueType: 'select',
      filterType: 'table',
      fieldProps: {
        label: '网络',
        placeholder: '请选择状态',
      },
      order: 1,
      valueEnum: new Map([
        [1, { text: '在线', status: 'success' }],
        [2, { text: '离线', status: 'error' }],
      ]),
    },
    {
      title: '省',
      order: 5,
      dataIndex: 'province',
      key: 'province',
      search: true,
      valueType: 'select',
      valueEnum: new Map([
        [1, '浙江省'],
        [2, '上海市'],
        [3, '北京市'],
        [4, '广州市'],
      ]),
      fieldProps: {
        onChange: (val) => {
          setProvince(val);
          try {
            actionRef.current.setFilterValue({
              province: val,
              city: (citys[val] && citys[val][0]?.value) || undefined,
            });
          } catch (err) {
            console.log(err);
          }
        },
      },
    },
    {
      title: '市',
      order: 6,
      dataIndex: 'city',
      key: 'city',
      search: true,
      valueType: 'select',
      fieldProps: {
        disabled: !province,
      },
      valueEnum: new Map(
        (citys[province] || []).map((item) => [item.value, item.label]),
      ),
    },
    {
      title: 'Tree',
      order: 3,
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
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
      order: 4,
      search: true,
      width: 200,
      valueType: 'cascader',
      fieldProps: {
        options: [
          {
            value: 'zhejiang',
            label: 'Zhejiang',
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
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

  const dataSource = new Array(12).fill('').map((_, index) => ({
    id: index,
    status: index % 2 === 0 ? 1 : 2,
    name: `mm-${index + 1}`,
    date: 1648107265980,
    province: index > 3 ? 1 : index + 1,
  }));

  const toolbar = {
    options: {
      columnSetting: true,
    },
    actions: [
      <div key="title" style={{ color: '#344563', fontSize: 20 }}>
        示例：
      </div>,
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
          actionRef.current.setFilterValue({ name: '麦麦' });
        }}
        key="setFilterValue"
      >
        setFieldsValue
      </Button>,
      <Button
        onClick={() => {
          actionRef.current.resetFilter();
        }}
        key="resetFilter"
      >
        resetFilter
      </Button>,
    ],
    slot: [
      <Button
        key="del"
        onClick={() => {
          message.info(`删除id为${selectedRows.join(',')}的数据`);
        }}
        disabled={selectedRows.length === 0}
      >
        删除
      </Button>,
    ],
    showFilter: true,
  };

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: selectedRows,
    onChange: (keys) => {
      setSelectedRows(keys);
    },
    getCheckboxProps: (record) => ({
      // id为2的不可选
      disabled: record.id === 2,
    }),
  };

  const actionRef = useRef<ActionType>();

  return (
    <ProTable
      id="setting"
      actionRef={actionRef}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      remember
      pagination={false}
      rowSelection={rowSelection}
      toolbar={toolbar}
      scroll={{ x: 'max-content' }}
      formProps={{
        initialValues: {
          name: '默认',
        },
        filters: {
          status: [1],
        },
        sorters: {
          id: 'ascend',
        },
      }}
      drawerProps={{
        width: 328,
        filterProps: {
          column: 1,
        },
      }}
      formMode="static"
    />
  );
};
```

### API

#### ProTable

tips: 开启表格右上角设置配置展示字段时，一个页面有多个表格可能导致存取 localStorage 冲突，可使用传递不同 id 避免

| 属性              | 说明                                                                                                                            | 类型                                                                | 默认值                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------ |
| id                | 表格唯一标识符                                                                                                                  | string                                                              | 'basic'                        |
| request           | 获取 `dataSource` 的方法                                                                                                        | `(params?: {pageSize,current},sort,filter) => {data,success,total}` | -                              |
| params            | 用于 request 查询的额外参数，一旦变化会触发重新加载                                                                             | object                                                              | -                              |
| columns           | 列定义，[ProColumn](#procolumn-列定义)                                                                                          |                                                                     | --                             |
| tableClassName    | 表格类名                                                                                                                        | string                                                              | --                             |
| tableStyle        | 表格样式                                                                                                                        | `React.CSSProperties`                                               | --                             |
| formClassName     | 搜索表单类名                                                                                                                    | string                                                              | --                             |
| formStyle         | 搜索表单样式                                                                                                                    | `React.CSSProperties`                                               | --                             |
| formProps         | 搜索表单属性，详见 antd [Form 组件](https://ant.design/components/form-cn/#API) filters 表头筛选默认值， sorters 表头排序默认值 | object                                                              | --                             |
| toolbar           | 工具栏                                                                                                                          | [Toolbar](#toolbar-props-定义)                                      | --                             |
| actionRef         | Table action 的引用，便于自定义触发，[ActionRef 手动触发](#actionref-手动触发)                                                  | `MutableRefObject<FormInstance>`                                    | --                             |
| defaultPagination | 默认分页方式                                                                                                                    | `{ current: number, pageSize: number }`                             | `{ current: 1, pageSize: 10 }` |
| formMode          | 搜索项展开的展示模式                                                                                                            | `fixed` \| `static`                                                 | `fixed`                        |
| defaultCollapsed  | 搜索表单默认收起状态                                                                                                            | boolean                                                             | true                           |
| remember          | 是否记住搜索参数和分页（需要在详情页面配合，详情的路由需包含列表路由）                                                          | boolean                                                             | false                          |
| resetRemember     | 是否清除搜索参数 （需先开启 remember，默认跳转不包含路由清除搜索参数，设置为 false 后可自行控制是否清除搜索参数）               | boolean                                                             | true                           |
| drawerProps       | 开启 toolbar.showFilter 后，透传抽屉组件配置                                                                                    | 详情见 DrawerFilter 组件                                            | --                             |
| onFilterSearch    | 搜索回调                                                                                                                        | (values: any) => void                                               | --                             |
| onFilterReset     | 重置回调                                                                                                                        | () => void                                                          | --                             |

> **注意**
>
> 组件中 `pagination` 属性中配置项 `current`、`pageSize`、`total`、`showQuickJumper`、`showSizeChanger`、`showTotal`、`onChange`、`onShowSizeChange` 已根据业务内容进行重写，重复配置无效， `current`、`pageSize` 属性可在 `defaultPagination` 中进行修改

> 开启`remember`以后，需要在详情页配合，具体配置如下：

```javascript
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const history = useHistory();
const { pathname } = history.location;
let UNLISTEN: () => void;

useEffect(() => {
  UNLISTEN = history.listen((location: any) => {
    if (!pathname.includes(location.pathname)) {
      // 跳转到除列表页的其他页面清空localStorage
      localStorage.removeItem(
        `[列表页pathname]-[列表页table的id，默认为basic]-Page`,
      );
      localStorage.removeItem(
        `[列表页pathname]-[列表页table的id，默认为basic]-Params`,
      );
      localStorage.removeItem(
        `[列表页pathname]-[列表页table的id，默认为basic]-Sort`,
      );
      localStorage.removeItem(
        `[列表页pathname]-[列表页table的id，默认为basic]-Filter`,
      );
    }
  });
  return () => {
    UNLISTEN && UNLISTEN();
  };
}, []);
```

#### ProColumn 列定义

| 属性           | 说明                                                                          | 类型                                                                                         | 默认值                                            |
| -------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------- |
| title          | 列头显示文字，如搜索名称和表格名称不一致 可配置 fieldProps.label 指定搜索名称 | ReactNode                                                                                    | ({ sortOrder, sortColumn, filters }) => ReactNode | -- （函数用法 3.10.0 后支持） |
| dataIndex      | 列数据在数据项中对应的路径                                                    | string                                                                                       | --                                                |
| key            | React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性            | string                                                                                       | --                                                |
| valueType      | 渲染值类型                                                                    | `text \| search \| select \| treeSelect \| date \| dateRange \| radio \| cascader \| custom` | text                                              |
| valueEnum      | 值的枚举，会自动转化把值当成 key 来取出要显示的内容                           | [ValueEnum](#valueenum-定义)                                                                 | -                                                 |
| search         | 是否在搜索栏中显示                                                            | boolean                                                                                      | false                                             |
| fieldProps     | 透传给查询组件的属性                                                          | object                                                                                       | -                                                 |
| hideInTable    | 是否在表格中隐藏                                                              | boolean                                                                                      | false                                             |
| dateTimeFormat | 时间类型数据显示格式                                                          | string                                                                                       | `yyyy-MM-DD HH:mm:ss`                             |
| order          | 筛选项权重，权重大的在前                                                      | number                                                                                       | 0                                                 |
| filterType     | 筛选位置配置(开启 search 有效)                                                | `right \| table \| filter `                                                                  | filter                                            |

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
      color: React.ReactNode;
    }
>;
```

#### toolbar Props 定义

| 属性       | 说明                                                         | 类型                                             | 默认值 |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------ | ------ | ----- |
| actions    | 左侧操作栏                                                   | `React.ReactNode[]`                              | --     |
| options    | 右侧操作栏，包括刷新、列展示选择功能                         | `{ refresh?: boolean, columnSetting?: boolean }` |        | --    |
| showFilter | 右侧操作栏功能插槽前显示筛选按钮（开启则不展示表格上方筛选） | boolean                                          |        | false |
| slot       | 右侧操作栏，功能插槽                                         | `React.ReactNode[]`                              |        | --    |

#### ActionRef 手动触发

有时我们要手动触发 table 的 reload 等操作，可以使用 actionRef，可编辑表格也提供了一些操作来帮助我们更快的实现需求。

```ts
interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  getFilterValue: () => object;
  setFilterValue: (val: any) => void;
  resetFilter: () => void;
  getPage: () => void;
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
// 获取分页数据
ref.current.getPage();
```

#### 两个格式参数方法

```ts
/**
 * 将请求格式化成 pro-table 使用的 request 格式
 * @param {Function} method 调用请求
 * @param {Object} params 调用请求
 * @param {Function} method 重构列表数据
 * @return {Promise}
 */

interface RequestData {
  success: boolean;
  data?: any[];
  total: number;
}

export function formatTableRequest(
  method: any,
  params: { [x: string]: any },
  query?: { [x: string]: any } | undefined,
): Promise<RequestData> {
  return new Promise((resolve, reject) => {
    method(params, query)
      .then((res: any) => {
        const resList = res.data?.records || res.data || [];
        resolve({
          success: res.success,
          data: resList,
          total: res.data?.total || 0,
        });
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}

// 格式化请求分数数据
export function formatPaginationParams(
  params: {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  } = { current: 1, pageSize: 10 },
) {
  const { current, ...rest } = params;
  return {
    ...rest,
    pageNum: current,
  };
}
```
