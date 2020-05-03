// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/loginA',
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
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              component: './dashboard',
            },
            {
              path: '/org',
              name: 'org',
              icon: 'dashboard',
              routes: [
                {
                  path: '/org/user',
                  name: 'org-user',
                  component: './user/userList',
                },
                {
                  path: '/org/permission',
                  component: './permission/permissionList',
                  exact: true
                },
                {
                  path: '/org/permission/:id?',
                  component: './permission/permissionEdit'
                },
                {
                  path: '/org/role',
                  component: './role/roleList'
                },
                {
                  path: '/org/dept',
                  component: './dept'
                },
                {
                  component: './404',
                }
              ]
            },
            {
              name: 'account',
              path: '/account',
              routes: [
                {
                  path: '/account',
                  component: './account',
                  exact: true
                },
                {
                  path: '/account/deptEidt/:id?',
                  component: './deptEdit',
                  exact: true
                },
                {
                  component: './404'
                }
              ]
            },
            {
              path: '/sys',
              name: 'sys',
              routes: [
                {
                  path: '/sys/swagger',
                  name: 'sys-swagger',
                  component: './swagger',
                },
                {
                  path: '/sys/logs',
                  name: 'sys-log',
                  component: './log',
                },
                {
                  path: '/sys/sql',
                  name: 'sys-durid',
                  component: './durid'
                },
                {
                  component: './404',
                }
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
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
