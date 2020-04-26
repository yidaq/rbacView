import React, { useState } from 'react';
import { Radio, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ButtonFrom from './components/ButtonFrom'
import MenuFrom from './components/MenuFrom'
import MuluFrom from './components/MuluFrom'

const permissionEdit = (props) => {
    const [value, setValue] = useState('目录')
    var isFrom
    const onChange = e => {
        setValue(e.target.value)
    };
    switch (value) {
        case '目录': isFrom = <MuluFrom style={{ marginTop: 10 }} />; break
        case '菜单': isFrom = <MenuFrom />; break
        case '按钮': isFrom = <ButtonFrom />; break
        default: break
    }
    return (
        <PageHeaderWrapper title={'新建权限'}>
            <Card >
                <span style={{ marginLeft: 50 }}>类型：</span>
                <Radio.Group onChange={onChange} value={value} style={{ marginBottom: 30 }}>
                    <Radio value={'目录'}>目录</Radio>
                    <Radio value={'菜单'}>菜单</Radio>
                    <Radio value={'按钮'}>按钮</Radio>
                </Radio.Group >
                {isFrom}
            </Card>
        </PageHeaderWrapper>
    )
}

export default permissionEdit
