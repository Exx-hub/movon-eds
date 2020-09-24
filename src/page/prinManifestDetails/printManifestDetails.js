import React from 'react';
import ReactToPrint from 'react-to-print';
import moment from 'moment';
import { Layout, Button, Table, Col, Row, Tooltip } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import './printManifestDetails.css'
import ManifestService from '../../service/Manifest';
import ParcelService from '../../service/Parcel';


import {
  getUser
} from "../../utility";

const { Header } = Layout

function TableView(props) {
  const busCompanyName = (props && props.dataSource.length > 0) ? props.dataSource[0].busCompanyName : "";
  const columns = [
    {
      title: () => (<span>(Movon) <br /> Bill of Lading</span>),
      dataIndex: 'movonBillOfLading',
      key: 'billOfLading1'
    },
    {
      title: () => (<span>({busCompanyName === "Bicol Isarog Trasport System Inc." ? "BITSI" : busCompanyName}) <br /> Bill of Lading</span>),
      dataIndex: 'companyBillOfLading',
      key: 'billOfLading2',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render:(text)=>(<>{text}{Number(text)>1 ? " kgs." : " kg."}</>)
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
    // {
    //   title: 'Amount',
    //   dataIndex: 'amount',
    //   key: 'amount',
    //   render:(text)=>(<>₱ {parseFloat(text).toFixed(2)}</>)
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    // },
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
    // {
    //   title: 'Created',
    //   dataIndex: 'created',
    //   key: 'created',
    // },
  ];
  return (<Col span={24} style={{ padding: '.25rem' }}>
    <Table 
      pagination={false} 
      dataSource={props.dataSource} 
      columns={columns} />
  </Col>)
}

class PrintManifestDetails extends React.Component {

  state={
    deliveryPerson:undefined, 
    departureTime:undefined,
    routes1:undefined,
    routes2:undefined,
    tripCode:undefined,
    dataSource:[],
    busCompanyName:undefined,
  }

  componentDidMount(){
    this.printEl = React.createRef();
    const companyTag = getUser() ? getUser().busCompanyId.config.parcel.tag : undefined;
    this.companyTag = companyTag;

    const {
      end,
      endStationName,
      startStationName,
    } = this.props.location.state.selected;

    let totalSales = 0;
    const startStation = getUser().assignedStation._id;

    console.log('date', this.props.location.state.date)
    console.log('startStation', startStation)
    console.log('end', end)

    ManifestService.getManifestByDate(moment(this.props.location.state.date).format('MMM DD, YYYY'), startStation, end)
    .then(e=>{
      console.log('getManifestByDate',e)
      const data = e.data;
      
      const departureTime = moment(this.props.location.state.date).format("MMM-DD-YYYY hh:mm A");
      const routes1 = startStationName
      const routes2 = endStationName;
    
      
      if(data && data.length > 0){
        const deliveryPerson = data[0].deliveryPersonInfo.deliveryPersonName
        const tripCode = data[0].trips.displayId
        const busCompanyName= data[0].busCompanyName;
        const dddd = data.map(e=>(Number(e.priceDetails.totalPrice) - Number(e.priceDetails.convenienceFee)))
        totalSales = dddd.reduce((accumulator, currentValue)=> accumulator + currentValue );

        const dataSource = data.map((e,i)=>{
          return {
            key: i,
            movonBillOfLading: e.displayId,
            companyBillOfLading: e.billOfLading,
            description: e.packageInfo.packageName,
            weight: e.packageInfo.packageWeight,
            amount: e.priceDetails.totalPrice - 10,
            qty: e.packageInfo.quantity,
            sender: e.senderInfo.senderName,
            reciepient: e.recipientInfo.recipientName,
            status: e.status,
            busCompanyName: e.busCompanyName
          }
        })

        this.setState({
          transactionDate: moment(this.props.location.state.date).format("MMM DD, YYYY"),
          totalSales,
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
    })
  }

  render(){
    const{
      deliveryPerson, 
      routes1,
      routes2,
      dataSource,
      busCompanyName
    }=this.state;
    return(
      <Layout className="print-manifest-details-page">
        <Header className="home-header-view">
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <div>
          <Button type="link" onClick={() => this.props.history.goBack()}>
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
                <span className="print-company-date">{this.state.transactionDate}</span>
              </div>
              <Row>
                <Col offset={2} span={3}>
                  <h3 className="col-title">Routes:</h3>
                  <h3 className="col-title">Total Transaction:</h3>
                </Col>

                <Col span={6}>
                  <h3 className="col-value">{this.companyTag === 'bicol-isarog' ? `Edsa Cubao - ${routes2}` : `${routes1}-${routes2}`}</h3>
                  <h3 className="col-value">{this.state.dataSource.length}</h3>
                </Col>

                <Col offset={4} span={4}>
                  <h3 className="col-title">Total Sales:</h3>
                  <h3 className="col-title">Prepared By:</h3>
                </Col>

                <Col>
                  <h3 className="col-value">₱ {this.state.totalSales ? this.state.totalSales.toFixed(2) : 0.00 }</h3>
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