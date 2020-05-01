import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import styles from './style.less';

import { connect } from 'umi';

// const PageHeaderContent = ({ currentUser }) => {
//     const loading = currentUser && Object.keys(currentUser).length;
//     if (!loading) {
//         return (
//             <Skeleton avatar paragraph={{ rows: 1, }} active />
//         );
//     }
//     return (
//         <div className={styles.pageHeaderContent}>
//             <div className={styles.avatar}>
//                 <Avatar size="large" src={currentUser.avatar} />
//             </div>
//             <div className={styles.content}>
//                 <div className={styles.contentTitle}>
//                     你好，
//                      {currentUser.name}
//                 </div>
//                 <div>
//                     {currentUser.role} | {currentUser.group}
//                 </div>
//             </div>
//         </div>
//     );
// };
const ExtraContent = () => (
    <div className={styles.extraContent}>
        <div className={styles.statItem}>
            <Statistic title="项目数" value={56} />
        </div>
        <div className={styles.statItem}>
            <Statistic title="团队内排名" value={8} suffix="/ 24" />
        </div>
        <div className={styles.statItem}>
            <Statistic title="项目访问" value={2223} />
        </div>
    </div>
);
const DeptEdit = props => {
    const deptId = props.match.params.id
    return (
        // <PageHeaderWrapper title=' ' content={<PageHeaderContent currentUser={currentUser} />} extraContent={<ExtraContent />}>

        <div>1</div>
        // </PageHeaderWrapper>
    )
}

export default DeptEdit
