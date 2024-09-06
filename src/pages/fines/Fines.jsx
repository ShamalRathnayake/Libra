import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Pagination, Row, Space, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  useDeleteFineMutation,
  useGetFinesQuery,
  useSearchFinesQuery,
} from '../../store/finesApi/finesApiSlice';
import styles from './Fines.module.scss';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice/notificationSlice';
import ConfirmationModal from '../../core/confirmationModal/ConfirmationModal';
import { setLoading } from '../../store/settingsSlice/settingsSlice';
import { useGetUsersQuery } from '../../store/userApi/userApiSlice';
import { useGetBooksQuery } from '../../store/booksApi/booksApiSlice';
import CreateFine from '../../core/createFine/CreateFine';

const Fines = () => {
  const dispatch = useDispatch();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const {
    data: finesData,
    isLoading: finesLoading,
    isFetching: finesFetching,
    refetch: getFinesAgain,
  } = useGetFinesQuery(
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
  );

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: finesData?.totalRecords || 0,
      },
    });
  }, [finesData]);

  const { data: users = [] } = useGetUsersQuery();
  const { data: books = [] } = useGetBooksQuery();

  const getUserName = (id) => {
    const user = users?.data?.find((user) => user.id === id);
    return `${user?.firstName} ${user?.lastName}`;
  };

  const getBookTitle = (id) => {
    const book = books?.find((book) => book.id === id);
    return book?.title;
  };

  useEffect(() => {
    getFinesAgain();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const [isCreateFineVisible, setIsCreateFineVisible] = useState(false);
  const [editFine, setEditFine] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  const searchTimeoutRef = useRef(null);
  const { data: searchResults, isLoading: searchLoading } = useSearchFinesQuery(
    searchTerm,
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
  );

  const [deleteFine] = useDeleteFineMutation();
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState('');

  const handleSearch = (value) => {
    if (!value) getFinesAgain();
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
    setIsCreateFineVisible(true);
    setEditFine(record);
  };

  const handleDelete = async (id) => {
    setDeleteModalActive(true);
    setDeleteRecordId(id);
  };

  const handleCreateFineClose = async () => {
    setIsCreateFineVisible(false);
    setEditFine(null);
  };

  const deleteFineProcess = async () => {
    try {
      dispatch(setLoading(true));
      await deleteFine(deleteRecordId).unwrap();

      dispatch(
        showNotification({
          type: 'success',
          message: 'Fine record deleted successfully',
          description: '',
        }),
      );
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Deleting fine record failed',
          description: '',
        }),
      );
    } finally {
      setDeleteRecordId('');
      setDeleteModalActive(false);
      dispatch(setLoading(false));
    }
  };

  const getPaidStatus = (paidStatus) => {
    return paidStatus ? (
      <Tag color="green">Paid</Tag>
    ) : (
      <Tag color="red">Unpaid</Tag>
    );
  };

  const columns = [
    {
      title: 'Book',
      dataIndex: 'lendId',
      key: 'book',
      render: (bookId) => getBookTitle(bookId),
    },
    {
      title: 'User',
      dataIndex: 'lendId',
      key: 'user',
      render: (userId) => getUserName(userId),
    },
    {
      title: 'Fine Amount',
      dataIndex: 'fineAmount',
      key: 'fineAmount',
      sorter: (a, b) => a.fineAmount - b.fineAmount,
    },
    {
      title: 'Paid Status',
      dataIndex: 'paidStatus',
      key: 'paidStatus',
      render: (paidStatus) => getPaidStatus(paidStatus),
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      sorter: (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
      render: (date) =>
        date ? new Date(date).toLocaleDateString('en-GB') : 'Not Paid',
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
            onClick={() => handleDelete(record.fineId)}
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
          <h1>Fine Records</h1>
        </Col>
        <Col span={6}>
          <Input
            placeholder="Search fine records"
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
        handleConfirm={deleteFineProcess}
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
                dataSource={searchTerm ? searchResults : finesData}
                loading={
                  searchTerm ? searchLoading : finesLoading || finesFetching
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
        onClick={() => setIsCreateFineVisible(true)}
      />
      <CreateFine
        isVisible={isCreateFineVisible}
        onClose={handleCreateFineClose}
        initialFine={editFine}
      />
    </Space>
  );
};

export default Fines;
