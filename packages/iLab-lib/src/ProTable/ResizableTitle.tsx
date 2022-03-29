import React from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';

interface TitleProps {
  width: number;
  onResize?: (
    e: React.SyntheticEvent<Element, Event>,
    data: ResizeCallbackData,
  ) => any;
  [x: string]: any;
}
// 可伸缩列
const ResizableTitle: React.FC<TitleProps> = (props: TitleProps) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export default ResizableTitle;
