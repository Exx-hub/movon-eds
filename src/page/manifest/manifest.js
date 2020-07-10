import React from 'react';
import { Table, DatePicker, Button, Row, Col, Layout, Input, Select, Skeleton } from 'antd';
import './manifest.scss';
import moment from 'moment';
import { EyeOutlined, PrinterOutlined } from '@ant-design/icons'
import ManifestService from '../../service/Manifest';
import {openNotificationWithIcon, openNotificationWithDuration, clearCredential} from '../../utility'

const { Search } = Input
const { RangePicker } = DatePicker;
const dateFormat = "MMM DD, YYYY";
const currentTime = moment()
const today = currentTime.format(dateFormat)
const yesterday = currentTime.subtract(1, 'd').format(dateFormat);
    // <Search
    //         className="manifest-search"
    //         placeholder="Routes | Departure | Arrival | Model" />

    // <RangePicker
    //         className="manifest-date-range"
    //         onChange={(date, date2) => { console.log('date2', date2) }}
    //         defaultValue={[moment(yesterday, dateFormat), moment(today, dateFormat)]}
    //         format={dateFormat} />

const { Option } = Select;    
const LIMIT= 5;


const TableRoutesView = (props) =>{
  const columns = [
  {
    title: 'Origin',
    dataIndex: 'origin',
    defaultSortOrder: 'descend',
    //sorter: (a, b) => a.startStation.length - b.startStation.length
  },
  {
    title: 'Destination',
    dataIndex: 'destination',
    defaultSortOrder: 'descend',
    //sorter: (a, b) => a.endStation.length - b.endStation.length
  },
  {
    title: 'Departure Date',
    dataIndex: 'date',
    defaultSortOrder: 'descend',
    //sorter: (a, b) => a.startStation.length - b.startStation.length
  },
  {
    title: 'Total Parcel',
    dataIndex: 'count',
    defaultSortOrder: 'descend',
    //sorter: (a, b) => a.startStation.length - b.startStation.length
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Layout>
        <Button
          style={{color:'white', fontWeight:'200', background:'teal'}}
          size="small"
          onClick={() =>props.onViewClick(record.data)}> View </Button>

        {/* <Button
          onClick={() => { props.history.push('/manifest/print') }}>
          <PrinterOutlined /> Print

      </Button> */}
      </Layout>),
  },
  ];
  return <Table
    pagination={false}
    columns={columns}
    dataSource={props.dataSource}
    onChange={props.onChange} />
}    

class Manifest extends React.Component {

  constructor(props){
    super(props);
    this.state={
      fetching:false,
      routes:undefined,
      routesList:{
        value:0,
        options:[]
      },
      listOfTripDates:[]
    }
  }

  componentDidMount(){

    ManifestService
    .getRoutes()
    .then(e=>{
      const{errorCode,success,data}=e.data;
      if(!success && errorCode){
        if(errorCode === 1000){
          this.onForceLogout(errorCode)
        }else{
          openNotificationWithIcon('error',errorCode);
        }
      }else{
        console.log('getRoutes ====> e',data)

        const options = data.map((e,i)=>{
          return{
            data: e,
            value: i,
            name: `${e.startStationName} - ${e.endStationName}`
          }
        })
        this.setState({
          routes:data, 
          routesList:{...this.state.routesList,...{options}}
        });
        this.getManifestByDestination(data[2].start, data[2].end)
      }
    });

  }

  getManifestByDestination = (startStationId, endStationId) =>{
    console.log('startStationId',startStationId)
    console.log('endStationId',endStationId)
    this.setState({fetching:true})
    ManifestService.getAvailableManifest(startStationId, endStationId, LIMIT)
        .then(e=>{
          console.log('getAvailableManifest',e)
          const{data, success, errorCode}=e.data
          if(!success){
            if(errorCode === 1000){
              this.onForceLogout(errorCode);
            }else{
              openNotificationWithIcon('error',errorCode)
            }
            return;
          }
          this.setState({listOfTripDates:data, fetching:false})
        })
  }

  onForceLogout = (errorCode) =>{
    openNotificationWithDuration('error', errorCode)
    clearCredential();
    this.props.history.push('/login')
  }
  
  onChangeTable = (pagination, filters, sorter, extra) =>{
    console.log('params', pagination, filters, sorter, extra);
  }

  handleSelectChange = (value) =>{
    const data = this.state.routes[value];
    this.getManifestByDestination(data.start, data.end)
    this.setState({routesList:{...this.state.routesList, ...{value}}})
  }

  dataSource = () =>{
    return this.state.listOfTripDates.map((e,i)=>{
      console.log('routesList.value',this.state.routesList.value)
      return {
        key: i,
        date:  moment(e._id).format('MMM DD, YYYY hh:mm A') ,
        count: e.count,
        origin: this.state.routes[this.state.routesList.value].startStationName,
        destination: this.state.routes[this.state.routesList.value].endStationName,
        data: e.data
      }
    });
  }

  handleDateRangeChange = (date) =>{
    const firstDate = date[0];
    const secondDate = date[1];
  }

  render(){
    const{routes, routesList, fetching}=this.state;
    console.log('routesList',routesList)

    return <div className="manifest-page">
      <Row style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <Col span={12}>
        {
          routesList && 
          <Select 
            defaultValue={routesList.value} 
            style={{ width: '90%' }} 
            onChange={this.handleSelectChange}>{ routesList.options.map(e=>(<Option key={e.value} value={e.value}>{e.name}</Option>)) }
          </Select>
        }
        </Col>
        <Col span={12}>
          <RangePicker
            style={{float:'right'}}
            onChange={(date, date2) => this.handleDateRangeChange(date2)}
             />
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{marginTop:'.5rem'}}>
          { 
            !fetching ? 
            <TableRoutesView
              routes={routes}
              pagination={false}
              dataSource={this.dataSource()}
              onChange={this.onChangeTable} 
              onViewClick={(data)=>this.props.history.push('/manifest/details', {data}) }
              /> :
              <Skeleton active />
          }
        </Col>
      </Row>

    </div>
  }
}

export default Manifest;