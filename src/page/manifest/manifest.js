import React from 'react';
import {Table, DatePicker, Button, Row, Col, Layout, Input} from 'antd';
import './manifest.scss';
import moment from 'moment';
import { EyeOutlined, PrinterOutlined } from '@ant-design/icons'

const {Search} = Input
const { RangePicker } = DatePicker;
const dateFormat = "MMM DD, YYYY";
const currentTime = moment()
const today = currentTime.format(dateFormat)
const yesterday = currentTime.subtract(1,'d').format(dateFormat);


function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}

function Manifest(props) {

  const columns = [
    {
      title: 'Routes',
      dataIndex: 'startStation',
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend'],
    },
    {
      title: 'Departure Date',
      dataIndex: 'departureDate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.departureDate - b.departureDate
    },
    {
      title: 'Arrival Date',
      dataIndex: 'arrival',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.arrival.length - b.arrival.length
    },
    {
      title: 'Model',
      dataIndex: 'busModel',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.busModel.length - b.busModel.length,
    },
    {
      title: 'Qty',
      dataIndex: 'totalParcel',
      filterMultiple: false,
      onFilter: (value, record) => record.address.indexOf(value) === 0,
      sorter: (a, b) => a.totalParcel - b.totalParcel,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
      <Layout>
        <Button 
          onClick={()=>{props.history.push('/manifest/details/1',{test:"this is a test"})}}>
            <EyeOutlined />View
        </Button>

        <Button 
          onClick={()=>{props.history.push('/manifest/print')}}>
            <PrinterOutlined/> Print
        </Button>
      </Layout>),
    },
  ];
  
  const data = [
    {
      key: '1',
      startStation: 'Cubao - Naga',
      departureDate: 'Jun 26, 2020 - 05:30 PM',
      arrival: 'Jun 26, 2020 - 05:30 PM',
      totalParcel: 1,
      type:"Regular",
      busModel:"Model 1"
    },
    {
      key: '2',
      startStation: 'Cubao - Tugegarao',
      departureDate: 'Jun 26, 2020 - 05:30 PM',
      arrival: 'Jun 26, 2020 - 05:30 PM',
      totalParcel: 2,
      type:"Delux",
      busModel:"Model 2"
    },
    
  ];

  return (
    <div className="manifest-page">
      <Row style={{marginTop:'2rem',marginBottom:'1rem'}}>
        <Col span={12}>
          <RangePicker  
              className="manifest-date-range" 
              onChange={(date,date2)=>{console.log('date2',date2)}}
              defaultValue={[moment(yesterday, dateFormat), moment(today, dateFormat)]}
              format={dateFormat} />
        </Col>
        <Col offset={4} span={8}>
          <Search 
            className="manifest-search" 
            placeholder="Routes | Departure | Arrival | Model"/>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
           <Table
              columns={columns} 
              dataSource={data} 
              onChange={onChange} />
          </Col>
      </Row>
      
    </div>
  );
}

export default Manifest;