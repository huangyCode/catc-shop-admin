import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';

const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/merchant',
              authority: ['admin'],
            },
            {
              path: '/',
              redirect: '/orderuser',
              authority: ['user'],
            },
            {
              path: '/merchant',
              name: '商户信息',
              icon: 'TeamOutlined',
              component: './Merchant',
              authority: ['admin'],
            },
            {
              path: '/merchantStaff',
              name: '店长介绍',
              icon: 'TeamOutlined',
              component: './MerchantStaff',
              authority: ['admin'],
            },
            // {
            //   path: '/customer',
            //   name: '用户列表',
            //   icon: 'TeamOutlined',
            //   component: './Customer',
            //   authority: ['admin'],
            // },
            // {
            //   path: '/account',
            //   name: '账户管理',
            //   icon: 'ContactsOutlined',
            //   component: './Account',
            //   authority: ['admin'],
            // },
            // {
            //   path: '/brand',
            //   name: '品牌管理',
            //   icon: 'ShopOutlined',
            //   component: './MerchantBrand',
            //   authority: ['admin'],
            // },
            // {
            //   path: '/product',
            //   name: '商品管理',
            //   icon: 'ShoppingOutlined',
            //   children: [
            //     {
            //       path: '/product/goods',
            //       name: '商品列表',
            //     },
            //     {
            //       path: '/product/classes',
            //       name: '商品类别',
            //     },
            //   ],
            //   authority: ['admin'],
            // },
            // {
            //   path: '/order',
            //   name: '订单列表',
            //   icon: 'PayCircleOutlined',
            //   component: './Order',
            //   authority: ['admin'],
            // },
            // {
            //   path: '/orderuser',
            //   name: '订单列表',
            //   icon: 'PayCircleOutlined',
            //   component: './OrderUser',
            //   authority: ['user'],
            // },
            // {
            //   path: '/productuser',
            //   name: '商品列表',
            //   icon: 'ShoppingOutlined',
            //   component: './ProductUser',
            //   authority: ['user'],
            // },
            // {
            //   path: '/product/goods',
            //   component: './Product',
            // },
            // {
            //   path: '/dadaacountuser',
            //   component: './DadaAccountUser',
            //   authority: ['user'],
            //   name: '达达记录',
            //   icon: 'DollarCircleOutlined',
            // },
            // {
            //   path: '/DadaRecharge',
            //   component: './DadaRecharge',
            //   authority: ['admin'],
            //   name: '达达充值',
            //   icon: 'DollarCircleOutlined',
            // },
            // {
            //   path: '/dadaacount',
            //   component: './DadaAccount',
            //   authority: ['admin'],
            //   name: '达达记录',
            //   icon: 'DollarCircleOutlined',
            // },
            // {
            //   path: '/product/classes',
            //   component: './ProductClasses',
            // },
            // {
            //   path: '/welcome',
            //   name: 'welcome',
            //   icon: 'smile',
            //   component: './Welcome',
            // },
            // {
            //   path: '/admin',
            //   name: 'admin',
            //   icon: 'crown',
            //   component: './Admin',
            //   authority: ['admin'],
            // },
            // {
            //   name: 'list.table-list',
            //   icon: 'table',
            //   path: '/list',
            //   component: './ListTableList',
            // },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    'process.env': {
      API_ENV: process.env.API_ENV, // 这里是重点吧，获取配置
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  }, // chainWebpack: webpackPlugin,
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
};
