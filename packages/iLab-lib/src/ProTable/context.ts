import React from 'react';
import { ProColumn } from './index';

interface ITableContext<Column> {
  columns: Array<ProColumn<Column>>;
  setColumns: React.Dispatch<React.SetStateAction<Array<ProColumn<Column>>>>;
  selectedDataIndex: string[];
  setSelectedDataIndex: React.Dispatch<React.SetStateAction<string[]>>;
  fetchData: () => Promise<any>;
}

const TableContext = React.createContext<ITableContext<any>>({
  columns: [],
  setColumns: () => {},
  selectedDataIndex: [],
  setSelectedDataIndex: () => {},
  fetchData: () => Promise.resolve(),
});

export default TableContext;
