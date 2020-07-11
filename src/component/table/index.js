import React from 'react';
import { Button, Table, Col, Tooltip, } from 'antd';
import './table.scss'
import {  ArrowsAltOutlined } from '@ant-design/icons';

export const TableView = (props) => {
    return (<Col span={24} style={{ padding: '1rem', marginBottom:'2rem' }}>
      <Table pagination={props.pagination || false}  dataSource={props.dataSource} columns={props.columns} />
    </Col>)
  }