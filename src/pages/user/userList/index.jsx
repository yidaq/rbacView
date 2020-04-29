import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import AddRoleForm from './components/AddRoleForm';
import { getUserTable } from '@/services/user';
import moment from "moment";
import { addUser, saveRoles, deleteUsers, updateUser } from '@/services/user'
import Authorized from '@/utils/Authorized';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
    console.log(fields)
    const hide = message.loading('正在添加');
    try {
        await addUser({
            username: fields.username,
            password: fields.password,
            deptId: fields.deptId,
            phone: fields.phone === undefined ? '' : fields.phone,
            createWhere: fields.createWhere,
            status: fields.switch === true ? 1 : 0
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
/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async fields => {
    const hide = message.loading('正在配置');
    try {
        await updateUser({
            id: fields.id,
            username: fields.username,
            password: fields.password,
            phone: fields.phone,
            nickName: fields.nickName,
            email: fields.email,
            status: fields.switch === true ? 1 : 2,
            deptId: fields.deptId
        });
        hide();
        message.success('配置成功');
        return true;
    } catch (error) {
        hide();
        message.error('配置失败请重试！');
        return false;
    }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
        await deleteUsers({
            key: selectedRows.map(row => row.id),
        });
        hide();
        message.success('删除成功，即将刷新');
        return true;
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
};

const addRoles = async fields => {
    const hide = message.loading('正在配置');
    try {
        await saveRoles({ userId: fields.id, roleIds: fields.roleIds });
        hide();
        message.success('配置成功');
        return true;
    } catch (error) {
        hide();
        message.error('配置失败请重试！');
        return false;
    }
}

const userList = () => {
    const [createModalVisible, handleModalVisible] = useState(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState(false);
    const [stepFormValues, setStepFormValues] = useState({});
    const [addRoleModalVisible, handleAddRoleModalVisible] = useState(false);
    const actionRef = useRef();
    const columns = [
        {
            title: '序号',
            valueType: 'indexBorder',
            width: 72,
            align: 'center'
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
            title: '所属团队',
            hideInSearch: true,
            dataIndex: 'deptName',
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
            valueEnum: {
                2: {
                    text: '禁用',
                    status: 'Default',
                },
                1: {
                    text: '正常',
                    status: 'Processing',
                },
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: true,
            valueType: 'dateTimeRange',
            align: 'center',
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
        },
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
                        >赋予角色</a>
                    </Authorized>
                    <Divider type="vertical" />
                    <Authorized authority="sys:user:update" noMatch=''>
                        <a
                            onClick={() => {
                                handleUpdateModalVisible(true);
                                setStepFormValues(record);
                            }}>
                            修改
                    </a>
                    </Authorized>
                    <Divider type="vertical" />
                    <Authorized authority="sys:user:delete" noMatch=''>
                        <a onClick={() => {
                            handleRemove([{ id: record.id }]),
                                actionRef.current.reload()
                        }}>删除</a>
                    </Authorized>
                </>
            ),
        },
    ];
    return (
        <PageHeaderWrapper>
            <ProTable
                headerTitle="用户列表"
                actionRef={actionRef}
                rowKey="id"
                toolBarRender={(action, { selectedRows }) => [
                    <Authorized authority="sys:user:add" noMatch=''>

                        <Button icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
                            新建
                     </Button>
                    </Authorized>,
                    selectedRows && selectedRows.length > 0 && (
                        <Dropdown
                            overlay={
                                <Menu
                                    onClick={async e => {
                                        if (e.key === 'remove') {
                                            await handleRemove(selectedRows);
                                            action.reload();
                                        }
                                    }}
                                    selectedKeys={[]}
                                >
                                    <Menu.Item key="remove">批量删除</Menu.Item>
                                </Menu>
                            }>
                            <Button>
                                批量操作 <DownOutlined />
                            </Button>
                        </Dropdown>
                    ),
                ]}

                request={
                    async (params = {}) => {
                        const data = await getUserTable(
                            {
                                ...params,
                                pageNum: params.current,
                                pageSize: params.pageSize,
                            },
                        );
                        const list = data.data.list
                        return {
                            data: list,
                            page: params.current,
                            success: true,
                            total: data.data.totalRows,
                        };
                    }}
                columns={columns}
                search={<Authorized authority="sys:user:list" noMatch={false}>{true}</Authorized>}
                rowSelection={{}}
            />

            <CreateForm
                onSubmit={async value => {
                    const success = await handleAdd(value);
                    if (success) {
                        handleModalVisible(false);
                        setStepFormValues({});

                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
                onCancel={() => {
                    handleModalVisible(false),
                        setStepFormValues({})
                }}
                modalVisible={createModalVisible}
            />
            {stepFormValues && Object.keys(stepFormValues).length ? (
                <AddRoleForm
                    onSubmit={async value => {
                        console.log(value)
                        const success = await addRoles(value);
                        if (success) {
                            handleAddRoleModalVisible(false);
                            setStepFormValues({});
                            if (actionRef.current) {
                                actionRef.current.reload();
                            }
                        }
                    }}
                    onCancel={() => {
                        handleAddRoleModalVisible(false),
                            setStepFormValues({})
                    }}
                    modalVisible={addRoleModalVisible}
                    values={stepFormValues}

                />
            ) : null}
            {stepFormValues && Object.keys(stepFormValues).length ? (
                <UpdateForm
                    onSubmit={async value => {
                        const success = await handleUpdate(value);

                        if (success) {
                            handleModalVisible(false);
                            setStepFormValues({});

                            if (actionRef.current) {
                                actionRef.current.reload();
                            }
                        }
                    }}
                    onCancel={() => {
                        handleUpdateModalVisible(false);
                        setStepFormValues({});
                    }}
                    updateModalVisible={updateModalVisible}
                    values={stepFormValues}
                />
            ) : null}
        </PageHeaderWrapper>
    );
};

export default userList;
