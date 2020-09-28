import React from 'react';
import { Table, DatePicker, Button, Row, Col, Select, Skeleton, Space, notification, AutoComplete } from 'antd';
import {openNotificationWithIcon, openNotificationWithDuration, clearCredential} from '../../utility'
import ManifestService from '../../service/Manifest';
import moment from 'moment';
import './manifest.scss';

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
    title: 'Sent Date',
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

  state={
    endDay: moment().format(dateFormat),
    startDay:moment().subtract(1, 'd').format(dateFormat),
    fetching:false,
    routes:undefined,
    routesList:{
      value:undefined,
      options:[]
    },
    listOfTripDates:undefined,
    selectedRoute:undefined,
    tempDestinationList:[],
    selected:undefined
  }

  componentDidMount(){
    this.setState({fetching:true})
    try {
      ManifestService
      .getRoutes()
      .then(e=>{
        console.log('getRoutes',e)
        const{errorCode,success,data}=e.data;
        if(!success && errorCode){
          this.handleErrorNotification(errorCode)
        }else{
        this.setState({fetching:false})
        if(!data || (data && data.length < 1)){
          return;
        }

        const options = data.map((e,i)=>{
          return{
            data: e,
            value: i,
            name: e.endStationName
          }
        })

        const params = new URLSearchParams(this.props.location.search);
        const routesIndex = params.get('route-id'); // bar
        
        const routesList = {...this.state.routesList,...{options, value: Number(routesIndex)}}
        const tempDestinationList = data.filter(e=> e !== null || e!== "null").map(e=>(e.endStationName))
        console.log('tempDestinationList',tempDestinationList)

        this.setState({
          routes:data, 
          selectedRoute:data[Number(routesIndex||0)],
          routesList,
          tempDestinationList
        });
        //this.getManifestByDestination(data[Number(routesIndex||0)].start, data[Number(routesIndex||0)].end)
        
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
        console.log('getManifestDateRange',e)
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
    console.log('handleSelectChange value',value)

    const data = this.state.routes[value];
    this.setState({
      selectedRoute: data,
      routesList:{...this.state.routesList, ...{value}}
    },()=>{
      this.getManifestByDestination(data.start, data.end)
      this.props.history.push({
        pathname: '/manifest/list',
        search: `?route-id=${value}`
      })
    })
  }

  dataSource = () =>{
    if(!this.state.listOfTripDates){
      return null;
    }

    console.log('this.state.listOfTripDates',this.state.listOfTripDates)

    return this.state.listOfTripDates.map((e,i)=>{
      const data = this.state.routes[this.state.routesList.value]
      console.log('data',data)
      return {
        key: i,
        date:  moment(e._id).format('MMM DD, YYYY') ,
        count: e.count,
        origin: data.startStationName,
        name: (this.state.selected && this.state.selected.endStationName) || "" ,
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
        const selectedRoute = this.state.selected;
        if(selectedRoute){
          console.log('selectedRoute',selectedRoute)
          this.getManifestByDestination(selectedRoute.start, selectedRoute.end)
        }
      });
    }
  }

  doSearch = el =>{
    const data = this.state.routesList.options;
    console.log('data',data)
    const toSearch = el.toLowerCase();
    const tempDestinationList = data.filter(e=>{
      return e.name.toLowerCase().includes(toSearch) 
    }).map(e=>(e.name))
    this.setState({tempDestinationList})
  }

  render(){
    const{routes, routesList, fetching}=this.state;
    return <div className="manifest-page">
      <Row style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <Col span={8}>
        <div style={{display:'none'}}>
        {
          routesList && 
          <Select 
            size="large"
            value={routesList.value} 
            style={{ width: '90%' }} 
            onChange={this.handleSelectChange}>{ 
              routesList.options.map(e=>(<Option key={e.value} value={e.value}>{e.name}</Option>)) 
            }
          </Select>
        }
        </div>
        <AutoComplete
          dataSource={this.state.tempDestinationList}
          style={{ width: '100%' }}
          onSelect={(item)=>{
            console.log('item',item)
            let selected = this.state.routes.find(e=>e.endStationName === item);
            if(selected){
              this.setState({selected},()=>this.getManifestByDestination(selected.start, selected.end))
              console.log('selected',selected)
            }
          }}
          onSearch={(e)=>this.doSearch(e)}
          placeholder="Destination"
        />
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
        !fetching ? 
        <TableRoutesView
          routes={routes}
          pagination={false}
          dataSource={this.dataSource()}
          onChange={this.onChangeTable} 
          onPrint={(data)=>this.props.history.push('/manifest/print',{ date:data.date, selected:this.state.selected })}
          onViewClick={(data)=>this.props.history.push('/manifest/details',{ date:data.date, selected:this.state.selected })}
          /> :
          <Skeleton active />
      }
    </div>
  }
}

export default Manifest;