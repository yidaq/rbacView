import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, Dropdown, Menu, message } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import moment from "moment";
import { getRoleTable } from '@/services/role';

const roleList = props => {
    const actionRef = useRef();

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
                2: {
                    text: '禁用',
                    status: 'Error',
                },
            },
        },
        {
            align: 'center',
            title: '描述',
            dataIndex: 'description',
            valueType: 'code',
            key: 'code',
        },
        {
            align: 'center',
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
                <>
                    <a
                        onClick={() => {
                            console.log(record.id)
                        }}>
                        修改
                    </a>
                    <Divider type="vertical" />
                    <a href="">删除</a>
                </>
            ),
        },
    ];
    return (
        <PageHeaderWrapper title=''>
            <ProTable
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="key"
                toolBarRender={(action, { selectedRows }) => [
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
                        新建
                     </Button>,

                ]}
                columns={columns}
                request={async (params = {}) => {
                    const data = await getRoleTable(
                        {
                            params: {
                                pageNum: params.current,
                                pageSize: params.pageSize,
                            },
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
                dateFormatter="string"
            />
        </PageHeaderWrapper>
    )
}

export default roleList
