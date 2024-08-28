import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '../../store/userApi/userApiSlice';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { setLoading } from '../../store/settingsSlice/settingsSlice';
import { showNotification } from '../../store/notificationSlice/notificationSlice';

const CreateUser = ({ isVisible, onClose, initialUser }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (initialUser) {
      const formValues = {
        ...initialUser,
        joinedDate: initialUser.joinedDate
          ? moment(initialUser.joinedDate, 'YYYY-MM-DD')
          : null,
      };
      form.setFieldsValue(formValues);
    }
  }, [initialUser, form]);

  const onFinish = async (values) => {
    const userData = {
      ...values,
      joinedDate: values.joinedDate
        ? values.joinedDate.format('YYYY-MM-DD')
        : null,
    };

    if (initialUser) {
      try {
        dispatch(setLoading(true));
        await updateUser({ id: initialUser.id, ...userData }).unwrap();
        dispatch(
          showNotification({
            type: 'success',
            message: 'User updated successfully',
            description: '',
          }),
        );
      } catch (error) {
        console.log('🚀 ~ onFinish ~ error:', error);
        dispatch(
          showNotification({
            type: 'error',
            message: 'Updating user failed',
            description: '',
          }),
        );
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      try {
        dispatch(setLoading(true));
        await createUser(userData).unwrap();
        dispatch(
          showNotification({
            type: 'success',
            message: 'User created successfully',
            description: '',
          }),
        );
      } catch (error) {
        console.log('🚀 ~ onFinish ~ error:', error);
        dispatch(
          showNotification({
            type: 'error',
            message: 'Creating user failed',
            description: '',
          }),
        );
      } finally {
        dispatch(setLoading(false));
      }
    }

    onClose();
  };

  return (
    <Modal
      title={initialUser ? 'Edit User' : 'Create New User'}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter the first name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter the last name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter the email address' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter the password' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter the phone number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter the address' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select a role">
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="User">User</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="joinedDate"
          label="Joined Date"
          rules={[{ required: true, message: 'Please select the joined date' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
            style={{
              width: '100%',
              marginTop: '1rem',
            }}
          >
            {initialUser ? 'Update User' : 'Create User'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUser;
