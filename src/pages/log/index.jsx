import { EllipsisOutlined, DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, Row, Button, message } from 'antd';
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'umi';
import PageLoading from './components/PageLoading';
import styles from './style.less';
import SalesCard from './components/SalesCard'
import ProTable from '@ant-design/pro-table';
import { getLogTable, deleteLogs } from '@/services/log'

const handleRemove = async selectedRows => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
        await deleteLogs({
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

const Log = props => {
    const { loading, dispatch, chart } = props
    const [stepFormValues, setStepFormValues] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '序号',
            valueType: 'indexBorder',
            fixed: 'left',
            width: '4%',
            align: 'center'
        },
        {
            title: '用户账号',
            width: '5%',
            dataIndex: 'username',
            align: 'center',
        },
        {
            title: '用户操作',
            hideInSearch: true,
            dataIndex: 'operation',
            align: 'center',
        },
        {
            title: '请求方法',
            hideInSearch: true,
            dataIndex: 'method',
            align: 'center',
        },
        {
            title: '请求参数',
            width: '8%',
            hideInSearch: true,
            dataIndex: 'params',
            align: 'center',
        },
        {
            title: 'IP地址',
            dataIndex: 'ip',
            width: '5%',
            align: 'center',
        },
        {
            title: '创建时间',
            hideInSearch: true,
            dataIndex: 'createTime',
            valueType: 'dateTime',
            width: '10%',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'option',
            valueType: 'option',
            width: '5%',
            fixed: 'right',
            render: (_, record) => (
                <>
                    <a onClick={() => {
                        handleRemove([{ id: record.id }]),
                            actionRef.current.reload()
                    }}>删除</a>
                </>)
        },
    ]
    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'log/getLogChart'
            })
        }
    }, [])
    return (
        <GridContent>
            <React.Fragment>
                <Suspense fallback={<PageLoading />}>
                </Suspense>
                <Suspense fallback={null}>
                    <SalesCard
                        // rangePickerValue={rangePickerValue}
                        salesData={chart}
                        // handleRangePickerChange={this.handleRangePickerChange}
                        loading={loading}
                    //   selectDate={this.selectDate}
                    />
                </Suspense>

                <ProTable
                    scroll={{ x: 1900 }}
                    style={{ marginTop: 30 }}
                    headerTitle="日志列表"
                    actionRef={actionRef}
                    rowKey="id"
                    toolBarRender={(action, { selectedRows }) => [,
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
                            const data = await getLogTable(
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
                    // search={false}
                    rowSelection={{}}
                />
            </React.Fragment>
        </GridContent>
    )
}
export default connect(({ log, loading }) => ({
    chart: log.chart,
    loading: loading.effects['log/getLogChart'],
}))(Log);
