import React, { useState, useEffect } from 'react'
import { withRouter, connect } from 'umi'
import { Form, Input, Button, TreeSelect, Switch, message } from 'antd';
import { addPermission } from '@/services/permission'

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
};
const tailLayout = {
    wrapperCol: { offset: 2, span: 8 },
};

const MenuFrom = (props) => {

    const { dispatch } = props;
    const [value, setValue] = useState('')
    const [status, setStatus] = useState('1')

    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'permission/getMenuTree',
                payload: { type: 'false' }
            });
        }
    }, [])

    const onFinish = async values => {
        const hide = message.loading('正在添加');
        await addPermission({ ...values, type: '2', status: status }).then(data => {
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
    const onChange = value => {
        setValue(value)
    };
    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ status: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size={"middle"}
        >
            <Form.Item
                label="菜单名称"
                name="name"
                defaultValue=""
                hasFeedback
                rules={[{ required: true, message: '目录名称不能为空!' }]}
            >
                <Input allowClear placeholder="请输入目录名称" />
            </Form.Item>

            <Form.Item
                label="所属目录"
                hasFeedback
                name="pid"
                rules={[{ required: true, message: '所属目录不能为空!' }]}

            >
                <TreeSelect
                    style={{ width: '100%' }}
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
            >
                <Input allowClear placeholder="请输入授权标识,如果 sys:user:list" />
            </Form.Item>

            <Form.Item
                label="请求方式"
                name="method"
                hasFeedback
            >
                <Input allowClear placeholder="请输入请求方式，如 GET、POST" />
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
export default connect(({ permission }) => ({
    permission,
}))(withRouter(MenuFrom));
