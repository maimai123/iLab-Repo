import React, { useState, useEffect } from 'react';
import { Upload, UploadProps, message, Spin } from 'antd';
import Icon from '../Icon';
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
  value?: string;
  // 回调函数
  onSet: (url: any) => void;
}

const ImageUpload = (props: ImageUploadProps) => {
  const {
    className,
    style,
    size = 2,
    url = '/api/inventory/secure/oss/upload/file',
    value = '',
    onSet,
    ...rest
  } = props;

  const [link, setLink] = useState<string>(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onSet && onSet(link);
  }, [link]);

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

  const handleChange = (info: { file: { status?: any; response?: any } }) => {
    try {
      if (info.file.status === 'uploading') {
        setLoading(true);
      }
      if (info.file.status === 'done') {
        const { response } = info.file;
        if (response.success) {
          setLink(response?.data?.downAddress);
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
        <Upload
          name="file"
          capture
          action={url}
          className={classnames(
            'iLab-upload',
            className,
            'iLab-upload-preview',
          )}
          style={style}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          showUploadList={false}
          accept=".png,.jpg,.jpeg"
          {...rest}
        >
          <Spin spinning={loading}>
            <div className="iLab-upload_btn">
              {link ? (
                <>
                  <img
                    className="iLab-upload_show"
                    src={link}
                    alt="图片加载失败"
                  />
                  <Icon
                    className="iLab-upload_del"
                    type="icon-guanbi2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLink('');
                    }}
                  />
                </>
              ) : (
                <>
                  <img
                    className="iLab-upload_default"
                    src={require('@/assets/upload_img.png')}
                    alt="图片加载失败"
                  />
                  <div>上传图片</div>
                </>
              )}
            </div>
          </Spin>
        </Upload>
      </div>
    </>
  );
};
export default ImageUpload;
