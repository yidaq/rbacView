import React, { useState, useEffect } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload, Form, message } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import styles from './BaseView.less';
import { findDOMNode } from 'react-dom';

const AvatarView = ({ avatar }) => (
    <>
        <div className={styles.avatar_title}>
            <FormattedMessage id="accountandsettings.basic.avatar" defaultMessage="头像" />
        </div>
        <div className={styles.avatar}>
            <img src={avatar} alt="avatar" />
        </div>
        <Upload showUploadList={false}>
            <div className={styles.button_view}>
                <Button>
                    <UploadOutlined />
                    <FormattedMessage
                        id="accountandsettings.basic.change-avatar"
                        defaultMessage="修改头像"
                    />
                </Button>
            </div>
        </Upload>
    </>
);

const ownMsg = props => {
    const [view, setView] = useState(undefined)
    const { dispatch } = props
    const { currentUser } = props
    const getAvatarURL = () => {
        if (currentUser) {
            if (currentUser.avatar) {
                return currentUser.avatar;
            }
            const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
            return url;
        }
        return '';
    }

    const handleFinish = (value) => {
        if (dispatch) {
            dispatch({
                type: 'user/updateUserInfo',
                payload: value
            });
        }
        message.success('修改成功')
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Select.Option value="86">+86</Select.Option>
                <Select.Option value="87">+87</Select.Option>
            </Select>
        </Form.Item>
    );

    const getViewDom = ref => {
        setView(ref)
    };

    return (
        <div className={styles.baseView} ref={getViewDom} >
            <div className={styles.left}>
                <Form
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{
                        email: currentUser.email,
                        nickName: currentUser.name,
                        phone: currentUser.phone,
                        prefix: '86',
                    }}
                    hideRequiredMark
                >
                    <Form.Item
                        name="email"
                        label={'邮箱'}
                        rules={[
                            {
                                type: 'email',
                                message: '请输入正确的邮箱!',
                            },
                            {
                                required: true,
                                message: '邮箱不能为空!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="nickName"
                        label={'昵称'}
                        rules={[
                            {
                                required: true,
                                message: '昵称不能为空！'
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label={'手机号'}
                        rules={[
                            {
                                required: true,
                                message: '手机号不能为空'
                            },
                        ]}
                    >
                        <Input addonBefore={prefixSelector} />
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" type="primary">
                            修改信息
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className={styles.right}>
                <AvatarView avatar={getAvatarURL()} />
            </div>
        </div>
    )
}
export default connect(({ user }) => ({
    currentUser: user.currentUser,
}))(ownMsg);
