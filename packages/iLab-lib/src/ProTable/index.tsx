import { ConfigProvider, Table } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Key, SorterResult } from 'antd/lib/table/interface';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TableFilter, {
  ActionType as TableFilterActionType,
  IField,
} from '../TableFilter';
import Tag from '../Tag';
import { removeObjectNull } from '../utils';
import {
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_EMPTY_VALUE,
  DEFAULT_PAGINATION,
} from './constants';
import TableContext from './context';
import './index.less';
import ResizableTitle from './ResizableTitle';
import Toolbar from './Toolbar';
import { IPagination, ProColumn, ActionType, ProTableProps } from './interface';

ConfigProvider.config({
  theme: {
    primaryColor: '#00A4F5',
  },
});

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
    resetRemember = true,
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
  // 搜索参数 包括 筛选表格、左侧筛选、表格头部筛选和排序 开启remember可存
  const [formData, setFormData] = useState(
    _.cloneDeep(formProps?.initialValues) || {},
  );
  let UNLISTEN: () => void;

  useEffect(() => {
    // 设置表格字段内容
    setTableColumns(formatColumns(columns));
  }, [columns, proSort, proFilter]);

  useEffect(() => {
    fetchData();
  }, [params, page, proSort, proFilter]);

  useEffect(() => {
    if (remember) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      UNLISTEN = history?.listen((location: any) => {
        if (!location.pathname.includes(pathname)) {
          // 跳转详情不清空page
          removeParamsStorage('Page');
          removeParamsStorage('Params');
          removeParamsStorage('Sort');
          removeParamsStorage('Filter');
        }
      });
      const localPagination = getParamsStorage('Page');
      const localParams = getParamsStorage('Params');
      const localSort = getParamsStorage('Sort');
      const localFilter = getParamsStorage('Filter');

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
      setPage(
        (localPagination && JSON.parse(localPagination)) || defaultPagination,
      );
      setProSort((localSort && JSON.parse(localSort)) || formProps?.sorters || {});
      setProFilter((localFilter && JSON.parse(localFilter)) || formProps?.filters || {});
      setFormData(_.cloneDeep(sParams || formProps?.initialValues));
    } else {
      removeParamsStorage('Page');
      removeParamsStorage('Params');
      removeParamsStorage('Sort');
      removeParamsStorage('Filter');
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
      getFilterValue: () => {
        // 筛选值
        const defaultFilter = toolbar?.showFilter
          ? removeObjectNull(formData)
          : {
            ...removeObjectNull(formData),
            ...tableFilterRef.current?.getFieldsValue(),
          } || {};
        return { ...defaultFilter, ...proSort, ...proFilter };
      },
      setFilterValue: (val) => {
        if (toolbar?.showFilter) {
          setFormData(
            _.cloneDeep({
              ...formData,
              ...val,
            }),
          );
        } else {
          tableFilterRef.current?.setFieldsValue(val);
        }
      },
      resetFilter: () => {
        if (toolbar?.showFilter) {
          // 抽屉式筛选
          setFormData(_.cloneDeep(formProps?.initialValues || {}));
        } else {
          tableFilterRef.current?.resetFields();
        }
      },
      getPage: () => page,
    };
    if (actionRef && typeof actionRef === 'function') {
      actionRef(userAction);
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, [props, formData, proSort, proFilter]);

  // 存取Storage
  const getParamsStorage = (type: string) =>
    remember && localStorage.getItem(`${pathname}-${id}-${type}`);
  const setParamsStorage = (type: string, param: { [x: string]: any }) => {
    remember &&
      param &&
      localStorage.setItem(`${pathname}-${id}-${type}`, JSON.stringify(param));
  };
  const removeParamsStorage = (type: string) =>
    remember && resetRemember && localStorage.removeItem(`${pathname}-${id}-${type}`);

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
      filterType: item.filterType || 'filter',
      customRender: item.customRender,
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

  const getFilterByType = (type: 'filter' | 'right' | 'table') => {
    return type ? fields.filter(
      (item) => item.filterType && item.filterType === type,
    ) : fields || [];
  };

  // 表格渲染字段
  const formatColumns: <T>(col: Array<ProColumn<T>>) => Array<ProColumn<T>> = (
    cols,
  ) => {
    const ret = cols
      .filter((item) => !item.hideInTable)
      .map((item) => {
        // 如果存在自定义渲染方法，则优先执行
        // 枚举值处理
        if (item.valueType === 'select' && item.valueEnum) {
          if (item?.filterType === 'table') {
            // 设置table表头的筛选
            item.filters = Array.from(item.valueEnum).map((it) => ({
              text: typeof it[1] === 'object' ? it[1].text : it[1],
              value: it[0],
            }));
            item.filteredValue = proFilter[item.dataIndex] || undefined;
          }
          if (item.render) return item;
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
        if (item.valueType === 'radio' && item.valueEnum) {
          if (item.render) return item;
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
        if (item?.sorter) {
          item.sortOrder = proSort[item.dataIndex] || undefined;
          if (item.render) return item;
        }
        // 时间类型数据处理
        if (item.valueType === 'date') {
          if (item.render) return item;
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
        if (item.render) return item;
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
    const p = {
      ...formData,
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
      setFormData(_.cloneDeep({ ...formData, ...values }));
      setParamsStorage('Params', _.cloneDeep({ ...formData, ...values }));
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
  const onTableFilterReset = async (resetAll?: boolean) => {
    if (onFilterReset) {
      onFilterReset();
    }
    try {
      const defaultIniValues = formProps?.initialValues || {}; // 初始设置的默认字段
      const { initialValues } = localFormProps; // 本地存的字段
      const rightData: any = {};
      getFilterByType('right')
        .map((item) => item.name)
        .forEach((name) => {
          rightData[name] = resetAll ? defaultIniValues[name] : initialValues[name] || undefined;
        });
      const resetFormData = {
        ...formProps?.initialValues,
        ...rightData,
      };

      if (resetAll) { // 点击全部重置，所有参数重置
        setProFilter({});
        setParamsStorage('Filter', {});
        setProSort({});
        setParamsStorage('Sort', {});
      }

      setFormData(_.cloneDeep(resetFormData));
      // 为了解决点击重置时需要点两下才清空的bug，强制reset
      tableFilterRef?.current?.resetFields();
      setParamsStorage('Params', resetFormData || {});
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

  const handleResize =
    (index: number) =>
      (e: any, { size }: any) => {
        const nextColumns = [...tableColumns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        setTableColumns(nextColumns);
      };

  const resetColumn = tableColumns
    .map((col: any, index: any) => {
      return {
        ...col,
        onHeaderCell: (column: any) => ({
          width: column.width,
          onResize: handleResize(index),
        }),
      };
    })
    .filter((item) => selectedDataIndex.includes(item.dataIndex)); // 过滤setting中没选中的字段

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
              fields={getFilterByType('filter')}
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
              fields={getFilterByType('filter')}
              rightFilter={getFilterByType('right')}
              tableFilter={getFilterByType('table')}
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
            key={id}
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
              setParamsStorage('Filter', filters);
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
                setParamsStorage('Sort', data);
                setProSort(data);
              } else if (sorter.order) {
                setParamsStorage('Sort', { [`${sorter.field}`]: sorter.order });
                setProSort({ [`${sorter.field}`]: sorter.order });
              } else {
                setParamsStorage('Sort', {});
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
