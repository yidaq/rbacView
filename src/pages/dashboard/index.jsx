import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import styles from './style.less';
import { connect } from 'umi';
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
const ExtraContent = () => (
    <div className={styles.extraContent}>
        <div className={styles.statItem}>
            <Statistic title="项目数" value={56} />
        </div>
        <div className={styles.statItem}>
            <Statistic title="团队内排名" value={8} suffix="/ 24" />
        </div>
        <div className={styles.statItem}>
            <Statistic title="项目访问" value={2223} />
        </div>
    </div>
);
const DashBoard = props => {
    const { dispatch, currentUser, loginUsers, loginUsersLoading, currentUserLoading } = props;
    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'dashboard/init',
            });
        }
    }, [])
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
                    // loading={projectLoading}
                    >
                        <div className={styles.members}>
                            <Row gutter={48}>
                                {/* {projectNotice.map(item => (
                                    <Col span={12} key={`members-item-${item.id}`}>
                                        <Link to={item.href}>
                                            <Avatar src={item.logo} size="small" />
                                            <span className={styles.member}>{item.member}</span>
                                        </Link>
                                    </Col>
                                ))} */}
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
    currentUserLoading: loading.effects['dashboard/fetchCurrent'],
    loginUsersLoading: loading.effects['dashboard/fetchLoginUsers'],
}))(DashBoard);
