/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Link, useIntl, connect } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter, getRouteAuthority } from '@/utils/utils';
import logo from '../assets/logo.svg';
import { getRouters } from '@/services/routers';
import * as allIcons from '@ant-design/icons/es';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="抱歉，你没有访问权限"
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
//icon 处理
const toHump = (name) =>
  name.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
const formatter = (data) => {
  data.forEach(item => {
    if (item.icon) {
      const { icon } = item;
      const v4IconName = toHump(icon.replace(icon[0], icon[0].toUpperCase()));
      const NewIcon = allIcons[icon] || allIcons[''.concat(v4IconName, 'Outlined')];
      if (NewIcon) {
        try {
          // eslint-disable-next-line no-param-reassign
          item.icon = React.createElement(NewIcon);
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (item.routes || item.children) {
      const children = formatter(item.routes || item.children); // Reduce memory usage
      item.children = children;
    }
  });
  return data;
};

const patchRoutes = (routes) => formatter(routes);
/**
 * use Authorized check all menu item
 */
// const menuDataRender = menuList =>
//   menuList.map(item => {
//     const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
//     return Authorized.check(item.authority, localItem, null);
//   });


const defaultFooterDom = (
  <DefaultFooter
    copyright="权限管理系统"
    links={[
      {
        key: 'Safe_Manage',
        title: 'Safe Manage',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/yidaq/',
        blankTarget: true,
      },
      {
        key: 'Safe+Manage',
        title: 'Safe Manage',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout = props => {

  const [menuList, setMenuList] = useState([])

  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    getRouters().then(data => {
      setMenuList(patchRoutes(data.data || []))
    })

  }, []);

  /**
   * init variables
   */
  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority


  // props.routes.routeList.map(item => {
  //   item.children = item.children == '' ? undefined : item.children
  // })

  // const authorized = getAuthorityFromRouter(props.routes.routeList, location.pathname || '/') || {
  //   authority: undefined,
  // };
  //获取权限角色
  const authorized = getRouteAuthority(location.pathname || '/', menuList)

  const { formatMessage } = useIntl();

  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={() => menuList}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized == '' ? undefined : authorized} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
