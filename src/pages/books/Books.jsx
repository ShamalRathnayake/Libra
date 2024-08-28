import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Col,
  Image,
  Input,
  Pagination,
  Row,
  Space,
  Table,
  Tag,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  useDeleteBookMutation,
  useGetBooksQuery,
  useSearchBooksQuery,
} from '../../store/booksApi/booksApiSlice';
import styles from './Books.module.scss';
import CreateBook from '../../core/createBook/CreateBook';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice/notificationSlice';
import ConfirmationModal from '../../core/confirmationModal/ConfirmationModal';
import { setLoading } from '../../store/settingsSlice/settingsSlice';
import { useGetAuthorsQuery } from '../../store/authorApi/authorApiSlice';

const Books = () => {
  const dispatch = useDispatch();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const {
    data: booksData,
    isLoading: booksLoading,
    isFetching: booksFetching,
    refetch: getBooksAgain,
  } = useGetBooksQuery(
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
  );

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: booksData?.totalRecords || 0,
      },
    });
  }, [booksData]);

  const { data: authors = [] } = useGetAuthorsQuery();

  const getAuthorName = (id) => {
    const author = authors?.data?.find((author) => author.id === id);
    return `${author?.firstName} ${author?.lastName}`;
  };

  useEffect(() => {
    getBooksAgain();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const [isCreateBookVisible, setIsCreateBookVisible] = useState(false);
  const [editBook, setEditBook] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  const searchTimeoutRef = useRef(null);
  const { data: searchResults, isLoading: searchLoading } = useSearchBooksQuery(
    searchTerm,
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
  );

  const [deleteBook] = useDeleteBookMutation();
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState('');

  const handleSearch = (value) => {
    if (!value) getBooksAgain();
    setDebouncedTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
    }, 500);
  };

  const handlePageChange = (page, size) => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        current: page,
        pageSize: size,
      },
    });
  };

  const handleEdit = (record) => {
    setIsCreateBookVisible(true);
    setEditBook(record);
  };

  const handleDelete = async (id) => {
    setDeleteModalActive(true);
    setDeleteRecordId(id);
  };

  const handleCreateBookClose = async () => {
    setIsCreateBookVisible(false);
    setEditBook(null);
  };

  const deleteBookProcess = async () => {
    try {
      dispatch(setLoading(true));
      await deleteBook(deleteRecordId).unwrap();

      dispatch(
        showNotification({
          type: 'success',
          message: 'Book deleted successfully',
          description: '',
        }),
      );
    } catch (error) {
      console.log('🚀 ~ deleteBook ~ error:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Deleting book failed',
          description: '',
        }),
      );
    } finally {
      setDeleteRecordId('');
      setDeleteModalActive(false);
      dispatch(setLoading(false));
    }
  };

  const columns = [
    {
      title: 'Cover',
      dataIndex: 'coverImage',
      key: 'cover',
      render: (cover) => <Image width={50} src={cover} />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Author',
      dataIndex: 'authorId',
      key: 'author',
      sorter: (a, b) => a.authorId.localeCompare(b.authorId),
      render: (authorId) => getAuthorName(authorId),
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      sorter: (a, b) => a.publisher.localeCompare(b.publisher),
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
      sorter: (a, b) => a.isbn.localeCompare(b.isbn),
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      sorter: (a, b) => a.genre.join(', ').localeCompare(b.genre.join(', ')),
      render: (genre) => genre.join(', '),
    },
    {
      title: 'Publication Date',
      dataIndex: 'publicationDate',
      key: 'publicationDate',
      sorter: (a, b) =>
        new Date(a.publicationDate) - new Date(b.publicationDate),
      render: (date) => new Date(date).getFullYear(),
    },
    {
      title: 'Copies Available',
      dataIndex: 'copiesAvailable',
      key: 'copiesAvailable',
      sorter: (a, b) => a.copiesAvailable - b.copiesAvailable,
    },
    {
      title: 'Status',
      dataIndex: 'copiesAvailable',
      key: 'status',
      sorter: (a, b) => a.copiesAvailable - b.copiesAvailable,
      render: (copiesAvailable) => {
        if (copiesAvailable > 0) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Available
            </Tag>
          );
        } else {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Checked Out
            </Tag>
          );
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="small" direction="vertical">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
            size="small"
            ghost
            style={{
              width: '100%',
            }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Row>
        <Col span={18}>
          <h1>Books</h1>
        </Col>
        <Col span={6}>
          <Input
            placeholder="Search books"
            enterButton="Search"
            size="large"
            value={debouncedTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
      </Row>
      <ConfirmationModal
        title={'Delete'}
        content={'Are you sure to delete?'}
        confirmText={'Yes'}
        handleCancel={() => setDeleteModalActive(false)}
        handleConfirm={deleteBookProcess}
        isModelActive={deleteModalActive}
        type={'danger'}
      />
      <Row>
        <Col span={24}>
          <div className={styles.tableWrapper}>
            <Space
              direction="vertical"
              size={'middle'}
              className={styles.usersTableWrapper}
            >
              <Table
                columns={columns}
                dataSource={searchTerm ? searchResults?.data : booksData?.data}
                loading={
                  searchTerm ? searchLoading : booksLoading || booksFetching
                }
                rowKey="id"
                pagination={false}
              />
              <div className={styles.paginationWrapper}>
                <Pagination
                  total={tableParams.pagination.total}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                  current={tableParams.pagination.current}
                  pageSize={tableParams.pagination.pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={true}
                  pageSizeOptions={[5, 10, 15, 20, 50, 100]}
                />
              </div>
            </Space>
          </div>
        </Col>
      </Row>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
        onClick={() => setIsCreateBookVisible(true)}
      />
      <CreateBook
        isVisible={isCreateBookVisible}
        onClose={handleCreateBookClose}
        initialBook={editBook}
      />
    </Space>
  );
};

export default Books;
