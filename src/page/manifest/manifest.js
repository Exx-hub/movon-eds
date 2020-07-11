import React from 'react';
import { Table, DatePicker, Button, Row, Col, Select, Skeleton, Space } from 'antd';
import {openNotificationWithIcon, openNotificationWithDuration, clearCredential} from '../../utility'
import ManifestService from '../../service/Manifest';
import moment from 'moment';
import './manifest.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;    

const LIMIT= 5;
const dateFormat = "MMM DD, YYYY";

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
    title: 'Parcel',
    dataIndex: 'count',
    defaultSortOrder: 'descend',
    //sorter: (a, b) => a.startStation.length - b.startStation.length
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space>
        <Button
          style={{color:'white', fontWeight:'200', background:'teal'}}
          size="small"
          onClick={() =>props.onViewClick(record.data)}> View </Button>

        <Button
          size="small"
          style={{color:'white', fontWeight:'200', background:'teal'}}
          onClick={() => props.onPrint(record.data)}> Print </Button>
      </Space>),
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
      endDay: moment().format(dateFormat),
      startDay:moment().subtract(5, 'd').format(dateFormat),
      fetching:false,
      routes:undefined,
      routesList:{
        value:0,
        options:[]
      },
      listOfTripDates:undefined,
      selectedRoute:undefined
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
          selectedRoute:data[0],
          routesList:{...this.state.routesList,...{options}}
        });
        this.getManifestByDestination(data[0].start, data[0].end)
      }
    });

  }

  getManifestByDestination = ( startStationId, endStationId) =>{
    this.setState({fetching:true})
    ManifestService.getManifestDateRange(this.state.startDay, this.state.endDay, startStationId, endStationId)
        .then(e=>{
          console.log('getManifestDateRange',e)
          const{data, success, errorCode}=e.data
          if(!success){
            if(errorCode === 1000){
              this.onForceLogout(errorCode);
            }else{
              openNotificationWithIcon('error',errorCode)
            }
            return;
          }
          this.setState({listOfTripDates:data || [], fetching:false})
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
    this.setState({
      selectedRoute: data,
      routesList:{...this.state.routesList, ...{value}}
    },()=>{
      this.getManifestByDestination(data.start, data.end)
    })
  }

  dataSource = () =>{
    if(!this.state.listOfTripDates){
      return null;
    }

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

  onChangeDatePicker = (date) =>{
    const startDay = date[0];
    const endDay = date[1];
    console.log('onChangeDatePicker date',date)
    console.log('onChangeDatePicker date',date)

    if(startDay && endDay){
      this.setState({startDay,endDay},()=>{
        const selectedRoute = this.state.selectedRoute;
        this.getManifestByDestination(selectedRoute.start, selectedRoute.end)
      });
    }
  }

  render(){
    const{routes, routesList, fetching}=this.state;
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
            defaultValue={[moment(this.state.startDay, dateFormat), moment(this.state.endDay, dateFormat)]}
            onChange={(date, date2) => this.onChangeDatePicker(date2)}/>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{marginTop:'.5rem'}}>
          { 
            !fetching && this.state.listOfTripDates ? 
            <TableRoutesView
              routes={routes}
              pagination={false}
              dataSource={this.dataSource()}
              onChange={this.onChangeTable} 
              onPrint={(data)=>this.props.history.push('/manifest/print',{data})}
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