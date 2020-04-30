import { EllipsisOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, Row } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'umi';
import PageLoading from './components/PageLoading';
import styles from './style.less';
// import SalesCard from './components/SalesCard'


const isActive = type => {
    const { rangePickerValue } = this.state;

    if (!rangePickerValue) {
        return '';
    }

    const value = getTimeDistance(type);

    if (!value) {
        return '';
    }

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
        return '';
    }

    if (
        rangePickerValue[0].isSame(value[0], 'day') &&
        rangePickerValue[1].isSame(value[1], 'day')
    ) {
        return styles.currentDate;
    }

    return '';
};

const Log = props => {
    return (
        <GridContent>
            <React.Fragment>
                <Suspense fallback={<PageLoading />}>
                </Suspense>
                <Suspense fallback={null}>
                    {/* <SalesCard
                        rangePickerValue={rangePickerValue}
                        //   salesData={salesData}
                        isActive={isActive}
                    //   handleRangePickerChange={this.handleRangePickerChange}
                    //   loading={loading}
                    //   selectDate={this.selectDate}
                    /> */}
                </Suspense>
            </React.Fragment>
        </GridContent>
    )
}

export default Log
