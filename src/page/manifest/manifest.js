import React from 'react';
import { Table, DatePicker, Button, Row, Col, Layout, Input, Alert } from 'antd';
import './manifest.scss';
import moment from 'moment';
import { EyeOutlined, PrinterOutlined } from '@ant-design/icons'
import ManifestService from '../../service/Manifest';
import {openNotificationWithIcon} from '../../utility'

const { Search } = Input
const { RangePicker } = DatePicker;
const dateFormat = "MMM DD, YYYY";
const currentTime = moment()
const today = currentTime.format(dateFormat)
const yesterday = currentTime.subtract(1, 'd').format(dateFormat);
{/* <RangePicker
    className="manifest-date-range"
    onChange={(date, date2) => { console.log('date2', date2) }}
    defaultValue={[moment(yesterday, dateFormat), moment(today, dateFormat)]}
    format={dateFormat} /> */}

function Manifest(props) {

  const [state, setState] = React.useState({
    routes:null
  });

  React.useEffect(()=>{

    if(!state.routes){
      ManifestService
      .getRoutes()
      .then(e=>{
        console.log('getRoutes ====> e',e)
        const{errorCode,success,data}=e.data;
        if(!success && errorCode){
          openNotificationWithIcon('error',errorCode);
        }else{
          setState({...state,...{routes:data}})
        }
        ManifestService.getAvailableManifest(data[2].start,data[2].end).then(e=>{console.log('getAvailableManifest',e)})

      });

    }
  },[state.routes])

  const columns = [
    {
      title: 'Origin',
      dataIndex: 'startStation',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.startStation.length - b.startStation.length
    },
    {
      title: 'Destination',
      dataIndex: 'endStation',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.endStation.length - b.endStation.length
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Layout>
          <Button
            onClick={() => { 
              props.history.push('/manifest/details', { data: state.routes[record.key] }) 
            }}>
            <EyeOutlined />View
          </Button>

          {/* <Button
            onClick={() => { props.history.push('/manifest/print') }}>
            <PrinterOutlined /> Print
        </Button> */}
        </Layout>),
    },
  ];

  const onChangeTable = (pagination, filters, sorter, extra) =>{
    console.log('params', pagination, filters, sorter, extra);
  }

  const getRoutes = () =>{
    return state.routes.map((e,i)=>{
      return {
        key: i,
        startStation: e.startStationName,
        endStation: e.endStationName
      }
    });
  }

  return (
    <div className="manifest-page">
      <Row style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <Col offset={16} span={8}>
          <Search
            className="manifest-search"
            placeholder="Routes | Departure | Arrival | Model" />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          { 
            state.routes && 
            <Table
              pagination={false}
              columns={columns}
              dataSource={getRoutes()}
              onChange={onChangeTable} /> 
          }
        </Col>
      </Row>

    </div>
  );
}

export default Manifest;