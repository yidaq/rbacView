import React, { useState, useRef, useEffect } from 'react';
import { Table, Tag, Button, Popconfirm, Spin, Space, Divider } from 'antd';
import { Dropdown, Menu, message } from 'antd';
import moment from "moment";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm';
import { getPermissionTable } from '@/services/permission';

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: '7%',
  },
  {
    title: 'url',
    dataIndex: 'url',
    key: 'url',
    width: '6%',
    align: 'center',
  },
  {
    title: '请求方式',
    dataIndex: 'method',
    width: '4%',
    key: 'method',
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
    width: '4%',
    key: 'type',
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
    }
  },
  {
    title: '父级名称',
    dataIndex: 'pidName',
    width: '6%',
    key: 'pidName',
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
    key: 'orderNum',
    width: '3%',
    align: 'center',
  },
  {
    title: '资源标识',
    dataIndex: 'perms',
    key: 'perms',
    width: '5%',
    align: 'center',
  },
  {
    title: '前后端分离按钮控制标识',
    dataIndex: 'code',
    key: 'code',
    width: '6%',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '6%',
    key: 'createTime',
    align: 'center',
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
  },
  {
    align: 'center',
    width: '4%',
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: val => {
      if (val === 1) {
        return <Tag color="#87d068" style={{ marginLeft: 10 }} > {'正常'}</Tag>
      }
      if (val === 2) {
        return <Tag color="#f50" style={{ marginLeft: 10 }} > {'禁用'}</Tag>
      }
    }
  },
  {
    align: 'center',
    title: '操作',
    fixed: 'right',
    width: '5%',
    render: (txt, record, index) => {
      return (<div>
        <a type="primary" size="small" onClick={() => {
          props.history.push(`/admin/permission/edit/${record.id}`)
        }}>修改</a>
        <Divider type="vertical" />
        <Popconfirm title="确定删除此项? "
          placement="leftTop"
          onCancel={() => console.log("用户取消删除")}
          onConfirm={() => console.log("用户确定删除")
            //此处调用api接口
          }>
          <a type="danger" size="small"  >删除</a>
        </Popconfirm>
      </div>)
    }
  }
];

//批量删除
const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
};
//新建事件
const handleAdd = async fields => {
  const hide = message.loading('正在添加');
  try {
    await addRule({
      desc: fields.desc,
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

const PermissionList = props => {
  const actionRef = useRef();
  const [createModalVisible, handleModalVisible] = useState(false);
  const [permissionTable, setPermissionTable] = useState([])

  useEffect(() => {
    getPermissionTable().then(data => {
      setPermissionTable(data.data)
    })

  }, []);

  return (
    <PageHeaderWrapper title={' '}>
      <ProTable
        actionRef={actionRef}
        headerTitle="菜单列表"
        rowKey="key"
        autoExpandParent={true}
        toolBarRender={(action, { selectedRows }) => [
          <Button icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
            新建
           </Button>,
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
        bordered
        dataSource={permissionTable}
        scroll={{ x: 1900 }} >
      </ProTable>
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
    </PageHeaderWrapper>
  )
}

export default PermissionList
