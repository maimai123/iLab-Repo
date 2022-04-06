import { Popover, Space } from 'antd';
import { FormProps } from 'antd/lib/form';
import classnames from 'classnames';

import React, { useContext } from 'react';
import Icon from '@/Icon';
import _ from 'lodash';

import DrawerFilter, { IProps as drawerProp } from '../../DrawerFilter';
import { IField } from '../../TableFilter';
import TableContext from '../context';
import ColumnSetting from './ColumnSetting';
import { removeObjectNull } from '../../utils';

import matchItem from '../../TableFilter/matchItem';

import './index.less';

interface OptionsProps {
  refresh?: boolean;
  columnSetting?: boolean;
}

export interface ToolbarProps {
  className?: string;
  style?: React.CSSProperties;
  actions?: React.ReactNode[];
  options?: OptionsProps;
  slot?: React.ReactNode[];
  showFilter?: boolean;
  fields?: IField[];
  drawerProps?: drawerProp;
  rightFilter?: IField[];
  tableFilter?: IField[];
  formProps?: FormProps;
  onSearch?: (values: { [x: string]: any }) => void;
  onReset?: (resetAll?: boolean) => void;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const {
    className,
    style,
    actions,
    options = {},
    slot,
    showFilter,
    fields,
    rightFilter,
    tableFilter,
    drawerProps,
    formProps,
    onSearch,
    onReset,
  } = props;
  const { refresh = false, columnSetting = false } = options;
  const { loading, fetchData } = useContext(TableContext);

  const showOptionsBar = Object.values(options).some((item) => item);
  // @ts-ignore
  const initialValues = formProps?.initialValues || {};
  const allFields = [...(fields || []), ...(rightFilter || []), ...(tableFilter || [])];
  const fieldNames = allFields?.map((item) => item.name);
  const searchNames = Object.keys(removeObjectNull(initialValues));

  // 搜索框放到最右边
  const leftFilters = rightFilter?.filter((item) => item.valueType !== 'search');
  const rightFilters = rightFilter?.filter((item) => item.valueType === 'search');

  return (
    <div
      className={classnames('iLab-pro-table-toolbar', className)}
      style={style}
    >
      <div className={'iLab-pro-table-toolbar-side-left'}>
        {actions && (
          <Space className={'iLab-pro-table-toolbar-actions'}>
            {actions}
          </Space>
        )}
      </div>
      <div className={'iLab-pro-table-toolbar-side-right'}>
        <Space className={'iLab-pro-table-toolbar-slot'}>
          {showFilter && fields && _.intersectionWith(fieldNames, searchNames).length > 0 && (
            <div className="iLab-pro-table-toolbar-reset" key="reset" onClick={() => onReset && onReset(true)}>
              <Icon type="icon-zhongzhi1" />
              重置
            </div>
          )}
          {/* 左侧下拉等筛选 */}
          {!!leftFilters?.length && leftFilters?.map((item) => {
            item.defaultValue = initialValues[item.name] || undefined;
            if (item.valueType === 'select') {
            // 下拉框
              item.fieldProps.onChange = (val: any) =>
                onSearch && onSearch({ ...initialValues, [item.name]: val });
            }
            if (item.valueType === 'radio') {
            // 单选框
              item.fieldProps.onChange = (e: any) =>
                onSearch &&
              onSearch({ ...initialValues, [item.name]: e.target.value });
            }
            item.fieldProps.value = initialValues[item.name] || undefined;
            return (
              <div
                key={item.name}
                style={{ width: item.fieldProps?.width || 120 }}
              >
                {matchItem(item)}
              </div>
            );
          })}
          {/* 用户传进来的插槽 */}
          {slot}
          {/* 筛选按钮 */}
          {showFilter && fields && (
            <>
              <DrawerFilter
                options={fields}
                onSubmit={(values) => onSearch && onSearch(values)}
                onReset={() => onReset && onReset()}
                formProps={formProps}
                {...drawerProps}
              />
            </>
          )}
          {/* 搜索框 */}
          {!!rightFilters?.length && rightFilters?.map((item) => {
            item.defaultValue = initialValues[item.name] || undefined;
            if (item.valueType === 'search') {
              item.fieldProps.onChange = (e: any) => onSearch &&
                  onSearch({ ...initialValues, [item.name]: e.target.value });
              // 搜索框
              item.fieldProps.onSearch = (val: string) =>
                onSearch &&
                onSearch({ ...initialValues, [item.name]: val });
            }
            item.fieldProps.value = initialValues[item.name] || undefined;
            return (
              <div
                key={item.name}
                style={{ width: item.fieldProps?.width || 120 }}
              >
                {matchItem(item)}
              </div>
            );
          })}
        </Space>
        {showOptionsBar && (
          <Space className={'iLab-pro-table-toolbar-options'} size={12}>
            {refresh && (
              <Icon type={'icon-shuaxin'} spin={loading} onClick={fetchData} />
            )}
            {columnSetting && (
              <Popover
                overlayClassName={
                  'iLab-pro-table-toolbar-options-setting-popover'
                }
                content={<ColumnSetting />}
                trigger="click"
                placement="bottomRight"
              >
                <Icon type={'icon-ziduanshezhi'} />
              </Popover>
            )}
          </Space>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
