import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Pagination, Row, Space, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  useDeleteLendingMutation,
  useGetLendingsQuery,
  useSearchLendingsQuery,
} from '../../store/lendingApi/lendingApiSlice';
import styles from './Lending.module.scss';
import CreateLending from '../../core/createLending/CreateLending';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice/notificationSlice';
import ConfirmationModal from '../../core/confirmationModal/ConfirmationModal';
import { setLoading } from '../../store/settingsSlice/settingsSlice';
import { useGetUsersQuery } from '../../store/userApi/userApiSlice';
import { useGetBooksQuery } from '../../store/booksApi/booksApiSlice';

const Lending = () => {
  const dispatch = useDispatch();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const {
    data: lendingsData,
    isLoading: lendingsLoading,
    isFetching: lendingsFetching,
    refetch: getLendingsAgain,
  } = useGetLendingsQuery(
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
  );

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: lendingsData?.totalRecords || 0,
      },
    });
  }, [lendingsData]);

  const { data: users = [] } = useGetUsersQuery();
  const { data: books = [] } = useGetBooksQuery();

  const getUserName = (id) => {
    const user = users?.data?.find((user) => user.id === id);
    return `${user?.firstName} ${user?.lastName}`;
  };

  const getBookTitle = (id) => {
    const book = books?.find((book) => book.bookId === id);
    return book?.title;
  };

  useEffect(() => {
    getLendingsAgain();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const [isCreateLendingVisible, setIsCreateLendingVisible] = useState(false);
  const [editLending, setEditLending] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  const searchTimeoutRef = useRef(null);
  const { data: searchResults, isLoading: searchLoading } =
    useSearchLendingsQuery(
      searchTerm,
      tableParams.pagination.current,
      tableParams.pagination.pageSize,
    );

  const [deleteLending] = useDeleteLendingMutation();
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState('');

  const handleSearch = (value) => {
    if (!value) getLendingsAgain();
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
    setIsCreateLendingVisible(true);
    setEditLending(record);
  };

  const handleDelete = async (id) => {
    setDeleteModalActive(true);
    setDeleteRecordId(id);
  };

  const handleCreateLendingClose = async () => {
    setIsCreateLendingVisible(false);
    setEditLending(null);
  };

  const deleteLendingProcess = async () => {
    try {
      dispatch(setLoading(true));
      await deleteLending(deleteRecordId).unwrap();

      dispatch(
        showNotification({
          type: 'success',
          message: 'Lending record deleted successfully',
          description: '',
        }),
      );
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Deleting lending record failed',
          description: '',
        }),
      );
    } finally {
      setDeleteRecordId('');
      setDeleteModalActive(false);
      dispatch(setLoading(false));
    }
  };

  const getStatus = (dueDate, returnDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : null;

    if (returned) {
      return returned > due ? (
        <Tag color="red">Returned Late</Tag>
      ) : (
        <Tag color="green">Returned On Time</Tag>
      );
    } else if (today > due) {
      return <Tag color="red">Late</Tag>;
    } else {
      return <Tag color="blue">Not Returned</Tag>;
    }
  };

  const columns = [
    {
      title: 'Book',
      dataIndex: 'bookId',
      key: 'book',
      sorter: (a, b) => a.bookId.localeCompare(b.bookId),
      render: (bookId) => getBookTitle(bookId),
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'user',
      sorter: (a, b) => a.userId.localeCompare(b.userId),
      render: (userId) => getUserName(userId),
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate),
      render: (date) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      render: (date) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Return Date',
      dataIndex: 'returnDate',
      key: 'returnDate',
      sorter: (a, b) => new Date(a.returnDate) - new Date(b.returnDate),
      render: (date) =>
        date ? new Date(date).toLocaleDateString('en-GB') : 'Not Returned',
    },
    {
      title: 'Status',
      key: 'status',
      render: (record) => getStatus(record.dueDate, record.returnDate),
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
            onClick={() => handleDelete(record.lendId)}
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
          <h1>Lending Records</h1>
        </Col>
        <Col span={6}>
          <Input
            placeholder="Search lending records"
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
        handleConfirm={deleteLendingProcess}
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
                dataSource={searchTerm ? searchResults : lendingsData}
                loading={
                  searchTerm
                    ? searchLoading
                    : lendingsLoading || lendingsFetching
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
        onClick={() => setIsCreateLendingVisible(true)}
      />
      <CreateLending
        isVisible={isCreateLendingVisible}
        onClose={handleCreateLendingClose}
        initialLending={editLending}
      />
    </Space>
  );
};

export default Lending;
