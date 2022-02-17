import React, { useContext } from 'react';
import { Space, Popover } from 'antd';
import {
  SettingOutlined,
  RedoOutlined
} from '@ant-design/icons'
import { IField } from '../../FilterForm'
import DrawerFilter from '../../DrawerFilter';
import classnames from 'classnames';
import TableContext from '../context';
import ColumnSetting from './ColumnSetting';
import { IProps as drawerProps } from '../../DrawerFilter';
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
  drawerProps?: drawerProps;
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
  onSearch,
}) => {
  const { refresh = false, columnSetting = false } = options;
  const { fetchData } = useContext(TableContext);

  const showOptionsBar = Object.values(options).some(item => item);

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
            {showFilter && fields
            && <DrawerFilter options={fields} onChange={(values) => onSearch && onSearch(values)} {...drawerProps} />}
            {slot}
          </Space>
        {showOptionsBar && (
          <Space className={'iLab-pro-table-toolbar-options'} size={12}>
            {refresh && <RedoOutlined onClick={fetchData} />}
            {columnSetting && (
              <Popover
                overlayClassName={
                  'iLab-pro-table-toolbar-options-setting-popover'
                }
                content={<ColumnSetting />}
                trigger="click"
                placement="bottomRight"
              >
                <SettingOutlined />
              </Popover>
            )}
          </Space>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
