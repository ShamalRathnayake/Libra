import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
} from 'antd';
import {
  useCreateBookMutation,
  useUpdateBookMutation,
} from '../../store/booksApi/booksApiSlice';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useGetAuthorsQuery } from '../../store/authorApi/authorApiSlice';
import { setLoading } from '../../store/settingsSlice/settingsSlice';
import { showNotification } from '../../store/notificationSlice/notificationSlice';

const CreateBook = ({ isVisible, onClose, initialBook }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [genres, setGenres] = useState([]);

  const allGenres = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'History',
    'Biography',
    'Fantasy',
    'Romance',
    'Mystery',
    'Thriller',
    'Self-Help',
    'Cookbook',
  ];

  const {
    data: authors = [],
    isLoading: isAuthorsLoading,
    error: authorsError,
  } = useGetAuthorsQuery();

  useEffect(() => {
    if (initialBook) {
      const formValues = {
        ...initialBook,
        publicationDate: initialBook.publicationDate
          ? moment(initialBook.publicationDate, 'YYYY-MM-DD')
          : null,
        authorId: initialBook.authorId,
      };
      form.setFieldsValue(formValues);
      setGenres(initialBook.genre || []);
    }
  }, [initialBook, form]);

  const handleGenreChange = (selectedGenres) => {
    setGenres(selectedGenres);
    form.setFieldsValue({ genre: selectedGenres });
  };

  const onFinish = async (values) => {
    const bookData = {
      ...values,
      genre: genres,
      publicationDate: values.publicationDate
        ? values.publicationDate.format('YYYY-MM-DD')
        : null,
    };

    if (initialBook) {
      try {
        dispatch(setLoading(true));
        await updateBook({ id: initialBook.id, ...bookData }).unwrap();
        dispatch(
          showNotification({
            type: 'success',
            message: 'Book updated successfully',
            description: '',
          }),
        );
      } catch (error) {
        console.log('🚀 ~ onFinish ~ error:', error);
        dispatch(
          showNotification({
            type: 'error',
            message: 'Updating book failed',
            description: '',
          }),
        );
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      try {
        dispatch(setLoading(true));
        await createBook(bookData).unwrap();
        dispatch(
          showNotification({
            type: 'success',
            message: 'Book created successfully',
            description: '',
          }),
        );
      } catch (error) {
        console.log('🚀 ~ onFinish ~ error:', error);
        dispatch(
          showNotification({
            type: 'error',
            message: 'Creating book failed',
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
      title={initialBook ? 'Edit Book' : 'Create New Book'}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter the book title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="authorId"
          label="Author"
          rules={[{ required: true, message: 'Please select an author' }]}
        >
          <Select
            placeholder="Select an author"
            loading={isAuthorsLoading}
            disabled={isAuthorsLoading || authorsError}
          >
            {authors.map((author) => (
              <Select.Option key={author.id} value={author.id}>
                {author.firstName + ' ' + author.lastName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="isbn"
          label="ISBN"
          rules={[{ required: true, message: 'Please enter the ISBN' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="publisher"
          label="Publisher"
          rules={[{ required: true, message: 'Please enter the publisher' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="genre"
          label="Genre"
          rules={[
            { required: true, message: 'Please select at least one genre' },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select genres"
            value={genres}
            onChange={handleGenreChange}
            style={{ width: '100%' }}
          >
            {allGenres.map((genre) => (
              <Select.Option key={genre} value={genre}>
                {genre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="publicationDate"
          label="Publication Date"
          rules={[
            { required: true, message: 'Please select the publication date' },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="copiesAvailable"
          label="Copies Available"
          rules={[
            {
              required: true,
              message: 'Please enter the number of available copies',
            },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="coverImage"
          label="Cover Image URL"
          rules={[
            { required: true, message: 'Please enter the cover image URL' },
          ]}
        >
          <Input />
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
            {initialBook ? 'Update Book' : 'Create Book'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBook;
