import { Popover, Space } from 'antd';
import { FormProps } from 'antd/lib/form';
import classnames from 'classnames';
import React, { useContext } from 'react';

import Icon from '@/Icon';

import DrawerFilter, { IProps as drawerProp } from '../../DrawerFilter';
import { IField } from '../../FilterForm';
import TableContext from '../context';
import ColumnSetting from './ColumnSetting';

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
  formProps?: FormProps;
  onSearch?: (values: { [x: string]: any }) => void;
  onReset?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  className,
  style,
  actions,
  options = {},
  slot,
  showFilter,
  fields,
  drawerProps,
  formProps,
  onSearch,
  onReset,
}) => {
  const { refresh = false, columnSetting = false } = options;
  const { loading, fetchData } = useContext(TableContext);

  const showOptionsBar = Object.values(options).some((item) => item);

  return (
    <div
      className={classnames('iLab-pro-table-toolbar', className)}
      style={style}
    >
      <div className={'iLab-pro-table-toolbar-side-left'}>
        {actions && (
          <Space className={'iLab-pro-table-toolbar-actions'}>{actions}</Space>
        )}
      </div>
      <div className={'iLab-pro-table-toolbar-side-right'}>
        <Space className={'iLab-pro-table-toolbar-slot'}>
          {showFilter && fields && (
            <DrawerFilter
              options={fields}
              onSubmit={(values) => onSearch && onSearch(values)}
              onReset={() => onReset && onReset()}
              formProps={formProps}
              {...drawerProps}
            />
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
