import { Col, Row, Space } from 'antd';
import React from 'react';

const Authors = () => {
  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
        }}
      >
        <Row>
          <Col span={24}>
            <h1>Authors</h1>
          </Col>
        </Row>
      </Space>
    </>
  );
};

export default Authors;
