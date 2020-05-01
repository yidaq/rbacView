import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Switch, TreeSelect, Select, Spin } from 'antd';
import { withRouter, connect } from 'umi'
import { getUserByKey } from '@/services/dept'
const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};

const CreateForm = props => {
  const deptId = props.match.params.id
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, extUser, loading } = props;
  const { dispatch } = props;


  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd(fieldsValue);
  };
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'deptEdit/getExtUser',
      });
    }
  }, [])

  return (
    <Modal
      destroyOnClose
      title="添加成员"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => { onCancel(), form.resetFields() }}
    >
      <Form
        form={form}
        {...formLayout}
      >
        <Form.Item
          label="搜索用户"
          name="managerId"
          hasFeedback
          rules={[{ required: true, message: '用户不能为空!' }]}
        >
          <Select
            allowClear
            mode="multiple"
            loading={loading}
            placeholder="若想获取所有请删除输入"
            style={{ width: '100%' }}
          >
            {extUser.map(d => (
              <Select.Option key={d.value}>{d.title}</Select.Option>
            ))}
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default connect(({ deptEdit, loading }) => ({
  extUser: deptEdit.extUser,
  loading: loading.effects['deptEdit/getExtUser'],
}))(withRouter(CreateForm));
