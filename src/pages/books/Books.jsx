import { Col, Image, Input, Pagination, Row, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  useGetBooksQuery,
  useSearchBooksQuery,
} from '../../store/booksApi/booksApiSlice';
import styles from './Books.module.scss';

const Books = () => {
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
    console.log(
      '🚀 ~ useEffect ~ booksData?.totalRecords:',
      booksData?.totalRecords,
    );
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: booksData?.totalRecords || 0,
      },
    });
  }, [booksData]);

  useEffect(() => {
    getBooksAgain();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  const searchTimeoutRef = useRef(null);
  const { data: searchResults, isLoading: searchLoading } = useSearchBooksQuery(
    searchTerm,
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
  );

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
    console.log('🚀 ~ handlePageChange ~ size:', size);
    console.log('🚀 ~ handlePageChange ~ page:', page);
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        current: page,
        pageSize: size,
      },
    });
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
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: 'Category',
      dataIndex: 'genre',
      key: 'category',
      sorter: (a, b) => a.genre.localeCompare(b.genre),
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      sorter: (a, b) => a.language.localeCompare(b.language),
    },
    {
      title: 'Copies Available',
      dataIndex: 'availableCopies',
      key: 'copiesAvailable',
      sorter: (a, b) => a.availableCopies - b.availableCopies,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: 'flex',
      }}
    >
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

      <Row>
        <Col span={24}>
          <div className={styles.tableWrapper}>
            <Space direction="vertical" size={'middle'}>
              <Table
                columns={columns}
                dataSource={searchTerm ? searchResults?.data : booksData?.data}
                loading={
                  searchTerm ? searchLoading : booksLoading || booksFetching
                }
                rowKey="id"
                /* onChange={handleTableChange} */
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
                />
              </div>
            </Space>
          </div>
        </Col>
      </Row>
    </Space>
  );
};

export default Books;
