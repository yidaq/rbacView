import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import styles from './style.less';
import { connect, Link } from 'umi';
import { getLoginUser } from '@/services/user'
import moment from 'moment';
import { render } from 'enzyme';

const PageHeaderContent = ({ currentUser }) => {
    const loading = currentUser && Object.keys(currentUser).length;
    if (!loading) {
        return (
            <Skeleton avatar paragraph={{ rows: 1, }} active />
        );
    }
    return (
        <div className={styles.pageHeaderContent}>
            <div className={styles.avatar}>
                <Avatar size="large" src={currentUser.avatar} />
            </div>
            <div className={styles.content}>
                <div className={styles.contentTitle}>
                    你好，
                     {currentUser.name}
                </div>
                <div>
                    {currentUser.role} | {currentUser.group}
                </div>
            </div>
        </div>
    );
};

const DashBoard = props => {
    const { dispatch, currentUser, loginUsers, loginUsersLoading, currentUserLoading, deptInfo, deptInfoLoading } = props;
    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'dashboard/init',
            });
        }
    }, [])
    const ExtraContent = () => (
        <div className={styles.extraContent}>
            <div className={styles.statItem}>
                <Statistic title="当前在线人数" value={loginUsers.length} suffix="/5" />
            </div>
            <div className={styles.statItem}>
                <Statistic title="团队总数" value={deptInfo.length} />
            </div>
        </div>
    );
    return (
        <PageHeaderWrapper title=' ' content={<PageHeaderContent currentUser={currentUser} />} extraContent={<ExtraContent />}>
            <Row gutter={24}>
                <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                    <Card
                        bodyStyle={{
                            padding: 0,
                        }}
                        bordered={false}
                        className={styles.activeCard}
                        title="当前在线用户"
                    >
                        <List
                            loading={loginUsersLoading}
                            className={styles.activitiesList}
                            size="large"
                        >
                            {loginUsers === [] ? '111' :
                                loginUsers.map(item => {
                                    return (<List.Item key={item.id} >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar} />}
                                            title={
                                                <span>
                                                    <a className={styles.username}>{item.nickName}</a>
                                                    &nbsp;
                                                     <span className={styles.event}></span>
                                                </span>
                                            }
                                            description={
                                                <span className={styles.datetime} title={item.updatedAt}>
                                                    {moment(item.updatedAt).fromNow()}
                                                </span>
                                            }
                                        />
                                    </List.Item>)

                                })
                            }
                        </List>
                    </Card>
                </Col>
                <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                    <Card
                        bodyStyle={{
                            paddingTop: 12,
                            paddingBottom: 12,
                        }}
                        bordered={false}
                        title="部门"
                        loading={deptInfoLoading}
                    >
                        <div className={styles.members}>
                            <Row gutter={48}>
                                {deptInfo.map(item => (
                                    <Col span={12} key={item.id}>
                                        <Link to={`/account/deptEidt/${item.id}`}>
                                            <Avatar src={item.avatar} size="small" />
                                            <span className={styles.member}>{item.name}</span>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
        </PageHeaderWrapper>
    )
}

export default connect(({ dashboard, loading }) => ({
    currentUser: dashboard.currentUser,
    loginUsers: dashboard.loginUsers,
    deptInfo: dashboard.deptInfo,
    deptInfoLoading: loading.effects['dashboard/fetchDeptInfo'],
    currentUserLoading: loading.effects['dashboard/fetchCurrent'],
    loginUsersLoading: loading.effects['dashboard/fetchLoginUsers'],
}))(DashBoard);
