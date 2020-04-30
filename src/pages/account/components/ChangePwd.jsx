import React, { useState, useEffect } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload, Form, message } from 'antd';
import { connect, FormattedMessage, history } from 'umi';
import styles from './BaseView.less';
import { updateUserPassword } from '@/services/user'
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

const ChangePwd = props => {
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

    const handleFinish = async (value) => {
        const hide = message.loading('正在修改');
        await updateUserPassword(value).then(data => {
            if (data !== undefined) {
                if (data.code === 0) {
                    hide();
                    message.success('修改成功');
                    history.replace('/user/login');
                } else {
                    hide();
                    message.error('修改失败');

                }
            } else {
                hide();
                message.error('修改失败');
            }
        })

    };

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
                        username: currentUser.username,
                    }}
                    hideRequiredMark
                >
                    <Form.Item
                        name="username"
                        label={'账号'}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="oldPwd"
                        label={'旧密码'}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '旧密码不能为空！'
                            },
                        ]}
                    >
                        <Input.Password allowClear />
                    </Form.Item>
                    <Form.Item
                        name="newPwd"
                        label={'新密码'}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '新密码不能为空！'
                            },
                        ]}
                    >
                        <Input.Password allowClear />
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" type="primary">
                            修改信息
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
export default connect(({ user }) => ({
    currentUser: user.currentUser,
}))(ChangePwd);
