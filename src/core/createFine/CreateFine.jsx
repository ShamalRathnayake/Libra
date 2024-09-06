import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  useCreateFineMutation,
  useUpdateFineMutation,
} from '../../store/finesApi/finesApiSlice';
import { setLoading } from '../../store/settingsSlice/settingsSlice';
import { showNotification } from '../../store/notificationSlice/notificationSlice';

const CreateFine = ({ isVisible, onClose, initialFine }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [createFine, { isLoading: isCreating }] = useCreateFineMutation();
  const [updateFine, { isLoading: isUpdating }] = useUpdateFineMutation();

  useEffect(() => {
    if (initialFine) {
      const formValues = {
        ...initialFine,
        paymentDate: initialFine.paymentDate
          ? moment(initialFine.paymentDate, 'YYYY-MM-DD')
          : null,
      };
      form.setFieldsValue(formValues);
    }
  }, [initialFine, form]);

  const onFinish = async (values) => {
    const fineData = {
      ...values,
      paymentDate: values.paymentDate
        ? values.paymentDate.format('YYYY-MM-DD')
        : null,
    };

    if (initialFine) {
      try {
        dispatch(setLoading(true));
        await updateFine({ id: initialFine.fineId, ...fineData }).unwrap();
        dispatch(
          showNotification({
            type: 'success',
            message: 'Fine updated successfully',
            description: '',
          }),
        );
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Updating fine failed',
            description: '',
          }),
        );
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      try {
        dispatch(setLoading(true));
        await createFine(fineData).unwrap();
        dispatch(
          showNotification({
            type: 'success',
            message: 'Fine created successfully',
            description: '',
          }),
        );
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Creating fine failed',
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
      title={initialFine ? 'Edit Fine' : 'Create New Fine'}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="fineAmount"
          label="Fine Amount"
          rules={[{ required: true, message: 'Please enter the fine amount' }]}
        >
          <Input type="number" placeholder="Enter fine amount" />
        </Form.Item>

        <Form.Item
          name="paidStatus"
          label="Paid Status"
          rules={[{ required: true, message: 'Please select the paid status' }]}
        >
          <Select placeholder="Select paid status">
            <Select.Option value={true}>Paid</Select.Option>
            <Select.Option value={false}>Unpaid</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="paymentDate"
          label="Payment Date"
          rules={[
            { required: true, message: 'Please select the payment date' },
          ]}
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
            {initialFine ? 'Update Fine' : 'Create Fine'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateFine;
