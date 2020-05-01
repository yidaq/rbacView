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
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const { dispatch } = props;
  const [initValue, setInitValue] = useState({ switch: true, prefix: '86' })
  const [fetching, setFetching] = useState(false)
  const [selectData, setSelectData] = useState([])

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

  const fetchUser = async value => {
    setFetching(true)
    setSelectData([])
    await getUserByKey({ key: value + '' }).then(data => {
      if (data !== undefined) {
        if (data.data !== null) {
          setSelectData(data.data)
          setFetching(false)
        }
      }
    })
  }

  return (
    <Modal
      destroyOnClose
      title="新建部门"
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
          label="部门名称"
          name="name"
          hasFeedback
          rules={[{ required: true, message: '部门名称不能为空!' }]}
        >
          <Input placeholder="请输入部门名称" allowClear />
        </Form.Item>

        <Form.Item
          label="部门负责人"
          name="managerId"
          hasFeedback
          rules={[{ required: true, message: '部门负责人不能为空!' }]}
        >
          <Select
            showSearch
            allowClear
            // mode="multiple"
            placeholder="请输入部门负责人昵称"
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={fetchUser}
            style={{ width: '100%' }}
          >
            {selectData.map(d => (
              <Select.Option key={d.value}>{d.title}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="phone"
          label="部门负责人电话"
          hasFeedback
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} allowClear />
        </Form.Item>

        <Form.Item
          label="上级部门"
          name="pid"
          hasFeedback
          rules={[{ required: true, message: '上级部门不能为空!' }]}
        >
          <TreeSelect
            allowClear
            style={{ width: '80%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={props.dept.deptTree || []}
            placeholder="请选择上级部门"
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
