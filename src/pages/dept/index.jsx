import React, { useRef, useState, useEffect } from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Dropdown, Input, List, Menu, Modal, Radio, Row, Tag, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Link } from 'umi';
import moment from 'moment';
import styles from './style.less';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import AddRoleForm from './components/AddRoleForm';
import { updateDeptRoles } from '@/services/dept'
import { findDOMNode } from 'react-dom';
import Authorized from '@/utils/Authorized';
import { addDept, deleteDept } from '@/services/dept'

const { Search } = Input;

const Info = ({ title, value, bordered }) => (
    <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
    </div>
);

const ListContent = ({ data: { managerName, createTime, pidName, pid, status } }) => (
    <div className={styles.listContent}>
        <div className={styles.listContentItem}>
            <span>Owner</span>
            <p>{managerName}</p>
        </div>
        <div className={styles.listContentItem}>
            <span>创建时间</span>
            <p>{moment(createTime).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
            {pid === '0' ? <span>没有上级</span> : <span>上级部门</span>}
            <p>{pidName}</p>
        </div>
        <div className={styles.listContentItem}>
            {status === 1 ? <Tag icon={<SmileOutlined />} color="processing">正常</Tag>
                : <Tag icon={<SmileOutlined rotate={180} />} color="default">禁用</Tag>}
        </div>
    </div>
);

export const DeptTable = props => {
    const {
        loading,
        dispatch,
        dept: { deptTable },
    } = props;
    const [stepFormValues, setStepFormValues] = useState({});
    const [addRoleModalVisible, handleAddRoleModalVisible] = useState(false);
    const [createFormModalVisible, handleCreateFormModalVisible] = useState(false);
    const actionRef = useRef();


    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'dept/getDeptTable'
            });
        }
    }, [1]);

    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 5,
        total: deptTable.length,
    };

    const editAndDelete = (key, currentItem) => {
        if (key === 'edit') ''
        else if (key === 'delete') {
            Modal.confirm({
                title: '删除部门',
                content: '确定删除该部门',
                okText: '确认',
                cancelText: '取消',
                onOk: () => deleteItem(currentItem.id),
            });
        }
    };

    const deleteItem = async (id) => {
        await deleteDept(id).then(data => {
            if (data !== undefined) {
                if (data.code === 0) {
                    message.success('删除成功')
                } else {
                    message.warning(data.msg)
                }
            }
        })
        if (dispatch) {
            dispatch({
                type: 'dept/getDeptTable'
            });
        }
    }

    const extraContent = (
        <div className={styles.extraContent}>
            <Authorized authority="sys:dept:add" noMatch=''>
                <Button type="primary" onClick={() => handleCreateFormModalVisible(true)}>新增</Button>
            </Authorized>
            <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
        </div>
    );

    const MoreBtn = ({ item }) => (
        <Dropdown
            overlay={
                <Menu onClick={({ key }) => editAndDelete(key, item)}>
                    <Menu.Item key="edit">
                        <Authorized authority="sys:dept:list" noMatch=''>
                            <Link to={`/account/deptEidt/${item.id}`} >详情</Link>
                        </Authorized>
                    </Menu.Item>
                    <Menu.Item key="delete">
                        <Authorized authority="sys:dept:delete" noMatch=''>
                            删除
                        </Authorized>
                    </Menu.Item>
                </Menu>
            } >
            <a>
                更多 <DownOutlined />
            </a>
        </Dropdown>
    );

    const addRoles = async fields => {
        const hide = message.loading('正在配置');
        try {
            await updateDeptRoles({ deptId: fields.id, roleIds: fields.roleIds });
            hide();
            message.success('配置成功');
            return true;
        } catch (error) {
            hide();
            message.error('配置失败请重试！');
            return false;
        }
    }

    const handleAdd = async fields => {
        console.log(fields)
        const hide = message.loading('正在添加');
        try {
            await addDept({
                name: fields.name,
                pid: fields.pid,
                managerId: fields.managerId,
                phone: fields.phone === undefined ? '' : fields.phone,
                status: fields.switch === true ? 1 : 0
            });
            hide();
            message.success('添加成功');
            return true;
        } catch (error) {
            hide();
            message.error('添加失败请重试！');
            return false;
        }
    };
    return (
        <div>
            <PageHeaderWrapper>
                <div className={styles.standardList}>
                    <Card bordered={false}>
                        <Row>
                            <Col sm={8} xs={24}>
                                <Info title="我的部门" value={localStorage.getItem('group')} bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="已成立部门" value={deptTable.length} bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="本周完成任务数" value="24个任务" />
                            </Col>
                        </Row>
                    </Card>

                    <Card
                        className={styles.listCard}
                        bordered={false}
                        title="基本列表"
                        style={{
                            marginTop: 24,
                        }}
                        bodyStyle={{
                            padding: '0 32px 40px 32px',
                        }}
                        extra={extraContent}>

                        <List
                            ref={actionRef}
                            size="large"
                            rowKey="id"
                            loading={loading}
                            pagination={paginationProps}
                            dataSource={deptTable}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <Authorized authority="sys:dept:role:update" noMatch=''>
                                            <a
                                                onClick={e => {
                                                    e.preventDefault();
                                                    handleAddRoleModalVisible(true),
                                                        setStepFormValues(item)
                                                }}>
                                                授权
                                        </a>
                                        </Authorized>,
                                        <MoreBtn key="more" item={item} />,
                                    ]}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} shape="square" size="large" />}
                                        title={<a >{item.name}</a>}
                                        description={item.relationCode}
                                    />
                                    <ListContent data={item} />
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
            </PageHeaderWrapper>
            {stepFormValues && Object.keys(stepFormValues).length ? (
                <AddRoleForm
                    onSubmit={async value => {
                        const success = await addRoles(value);
                        if (success) {
                            handleAddRoleModalVisible(false);
                            setStepFormValues({});
                            console.log()
                            if (actionRef.current) {
                                const aaref = findDOMNode(actionRef.current)
                                setTimeout(() => aaref.blur(), 0);
                            }
                        }
                    }}
                    onCancel={() => {
                        handleAddRoleModalVisible(false),
                            setStepFormValues({})
                    }}
                    modalVisible={addRoleModalVisible}
                    values={stepFormValues}
                />
            ) : null}
            <CreateForm
                onSubmit={async value => {
                    const success = await handleAdd(value);
                    if (success) {
                        handleCreateFormModalVisible(false);
                        setStepFormValues({});
                        if (actionRef.current) {
                            const aaref = findDOMNode(actionRef.current)
                            setTimeout(() => aaref.blur(), 0);
                        }
                    }
                }}
                onCancel={() => {
                    handleCreateFormModalVisible(false),
                        setStepFormValues({})
                }}
                modalVisible={createFormModalVisible}
            />

        </div>
    );
};
export default connect(({ dept, loading }) => ({
    dept,
    loading: loading.models.dept,
}))(DeptTable);
