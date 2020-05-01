import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Card, Table, Skeleton, Divider, Tag, Button } from 'antd';
import styles from './style.less';
import Authorized from '@/utils/Authorized';
import { SmileOutlined } from '@ant-design/icons';

import { connect } from 'umi';
import { render } from 'react-dom';

const PageHeaderContent = ({ currentUser, deptInfo }) => {
    const loading = currentUser && Object.keys(currentUser).length && deptInfo && Object.keys(deptInfo).length;
    if (!loading) {
        return (
            <Skeleton avatar paragraph={{ rows: 1, }} active />
        );
    }
    return (
        <div className={styles.pageHeaderContent}>
            <div className={styles.avatar}>
                <Avatar size="large" src={deptInfo.avatar} />
            </div>
            <div className={styles.content}>
                <div className={styles.contentTitle}>
                    {deptInfo.name}
                </div>
                <div>
                    {deptInfo.relationCode}
                </div>
            </div>
        </div>
    );
};

const DeptEdit = props => {
    const deptId = props.match.params.id
    const { dispatch, currentUser, deptUsers, deptPermissions, deptInfo,
        deptUsersLoading, currentUserLoading, deptPermissionsLoading } = props
    const columns = [
        {
            width: 72,
            align: 'center',
            render: (record) => (<Avatar size="small" src={record.avatar} />)
        },
        {
            title: '昵称',
            dataIndex: 'nickName',
            align: 'center',
        },
        {
            title: '账号',
            dataIndex: 'username',
            align: 'center',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            align: 'center',
        },
        {
            title: '账号状态',
            dataIndex: 'status',
            align: 'center',
            render: (_, record) => (
                <>
                    {record.status === 1 ?
                        <Tag icon={<SmileOutlined />} color="processing">正常</Tag>
                        : <Tag icon={<SmileOutlined rotate={180} />} color="default">禁用</Tag>}
                </>
            )
        },
        currentUser && Object.keys(currentUser).length && deptInfo && Object.keys(deptInfo).length &&
            currentUser.deptId === deptInfo.id ?
            {
                title: '操作',
                align: 'center',
                dataIndex: 'option',
                valueType: 'option',
                render: (_, record) => (
                    <>
                        <Authorized authority="sys:user:role:update" noMatch=''>
                            <a
                                onClick={() => {
                                    handleAddRoleModalVisible(true)
                                    setStepFormValues(record)
                                }}
                            >授权</a>
                        </Authorized>
                        <Divider type="vertical" />
                        <Authorized authority="sys:user:delete" noMatch=''>
                            <a onClick={() => {
                                handleRemove([{ id: record.id }]),
                                    actionRef.current.reload()
                            }}>踢出部门</a>
                        </Authorized>
                    </>
                ),
            } : {}
    ];
    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'deptEdit/init',
                payload: { deptId: props.match.params.id }
            });
        }
    }, [])
    return (
        <PageHeaderWrapper title=' '
            content={<PageHeaderContent currentUser={currentUser} deptInfo={deptInfo} />}
        >
            <Card bordered={false}>
                <div className={styles.title}>部门成员
                     <Button type='primary' style={{ float: 'right' }}>添加成员</Button>
                </div>
                <Table
                    style={{
                        marginBottom: 24,
                    }}
                    pagination={false}
                    loading={deptUsersLoading}
                    dataSource={deptUsers}
                    columns={columns}
                    rowKey="id"
                />
            </Card>
        </PageHeaderWrapper>
    )
}
export default connect(({ deptEdit, loading }) => ({
    deptInfo: deptEdit.deptInfo,
    currentUser: deptEdit.currentUser,
    deptUsers: deptEdit.deptUsers,
    deptPermissions: deptEdit.deptPermissions,
    deptUsersLoading: loading.effects['deptEdit/fetchDeptUser'],
    currentUserLoading: loading.effects['deptEdit/fetchCurrent'],
    deptPermissionsLoading: loading.effects['deptEdit/fetchDeptPermissions'],
}))(DeptEdit);
