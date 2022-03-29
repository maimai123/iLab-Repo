import React, { useState } from 'react';
import { Upload, UploadProps, message } from 'antd';
import classnames from 'classnames';

import './index.less';

export interface ImageUploadProps extends UploadProps {
  className?: string;
  style?: React.CSSProperties;
  // 文件大小，单位M
  size?: number;
  // 上传所需额外参数或返回上传额外参数的方法
  params?: { [x: string]: any };
  // 上传路径
  url: string;
  // 默认回填图片
  value: any[];
  // 回调函数
  onSet: (url: string[]) => void;
}

const ImageUpload = (props: ImageUploadProps) => {
  const {
    className,
    style,
    size,
    url = '/api/inventory/secure/oss/upload/file',
    value = [],
    onSet,
    ...rest
  } = props;
  const { maxCount = 2 } = rest;

  const [fileList, setFileList] = useState<any[]>(
    value.map((item) => ({
      uid: '0',
      name: 'image.png',
      status: 'done',
      url: item,
    })),
  );

  const beforeUpload = (file: any) => {
    const isJpgOrPng = ['image/jpeg', 'image/png', 'image/jpg'].includes(
      file.type,
    );
    if (size && file.size / 1024 / 1024 > size) {
      message.warning(`图片大小需小于${size}M`);
      return false;
    }
    if (!isJpgOrPng) {
      message.warning('仅支持上传JPG、PNG、JPEG格式!');
      return false;
    }
    return true;
  };

  const handleChange = (info: { fileList: any }) => {
    try {
      let fileLists = [...info.fileList];
      fileLists = fileLists.slice(-maxCount);
      fileLists = fileLists.map((file) => {
        if (file?.response) {
          file.url = file.response.data.downAddress;
        }
        return file;
      });
      setFileList(fileLists);
      onSet && onSet(fileLists.map((item: { url: any }) => item.url));
    } catch (err) {
      console.log(err);
    }
  };

  const uploadButton = (
    <div>
      <img
        className="iLab-upload-multi_default"
        src={require('@/assets/upload_img.png')}
        alt="图片加载失败"
      />
      <div>上传图片</div>
    </div>
  );
  return (
    <>
      <Upload
        className={classnames('iLab-upload-multi', className)}
        style={style}
        name="file"
        action={url}
        listType="picture-card"
        fileList={fileList}
        showUploadList={{
          showPreviewIcon: false,
          showRemoveIcon: true,
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        capture
        multiple
        accept=".png,.jpg,.jpeg"
        {...rest}
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>
    </>
  );
};
export default ImageUpload;
