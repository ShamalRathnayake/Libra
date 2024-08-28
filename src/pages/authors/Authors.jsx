import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Pagination, Row, Space, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  useDeleteAuthorMutation,
  useGetAuthorsQuery,
  useSearchAuthorsQuery,
} from '../../store/authorApi/authorApiSlice';
import styles from './Authors.module.scss';
import CreateAuthor from '../../core/createAuthor/CreateAuthor';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice/notificationSlice';
import ConfirmationModal from '../../core/confirmationModal/ConfirmationModal';
import { setLoading } from '../../store/settingsSlice/settingsSlice';

const Authors = () => {
  const dispatch = useDispatch();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const {
    data: authorsData,
    isLoading: authorsLoading,
    isFetching: authorsFetching,
    refetch: getAuthorsAgain,
  } = useGetAuthorsQuery(
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
  );

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: authorsData?.totalRecords || 0,
      },
    });
  }, [authorsData]);

  const [isCreateAuthorVisible, setIsCreateAuthorVisible] = useState(false);
  const [editAuthor, setEditAuthor] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  const searchTimeoutRef = useRef(null);
  const { data: searchResults, isLoading: searchLoading } =
    useSearchAuthorsQuery(
      searchTerm,
      tableParams.pagination.current,
      tableParams.pagination.pageSize,
    );

  const [deleteAuthor] = useDeleteAuthorMutation();
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState('');

  const handleSearch = (value) => {
    if (!value) getAuthorsAgain();
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
    setIsCreateAuthorVisible(true);
    setEditAuthor(record);
  };

  const handleDelete = async (id) => {
    setDeleteModalActive(true);
    setDeleteRecordId(id);
  };

  const handleCreateAuthorClose = async () => {
    setIsCreateAuthorVisible(false);
    setEditAuthor(null);
  };

  const deleteAuthorProcess = async () => {
    try {
      dispatch(setLoading(true));
      await deleteAuthor(deleteRecordId).unwrap();

      dispatch(
        showNotification({
          type: 'success',
          message: 'Author deleted successfully',
          description: '',
        }),
      );
    } catch (error) {
      console.log('🚀 ~ deleteAuthor ~ error:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Deleting author failed',
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
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: (a, b) => a.country.localeCompare(b.country),
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
          <h1>Authors</h1>
        </Col>
        <Col span={6}>
          <Input
            placeholder="Search authors"
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
        handleConfirm={deleteAuthorProcess}
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
                dataSource={
                  searchTerm ? searchResults?.data : authorsData?.data
                }
                loading={
                  searchTerm ? searchLoading : authorsLoading || authorsFetching
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
        onClick={() => setIsCreateAuthorVisible(true)}
      />
      <CreateAuthor
        isVisible={isCreateAuthorVisible}
        onClose={handleCreateAuthorClose}
        initialAuthor={editAuthor}
      />
    </Space>
  );
};

export default Authors;
