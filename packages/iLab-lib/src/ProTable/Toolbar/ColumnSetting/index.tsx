import React, { useContext } from 'react';
import { Checkbox, Button } from 'antd';
import TableContext from '../../context';
import './index.less';

interface ColumnSettingProps {}

const ColumnSetting: React.FC<ColumnSettingProps> = () => {
  const { id, columns, selectedDataIndex, setSelectedDataIndex } = useContext(
    TableContext,
  );



  return (
    <div className="iLab-pro-table-toolbar-column-setting">
      <div className="iLab-pro-table-toolbar-column-setting-header">
        <span className="iLab-pro-table-toolbar-column-setting-header-text">
          列展示
        </span>
        <Button
          type="link"
          onClick={() => {
            localStorage.setItem(`${window.location.pathname}-${id}-Col`, columns.map(item => item.dataIndex).join())
            setSelectedDataIndex(columns.map(item => item.dataIndex));
          }}
        >
          重置
        </Button>
      </div>
      <div className="iLab-pro-table-toolbar-column-setting-body">
        <Checkbox.Group
          options={columns.map(item => ({
            label: item.title,
            value: item.dataIndex,
          }))}
          value={selectedDataIndex}
          onChange={checkedValue => {
            localStorage.setItem(`${window.location.pathname}-${id}-Col`, checkedValue.join())
            setSelectedDataIndex(checkedValue as string[])
            }
          }
        />
      </div>
    </div>
  );
};

export default ColumnSetting;
