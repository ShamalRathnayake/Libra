import React, { useEffect } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import {
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
} from '../../store/authorApi/authorApiSlice';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/settingsSlice/settingsSlice';
import { showNotification } from '../../store/notificationSlice/notificationSlice';

const CreateAuthor = ({ isVisible, onClose, initialAuthor }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [createAuthor, { isLoading: isCreating }] = useCreateAuthorMutation();
  const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();

  useEffect(() => {
    if (initialAuthor) {
      form.setFieldsValue({
        ...initialAuthor,
        country: initialAuthor.country,
      });
    }
  }, [initialAuthor, form]);

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      if (initialAuthor) {
        await updateAuthor({ id: initialAuthor.id, ...values }).unwrap();
        dispatch(
          showNotification({
            type: 'success',
            message: 'Author updated successfully',
            description: '',
          }),
        );
      } else {
        await createAuthor(values).unwrap();
        dispatch(
          showNotification({
            type: 'success',
            message: 'Author created successfully',
            description: '',
          }),
        );
      }
    } catch (error) {
      console.log('🚀 ~ onFinish ~ error:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Operation failed',
          description: '',
        }),
      );
    } finally {
      dispatch(setLoading(false));
      onClose();
    }
  };

  return (
    <Modal
      title={initialAuthor ? 'Edit Author' : 'Create New Author'}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            { required: true, message: "Please enter the author's first name" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: "Please enter the author's last name" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="country"
          label="Country"
          rules={[
            { required: true, message: "Please enter the author's country" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {initialAuthor ? 'Update Author' : 'Create Author'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAuthor;
