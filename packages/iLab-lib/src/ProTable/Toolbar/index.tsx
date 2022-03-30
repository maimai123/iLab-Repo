import { Popover, Space, Button } from 'antd';
import { FormProps } from 'antd/lib/form';
import classnames from 'classnames';
import { RedoOutlined } from '@ant-design/icons';

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
  leftFilter?: IField[];
  formProps?: FormProps;
  onSearch?: (values: { [x: string]: any }) => void;
  onReset?: () => void;
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
    leftFilter,
    drawerProps,
    formProps,
    onSearch,
    onReset,
  } = props;
  const { refresh = false, columnSetting = false } = options;
  const { loading, fetchData } = useContext(TableContext);

  const showOptionsBar = Object.values(options).some((item) => item);
  // @ts-ignore
  const { initialValues } = formProps;
  const fieldNames = fields?.map((item) => item.name);
  const searchNames = Object.keys(removeObjectNull(initialValues));

  return (
    <div
      className={classnames('iLab-pro-table-toolbar', className)}
      style={style}
    >
      <div className={'iLab-pro-table-toolbar-side-left'}>
        {(actions || leftFilter?.length) && (
          <Space className={'iLab-pro-table-toolbar-actions'}>
            {actions}
            {leftFilter?.map((item) => {
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
          </Space>
        )}
      </div>
      <div className={'iLab-pro-table-toolbar-side-right'}>
        <Space className={'iLab-pro-table-toolbar-slot'}>
          {showFilter && fields && (
            <>
              {_.intersectionWith(fieldNames, searchNames).length > 0 && (
                <Button
                  type="link"
                  icon={<RedoOutlined style={{ color: '#1890ff' }} />}
                  onClick={() => onReset && onReset()}
                >
                  重置
                </Button>
              )}
              <DrawerFilter
                options={fields}
                onSubmit={(values) => onSearch && onSearch(values)}
                onReset={() => onReset && onReset()}
                formProps={formProps}
                {...drawerProps}
              />
            </>
          )}
          {slot}
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
