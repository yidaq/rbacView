import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Switch, TreeSelect } from 'antd';
import { withRouter } from 'umi'

const formLayout = {
    labelCol: {
        span: 7,
    },
    wrapperCol: {
        span: 13,
    },
};

const UpdateForm = props => {
    const [form] = Form.useForm();
    const { modalVisible, onSubmit: handleUpdate, onCancel: handleUpdateModalVisible, updateModalVisible, values } = props;
    const [value, setValue] = useState('')

    const okHandle = async () => {
        const fieldsValue = await form.validateFields();
        form.resetFields();
        handleUpdate(fieldsValue);
    };

    const onChange = value => {
        setValue(value)
    };

    return (
        <Modal
            destroyOnClose
            title="新建规则"
            visible={updateModalVisible}
            onOk={okHandle}
            onCancel={() => handleUpdateModalVisible()}
        >

            <Form
                form={form}
                {...formLayout}
                initialValues={{
                    name: values.name,
                    description: values.description,
                    permissions: values.permissions,
                    switch: values.status === 1 ? true : false,
                }}
            >

                <Form.Item
                    label="角色名称"
                    name="name"
                    hasFeedback
                    rules={[{ required: true, message: '角色名称不能为空!' }]}
                >
                    <Input allowClear placeholder="请输入目录名称" />
                </Form.Item>

                <Form.Item
                    label="备注"
                    name="description"
                    hasFeedback
                >
                    <Input allowClear placeholder='请输入备注' />
                </Form.Item>

                <Form.Item
                    label="赋予权限"
                    name="permissions"
                >
                    <TreeSelect
                        style={{ width: '100%' }}
                        treeCheckable={true}
                        value={value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={values.menuTreeRespVO}
                        placeholder="请选权限"
                        allowClear
                        multiple
                        treeDefaultExpandAll={true}
                        onChange={onChange}
                    />

                </Form.Item>


                <Form.Item name="switch" label="状态" valuePropName="checked">
                    <Switch unCheckedChildren="0" />
                </Form.Item>

            </Form>

        </Modal>
    );
};
export default withRouter(UpdateForm);
