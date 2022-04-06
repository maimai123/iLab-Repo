import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { IProps as drawerProp } from '@/DrawerFilter';
import { FormProps } from 'antd/lib/form';
import {
  ValueType as TableFilterValueType,
} from '../TableFilter';
import { ToolbarProps } from './Toolbar';

export interface RequestData {
  success: boolean;
  data?: any[];
  total: number;
}

export type IValueEnum = Map<
any,
| string
| {
  text: string;
  status: PresetStatusColorType;
  icon?: React.ReactNode;
}
>;

export interface IPagination {
  current: number;
  pageSize: number;
}


export interface ProColumn<T = any> extends ColumnProps<T> {
  dataIndex: string;
  valueType?: TableFilterValueType;
  valueEnum?: IValueEnum;
  search?: boolean;
  hideInTable?: boolean;
  dateTimeFormat?: string;
  fieldProps?: any;
  order?: number;
  filterType?: 'right' | 'table' | 'filter';
  customRender?: React.ReactNode;
}

export interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  getFilterValue: () => object;
  setFilterValue: (val: any) => void;
  resetFilter: () => void;
  getPage: () => void;
}


export interface IFormProps extends FormProps {
  filters?: { [x: string]: any }; // 表头筛选默认值设置
  sorters?: { [x: string]: any }; // 表头排序默认值设置
}


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
  formProps?: IFormProps;
  toolbar?: ToolbarProps;
  actionRef?:
  | React.MutableRefObject<ActionType | undefined>
  | ((actionRef: ActionType) => void);
  defaultPagination?: IPagination;
  formMode?: 'fixed' | 'static';
  defaultCollapsed?: boolean;
  drawerProps?: drawerProp; // 筛选组件
  remember?: boolean; // 记住page功能
  resetRemember?: boolean; // 是否自动根据路由清除当前搜索参数
  onFilterSearch?: (values: any) => void;
  onFilterReset?: () => void;
}
