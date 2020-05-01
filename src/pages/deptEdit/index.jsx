import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Card, Table, Skeleton, Divider, Tag, Button, message } from 'antd';
import styles from './style.less';
import Authorized from '@/utils/Authorized';
import { SmileOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm'
import AddRoleForm from './components/AddRoleForm'
import { connect } from 'umi';
import { setDeptUser } from './service';

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
    const [createFormModalVisible, handleCreateFormModalVisible] = useState(false);
    const ref = useRef()
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
                        <Authorized authority="sys:dept:update" noMatch=''>
                            <a
                                onClick={() => {
                                    handleAddRoleModalVisible(true)
                                    setStepFormValues(record)
                                }}
                            >授权</a>
                        </Authorized>
                        <Divider type="vertical" />
                        <Authorized authority="sys:dept:update" noMatch=''>
                            <a onClick={() => {
                                handleRemove([{ id: record.id }]),
                                    actionRef.current.reload()
                            }}>踢出部门</a>
                        </Authorized>
                    </>
                ),
            } :
            {
                title: '操作',
                align: 'center',
                dataIndex: 'option',
                valueType: 'option',
                render: (_, record) => (
                    <>
                        <Authorized authority="sys:dept:update" noMatch=''>
                            <a
                                onClick={() => {
                                    handleAddRoleModalVisible(true)
                                    setStepFormValues(record)
                                }}
                            >授权</a>
                        </Authorized>
                        <Divider type="vertical" />
                        <Authorized authority="sys:dept:update" noMatch=''>
                            <a onClick={() => {
                                handleRemove([{ id: record.id }]),
                                    actionRef.current.reload()
                            }}>踢出部门</a>
                        </Authorized>
                    </>
                ),
            }
    ];
    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'deptEdit/init',
                payload: { deptId: props.match.params.id }
            });
        }
    }, [])
    const handleAdd = async fields => {
        console.log(fields)
        const hide = message.loading('正在添加');
        try {
            await setDeptUser({
                userId: fields.managerId,
                deptId: deptId,
            });
            hide();
            message.success('添加成功');
            return true;
        } catch (error) {
            hide();
            message.error('添加失败请重试！');
            return false;
        }
    };
    return (
        <PageHeaderWrapper title=' '
            content={<PageHeaderContent currentUser={currentUser} deptInfo={deptInfo} />}
        >
            <Card bordered={false}>
                <div className={styles.title}>部门成员
                     <Button
                        type='primary'
                        style={{ float: 'right' }}
                        onClick={() => handleCreateFormModalVisible(true)}>
                        添加成员
                    </Button>
                </div>
                <Table
                    action={ref}
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
            <CreateForm
                onSubmit={async value => {
                    const success = await handleAdd(value);
                    if (success) {
                        handleCreateFormModalVisible(false);
                        if (ref.current) {
                            ref.current.reload()
                        }
                    }
                }}
                onCancel={() => {
                    handleCreateFormModalVisible(false)
                }}
                modalVisible={createFormModalVisible}
            />

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
