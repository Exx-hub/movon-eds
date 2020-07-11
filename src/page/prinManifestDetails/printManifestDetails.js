import React from 'react';
import ReactToPrint from 'react-to-print';
import moment from 'moment';
import { Layout, Button, Table, Col, Row, Tooltip } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import './printManifestDetails.css'

const { Header } = Layout

function TableView(props) {
  const columns = [
    {
      title: () => (<span>(Movon) <br /> Bill of Lading</span>),
      dataIndex: 'movonBillOfLading',
      key: 'billOfLading1'
    },
    {
      title: () => (<span>(BITS) <br /> Bill of Lading</span>),
      dataIndex: 'companyBillOfLading',
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
    <Table 
      pagination={false} 
      dataSource={props.dataSource} 
      columns={columns} />
  </Col>)
}

class PrintManifestDetails extends React.Component {

  constructor(props){
    super(props);
    this.state={
      deliveryPerson:undefined, 
      departureTime:undefined,
      routes1:undefined,
      routes2:undefined,
      tripCode:undefined,
      dataSource:[],
      busCompanyName:undefined,
    }
    this.printEl = React.createRef();
  }

  componentDidMount(){
    const data = this.props.location.state.data
    if(!data) return;
    console.log('data',data)

    const departureTime = moment(data[0].trips.tripStartDateTime).format("MMM-DD-YYYY hh:mm A");
    const routes1 = data[0].trips.startStationName
    const routes2 = data[0].trips.endStationName;
    const deliveryPerson = data[0].deliveryPersonInfo.deliveryPersonName
    const tripCode = data[0].trips.displayId
    const busCompanyName= data[0].busCompanyName;

    const dataSource = data.map((e,i)=>{
      return {
        key: i,
        movonBillOfLading: e.displayId,
        companyBillOfLading: e.billOfLading,
        description: e.packageInfo.packageName,
        weight: e.packageInfo.packageWeight,
        amount: e.priceDetails.totalPrice,
        qty: e.packageInfo.quantity,
        sender: e.senderInfo.senderName,
        reciepient: e.recipientInfo.recipientName,
        status: e.status,
        created: e.deliveryPersonInfo.deliveryPersonName,
      }
    })

    this.setState({
      data, 
      deliveryPerson, 
      departureTime,
      routes1,
      routes2,
      tripCode,
      dataSource,
      busCompanyName
    })
  }

  render(){
    const{
      deliveryPerson, 
      departureTime,
      routes1,
      routes2,
      tripCode,
      dataSource,
      busCompanyName
    }=this.state;
    return(
      <Layout className="print-manifest-details-page">
        <Header className="home-header-view">
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <div>
          <Button type="link" onClick={() => this.props.history.push('/')}>
          <ArrowLeftOutlined style={{ fontSize: '16px', color: '#fff' }} />
            <span style={{ fontSize: "20px", color: "#fff" }}>Print Manifest</span>
          </Button>
        </div>
        <div>
          <ReactToPrint
            content={() => this.printEl.current}
            trigger={() => {
              return <Tooltip title="Print Document"><Button type="link">
                <PrinterOutlined style={{ fontSize: '16px', color: '#fff' }} />
                <span style={{ fontSize: '16px', color: '#fff' }}>Print</span>
              </Button>
              </Tooltip>
            }} />
        </div>
        </div>

      </Header>
        <Layout className="print-body">
          <div ref={ this.printEl }>
            <div style={{ marginLeft: '.5rem', marginTop: '.5rem' }}>
              <div className='print-title-corner'>
                <span className="print-company-title">{busCompanyName}</span>
                <span className="print-company-date">{moment().format("MMM DD, YYYY")}</span>
              </div>
              <Row>
                <Col offset={2} span={3}>
                  <h3 className="col-title">Routes:</h3>
                  <h3 className="col-title">Trip Code:</h3>
                </Col>

                <Col span={6}>
                  <h3 className="col-value">{routes1} - {routes2}</h3>
                  <h3 className="col-value">{tripCode}</h3>
                </Col>

                <Col offset={4} span={4}>
                  <h3 className="col-title">Departure Date:</h3>
                  <h3 className="col-title">Prepared By:</h3>
                </Col>

                <Col>
                  <h3 className="col-value">{departureTime}</h3>
                  <h3 className="col-value">{deliveryPerson}</h3>
                </Col>
              </Row>
          </div>
            <div className="my-table">
              <TableView 
                pagination={false} 
                dataSource={dataSource} />
            </div>
        </div>
      </Layout>
    </Layout>
    )
  }
}

export default PrintManifestDetails;