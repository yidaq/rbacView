import React, { useEffect, useState } from 'react';
import { Modal, Transfer } from 'antd';
import { connect } from 'umi'


const AddRoleForm = props => {
    const { dispatch } = props;
    const { modalVisible, onSubmit: addRoles, onCancel, values } = props;
    const [allRole, setAllRole] = useState([])
    const [ownRoles, setOwnRoles] = useState([])


    const okHandle = () => {
        addRoles({ roleIds: props.ownRoles, id: values.id });
    };

    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'user/getdDeptRoles',
                payload: { id: values.id }
            });
        }
    }, [])

    const handleChange = (targetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            dispatch({
                type: 'user/changeUserRoles',
                payload: {
                    allRole: props.allRole,
                    ownRoles: [...targetKeys]
                }
            });
        } else {
            for (var i = 0; i < moveKeys.length; i++) {
                dispatch({
                    type: 'user/deleteUserRoles',
                    payload: {
                        moveKeys: moveKeys[i],
                    }
                });
            }
        }
    };


    return (
        <Modal
            destroyOnClose
            title="部门角色赋予"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => onCancel()}
        >
            <Transfer
                dataSource={props.allRole}
                targetKeys={props.ownRoles}
                titles={['角色列表', '已有角色']}
                onChange={handleChange}
                render={item => item.title}
            />
        </Modal>
    )
}

export default connect(({ user }) => ({
    ownRoles: user.ownRoles,
    allRole: user.allRole,
}))(AddRoleForm);
