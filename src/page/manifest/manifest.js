import React from 'react';
import { Table, DatePicker, Button, Row, Col, Select, Skeleton, Space, notification } from 'antd';
import {openNotificationWithIcon, openNotificationWithDuration, clearCredential} from '../../utility'
import ManifestService from '../../service/Manifest';
import moment from 'moment';
import './manifest.scss';
import {config} from '../../config'

const { RangePicker } = DatePicker;
const { Option } = Select;    

const dateFormat = "MMM DD, YYYY";

const TableRoutesView = (props) =>{
  const columns = [
  // {
  //   title: 'Origin',
  //   dataIndex: 'origin',
  //   defaultSortOrder: 'descend',
  // },
  // {
  //   title: 'Destination',
  //   dataIndex: 'destination',
  //   defaultSortOrder: 'descend',
  // },
   {
    title: 'Destination',
    dataIndex: 'name',
    defaultSortOrder: 'name',
  },
  {
    title: 'Departure Date',
    dataIndex: 'date',
    defaultSortOrder: 'descend',
    sorter: (a, b) => moment(a.date) - moment(b.date)
  },
  {
    title: 'Parcel',
    dataIndex: 'count',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.count - b.count
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space>
        <Button
          style={{color:'white', fontWeight:'200', background:'teal'}}
          size="small"
          onClick={() =>props.onViewClick(record)}> View </Button>

        <Button
          size="small"
          style={{color:'white', fontWeight:'200', background:'teal'}}
          onClick={() => props.onPrint(record)}> Print </Button>
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
      startDay:moment().subtract(3, 'd').format(dateFormat),
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
    try {
      ManifestService
      .getRoutes()
      .then(e=>{
        const{errorCode,success,data}=e.data;
        if(!success && errorCode){
          this.handleErrorNotification(errorCode)
        }else{

        const options = data.map((e,i)=>{
          return{
            data: e,
            value: i,
            name: e.name
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
    } catch (error) {
      this.handleErrorNotification()
    }
  }

  handleErrorNotification = (code) =>{
    if(!code){
      notification['error']({
        message: "Server Error",
        description: "Something went wrong",
      });
      return;
    }

    if(code === 1000){
      openNotificationWithIcon('error', code);
      clearCredential();
      this.props.history.push('/')
      return;
    }
    openNotificationWithIcon('error', code);
  }

  getManifestByDestination = ( startStationId, endStationId) =>{
    this.setState({fetching:true})
    try {
      ManifestService.getManifestDateRange(this.state.startDay, this.state.endDay, startStationId, endStationId)
      .then(e=>{
        const{data, success, errorCode}=e.data
        if(success){
          this.setState({listOfTripDates:data || [], fetching:false})
          return;
        }
        this.handleErrorNotification(errorCode)
      })
    } catch (error) {
      this.setState({fetching:false},()=>{
        this.handleErrorNotification()
      })
    }
  }

  onForceLogout = (errorCode) =>{
    openNotificationWithDuration('error', errorCode)
    clearCredential();
    this.props.history.push('/login')
  }
  
  onChangeTable = (pagination, filters, sorter, extra) =>{
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
      const data = this.state.routes[this.state.routesList.value]
      return {
        key: i,
        date:  moment(e._id).format('MMM DD, YYYY hh:mm A') ,
        count: e.count,
        origin: data.startStationName,
        name: data.name,
        destination: data.endStationName,
        startStationId:data.start,
        endStationId:data.end
      }
    });
  }

  onChangeDatePicker = (date) =>{
    const startDay = date[0];
    const endDay = date[1];

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
        <Col span={8}>
        {
          routesList && 
          <Select 
            size="large"
            defaultValue={routesList.value} 
            style={{ width: '90%' }} 
            onChange={this.handleSelectChange}>{ routesList.options.map(e=>(<Option key={e.value} value={e.value}>{e.name}</Option>)) }
          </Select>
        }
        </Col>
        <Col offset={4} span={12}>
          <RangePicker
            size="large"
            style={{float:'right'}}
            defaultValue={[moment(this.state.startDay, dateFormat), moment(this.state.endDay, dateFormat)]}
            onChange={(date, date2) => this.onChangeDatePicker(date2)}/>
        </Col>
      </Row>
      { 
        !fetching && this.state.listOfTripDates ? 
        <TableRoutesView
          routes={routes}
          pagination={false}
          dataSource={this.dataSource()}
          onChange={this.onChangeTable} 
          onPrint={(data)=>this.props.history.push('/manifest/print',{ data })}
          onViewClick={(data)=>this.props.history.push('/manifest/details', { data }) }
          /> :
          <Skeleton active />
      }
    </div>
  }
}

export default Manifest;