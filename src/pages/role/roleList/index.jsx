import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, Dropdown, Menu, message, Popconfirm } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import moment from "moment";
import { getRoleTable, addRoleTable, deleteRole } from '@/services/role';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { getRoles, updateRole } from '@/services/role'
import Authorized from '@/utils/Authorized';

const handleAdd = async fields => {
    const hide = message.loading('正在添加');
    try {
        await addRoleTable({
            ...fields,
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


const roleList = props => {
    const actionRef = useRef();
    const [createModalVisible, handleModalVisible] = useState(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState(false);
    const [stepFormValues, setStepFormValues] = useState({});
    const [roleId, setRoleId] = useState('')
    const columns = [
        {
            title: '序号',
            valueType: 'indexBorder',
            width: 72,
            align: 'center'
        },
        {
            title: '角色名称',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            valueType: 'dateTimeRange',
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
        },
        {
            title: '更新时间',
            align: 'center',
            dataIndex: 'updateTime',
            hideInSearch: true,
            sorter: true,
            valueType: 'dateTime',
        },
        {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            valueEnum: {
                1: {
                    text: '正常',
                    status: 'Processing',
                },
                0: {
                    text: '禁用',
                    status: 'Default',
                },
            },
        },
        {
            align: 'center',
            hideInSearch: true,
            title: '描述',
            dataIndex: 'description',
            valueType: 'code',
            key: 'code',
        },
        {
            align: 'center',
            title: '操作',
            fixed: 'right',
            render: (txt, record, index) => {
                return (<div>
                    <Authorized authority="sys:role:update" noMatch=''>
                        <a onClick={async () => {
                            setRoleId(record.id)
                            await getRoles(record).then(data => {
                                if (data !== undefined) {
                                    if (data.code === 0) {
                                        handleUpdateModalVisible(true);
                                        setStepFormValues(data.data);
                                    }
                                }
                            })
                        }}>修改</a>
                    </Authorized>
                    <Divider type="vertical" />
                    <Authorized authority="sys:role:delete" noMatch=''>
                        <Popconfirm title="确定删除此项? "
                            placement="leftTop"
                            onCancel={() => console.log("用户取消删除")}
                            onConfirm={() => {
                                deleteRole({ id: record.id }).then(success => {
                                    if (success !== undefined) {
                                        if (success.code === 0) {
                                            message.success('删除成功')
                                        } else {
                                            message.error(success.msg)
                                        }
                                        if (actionRef.current) {
                                            actionRef.current.reload();
                                        }
                                    }
                                })
                            }}>
                            <a >删除</a>
                        </Popconfirm>
                    </Authorized>
                </div>)
            }
        }
    ];
    return (
        <PageHeaderWrapper title=''>
            <ProTable
                headerTitle="角色列表"
                actionRef={actionRef}
                rowKey="id"
                toolBarRender={(action, { selectedRows }) => [
                    <Authorized authority="sys:role:add" noMatch='' >
                        <Button icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
                            新建
                         </Button>
                    </Authorized>
                ]}
                columns={columns}
                request={async (params = {}) => {
                    const data = await getRoleTable(
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
                search={<Authorized authority="sys:role:list" noMatch={false}>{true}</Authorized>}
                dateFormatter="string"
            />
            <CreateForm
                onSubmit={async value => {
                    const success = await handleAdd(value);
                    if (success) {
                        handleModalVisible(false);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
                onCancel={() => handleModalVisible(false)}
                modalVisible={createModalVisible}
            />
            {stepFormValues && Object.keys(stepFormValues).length ? (
                <UpdateForm
                    onSubmit={async value => {
                        const hide = message.loading('正在配置');
                        const success = await updateRole({ ...value, id: roleId, status: value.switch === true ? 1 : 0 });
                        if (success) {
                            hide();
                            message.success('修改成功')
                            handleUpdateModalVisible(false);
                            setStepFormValues({});
                            if (actionRef.current) {
                                actionRef.current.reload();
                            }
                        } else {
                            hide();
                            message.error('修改失败')
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
    )
}

export default roleList
