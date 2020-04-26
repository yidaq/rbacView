import React, { useState, useRef, useEffect } from 'react';
import { Tag, Button, Popconfirm, Divider } from 'antd';
import { Dropdown, Menu, message } from 'antd';
import moment from "moment";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { getPermissionTable } from '@/services/permission';
import Authorized from '@/utils/Authorized';
import UpdateForm from './components/UpdateForm';


//批量删除
const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
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

const PermissionList = props => {
  const actionRef = useRef();
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});

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
      width: '4%',
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        1: {
          text: '正常',
          status: 'Processing',
        },
        2: {
          text: '禁用',
          status: 'Default',
        },
      },
    },
    {
      align: 'center',
      title: '操作',
      fixed: 'right',
      render: (txt, record, index) => {
        return (<div>
          <a onClick={() => {
            handleUpdateModalVisible(true);
            setStepFormValues(record);
          }}>修改</a>

          <Divider type="vertical" />

          <Popconfirm title="确定删除此项? "
            placement="leftTop"
            onCancel={() => console.log("用户取消删除")}
            onConfirm={() => console.log("用户确定删除")
              //此处调用api接口
            }>
            <a >删除</a>
          </Popconfirm>
        </div>)
      }
    }
  ];


  return (
    <PageHeaderWrapper title={' '}>
      <ProTable
        actionRef={actionRef}
        headerTitle="菜单列表"
        rowKey="key"
        autoExpandParent={true}
        toolBarRender={(action, { selectedRows }) => [
          <Authorized authority='sys:permission:add' noMatch=''>
            <Button icon={<PlusOutlined />} type="primary" onClick={() => props.history.push("/org/permission/1")}>
              新建
           </Button>
          </Authorized>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown overlay={
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
        columns={columns}
        rowSelection={[]}
        request={params => getPermissionTable(params)}
        scroll={{ x: 1900 }} >
      </ProTable>
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
  )
}

export default PermissionList
