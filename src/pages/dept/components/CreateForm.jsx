import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Switch, TreeSelect, Select } from 'antd';
import { withRouter, connect } from 'umi'

const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};

const CreateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const { dispatch } = props;
  const [initValue, setInitValue] = useState({ switch: true, prefix: '86' })

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Select.Option value="86">+86</Select.Option>
        <Select.Option value="87">+87</Select.Option>
      </Select>
    </Form.Item>
  );
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd(fieldsValue);
  };
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'dept/getDeptTree',
      });
    }
  }, [])

  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => { onCancel(), setInitValue({ switch: true, prefix: '86', }) }}
    >
      <Form
        form={form}
        {...formLayout}
        initialValues={initValue}
      >

        <Form.Item
          label="账号"
          name="username"
          hasFeedback
          rules={[{ required: true, message: '账号不能为空!' }]}
        >
          <Input placeholder="请输入账号" allowClear />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          hasFeedback
          rules={[{ required: true, message: '密码不能为空!' }]}
        >
          <Input.Password placeholder='请输入密码' allowClear />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          hasFeedback
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} allowClear />
        </Form.Item>

        <Form.Item
          label="所属部门"
          name="deptId"
          hasFeedback
          rules={[{ required: true, message: '所属部门不能为空!' }]}
        >
          <TreeSelect
            allowClear
            style={{ width: '80%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={props.dept.deptTree || []}
            placeholder="请选择所属部门"
            treeDefaultExpandAll={true}
          />

        </Form.Item>


        <Form.Item name="switch" label="状态" valuePropName="checked">
          <Switch unCheckedChildren="0" />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default connect(({ dept }) => ({
  dept,
}))(withRouter(CreateForm));
