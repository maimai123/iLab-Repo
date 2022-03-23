import React, { useState, useEffect } from 'react';
import { Upload, Modal, UploadProps, message, Spin } from 'antd';
import uploadImg from '@/assets/upload_img.png';
import Icon from '../Icon';
import classnames from 'classnames';

import Preview from './preview';

import './index.less';

export interface ImageUploadProps extends UploadProps {
  className?: string;
  style?: React.CSSProperties;
  // 文件大小，单位M
  size?: number;
  // 上传所需额外参数或返回上传额外参数的方法
  params?: {[x: string]: any};
  // 上传路径
  url: string;
  // 默认回填图片
  value: string[];
  // 回调函数
  onSet: (url: string[]) => void;
}

const ImageUpload = (props: ImageUploadProps) => {
  const { className, style, size, url = '/api/inventory/secure/oss/upload/file', value = [], params = {}, onSet, ...rest } = props;
  const { maxCount = 1 } = rest;

  const [fileList, setFileList] = useState(value);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    onSet && onSet(fileList);
  }, [fileList]);


  const beforeUpload = (file: any) => {
    const isJpgOrPng = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
    if (size && file.size / 1024 / 1024 > size) {
      message.warning(`图片大小需小于${size}M`);
      return false;
    }
    if (!isJpgOrPng) {
      message.warning('仅支持上传JPG、PNG、JPEG格式!');
      return false;
    }

    console.log(true);
    return true;
  };

  // 移除预览图片
  const handleRemove = (i: number) => {
    const file = [...fileList];
    file.splice(i, 1);
    setFileList(file);
  };

  const handlePreview = (i: number) => {
    setPreviewImage(fileList[i]);
    setVisible(true);
  };

  const handleChange = (info: { file: { status?: any; response?: any } }) => {
    try {
      if (maxCount !== 1 && fileList.length >= maxCount) {
        message.info(`最多支持上传${maxCount}张`);
        return;
      }
      if (info.file.status === 'uploading') {
        setLoading(true);
      }
      if (info.file.status === 'done') {
        const { response } = info.file;
        if (response.success) {
          const files = [...fileList];
          if (maxCount === 1) {
            files.splice(0, 1, response?.data?.downAddress);
          } else {
            files.push(response?.data?.downAddress);
          }
          if (maxCount !== 1 && fileList.length - maxCount >= 0) files.splice(0, 1);
          setFileList(files);
        } else {
          message.error(response.message);
        }
        setLoading(false);
      }
      if (info.file.status === 'error') {
        message.error('上传失败');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      <div className="iLab-upload-container">
        <div className="iLab-upload-list">
          {maxCount > 1 && fileList.map((item, index) => {
            return (
              <Preview
                src={item}
                key={index}
                onRemove={() => handleRemove(index)}
                onPreview={() => handlePreview(index)}
              />
            );
          })}
        </div>
        <Upload
          name="file"
          capture
          action={url}
          className={classnames('iLab-upload', className)}
          style={style}
          listType="picture-card"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          accept=".png,.jpg,.jpeg"
          showUploadList={false}
          {...rest}
        >
          <Spin spinning={loading}>
            <div className="iLab-upload_btn">
              {
                maxCount === 1 && fileList.length === 1 ? (
                  <>
                    <img className="iLab-upload_show" src={fileList[0]} alt="图片加载失败" />
                    <Icon
                      className="iLab-upload_del"
                      type="icon-guanbi2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileList([]);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <img className="iLab-upload_default" src={uploadImg} alt="图片加载失败" />
                    <div>上传图片</div>
                  </>
                )
              }
            </div>
          </Spin>
        </Upload>
      </div>
      <Modal visible={visible} onCancel={() => setVisible(false)} footer={null}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};
export default ImageUpload;
