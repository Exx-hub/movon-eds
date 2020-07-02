import React from 'react';
import { Layout, Button, Table, Col, Row, Tooltip } from 'antd';
import './printManifestDetails.css'
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import ReactToPrint from 'react-to-print';
import moment from 'moment'

const { Header } = Layout

const dataSource = [
  {
    key: '1',
    billOfLading1: 'P-567890-1',
    billOfLading2: 'SP-567890-1',
    description: 'Socks of Rice',
    weight: '30kg',
    amount: '100',
    qty: 1,
    sender: 'Juan Tamad',
    reciepient: 'Juan Dela Cruz',
    status: 'status',
    created: 'Jessa V.',
  },
  {
    key: '2',
    billOfLading1: 'P-567890-1',
    billOfLading2: 'SP-567890-1',
    description: 'Socks of Rice',
    weight: '20kg.',
    amount: '100',
    qty: 1,
    sender: 'Juan Tamad',
    reciepient: 'Juan Dela Cruz',
    status: 'status',
    created: 'Jessa V.',
  },
];


function TableView(props) {
  const columns = [
    {
      title: () => (<span>(Movon) <br /> Bill of Lading</span>),
      dataIndex: 'billOfLading1',
      key: 'billOfLading1'
    },
    {
      title: () => (<span>(BITS) <br /> Bill of Lading</span>),
      dataIndex: 'billOfLading2',
      key: 'billOfLading2',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Wt.',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Amt.',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: ' Sender ',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: 'Recipient',
      dataIndex: 'reciepient',
      key: 'reciepient',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
  ];
  return (<Col span={24} style={{ padding: '.25rem' }}>
    <Table pagination={false} dataSource={props.dataSource} columns={columns} />
  </Col>)
}

function PrintManifestDetails(props) {

  let printEl = React.useRef(null);

  return (
    <Layout className="print-manifest-details-page">
      <Header className="home-header-view">
        <div style={{height:'9vh', 
          display: 'flex', 
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button type="link" onClick={() => props.history.goBack()}>
            <ArrowLeftOutlined style={{ fontSize: '16px', color: '#fff' }} />
            <span style={{ fontSize: '16px', color: '#fff' }}>Manifest</span>
          </Button>
          <ReactToPrint
            content={() => printEl}
            trigger={() => {
              return <Tooltip title="Print Document"><Button type="link">
                <PrinterOutlined style={{ fontSize: '16px', color: '#fff' }} />
                <span style={{ fontSize: '16px', color: '#fff' }}>Print</span>
              </Button>
              </Tooltip>
            }} />
        </div>

      </Header>
      <Layout className="print-body">
        <div ref={(e) => { printEl = e }}>
          <div style={{ marginLeft: '.5rem', marginTop: '.5rem' }}>
            <div className='print-title-corner'>
              <span className="print-company-title">Bicol Isarog Transit</span>
              <span className="print-company-date">{moment().format("MMM DD, YYYY")}</span>
            </div>
            <Row>
              <Col span={3}>
                <h3 className="col-title">Routes:</h3>
                <h3 className="col-title">Trip Code:</h3>
              </Col>

              <Col span={4}>
                <h3 className="col-value">Naga - Cubao</h3>
                <h3 className="col-value">T-123421234</h3>
              </Col>

              <Col offset={6} span={4}>
                <h3 className="col-title">Departure Date:</h3>
                <h3 className="col-title">Prepared By:</h3>
              </Col>

              <Col>
                <h3 className="col-value">05:30 PM - Jun 29, 2020</h3>
                <h3 className="col-value">Mikee</h3>
              </Col>
            </Row>
          </div>
          <div className="my-table"><TableView pagination={false} dataSource={dataSource} /></div>
        </div>
      </Layout>
    </Layout>
  );
}

export default PrintManifestDetails;