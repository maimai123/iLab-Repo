
## EllipsisLine
#多行截断组件

Demo:

```tsx
import React from 'react';
import { EllipsisLine } from 'iLab-lib';

export default () => (
  <div style={{ width: 500, border: '1px solid #bdbdbd', padding: 16 }}>
    <EllipsisLine
      row={3}
      content="五百里滇池，奔来眼底，披襟岸帻，喜茫茫空阔无边。看东骧神骏，西翥灵仪，北走蜿蜒，南翔缟素。高人韵士，何妨选胜登临。趁蟹屿螺洲，梳裹就风鬟雾鬓；更苹天苇地，点缀些翠羽丹霞，莫辜负四围香稻，万顷晴沙，九夏芙蓉，三春杨柳。 数千年往事，注到心头，把酒凌虚，叹滚滚英雄谁在。想汉习楼船，唐标铁柱，宋挥玉斧，元跨革囊。伟烈丰功，费尽移山心力。尽珠帘画栋，卷不及暮雨朝云；便断碣残碑，都付与苍烟落照。只赢得几杵疏钟，半江渔火，两行秋雁，一枕清霜"
      />
  </div>
  );
```


### API

#### EllipsisLine

| 属性             | 说明                                                            | 类型                | 默认值  |
| ---------------- | --------------------------------------------------------------- | ------------------- | ------- |
| className           | 自定义类名                                    | string            | -       |
| style           | 自定义样式                                    | CSSProperties            | -       |
| content           | 内容                                    | ReactNode            |    -    |
| row         | 展示几行                                                        | number    | 2     |
| text          | 收起展开文案                                                        | TextField    |   -     |
| ellipsisText        | 扩展文案 | string              |  -      |


#### TextField
| 属性             | 说明                                                            | 类型                | 默认值  |
| ---------------- | --------------------------------------------------------------- | ------------------- | ------- |
| expend           | 展开文案                                    | string            | 【查看全部】       |
| close           | 收起文案                                    | string            | 【收起】       |
