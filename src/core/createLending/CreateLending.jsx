import React, { useEffect } from 'react';
import { Button, Modal, Form, Select, DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  useCreateLendingMutation,
  useUpdateLendingMutation,
} from '../../store/lendingApi/lendingApiSlice';
import { useGetUsersQuery } from '../../store/userApi/userApiSlice';
import { useGetBooksQuery } from '../../store/booksApi/booksApiSlice';
import { setLoading } from '../../store/settingsSlice/settingsSlice';
import { showNotification } from '../../store/notificationSlice/notificationSlice';
import { useCreateFineMutation } from '../../store/finesApi/finesApiSlice';

const CreateLending = ({ isVisible, onClose, initialLending }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [createLending, { isLoading: isCreating }] = useCreateLendingMutation();
  const [updateLending, { isLoading: isUpdating }] = useUpdateLendingMutation();
  const [createFine] = useCreateFineMutation();

  // Fetch users and books data
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery();
  const { data: booksData, isLoading: isLoadingBooks } = useGetBooksQuery();

  useEffect(() => {
    if (initialLending) {
      console.log('🚀 ~ useEffect ~ initialLending:', initialLending);
      const formValues = {
        ...initialLending,
        issueDate: initialLending.issueDate
          ? moment(initialLending.issueDate, 'YYYY-MM-DD')
          : null,
        dueDate: initialLending.dueDate
          ? moment(initialLending.dueDate, 'YYYY-MM-DD')
          : null,
        returnDate: initialLending.returnDate
          ? moment(initialLending.returnDate, 'YYYY-MM-DD')
          : null,
      };
      form.setFieldsValue(formValues);
    }
  }, [initialLending, form]);

  const onFinish = async (values) => {
    const lendingData = {
      ...values,
      issueDate: values.issueDate
        ? values.issueDate.format('YYYY-MM-DD')
        : null,
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      returnDate: values.returnDate
        ? values.returnDate.format('YYYY-MM-DD')
        : null,
    };

    if (initialLending) {
      try {
        dispatch(setLoading(true));
        await updateLending({ id: initialLending.id, ...lendingData }).unwrap();

        if (lendingData.returnDate) {
          console.log(
            '🚀 ~ onFinish ~ lendingData.returnDate:',
            lendingData.returnDate,
          );

          const dateDifference =
            (new Date(lendingData.returnDate) - new Date(lendingData.dueDate)) /
            (1000 * 60 * 60 * 24);
          console.log('🚀 ~ onFinish ~ dateDifference:', dateDifference);

          if (dateDifference > 1) {
            const fine = 20 * dateDifference;

            const finesObj = {
              lendId: initialLending.id,
              fineAmount: fine,
              paidStatus: false,
              paymentDate: null,
            };

            await createFine(finesObj).unwrap();
          }
        }
        dispatch(
          showNotification({
            type: 'success',
            message: 'Lending updated successfully',
            description: '',
          }),
        );
      } catch (error) {
        console.log('🚀 ~ onFinish ~ error:', error);
        dispatch(
          showNotification({
            type: 'error',
            message: 'Updating lending failed',
            description: '',
          }),
        );
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      try {
        dispatch(setLoading(true));
        await createLending(lendingData).unwrap();
        dispatch(
          showNotification({
            type: 'success',
            message: 'Lending created successfully',
            description: '',
          }),
        );
      } catch (error) {
        console.log('🚀 ~ onFinish ~ error:', error);
        dispatch(
          showNotification({
            type: 'error',
            message: 'Creating lending failed',
            description: '',
          }),
        );
      } finally {
        dispatch(setLoading(false));
      }
    }

    onClose();
  };

  if (isLoadingUsers || isLoadingBooks) {
    return <div>Loading...</div>;
  }

  return (
    <Modal
      title={initialLending ? 'Edit Lending' : 'Create New Lending'}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="bookId"
          label="Book"
          rules={[{ required: true, message: 'Please select a book' }]}
        >
          <Select placeholder="Select a book">
            {booksData?.map((book) => (
              <Select.Option key={book.bookId} value={book.bookId}>
                {book.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="userId"
          label="User"
          rules={[{ required: true, message: 'Please select a user' }]}
        >
          <Select placeholder="Select a user">
            {usersData?.data?.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {`${user.firstName} ${user.lastName}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="issueDate"
          label="Issue Date"
          rules={[{ required: true, message: 'Please select the issue date' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select the due date' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="returnDate" label="Return Date">
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
            {initialLending ? 'Update Lending' : 'Create Lending'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateLending;
