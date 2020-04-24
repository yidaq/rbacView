import React, { useState } from 'react';
import styles from './style.less';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, connect } from 'umi';

function Index(props) {
    const [message, setMessage] = useState(false);
    const [type, setType] = useState('1');

    const LoginMessage = ({ content }) => (
        <Alert
            style={{
                marginBottom: 24,
            }}
            message={content}
            type="error"
            showIcon
        />
    );

    const onFinish = values => {
        const { dispatch } = props;
        dispatch({
            type: 'login/login',
            payload: { ...values, type },
        });
    };

    return (
        <div className={styles.main}>
            {message && (
                <LoginMessage content="账户或密码错误（admin/ant.design）" />
            )}
            <Form
                name="normal_login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '用户名不能为空!' }]}
                >
                    <Input size="large" prefix={<UserOutlined style={{ color: '#1890ff' }} className={styles.prefixIcon} />} placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '密码不能为空!' }]}
                >
                    <Input.Password
                        size="large"
                        prefix={<LockOutlined style={{ color: '#1890ff' }} className={styles.prefixIcon} />}
                        type="password"
                        placeholder="请输入密码"
                    />
                </Form.Item>


                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" className={styles.submit}>
                        登 录
                </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default connect(({ login }) => ({
    userLogin: login,
}))(Index);
