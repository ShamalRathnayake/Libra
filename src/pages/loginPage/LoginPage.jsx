import { Button, Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import styles from './LoginPage.module.scss';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const LoginPage = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row className={styles.mainContainer}>
      <Col sm={{ flex: '100%' }} md={{ flex: '40%' }}>
        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <Card className={styles.formCard}>
              <h1 className={styles.titleText}>Welcome</h1>
              <Form
                name="login"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Username!',
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                  ]}
                >
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button block type="primary" htmlType="submit">
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </Col>
      <Col sm={{ flex: '0%' }} md={{ flex: '60%' }}>
        <div className={styles.imageContainer}></div>
      </Col>
    </Row>
  );
};

export default LoginPage;
