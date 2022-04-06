import React, { useEffect, useState, useContext, useRef } from 'react';
import { Table, Form, TableProps } from 'antd';
import EditableContext from './context';
import matchItem from './matchItem';
import classnames from 'classnames';
import _ from 'lodash';

import './index.less';
import '../ProTable/index.less';

const EditableRow: React.FC = (props) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children?: React.ReactNode;
  dataIndex: string;
  record: any;
  fieldProps: any;
  rules?: any[];
  handleSave: (record: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = (
  props: EditableCellProps,
) => {
  const {
    children,
    editable,
    dataIndex,
    rules,
    fieldProps = {},
    record,
    title,
    handleSave,
    ...restProps
  } = props;
  const inputRef = useRef<any>();
  const form = useContext(EditableContext);

  const renderCell = () => {
    const formParams = {
      name: dataIndex,
      rules: rules || [],
      initialValue: record[dataIndex],
    };

    const onSave = async () => {
      try {
        await form?.validateFields();
        const values = form?.getFieldsValue();
        handleSave({ ...record, ...values });
      } catch (err) {
        console.log(err);
        inputRef?.current.focus();
      }
    };

    fieldProps.onChange = _.debounce(() => {
      onSave();
    }, 500);

    return (
      <Form.Item {...formParams} name={dataIndex} style={{ margin: 0 }}>
        { matchItem(fieldProps) }
      </Form.Item>
    );
  };

  return (
    <td {...restProps}>
      {editable ? (
        <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
      ) : (
        children
      )}
    </td>
  );
};

interface ActionType {
  refresh: () => void;
}

interface EditableTableProps extends TableProps<any> {
  className?: string;
  style?: React.CSSProperties;
  onSave: (val: any) => void;
  actionRef?:
  | React.MutableRefObject<ActionType | undefined>
  | ((actionRef: ActionType) => void);
}

const EditableTable: React.FC<EditableTableProps> = (
  props: EditableTableProps,
) => {
  const {
    className,
    style,
    columns = [],
    rowKey,
    dataSource,
    onSave,
    actionRef,
    ...rest
  } = props;
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(1);

  useEffect(() => {
    const userAction = {
      refresh: () => { // 强制刷新
        setLoading(true);
        setKey(key + 1);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
    };

    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, []);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleSave = (row: any) => {
    // @ts-ignore
    const newData = [...dataSource];
    // @ts-ignore
    const index = newData.findIndex((item) => row[rowKey] === item[rowKey]);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    onSave && onSave(newData);
  };

  const resetColumns = columns.map((col: any) => {
    if (!col?.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col?.editable,
        dataIndex: col?.dataIndex,
        title: col.title,
        rules: col?.rules,
        fieldProps: col?.fieldProps,
        handleSave,
      }),
    };
  });

  return (
    <div
      className={classnames('iLab-pro-table', 'iLab-editableTable', className)}
      style={style}
    >
      <Table
        key={key}
        components={components}
        loading={loading}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={resetColumns}
        rowKey={rowKey}
        {...rest}
      />
    </div>
  );
};

export default EditableTable;
