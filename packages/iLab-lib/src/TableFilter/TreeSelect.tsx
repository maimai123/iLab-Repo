import React from 'react';
import { TreeSelect as UTreeSelect } from 'antd';

export type TreeSelectProps = Omit<
  typeof UTreeSelect,
'TreeNode' | 'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD'
>;

const TreeSelect: React.FC<TreeSelectProps> = (props) => {
  return <UTreeSelect allowClear {...props} />;
};

export default TreeSelect;
