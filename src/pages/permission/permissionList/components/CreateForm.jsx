import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Switch, TreeSelect, Select, Tag } from 'antd';
import { withRouter, connect } from 'umi'

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const CreateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const type = props.values.type
  const { dispatch } = props;
  const [value, setValue] = useState('')
  const [fromVal, setFromVal] = useState({})

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'permission/getMenuTree',
        payload: { type: type === 2 ? 'false' : 'true' }
      });
    }
    switch (type) {
      case 1:
        setFromVal({
          switch: true,
          name: props.values.name,
          url: props.values.url,
          orderNum: props.values.orderNum
        })
        break;
      case 2:
        setFromVal({
          switch: true,
          pid: props.values.pid,
          name: props.values.name,
          url: props.values.url,
          perms: props.values.perms,
          method: props.values.method,
          orderNum: props.values.orderNum,
        })
        break;
      default:
        setFromVal({
          switch: true,
          name: props.values.name,
          pid: props.values.pid,
          url: props.values.url,
          perms: props.values.perms,
          method: props.values.method,
          code: props.values.code,
          orderNum: props.values.orderNum,
        })
        break;
    }

  }, [])
  console.log(fromVal)
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd(fieldsValue);
  };
  const onChange = value => {
    setValue(value)
  };
  if (type === 1) {
    return (
      <Modal
        destroyOnClose
        title="修改目录"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => { setFromVal({}), onCancel() }}
      >
        <Form
          key='1'
          form={form}
          {...formLayout}
          initialValues={{
            ...fromVal
          }}
        >

          <Form.Item
            label="目录名称"
            name="name"
            hasFeedback
            rules={[{ required: true, message: '目录名称不能为空!' }]}
          >
            <Input placeholder="请输入目录名称" />
          </Form.Item>

          <Form.Item
            label="所属菜单"
            name="pid"
          >
            <Input disabled={true} placeholder='默认顶级菜单' />
          </Form.Item>

          <Form.Item
            label="接口URL"
            name="url"
          >
            <Input placeholder="请输入接口URL" />
          </Form.Item>

          <Form.Item
            label="排序码"
            name="orderNum"
          >
            <Input placeholder="请输入排序码" />
          </Form.Item>

          <Form.Item name="switch" label="状态" valuePropName="checked">
            <Switch unCheckedChildren="0" />
          </Form.Item>

        </Form>
      </Modal>
    )
  }

  if (type === 2) {
    return (
      <Modal
        destroyOnClose
        title="修改菜单"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => { setFromVal({}), onCancel() }}
      >
        <Form
          key='2'
          form={form}
          {...formLayout}
          initialValues={{
            ...fromVal
          }}
        >

          <Form.Item
            label="菜单名称"
            name="name"
            defaultValue=""
            hasFeedback
            rules={[{ required: true, message: '目录名称不能为空!' }]}
          >
            <Input placeholder="请输入目录名称" />
          </Form.Item>

          <Form.Item
            label="所属目录"
            name="pid"
            hasFeedback
            rules={[{ required: true, message: '所属目录不能为空!' }]}
          >
            <TreeSelect
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={props.permission.menuTree || []}
              placeholder="所属目录"
              treeDefaultExpandAll
              onChange={onChange}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="接口URL"
            name="url"
          >
            <Input placeholder="请输入接口URL" />
          </Form.Item>

          <Form.Item
            label="授权标识"
            name="perms"
          >
            <Input placeholder="请输入授权标识,如果 sys:user:list" />
          </Form.Item>

          <Form.Item
            label="请求方式"
            name="method"
          >
            <Select placeholder="请输入请求方式，如 GET、POST" style={{ width: 120 }} allowClear>
              <Select.Option value="GET" key="get111"><Tag color="blue" > {'GET'}</Tag></Select.Option>
              <Select.Option value="POST" key="post111"><Tag color="green" > {'POST'}</Tag></Select.Option>
              <Select.Option value="DELETE" key="delete111"><Tag color="red" > {'DELETE'}</Tag></Select.Option>
              <Select.Option value="PUT" key="put11"><Tag color="orange" > {'PUT'}</Tag></Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="排序码"
            name="orderNum"
          >
            <Input placeholder="请输入排序码" />
          </Form.Item>
          <Form.Item name="switch" label="状态" valuePropName="checked">
            <Switch unCheckedChildren="0" />
          </Form.Item>

        </Form>
      </Modal>
    )
  }
  return (
    <Modal
      destroyOnClose
      title="修改按钮"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => { setFromVal({}), onCancel() }}
    >
      <Form
        key='3'
        form={form}
        {...formLayout}
        initialValues={{
          ...fromVal
        }}
      >
        <Form.Item
          label="按钮名称"
          name="name"
          defaultValue=""
          hasFeedback
          rules={[{ required: true, message: '按钮名称不能为空!' }]}
        >
          <Input allowClear placeholder="请输入按钮名称" />
        </Form.Item>

        <Form.Item
          label="所属菜单"
          name="pid"
          hasFeedback
          rules={[{ required: true, message: '所属菜单不能为空!' }]}

        >
          <TreeSelect
            style={{ width: '100%' }}
            allowClear
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={props.permission.menuTree || []}
            placeholder="请选择所属菜单"
            treeDefaultExpandAll
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item
          label="接口URL"
          name="url"
          hasFeedback
        >
          <Input allowClear placeholder="请输入接口URL" />
        </Form.Item>

        <Form.Item
          label="授权标识"
          name="perms"
          hasFeedback
          rules={[{ required: true, message: '授权标识不能为空!' }]}
        >
          <Input allowClear placeholder="请输入授权标识,如果 sys:user:list" />

        </Form.Item>

        <Form.Item
          label="请求方式"
          name="method"
          hasFeedback
          rules={[{ required: true, message: '请求方式不能为空!' }]}
        >
          <Select placeholder="请输入请求方式，如 GET、POST" style={{ width: 120 }} allowClear>
            <Select.Option value="GET" key="get111"><Tag color="blue" > {'GET'}</Tag></Select.Option>
            <Select.Option value="POST" key="post111"><Tag color="green" > {'POST'}</Tag></Select.Option>
            <Select.Option value="DELETE" key="delete111"><Tag color="red" > {'DELETE'}</Tag></Select.Option>
            <Select.Option value="PUT" key="put11"><Tag color="orange" > {'PUT'}</Tag></Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="按钮标识"
          name="code"
          hasFeedback
          rules={[{ required: true, message: '按钮控制标识不能为空!' }]}
        >
          <Input allowClear placeholder="请输入前后端分离按钮控制标识,如果 btn-permission-list" />
        </Form.Item>

        <Form.Item
          label="排序码"
          name="orderNum"
        >
          <Input allowClear placeholder="请输入排序码" />
        </Form.Item>

        <Form.Item name="switch" label="状态" valuePropName="checked">
          <Switch unCheckedChildren="0" />
        </Form.Item>
      </Form>
    </Modal>
  )
};
export default connect(({ permission }) => ({
  permission,
}))(CreateForm);
