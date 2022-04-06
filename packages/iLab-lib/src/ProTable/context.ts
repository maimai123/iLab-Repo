import React from 'react';
import { ProColumn } from './interface';

interface ITableContext<Column> {
  id: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  columns: Array<ProColumn<Column>>;
  setColumns: React.Dispatch<React.SetStateAction<Array<ProColumn<Column>>>>;
  selectedDataIndex: string[];
  setSelectedDataIndex: React.Dispatch<React.SetStateAction<string[]>>;
  fetchData: () => Promise<any>;
}

const TableContext = React.createContext<ITableContext<any>>({
  id: 'basic',
  loading: false,
  setLoading: () => {},
  columns: [],
  setColumns: () => {},
  selectedDataIndex: [],
  setSelectedDataIndex: () => {},
  fetchData: () => Promise.resolve(),
});

export default TableContext;
