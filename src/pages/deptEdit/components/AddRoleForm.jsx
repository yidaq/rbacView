import React, { useEffect, useState } from 'react';
import { Modal, Transfer } from 'antd';
import { connect } from 'umi'


const AddRoleForm = props => {
    const { dispatch, allPermissions, ownPermissions, deptId } = props;
    const { modalVisible, onSubmit: addRoles, onCancel, values } = props;
    const okHandle = () => {
        addRoles({ roleIds: props.ownRoles, id: values.id });
    };

    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'deptPermission/getDeptOwnPermissions',
                payload: { deptId: deptId, userId: values.id }
            });
        }
    }, [])

    const handleChange = (targetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            dispatch({
                type: 'deptPermission/changeDeptOwnPermissions',
                payload: {
                    allPermissions: allPermissions,
                    ownPermissions: [...targetKeys]
                }
            });
        } else {
            for (var i = 0; i < moveKeys.length; i++) {
                dispatch({
                    type: 'deptPermission/deleteDeptOwnPermissions',
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
            title="部门资源授权"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => onCancel()}
        >
            <Transfer
                dataSource={allPermissions}
                targetKeys={ownPermissions}
                titles={['资源列表', '已有资源']}
                onChange={handleChange}
                render={item => item.title}
            />
        </Modal>
    )
}

export default connect(({ deptPermission }) => ({
    allPermissions: deptPermission.allPermissions,
    ownPermissions: deptPermission.ownPermissions,
}))(AddRoleForm);
