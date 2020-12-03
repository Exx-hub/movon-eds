import React from 'react';
import { Table, Col } from 'antd';
import './table.scss'

export const TableView = (props) => {
    return (<Col span={24} style={{ padding: '1rem', marginBottom:'2rem' }}>
      <Table scroll={{ x: true }} pagination={props.pagination || false}  dataSource={props.dataSource} columns={props.columns} />
    </Col>)
  }
