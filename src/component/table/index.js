import React from 'react';
import { Button, Table, Col, Tooltip, } from 'antd';
import './table.scss'
import {  ArrowsAltOutlined } from '@ant-design/icons';

export const TableView = (props) => {
    const columns = [
      {
        title: '',
        dataIndex: '',
        key: 'action',
        render: (text, record) => (
          <div className="table-view-expand">
            <Tooltip title="Show full details">
              <Button className="btn-expand-icon">
                <ArrowsAltOutlined
                  className="table-view-expand-icon"
                  onClick={() => {
                    props.onSelect(record)
                  }}
                />
              </Button>
            </Tooltip>
          </div>)
      },
      {
        title: 'QR Code',
        dataIndex: 'qrcode',
        key: 'qr-code',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Sender',
        dataIndex: 'sender',
        key: 'sender',
      },
      {
        title: 'Receiver',
        dataIndex: 'receiver',
        key: 'receiver',
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
      },
      {
        title: 'Parcel Status',
        dataIndex: 'travelStatus',
        key: 'travelStatus',
      },
    ];
    return (<Col span={24} style={{ padding: '1rem', marginBottom:'2rem' }}>
      <Table pagination={props.pagination || false}  dataSource={props.dataSource} columns={columns} />
    </Col>)
  }