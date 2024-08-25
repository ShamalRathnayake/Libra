import { Card, Col, Row, Space, Statistic } from 'antd';
import React from 'react';
import styles from './AdminDashboard.module.scss';
import CountUp from 'react-countup';

const AdminDashboard = () => {
  const getCounter = (value) => (
    <CountUp end={value} separator="," className={styles.textWhite} />
  );
  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: 'flex',
      }}
    >
      <Row>
        <Col span={24}>
          <h1>Dashboard</h1>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Books"
              value={112893}
              formatter={getCounter}
              className={styles.textWhite}
            />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Authors"
              value={175}
              formatter={getCounter}
              className={styles.textWhite}
            />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Users"
              value={150}
              formatter={getCounter}
              className={styles.textWhite}
            />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Users"
              value={150}
              formatter={getCounter}
              className={styles.textWhite}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default AdminDashboard;
