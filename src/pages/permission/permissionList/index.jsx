import React, { useState, useRef, useEffect } from 'react';
import { Tag, Button, Popconfirm, Divider } from 'antd';
import { Dropdown, Menu, message } from 'antd';
import moment from "moment";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { getPermissionTable, updatePermission } from '@/services/permission';
import Authorized from '@/utils/Authorized';
import CreateForm from './components/CreateForm';
import { deletePermission } from '@/services/permission'


const PermissionList = props => {
  const actionRef = useRef();
  const [createModalVisible, handleModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [id, setId] = useState('')
  const [type, setType] = useState('')

  const columns = [

    {
      title: '菜单名称',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '地址',
      dataIndex: 'url',
      align: 'center',
    },
    {
      align: 'center',
      width: '4%',
      title: '状态',
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
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      render: type => {
        if (type === 1) {
          return <Tag color="#a0d911" style={{ marginLeft: 10 }}> {'目录'}</Tag>
        }
        if (type === 2) {
          return <Tag color="#ff4d4f" style={{ marginLeft: 10 }}> {'菜单'}</Tag>
        }
        if (type === 3) {
          return <Tag color="#fadb14" style={{ marginLeft: 10 }}> {'按钮'}</Tag>
        }
      },
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      align: 'center',
      render: type => {
        if (type === "GET") {
          return <Tag color="blue" style={{ marginLeft: 10 }}> {'GET'}</Tag>
        }
        if (type === "POST") {
          return <Tag color="green" style={{ marginLeft: 10 }}> {'POST'}</Tag>
        }
        if (type === "DELETE") {
          return <Tag color="red" style={{ marginLeft: 10 }}> {'DELETE'}</Tag>
        }
        if (type === "PUT") {
          return <Tag color="orange" style={{ marginLeft: 10 }}> {'PUT'}</Tag>
        }
      }
    },
    {
      title: '父级名称',
      dataIndex: 'pidName',
      align: 'center',
      render: pidName => {
        if (pidName === null || pidName === undefined) {
          return <span>默认顶级菜单</span>
        } else {
          return <span>{pidName}</span>
        }
      }

    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      sorter: true,
      align: 'center',
    },
    {
      title: '资源标识',
      dataIndex: 'perms',
      align: 'center',
    },
    {
      title: '按钮控制标识',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
    },

    {
      align: 'center',
      title: '操作',
      fixed: 'right',
      render: (txt, record, index) => {
        return (<div>
          <Authorized authority="sys:permission:update" noMatch=''>
            <a onClick={() => {
              handleModalVisible(true);
              setId(record.id)
              setType(record.type)
              setStepFormValues(record);
            }}>修改</a>
          </Authorized>
          <Divider type="vertical" />
          <Authorized authority="sys:permission:delete" noMatch=''>
            <Popconfirm title="确定删除此项? "
              placement="leftTop"
              onCancel={() => console.log("用户取消删除")}
              onConfirm={() => {
                deletePermission({ id: record.id }).then(success => {
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
    <PageHeaderWrapper >
      <ProTable
        search={false}
        actionRef={actionRef}
        headerTitle="菜单列表"
        rowKey="key"
        autoExpandParent={true}
        toolBarRender={(action, { selectedRows }) => [
          <Authorized authority='sys:permission:add' noMatch=''>
            <Button icon={<PlusOutlined />} type="primary" onClick={() => props.history.push("/org/permission/1")}>
              新建
           </Button>
          </Authorized>
        ]}
        columns={columns}
        request={params => getPermissionTable(params)}
        scroll={{ x: 1900 }} >
      </ProTable>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <CreateForm
          onSubmit={async value => {
            const values = {
              ...value,
              id: id,
              status: value.switch === true ? 1 : 0,
              type: type,
              perms: value.perms === undefined ? '' : value.perms,
              pid: value.pid === undefined ? '0' : value.pid,
              url: value.url === undefined ? '' : value.url,
              method: value.method === undefined ? '' : value.method,
              orderNum: value.orderNum === undefined ? '100' : value.orderNum,
              code: value.code === undefined ? '' : value.code
            }

            delete values.switch
            await updatePermission(values).then(success => {
              if (success !== undefined) {
                if (success.code === 0) {
                  message.success('修改成功')
                } else {
                  message.error(success.msg)
                }
                handleModalVisible(false);
                setStepFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
          }}
          onCancel={() => { setStepFormValues({}), handleModalVisible(false) }}
          modalVisible={createModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  )
}

export default PermissionList
