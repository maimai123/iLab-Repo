---
group:
  title: Modal 组件
  order: 14
---

### Modal 组件

弹窗组件

Demo: 默认

```tsx
import React from 'react';
import { Modal } from 'ilab-lib';
import { Input, Button } from 'antd';

export default () => {
  return (
    <>
      <Modal
        okText="确定"
        cancelText="取消"
        width={320}
        title="新增"
        render={<div>内容</div>}
        onOk={(e) => {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            console.log(e);
          }).catch(() => console.log('Oops errors!'));
        }}
      >
        <Button>点我打开弹窗</Button>
      </Modal>
    </>
  );
};
```

Demo: 配合 FilterForm

```tsx
import React, { useRef } from 'react';
import { Modal, FilterForm } from 'ilab-lib';
import { Input, Button } from 'antd';

export default () => {
  const filterRef = useRef();
  const options = [
    {
      label: '姓名',
      name: 'name',
      valueType: 'text',
      rules: [{ required: true, message: '请输入姓名' }],
      fieldProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      label: '生日',
      name: 'date',
      valueType: 'date',
    },
  ];
  return (
    <>
      <Modal
        okText="确定"
        cancelText="取消"
        width={320}
        title="新增"
        render={
          <div>
            <FilterForm
              options={options}
              column={1}
              showAction={false}
              ref={filterRef}
            />
          </div>
        }
        onOk={async (e) => {
          await filterRef.current.validateFields();
          const fields = filterRef.current.getFieldsValue();
          // 模拟获取请求异步操作
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(fields);
              console.log(fields);
            }, 1000);
          }).catch(() => console.log('Oops errors!'));
        }}
      >
        <Button>点我打开弹窗</Button>
      </Modal>
    </>
  );
};
```

### API

#### Modal

| 属性     | 说明                                                            | 类型      | 默认值 |
| -------- | --------------------------------------------------------------- | --------- | ------ |
| render   | 弹窗内部实现                                                    | ReactNode |        |
| children | 自定义点击区域                                                  | ReactNode | button |
| -        | 其他属性同 [Modal](https://ant.design/components/modal-cn/#API) |
