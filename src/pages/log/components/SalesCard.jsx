import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import React from 'react';
import numeral from 'numeral';
import Bar from './Charts/Bar';
import styles from '../style.less';
import { connect } from 'umi';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const rankingListData = [];

for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: '用户' + i,
    total: 323234,
  });
}

const SalesCard = ({
  rangePickerValue,
  salesData,
  handleRangePickerChange,
  loading,
}) => (
    <Card
      loading={loading}
      bordered={false}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.salesCard}>
        <Tabs
          size="large"
          tabBarStyle={{
            marginBottom: 24,
          }}
        >

          <TabPane tab={'日志趋势图'} key="views" >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar
                    height={292}
                    title={'2020年日志量趋势图'}
                    data={salesData}
                  />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>
                    日志处理量排名
                  </h4>
                  <ul className={styles.rankingList}>
                    {rankingListData.map((item, i) => (
                      <li key={item.title}>
                        <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                        <span>{numeral(item.total).format('0,0')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );

export default SalesCard;
