import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Pagination, Row, Space, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useSearchUsersQuery,
} from '../../store/userApi/userApiSlice';
import styles from './Users.module.scss';
import CreateUser from '../../core/createUser/CreateUser';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice/notificationSlice';
import ConfirmationModal from '../../core/confirmationModal/ConfirmationModal';
import { setLoading } from '../../store/settingsSlice/settingsSlice';

const Users = () => {
  const dispatch = useDispatch();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    isFetching: usersFetching,
    refetch: getUsersAgain,
  } = useGetUsersQuery(
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
  );

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: usersData?.totalRecords || 0,
      },
    });
  }, [usersData]);

  const [isCreateUserVisible, setIsCreateUserVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  const searchTimeoutRef = useRef(null);
  const { data: searchResults, isLoading: searchLoading } = useSearchUsersQuery(
    searchTerm,
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
  );

  const [deleteUser] = useDeleteUserMutation();
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState('');

  const handleSearch = (value) => {
    if (!value) getUsersAgain();
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
    setIsCreateUserVisible(true);
    setEditUser(record);
  };

  const handleDelete = async (id) => {
    setDeleteModalActive(true);
    setDeleteRecordId(id);
  };

  const handleCreateUserClose = async () => {
    setIsCreateUserVisible(false);
    setEditUser(null);
  };

  const deleteUserProcess = async () => {
    try {
      dispatch(setLoading(true));
      await deleteUser(deleteRecordId).unwrap();

      dispatch(
        showNotification({
          type: 'success',
          message: 'User deleted successfully',
          description: '',
        }),
      );
    } catch (error) {
      console.log('🚀 ~ deleteUser ~ error:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Deleting user failed',
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
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: 'Joined Date',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
      sorter: (a, b) => new Date(a.joinedDate) - new Date(b.joinedDate),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (role) => (
        <Tag color={role === 'Admin' ? 'blue' : 'green'}>{role}</Tag>
      ),
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
          <h1>Users</h1>
        </Col>
        <Col span={6}>
          <Input
            placeholder="Search users"
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
        handleConfirm={deleteUserProcess}
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
                dataSource={searchTerm ? searchResults?.data : usersData?.data}
                loading={
                  searchTerm ? searchLoading : usersLoading || usersFetching
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
        onClick={() => setIsCreateUserVisible(true)}
      />
      <CreateUser
        isVisible={isCreateUserVisible}
        onClose={handleCreateUserClose}
        initialUser={editUser}
      />
    </Space>
  );
};

export default Users;
