import React, { useState, useEffect, useRef } from 'react';
import { Table, Badge } from 'antd';
import { FormProps } from 'antd/lib/form';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { SorterResult, Key } from 'antd/lib/table/interface';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { IProps as drawerProps } from '@/DrawerFilter';
import { useHistory } from "react-router-dom"
import classnames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import {
  DEFAULT_PAGINATION,
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_EMPTY_VALUE,
} from './constants';
import TableContext from './context';
import TableFilter, {
  IField,
  ValueType as TableFilterValueType,
  ActionType as TableFilterActionType,
} from '../TableFilter';
import Toolbar, { ToolbarProps } from './Toolbar';
import { removeObjectNull } from '../utils';
import './index.less';

export interface RequestData {
  success: boolean;
  data?: any[];
  total: number;
}

export type ValueType = TableFilterValueType | 'option';

type IValueEnum = Map<
  any,
  | string
  | {
      text: string;
      status: PresetStatusColorType;
    }
>;

interface IPagination {
  current: number;
  pageSize: number;
}

export interface ProColumn<T = any> extends ColumnProps<T> {
  dataIndex: string;
  valueType?: ValueType;
  valueEnum?: IValueEnum;
  search?: boolean;
  hideInTable?: boolean;
  dateTimeFormat?: string;
  fieldProps?: any;
  order?: number;
}

export interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  getFilterValue: () => object;
  setFilterValue: (val: any) => void;
  resetFilter: () => void;
}

export interface ProTableProps<Column> extends TableProps<Column> {
  id?: string;
  request: (
    params: object,
    sort: {
      [key: string]: 'ascend' | 'descend';
    },
    filter: { [key: string]: React.ReactText[] },
  ) => Promise<RequestData>;
  params?: object;
  columns: Array<ProColumn<Column>>;
  className?: string;
  style?: React.CSSProperties;
  tableClassName?: string;
  tableStyle?: React.CSSProperties;
  formClassName?: string;
  formStyle?: React.CSSProperties;
  formProps?: FormProps;
  toolbar?: ToolbarProps;
  actionRef?:
    | React.MutableRefObject<ActionType | undefined>
    | ((actionRef: ActionType) => void);
  defaultPagination?: IPagination;
  formMode?: 'fixed' | 'static';
  defaultCollapsed?: boolean;
  drawerProps?: drawerProps; // 筛选组件
  remember?: boolean; // 记住page功能
  onFilterSearch?: (values: any) => void;
  onFilterReset?: () => void;
}

const ProTable = <RecordType extends object = any>(
  props: ProTableProps<RecordType>,
): JSX.Element => {
  const {
    id = 'basic',
    request,
    params,
    columns,
    className,
    style,
    tableClassName,
    tableStyle,
    formClassName,
    formStyle,
    formProps,
    formMode,
    toolbar,
    actionRef,
    defaultPagination = DEFAULT_PAGINATION,
    defaultCollapsed,
    drawerProps,
    pagination,
    remember,
    onFilterSearch,
    onFilterReset,
    ...rest
  } = props;
  const history = useHistory()
  const { pathname } = history.location
  // loading 状态
  const [loading, setLoading] = useState<boolean>(false);
  // 表格字段
  const [tableColumns, setTableColumns] = useState<
    Array<ProColumn<RecordType>>
  >([]);
  // 选中列字段
  const [selectedDataIndex, setSelectedDataIndex] = useState<string[]>([]);
  // 表格数据
  const [list, setList] = useState<any[]>([]);
  // 数据总条数
  const [total, setTotal] = useState<number>(0);
  // 分页数据
  const [page, setPage] = useState<IPagination>(defaultPagination);
  // 排序
  const [proSort, setProSort] = useState<{
    [key: string]: 'ascend' | 'descend';
  }>({});
  // 筛选
  const [proFilter, setProFilter] = useState<{
    [key: string]: React.ReactText[];
  }>({});
  const tableFilterRef = useRef<TableFilterActionType>();
  const [formData, setFormData] = useState(formProps?.initialValues || {});
  let UNLISTEN: () => void;

  useEffect(() => {
    // 设置表格字段内容
    setTableColumns(formatColumns(columns));
  }, [columns]);

  useEffect(() => {
    fetchData();
  }, [params, page, proSort, setProFilter]);

  useEffect(() => {
    if (remember) {
      UNLISTEN = history.listen((location: any) => {
        if (!location.pathname.includes(pathname)) { // 跳转详情不清空page
          localStorage.removeItem(`${pathname}-${id}-Page`)
        }
      })
      const localPagination = getParamsStorage('Page')
      setPage(localPagination && JSON.parse(localPagination) || defaultPagination)
    }
    return () => {
      UNLISTEN && UNLISTEN()
    }
  }, [])

  useEffect(() => {
    // 给 actionRef 方法赋值
    const userAction: ActionType = {
      reload: async (resetPageIndex?: boolean) => {
        if (resetPageIndex) {
          setParamsStorage('Page', defaultPagination)
          setPage(_.cloneDeep(defaultPagination));
        } else {
          await fetchData();
        }
      },
      getFilterValue: () => tableFilterRef.current?.getFieldsValue() || {},
      setFilterValue: val => tableFilterRef.current?.setFieldsValue(val),
      resetFilter: () => tableFilterRef.current?.resetFields(),
    };
    if (actionRef && typeof actionRef === 'function') {
      actionRef(userAction);
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, [props]);

  // 存取Storage
  const getParamsStorage = (type: string) => localStorage.getItem(`${pathname}-${id}-${type}`)
  const setParamsStorage = (type: string, param: {[x: string]: any}) => {
    remember && param && localStorage.setItem(`${pathname}-${id}-${type}`, JSON.stringify(param))
  }

  // 表单渲染字段
  const fields: IField[] = columns
    .filter(item => item.search)
    .filter(item => item.valueType !== 'option')
    .map(item => ({
      label: item.fieldProps?.label || item.title,
      name: item.dataIndex,
      valueType: item.valueType || 'text',
      valueEnum: item.valueEnum,
      fieldProps: item.fieldProps,
      order: item.order,
    }))
    .map(item => {
      const map = new Map();
      item.valueEnum &&
        Array.from(item.valueEnum).forEach(e => {
          map.set(e[0], typeof e[1] === 'object' ? e[1].text : e[1]);
        });
      return {
        ...item,
        valueEnum: item.valueEnum ? map : undefined,
      };
    });

  // 表格渲染字段
  const formatColumns: <T>(
    col: Array<ProColumn<T>>,
  ) => Array<ProColumn<T>> = cols => {
    const ret = cols
      .filter(item => !item.hideInTable)
      .map(item => {
        // 如果存在自定义渲染方法，则优先执行
        if (item.render) return item;
        // 枚举值处理
        if (item.valueType === 'select' && item.valueEnum) {
          return {
            ...item,
            render: (value: any) => {
              const v = item.valueEnum!.get(value);
              if (isInvalidValue(v)) return DEFAULT_EMPTY_VALUE;
              if (typeof v === 'object') {
                return <Badge status={v.status} text={v.text} />;
              }
              return v;
            },
          };
        }
        // 时间类型数据处理
        if (item.valueType === 'date') {
          return {
            ...item,
            render: (value: string) =>
              isInvalidValue(value)
                ? DEFAULT_EMPTY_VALUE
                : moment(value).format(
                    item.dateTimeFormat || DEFAULT_DATE_TIME_FORMAT,
                  ),
          };
        }
        return {
          ...item,
          render: (value: any) =>
            isInvalidValue(value) ? DEFAULT_EMPTY_VALUE : value,
        };
      });
    // 从localStorage取 || 全部选中
    const resetColumn = getParamsStorage('Col') ? (getParamsStorage('Col') || '').split(',') : ret.map(item => item.dataIndex)
    setSelectedDataIndex(resetColumn);
    return ret;
  };

  // 过滤未选中字段
  const filterUnselectedColumns: <T>(
    col: Array<ProColumn<T>>,
  ) => Array<ProColumn<T>> = cols =>
    cols.filter(item => selectedDataIndex.includes(item.dataIndex));

  // 格式化请求参数
  const getFetchParams = (obj: object = {}) => {
    // 获取查询条件
    const query = toolbar?.showFilter ? formData : tableFilterRef.current?.getFieldsValue();
    const p = {
      ...query,
      current: page.current,
      pageSize: page.pageSize,
      ...obj,
    };
    // 外部传入的参数优先级最高
    if (params) {
      return { ...p, ...params };
    }
    return p;
  };

  // 获取数据
  const fetchData = async () => {
    const fetchParams = getFetchParams();
    if (!request) return;
    setLoading(true)
    try {
      const res = await request(fetchParams, proSort, proFilter);
      const { success, data, total: paginationTotal } = res;
      if (success) {
        setList(data || []);
        setTotal(paginationTotal || 0);
      }
      setLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  };

  // 搜索
  const onTableFilterSearch = async (values: any) => {
    if (onFilterSearch) {
      onFilterSearch(values);
    }
    if (toolbar?.showFilter) setFormData(values)
    try {
      setParamsStorage('Page', { current: 1, pageSize: defaultPagination.pageSize })
      setPage({ current: 1, pageSize: defaultPagination.pageSize });
    } catch (err) {
      console.log(err);
    }
  };

  // 搜索重置
  const onTableFilterReset = async () => {
    if (onFilterReset) {
      onFilterReset();
    }
    if (toolbar?.showFilter) setFormData({})
    try {
      setParamsStorage('Page', { current: 1, pageSize: defaultPagination.pageSize })
      setPage({ current: 1, pageSize: defaultPagination.pageSize });
    } catch (err) {
      console.log(err);
    }
  };

  // 改变页码
  const handlePageChange = async (
    current: number,
    pageSize: number = defaultPagination.pageSize,
  ) => {
    setParamsStorage('Page', { current, pageSize })
    setPage({
      current,
      pageSize,
    });
  };

  // 改变 pageSize
  const handlePageSizeChange = async (current: number, size: number) => {
    setParamsStorage('Page', {
      current,
      pageSize: size,
    })
    setPage({
      current,
      pageSize: size,
    });
  };

  // 判断无效值
  const isInvalidValue = (val: any) => val === undefined || val === null;

  return (
    <TableContext.Provider
      value={{
        id,
        loading,
        setLoading,
        columns: tableColumns,
        setColumns: setTableColumns,
        selectedDataIndex,
        setSelectedDataIndex,
        fetchData,
      }}
    >
      <div id={id} className={classnames("iLab-pro-table", className)} style={style}>
        {/* 搜索表单 默认展示搜索表单 toolbar showFilter开启则不展示 */}
        {
          !toolbar?.showFilter && <TableFilter
            className={classnames('iLab-pro-table-filter', formClassName)}
            style={formStyle}
            fields={fields}
            onSearch={onTableFilterSearch}
            onReset={onTableFilterReset}
            formProps={formProps}
            mode={formMode}
            defaultCollapsed={defaultCollapsed}
            actionRef={tableFilterRef}
          />
        }
        {/* 操作栏 */}
        {toolbar && <Toolbar {...toolbar} fields={fields} drawerProps={drawerProps} formProps={formProps} onSearch={onTableFilterSearch} onReset={onTableFilterReset}/>}
        {/* 表格 */}
        <Table
          className={classnames('iLab-pro-table-table', tableClassName)}
          style={tableStyle}
          columns={filterUnselectedColumns(tableColumns)}
          dataSource={list}
          loading={loading}
          pagination={{
            ...pagination,
            current: page.current,
            pageSize: page.pageSize,
            total,
            showQuickJumper: false,
            showSizeChanger: true,
            showTotal: t => `共${t}条`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageSizeChange,
          }}
          onChange={(
            changePagination,
            filters: Record<string, Array<Key | boolean> | null>,
            sorter: SorterResult<RecordType> | Array<SorterResult<RecordType>>,
            extra,
          ) => {
            if (rest.onChange) {
              rest.onChange(changePagination, filters, sorter, extra);
            }
            // 制造筛选的数据
            setProFilter(removeObjectNull(filters));

            // 修改排序字段及排序方式
            if (Array.isArray(sorter)) {
              const data = sorter.reduce<{
                [key: string]: any;
              }>((pre, value) => {
                if (!value.order) {
                  return pre;
                }
                return {
                  ...pre,
                  [`${value.field}`]: value.order,
                };
              }, {});
              setProSort(data);
            } else if (sorter.order) {
              setProSort({ [`${sorter.field}`]: sorter.order });
            } else {
              setProSort({});
            }
          }}
          {...rest}
        />
      </div>
    </TableContext.Provider>
  );
};

export default ProTable;
