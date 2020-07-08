import React from 'react';
import { Layout, Button, Table, Divider, Col, Row, Select, Input, Switch, Tooltip, Skeleton } from 'antd';
import './manifestDetails.scss'
import { FilterOutlined, ArrowLeftOutlined, ArrowsAltOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ParcelCard from '../../component/parcelCard'
import ReviewDetails from '../../component/reviewDetails'
import ManifestService from '../../service/Manifest';
import moment from 'moment';
import { config } from '../../config'
import { openNotificationWithIcon, clearCredential } from '../../utility'
import {TableView} from '../../component/table'


const { Search } = Input;
const { Option } = Select;
const { Header, Content, Sider } = Layout;

const dateFormat = "MMM DD, YYYY";
const currentTime = moment()
const today = currentTime.format(dateFormat)
const yesterday = currentTime.subtract(7, 'd').format(dateFormat);


function handleChange(value) {
  console.log(`selected ${value}`);
}

const InputBox = (props) => {
  return (<div className="input-box" style={{ margin: '.5rem' }}>
    <span>{props.title}</span>
    <Input className="input-box-item" placeholder={props.placeholder} disabled value={props.value} />
  </div>)
}

function SiderContent(props) {
  return (<section>
    {
      !props.hidden && <>
        <div className="filter-section">
          <FilterOutlined style={{ color: 'teal' }} />
          <span> Filter</span>
        </div>

        <div className="view-toggle-section">
          <span>View</span>
          <Switch
            checkedChildren="Card"
            unCheckedChildren="Table"
            checked={props.isCardView}
            onChange={(e) => props.onChange({ name: "switch-view", value: e })}
          />
        </div>
        <Row>
          <Col span={24} className="sider-content-col">
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
          <Col span={24} className="sider-content-col">
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
      </>
    }
    <Row>
      <Col span={24} style={{ padding: '.25rem' }}>
        <InputBox title="Routes" value={props.state.routes} />
        <InputBox title="MovOn Bill of Lading" value={props.state.movonBillOfLading} />
        <InputBox title="Company Bill of Lading" value={props.state.coyBillOfLading} />
        <InputBox title="Departure Date" value={props.state.departureTime} />
        <InputBox title="Arrival Date" value={props.state.arrivalTime} />
      </Col>
    </Row>

  </section>)
}

function CardView(props) {
  const dataSource = props.dataSource || []
  return (<section className="card-view-section">
    {
      dataSource.map(e => {
        return (<Col span={8}>
          <ParcelCard
            value={e}
            onSelect={(e) => props.onSelect(e)}
          />
        </Col>)
      })
    }
  </section>)
}

function ManifestDetails(props) {
  const [state, setState] = React.useState({
    data: null,
    isCardView: false,
    showDetails: false,
    selectedItem: null,
    parcelData: null,
    fetching: true
  })

  React.useEffect(() => {
    if (!state.data) {
      const data = props.location.state.data || "";
      ManifestService
        .getManifest(yesterday, today, data.start, data.end, 0)
        .then(e => {
          const { data, success, errorCode } = e.data
          console.log('getManifest ====> e', e)
          if (success) {
            const departureTime = moment(data[0].trips.tripStartDateTime).format("MMM-DD-YYYY hh:mm A");
            const arrivalTime = moment(data[0].trips.tripEndDateTime).format("MMM-DD-YYYY hh:mm A");
            const movonBillOfLading = data[0].displayId;
            const coyBillOfLading = data[0].billOfLading;
            const routes1 = data[0].trips.startStation.name
            const routes2 = data[0].trips.endStation.name

            setState({
              ...state, ...{
                parcelData: data,
                departureTime,
                arrivalTime,
                movonBillOfLading,
                coyBillOfLading,
                routes: `${routes1} - ${routes2}`,
                fetching: false
              }
            })
          } else {
            openNotificationWithIcon('error', errorCode)
            setTimeout(() => {
              clearCredential();
              props.history.push('/login')
            }, 4500);
          }
        })
      setState({ ...state, ...{ data } })
    }

  }, [])

  const onSiderChange = (e) => {
    switch (e.name) {
      case "switch-view":
        setState({ ...state, ...{ isCardView: e.value } })
        break;

      default:
        break;
    }
  }

  const parseParcel = () => {
    return state.parcelData ? state.parcelData.map((e, i) => {
      return {
        "key": i,
        "qrcode": e.scanCode,
        'description': e.packageInfo.packageName,
        'sender': e.senderInfo.senderName,
        'receiver': e.recipientInfo.recipientName,
        'qty': e.packageInfo.quantity,
        'travelStatus': config.parcelStatus[e.status],
        "packageImg":e.packageInfo.packageImages
      }
    }) : []
  }

  const onSelect = (value) => {
    console.log('onSelect xxxxx', value)
    setState({ ...state, ...{ showDetails: true, selectedItem: state.parcelData[value.key] } })
  }

  const getReviewDetails = (data) =>{
    return {
      packageName:data.packageInfo.packageName,
      packageWeight:data.packageInfo.packageWeight,
      packageQty: data.packageInfo.quantity,
      packageImages: data.packageInfo.packageImages,
      recipientName: data.recipientInfo.recipientName,
      recipientEmail: data.recipientInfo.recipientEmail,
      recipientPhone: data.recipientInfo.recipientPhone.number,
      senderName: data.senderInfo.senderName,
      senderEmail: data.senderInfo.senderEmail,
      senderPhone: data.senderInfo.senderPhone.number,
      convenienceFee: data.priceDetails.convenienceFee,
      insuranceFee: data.priceDetails.insuranceFee,
      price: data.priceDetails.price,
      totalPrice: data.priceDetails.totalPrice,
      additionalNote:data.additionalNote,
      billOfLading: data.billOfLading,
    }
  }

  return (
    <Layout className="manifest-details-page">
      <Header className="home-header-view">
        <Row>
          <Col span={8}>
            <div style={{ float: 'left' }}>
              <Button
                type="link"
                onClick={() => { props.history.goBack() }}>
                <ArrowLeftOutlined style={{ fontSize: '20px', color: '#fff' }} />
                <span style={{ fontSize: '20px', color: '#fff' }}>{"Manifest"}</span>
              </Button>
            </div>
          </Col>
        </Row>
      </Header>

      <Layout className="manifest-details-page-body">

        <Sider width={300} className="manifest-details-sider">
          <SiderContent
            hidden={state.showDetails}
            state={state}
            onChange={(e) => onSiderChange(e)} />
        </Sider>

        <Content>
          {
            state.showDetails ?
              <div className="manifest-review-details">
                <div className="manifest-review-details-header">
                  <span>Preview</span>
                  <Tooltip title="Close">
                    <CloseCircleOutlined 
                      onClick={()=>setState({...state,...{showDetails:false}})} 
                      className="x-button-close"/>
                  </Tooltip>
                </div>
                <ReviewDetails viewMode={true} value={getReviewDetails(state.selectedItem)} />
                <Button
                  onClick={() => setState({ ...state, ...{ showDetails: false } })}
                  className="manifest-review-details-button-close">Close</Button>
              </div> :
              <div className="right-content-section">
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
                        onSelect={(record) => onSelect(record)}
                        dataSource={parseParcel()} /> :
                      <>
                        {
                          state.fetching ? <Skeleton active /> :
                            <TableView
                              dataSource={parseParcel()}
                              onSelect={(record) => {
                                console.log('select', record)
                                onSelect(record)
                              }} />
                        }
                      </>

                  }
                </Row>
              </div>
          }
        </Content>

      </Layout>

    </Layout>
  );
}

export default ManifestDetails;