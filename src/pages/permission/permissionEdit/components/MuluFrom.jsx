import React, { useState } from 'react'
import { Form, Input, Button, Switch, message } from 'antd';
import { withRouter, connect } from 'umi'
import { addPermission } from '@/services/permission'

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
};
const tailLayout = {
    wrapperCol: { offset: 2, span: 8 },
};

function MuluFrom(props) {
    const [status, setStatus] = useState('1')
    const onFinish = async values => {
        values.pid = '0'
        const hide = message.loading('正在添加');
        await addPermission({ ...values, type: '1', status: status }).then(data => {
            if (data !== undefined) {
                if (data.code === 0) {
                    hide();
                    message.success('添加成功')
                    props.history.push('/org/permission')
                } else {
                    hide();
                    message.error('失败:' + data.msg)
                }
            } else {
                hide();
                message.error('添加失败')
            }
        })

    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };


    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ pid: '默认顶级菜单' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size={"middle"}
        >
            <Form.Item
                label="目录名称"
                name="name"
                defaultValue=""
                rules={[{ required: true, message: '目录名称不能为空!' }]}
            >
                <Input allowClear placeholder="请输入目录名称" />
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
                hasFeedback
            >
                <Input allowClear placeholder="请输入接口URL" />
            </Form.Item>

            <Form.Item
                label="排序码"
                name="orderNum"
                hasFeedback
            >
                <Input allowClear placeholder="请输入排序码" />
            </Form.Item>

            <Form.Item label="状态">
                <Switch unCheckedChildren="0" defaultChecked onClick={(status) => { if (status === false) setStatus('0') }} />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 30 }}>
                    添加
                </Button>
                <Button onClick={() => { props.history.push('/org/permission') }} >
                    返回
                </Button>
            </Form.Item>
        </Form>
    )
}

export default withRouter(MuluFrom)
