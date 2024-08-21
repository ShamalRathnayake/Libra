import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import React from 'react';
import styles from './LoginPage.module.scss';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import stackLogo from '../../assets/stack.png';
import { useLoginMutation } from '../../store/userApi/userApiSlice';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice/authSlice';
import { showNotification } from '../../store/notificationSlice/notificationSlice';

const LoginPage = () => {
  const [loginApi] = useLoginMutation();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    console.log('Success:', values);

    try {
      const response = await loginApi(values).unwrap();
      console.log('🚀 ~ onFinish ~ response:', response);

      dispatch(login({ user: response.user, token: response.token }));

      dispatch(
        showNotification({
          type: 'success',
          message: 'Login Successful',
          description: '',
        }),
      );
    } catch (error) {
      console.log('🚀 ~ onFinish ~ error:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Error',
          description: error.message || error?.data?.message,
        }),
      );
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row className={styles.mainContainer}>
      <Col span={24} className={styles.mainOverlay}>
        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <Card className={styles.formCard}>
              <div className={styles.titleWrapper}>
                <img src={stackLogo} alt="" className={styles.stackLogo} />
                <p className={styles.titleText}>Libra</p>
              </div>
              <h4 className={styles.subText}>Library Management System</h4>
              <Form
                name="login"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Space
                  direction="vertical"
                  size={'small'}
                  className={styles.inputWrapper}
                >
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your Email!',
                      },
                      {
                        type: 'email',
                        message: 'Please enter a valid email',
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Email"
                      type="email"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your Password!',
                      },
                      {
                        max: 30,
                        message: 'Max length allowed is 30 characters',
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
                </Space>
              </Form>
            </Card>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;
