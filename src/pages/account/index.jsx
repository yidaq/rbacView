import React, { useState, useEffect } from 'react'
import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';
import { Menu } from 'antd';
import ChangePwd from './components/ChangePwd'
import OwnMsg from './components/OwnMsg'
import { connect } from 'umi';

const { Item } = Menu;



const Accound = props => {
    const { dispatch } = props;
    const [selectKey, setSelectKey] = useState('ownMsg')

    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'user/fetchCurrent',
            });
        }
    }, [])

    const renderChildren = () => {

        switch (selectKey) {
            case 'ownMsg':
                return <OwnMsg />;

            case 'changePwd':
                return <ChangePwd />;
            default:
                break;
        }

        return null;
    };


    return (
        <GridContent>
            <div
                className={styles.main}
            //   ref={ref => {
            //     if (ref) {
            //       this.main = ref;
            //     }
            //   }}
            >
                <div className={styles.leftMenu}>
                    <Menu mode={'inline'} selectedKeys={selectKey} onClick={({ key }) => { setSelectKey(key) }}>
                        <Item key={'ownMsg'}>个人信息</Item>
                        <Item key={'changePwd'}>安全设置</Item>
                    </Menu>
                </div>
                <div className={styles.right}>
                    <div className={styles.title}>{selectKey === 'ownMsg' ? '个人信息' : '安全设置'}</div>
                    {renderChildren()}
                </div>
            </div>
        </GridContent>
    )
}
export default connect(({ user }) => ({
    currentUser: user.currentUser,
}))(Accound);
