import React from 'react';
import { Layout, Button, Table, Divider, Col, Row, Select, Input, Switch, Tooltip } from 'antd';
import './manifestDetails.scss'
import { FilterOutlined, ArrowLeftOutlined, ArrowsAltOutlined, CloseOutlined } from '@ant-design/icons';
import ParcelCard from '../../component/parcelCard'
import ReviewDetails from '../../component/reviewDetails'

const { Search } = Input;
const { Option } = Select;
const { Header, Content, Sider } = Layout

function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}

const InputBox = (props) => {
  return (<div style={{ margin: '.5rem' }}>
    <span>{props.title}</span>
    <Input placeholder={props.placeholder} disabled value={props.value} />
  </div>)
}

function SiderContent(props) {
  return (<div style={{marginBottom:'4rem'}}>
    <div style={{ padding: '1rem',  textAlign:'center' }}>
      <FilterOutlined style={{ color: 'teal' }} />
      <span> Filter</span>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <span>View</span>
      <Switch 
        checkedChildren="Card" 
        unCheckedChildren="Table" 
        checked={props.isCardView}
        onChange={(e)=>props.onChange({name:"switch-view", value:e})}
      />
    </div>

    <Row>
      <Col span={24} style={{ marginTop: '1rem', paddingLeft: '.8rem', paddingRight: '.8rem' }}>
        <div className="manifest-details-select">
          <span>Travel Status</span>
          <Select defaultValue="all" style={{ width: '100%' }} onChange={handleChange}>
            <Option value="all">All</Option>
            <Option value="intransit">In-Transit</Option>
            <Option value="arraived">Arraived</Option>
          </Select>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span={24} style={{ marginTop: '1rem', paddingLeft: '.8rem', paddingRight: '.8rem' }}>
        <div className="manifest-details-select">
          <span>Parcel Status</span>
          <Select defaultValue="all" style={{ width: '100%' }} onChange={handleChange}>
            <Option value="all">All</Option>
            <Option value="claimed">Claimed</Option>
            <Option value="unclaimed">Unclaimed</Option>
          </Select>
        </div>
      </Col>
    </Row>

    <Divider />
    
    <Row>
      <Col span={24} style={{ padding: '.25rem' }}>
        <InputBox title="Routes" value="test" />
        <InputBox title="MovOn Bill of Lading" value="test" />
        <InputBox title="Company Bill of Lading" value="test" />
        <InputBox title="Departure Date" value="test" />
        <InputBox title="Arrival Date" value="test" />
      </Col>
    </Row>
    
  </div>)
}

function CardView(props) {
  const dataSource = props.dataSource || []
  return (<>
  {
    dataSource.map(e=>{
      return (<Col span={8}>
      <ParcelCard value={e} onSelect={(e)=>props.onSelect(e)}  />
    </Col>)
    })
  }
  </>)
}

const dataSource = [
  {
    key: '1',
    qrcode: '567890-1',
    description: 'Socks of Rice',
    sender: 'Pedro Tawilis',
    receiver: 'Juan Tamad',
    qty: 1,
    status: 'Unclaimed',
    travelStatus: 'In-Transit',
  },
  {
    key: '2',
    qrcode: '567890-1',
    description: 'Socks of Rice',
    sender: 'Pedro Tawilis',
    receiver: 'Juan Tamad',
    qty: 1,
    status: 'Unclaimed',
    travelStatus: 'In-Transit',
  },
];

function TableView(props) {
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
                onClick={()=>props.onSelect(record)}
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Travel Status',
      dataIndex: 'travelStatus',
      key: 'travelStatus',
    },
  ];
  return (<Col span={24} style={{padding:'1rem'}}>
    <Table dataSource={props.dataSource} columns={columns} />
  </Col>)
}

function ManifestDetails(props) {

  React.useEffect(()=>{
    console.log('props', props)
  },[])
  
  const [state, setState] = React.useState({
    isCardView:false,
    showDetails:false,
    detailsItem: null
  })

  const onSiderChange = (e) =>{
    switch(e.name){
      case "switch-view": 
        setState({...state, ...{isCardView:e.value}})
      break;

      default:
        break;
    }
  }

  const onSelect = (value) =>{
    setState({...state,...{showDetails:true, detailsItem:value}})
  }

  return (
    <Layout className="manifest-details-page">
      <Header className="home-header-view">
        <Row>
          <Col span={8}>
            <div style={{ float: 'left' }}>
              <Button 
                type="link" 
                onClick={() => {state.showDetails ? setState({...state,...{showDetails:false}}) : props.history.goBack()}}>
                <ArrowLeftOutlined style={{ fontSize: '20px', color: '#fff' }} />
                <span style={{ fontSize: '20px', color: '#fff' }}>{state.showDetails ? "Back" : "Manifest"}</span>
              </Button>
            </div>
          </Col>
          <Col span={8} style={{ textAlign: 'center' }}>MovOn-Cargo</Col>
        </Row>
      </Header>
      <Layout className="manifest-details-page-body" style={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}>
      {
        state.showDetails ? 
        <div className="manifest-review-details">
          <ReviewDetails />
          <div className="manifest-review-details-button-close">
            <Button danger onClick={()=>{
              setState({...state, ...{showDetails:false}})
            }}>Close</Button>
          </div>
        </div> :
      <>
      <Sider width={300} className="manifest-details-sider">
        <SiderContent onChange={(e)=>onSiderChange(e)}/>
      </Sider>
      <Content>
        <Row>
          <Col span={24}>
            <div className="search-container">
              <Search
                className="manifest-details-search-box"
                placeholder="Sender | Receiver | QR Code"
                onSearch={value => console.log(value)}
              />
            </div>
          </Col>
        </Row>
        <Row>
          {
            state.isCardView ? 
            <CardView 
              onSelect={(record)=>onSelect(record)}
              dataSource={dataSource} /> 
            : 
            <TableView 
              dataSource={dataSource} 
              onSelect={(record)=>onSelect(record)}/>
          }
        </Row>
      </Content>
      </>}
      </Layout>

    </Layout>
  );
}

export default ManifestDetails;