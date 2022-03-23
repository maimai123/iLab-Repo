import { ConfigProvider, Table } from 'antd';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { FormProps } from 'antd/lib/form';
import zhCN from 'antd/lib/locale/zh_CN';
import Tag from '../Tag';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { Key, SorterResult } from 'antd/lib/table/interface';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Resizable, ResizeCallbackData } from 'react-resizable';

import { IProps as drawerProp } from '@/DrawerFilter';

import TableFilter, {
  ActionType as TableFilterActionType,
  IField,
  ValueType as TableFilterValueType,
} from '../TableFilter';
import { removeObjectNull } from '../utils';
import {
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_EMPTY_VALUE,
  DEFAULT_PAGINATION,
} from './constants';
import TableContext from './context';
import Toolbar, { ToolbarProps } from './Toolbar';

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
  icon?: React.ReactNode;
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

ConfigProvider.config({
  theme: {
    primaryColor: '#00A4F5',
  },
});

export interface ProTableProps<Column> extends TableProps<Column> {
  id?: string;
  request?: (
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
  drawerProps?: drawerProp; // 筛选组件
  remember?: boolean; // 记住page功能
  onFilterSearch?: (values: any) => void;
  onFilterReset?: () => void;
}
interface TitleProps {
  width: number;
  onResize?: (e: React.SyntheticEvent<Element, Event>, data: ResizeCallbackData) => any;
  [x: string]: any;
}
// 可伸缩列
const ResizableTitle = (props: TitleProps) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
          }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};


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
  const history = useHistory();
  const pathname = history?.location?.pathname || window.location.pathname;
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      UNLISTEN = history?.listen((location: any) => {
        if (!location.pathname.includes(pathname)) {
          // 跳转详情不清空page
          localStorage.removeItem(`${pathname}-${id}-Page`);
          localStorage.removeItem(`${pathname}-${id}-Params`);
        }
      });
      const localPagination = getParamsStorage('Page');
      const localParams = getParamsStorage('Params');
      setPage(
        (localPagination && JSON.parse(localPagination)) || defaultPagination,
      );
      // 设置搜索参数，默认根据localStorage取
      const sParams = (localParams && JSON.parse(localParams)) || null;
      sParams &&
        Object.keys(sParams).forEach((item) => {
          if (isDateFormat(sParams[item])) {
            sParams[item] = moment(sParams[item]);
          } else if (Array.isArray(sParams[item]) && sParams[item].length > 1) {
            if (isDateFormat(sParams[item][0])) {
              sParams[item] = [
                moment(sParams[item][0]),
                moment(sParams[item][1]),
              ];
            }
          }
        });
      setFormData(sParams || formProps?.initialValues);
    }
    return () => {
      UNLISTEN && UNLISTEN();
    };
  }, []);

  useEffect(() => {
    // 给 actionRef 方法赋值
    const userAction: ActionType = {
      reload: async (resetPageIndex?: boolean) => {
        if (resetPageIndex) {
          setParamsStorage('Page', defaultPagination);
          setPage(_.cloneDeep(defaultPagination));
        } else {
          await fetchData();
        }
      },
      getFilterValue: () => (toolbar?.showFilter
        ? removeObjectNull(formData) : tableFilterRef.current?.getFieldsValue() || {}),
      setFilterValue: (val) => {
        if (toolbar?.showFilter) {
          setFormData({
            ...formData,
            ...val,
          });
        } else {
          tableFilterRef.current?.setFieldsValue(val);
        }
      },
      resetFilter: () => {
        if (toolbar?.showFilter) { // 抽屉式筛选
          setFormData(formProps?.initialValues || {});
        } else {
          tableFilterRef.current?.resetFields();
        }
      },
    };
    if (actionRef && typeof actionRef === 'function') {
      actionRef(userAction);
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, [props, formData]);

  // 存取Storage
  const getParamsStorage = (type: string) =>
    remember && localStorage.getItem(`${pathname}-${id}-${type}`);
  const setParamsStorage = (type: string, param: { [x: string]: any }) => {
    remember &&
      param &&
      localStorage.setItem(`${pathname}-${id}-${type}`, JSON.stringify(param));
  };

  // 是否为日期格式
  const isDateFormat = (value: string) =>
    isNaN(+value) && !isNaN(Date.parse(value));

  // 表单渲染字段
  const fields: IField[] = columns
    .filter((item) => item.search)
    .filter((item) => item.valueType !== 'option')
    .map((item) => ({
      label: item.fieldProps?.label || item.title,
      name: item.dataIndex,
      valueType: item.valueType || 'text',
      valueEnum: item.valueEnum,
      fieldProps: item.fieldProps,
      order: item.order,
    }))
    .map((item) => {
      const map = new Map();
      item.valueEnum &&
        Array.from(item.valueEnum).forEach((e) => {
          map.set(e[0], typeof e[1] === 'object' ? e[1].text : e[1]);
        });
      return {
        ...item,
        valueEnum: item.valueEnum ? map : undefined,
      };
    });

  // 表格渲染字段
  const formatColumns: <T>(col: Array<ProColumn<T>>) => Array<ProColumn<T>> = (
    cols,
  ) => {
    const ret = cols
      .filter((item) => !item.hideInTable)
      .map((item) => {
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
                return <Tag status={v.status} text={v.text} icon={v?.icon} />;
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
              (isInvalidValue(value)
                ? DEFAULT_EMPTY_VALUE
                : moment(value).format(
                  item.dateTimeFormat || DEFAULT_DATE_TIME_FORMAT,
                )),
          };
        }
        return {
          ...item,
          render: (value: any) =>
            (isInvalidValue(value) ? DEFAULT_EMPTY_VALUE : value),
        };
      });
    // 从localStorage取 || 全部选中
    const resetColumn = getParamsStorage('Col')
      ? (getParamsStorage('Col') || '').split(',')
      : ret.map((item) => item.dataIndex);
    setSelectedDataIndex(resetColumn);
    return ret;
  };

  // 格式化请求参数
  const getFetchParams = (obj: object = {}) => {
    // 获取查询条件
    const query = toolbar?.showFilter
      ? formData
      : tableFilterRef.current?.getFieldsValue();
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
    // console.log('搜索参数', removeObjectNull(fetchParams));
    if (!request) return;
    setLoading(true);
    try {
      const res = await request(fetchParams, proSort, proFilter);
      const { success, data, total: paginationTotal } = res;
      if (success) {
        setList(data || []);
        setTotal(paginationTotal || 0);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // 搜索
  const onTableFilterSearch = async (values: any) => {
    if (onFilterSearch) {
      onFilterSearch(values);
    }
    try {
      setFormData(values);
      setParamsStorage('Params', values);
      setParamsStorage('Page', {
        current: 1,
        pageSize: defaultPagination.pageSize,
      });
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
    try {
      setFormData(formProps?.initialValues || {});
      // 为了解决点击重置时需要点两下才清空的bug，强制reset
      tableFilterRef?.current?.resetFields();
      setParamsStorage('Params', formProps?.initialValues || {});
      setParamsStorage('Page', {
        current: 1,
        pageSize: defaultPagination.pageSize,
      });
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
    setParamsStorage('Page', { current, pageSize });
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
    });
    setPage({
      current,
      pageSize: size,
    });
  };

  // 判断无效值
  const isInvalidValue = (val: any) => val === undefined || val === null;

  const localFormProps = {
    ...formProps,
    initialValues: formData,
  };

  const handleResize = (index: number) => (e: any, { size }: any) => {
    const nextColumns = [...tableColumns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    setTableColumns(nextColumns);
  };

  const resetColumn = tableColumns.map((col: any, index: any) => {
    return {
      ...col,
      onHeaderCell: (column: any) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    };
  }).filter((item) => selectedDataIndex.includes(item.dataIndex)); // 过滤setting中没选中的字段

  return (
    <ConfigProvider locale={zhCN}>
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
        <div
          id={id}
          className={classnames('iLab-pro-table', className)}
          style={style}
        >
          {/* 搜索表单 默认展示搜索表单 toolbar showFilter开启则不展示 */}
          {!toolbar?.showFilter && (
            <TableFilter
              className={classnames('iLab-pro-table-filter', formClassName)}
              style={formStyle}
              fields={fields}
              onSearch={onTableFilterSearch}
              onReset={onTableFilterReset}
              formProps={localFormProps}
              mode={formMode}
              defaultCollapsed={defaultCollapsed}
              actionRef={tableFilterRef}
            />
          )}
          {/* 操作栏 */}
          {toolbar && (
            <Toolbar
              {...toolbar}
              fields={fields}
              drawerProps={drawerProps}
              formProps={localFormProps}
              onSearch={onTableFilterSearch}
              onReset={onTableFilterReset}
            />
          )}
          {/* 表格 */}
          <Table
            className={classnames('iLab-pro-table-table', tableClassName)}
            style={tableStyle}
            columns={resetColumn}
            components={{
              header: {
                cell: ResizableTitle,
              },
            }}
            dataSource={list}
            loading={loading}
            locale={{
              emptyText: (
                <div className="empty-container">
                  <img src={require('@/assets/noData.png')} />
                  <div>暂无数据</div>
                </div>
              ),
            }}
            rowClassName={(record, index) => {
              return (index % 2 === 1 && 'light-row') || '';
            }}
            pagination={
              pagination != false && {
                ...pagination,
                current: page.current,
                pageSize: page.pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (t) => `共 ${t} 条`,
                onChange: handlePageChange,
                onShowSizeChange: handlePageSizeChange,
              }
            }
            onChange={(
              changePagination,
              filters: Record<string, Array<Key | boolean> | null>,
              sorter:
              | SorterResult<RecordType>
              | Array<SorterResult<RecordType>>,
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
    </ConfigProvider>
  );
};

export default ProTable;
