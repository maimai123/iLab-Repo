import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'ilab-lib',
  favicon: 'https://prod-saas-5.oss-cn-shanghai.aliyuncs.com/room/05f1fe75836a4fbf83a1ea3d541c3bc7/logo.png',
  logo: 'https://prod-saas-5.oss-cn-shanghai.aliyuncs.com/room/05f1fe75836a4fbf83a1ea3d541c3bc7/logo.png',
  outputPath: 'docs-dist',
  // more config: https://d.umijs.org/config
  // mfsu: {},
  proxy: {
    '/api': {
      target: 'https://inventory.scionetest.ilabservice.cloud/',
      pathRewrite: { '^/': '' },
      changeOrigin: true
    }
  }
});
