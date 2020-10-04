import React from "react";
import "./searchModule.scss";
import ParcelCard from "../../component/parcelCard";
import ReviewDetails from "../../component/reviewDetails";
import moment from "moment";
import { config } from "../../config";
import TicketView from "../../component/ticketView";
import ReactToPrint from "react-to-print";
import ManifestService from "../../service/Manifest";
import Parcel from "../../service/Parcel";
import {openNotificationWithIcon,clearCredential,getUser,debounce} from "../../utility";
import {notification, Table} from "antd";
import {CloseCircleOutlined} from "@ant-design/icons";
import {Layout,Button,Col, Row, Input, Tooltip, Skeleton, Space } from "antd";

const { Search } = Input;
const { Content } = Layout;

function CardView(props) {
  const dataSource = props.dataSource || [];
  return (
    <section className="card-view-section">
      {dataSource.map((e) => {
        return <ParcelCard value={e} onSelect={(e) => props.onSelect(e)} />;
      })}
    </section>
  );
}

const ManifestDetailsTable = (props) => {
  const columns = [
    // {
    //   title: "",
    //   dataIndex: "",
    //   key: "action",
    //   render: (text, record) => (
    //     <div className="table-view-expand">
    //       <Tooltip title="Show full details">
    //         <Button className="btn-expand-icon">
    //           <ArrowsAltOutlined
    //             className="table-view-expand-icon"
    //             onClick={() => {
    //               props.onSelect(record);
    //             }}
    //           />
    //         </Button>
    //       </Tooltip>
    //     </div>
    //   ),
    // },
    {
      title: "Transaction Date",
      dataIndex: "sentDate",
      key: "sentDate",
    },
    {
      title: "BL No.",
      dataIndex: "billOfLading",
      key: "billOfLading",
    },
    {
      title: "QR Code",
      dataIndex: "qrcode",
      key: "qr-code",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.length - b.description.length,
    },
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      sorter: (a, b) => a.sender.length - b.sender.length,
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      sorter: (a, b) => a.receiver.length - b.receiver.length,
    },
    {
      title: "Pack. Count",
      dataIndex: "qty",
      key: "qty",
      sorter: (a, b) => a.qty - b.qty,
    },
    {
      title: "Parcel Status",
      dataIndex: "travelStatus",
      key: "travelStatus",
      sorter: (a, b) => a.name.travelStatus - b.name.travelStatus,
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (text, record) => (
    //     <Space>
    //       <Button
    //         disabled={record.travelStatus.toLowerCase() !== "created"}
    //         size="small"
    //         style={{
    //           color: "white",
    //           fontWeight: "200",
    //           background: `${
    //             record.travelStatus.toLowerCase() === "created"
    //               ? "teal"
    //               : "gray"
    //           }`,
    //         }}
    //         onClick={() => props.onCheckIn(record._id)}
    //       >
    //         {" "}
    //         Check In{" "}
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];
  return (
    <div className="SearchModule-table" style={{padding:'1rem'}}>
    <Table
      pagination={false}
      className="table"
      columns={columns}
      dataSource={props.dataSource}
      onSelect={(record) => props.onSelect(record)}
    />
    </div>
    
  );
};

const TABLE_CARD_VIEW = 1;
const PREVIEW = 2;
const TICKET = 3;

class SearchModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      data: null,
      isCardView: false,
      showDetails: false,
      selectedItem: null,
      parcelData: null,
      fetching: false,
      currentView: TABLE_CARD_VIEW,
      searchValue: "",
      status: 0,
      date: undefined,
      startStationId: undefined,
      endStationId: undefined,
      parcelList:[]
    };
    this.printEl = React.createRef();
    this.fetchParcelList = debounce(this.fetchParcelList,1000)

  }

  componentDidMount() {
    const companyTag = getUser() ? getUser().busCompanyId.config.parcel.tag : undefined;
    this.companyTag = companyTag;

    window.addEventListener("resize", (e) => {
      this.setState({
        height: e.currentTarget.innerHeight,
        width: e.currentTarget.innerWidth,
      });
    });
}

  fetchManifest = (date, startStationId, endStationId, _routes) => {
    ManifestService.getManifestByDate(
      date,
      startStationId,
      endStationId
    ).then((e) => {
      if (!e.data.success && e.data.errorCode) {
        this.handleErrorNotification(e.data.errorCode);
        return;
      }

      if (e.data && e.data.length > 0) {
        let data = e.data;
        const departureTime = moment(date).format("MMM-DD-YYYY");
        const arrivalTime = moment(date).format("MMM-DD-YYYY");
        const movonBillOfLading = data[0].displayId;
        const coyBillOfLading = data[0].billOfLading;
        const routes1 = data[0].trips.startStationName;
        const routes2 = data[0].trips.endStationName;

        this.setState({
          date,
          startStationId,
          endStationId,
          tempParcelData: data,
          parcelData: data,
          departureTime,
          arrivalTime,
          movonBillOfLading,
          coyBillOfLading,
          routes: _routes,
          fetching: false,
        });
      } else {
        this.setState({
          fetching: false,
        });
      }
    });
  };

  onSiderChange = (name, value) => {
    switch (name) {
      case "switch-view":
        this.setState({ isCardView: value });
        break;

      case "parcelStatus":
        const data = this.state.parcelData;
        const tempParcelData = data.filter((e) => {
          if (value === 0) {
            return true;
          }
          if (e.status === value) {
            return true;
          }
          return false;
        });
        this.setState({ status: value, tempParcelData });
        break;

      default:
        break;
    }
  };

  onSelect = (value) => {
    const selectedItem = this.state.parcelData.filter(
      (e) => e._id === value._id
    )[0];
    this.setState({ selectedItem, currentView: PREVIEW });
  };

  getReviewDetails = (data) => {
    return {
      noOfSticker:
        (getUser() &&
          getUser().busCompanyId &&
          getUser().busCompanyId.config &&
          getUser().busCompanyId.config.parcel.noOfStickerCopy) ||
        2,
      packageName: data.packageInfo.packageName,
      packageWeight: data.packageInfo.packageWeight,
      packageQty: data.packageInfo.quantity,
      packageImages: data.packageInfo.packageImages,
      recipientName: data.recipientInfo.recipientName,
      recipientEmail: data.recipientInfo.recipientEmail,
      recipientPhone: "+63" + data.recipientInfo.recipientPhone.number,
      senderName: data.senderInfo.senderName,
      senderEmail: data.senderInfo.senderEmail,
      senderPhone: "+63" + data.senderInfo.senderPhone.number,
      convenienceFee: data.priceDetails.convenienceFee,
      insuranceFee: data.priceDetails.insuranceFee,
      price: data.priceDetails.price,
      totalPrice: data.priceDetails.totalPrice,
      additionalNote: data.additionalNote,
      billOfLading: data.billOfLading,
      busCompanyName: data.busCompanyName,
      busCompanyLogo: data.busCompanyLogo,
      endStationName: data.trips.endStationName,
      startStationName: data.trips.startStationName,
      tripCode: data.trips.displayId,
      tripDate: data.trips.tripStartDateTime,
      scanCode: data.scanCode,
      createdAt: data.createdAt,
      subParcels: data.subParcels,
    };
  };

  doSearch = (el) => {
    const toSearch = el.toLowerCase();
    this.setState({ searchValue: toSearch, fetching:true },()=> this.fetchParcelList());
  };

  fetchParcelList = () =>{
    Parcel.searchParcel(this.state.searchValue)
    .then(e=>{
      console.log('response',e)
      const{data, errorCode}=e.data;

      if(errorCode){
        this.handleErrorNotification(errorCode);
        return;
      }

      const parcelList = data.map((e, i) => {
        return {
          key: i,
          sentDate: moment(e.sentDate).format('MMM DD YYYY'),
          qrcode: e.scanCode,
          billOfLading: e.billOfLading,
          description: e.packageInfo.packageName,
          sender: e.senderInfo.senderName,
          receiver: e.recipientInfo.recipientName,
          qty: e.packageInfo.quantity,
          travelStatus: config.parcelStatus[e.status],
          packageImg: e.packageInfo.packageImages,
          tripId: e.tripId,
          _id: e._id,
        };
      })
      this.setState({parcelList, fetching:false})
    })
  }

  handleErrorNotification = (code) => {
    console.log("error", code);
    if (!code) {
      notification["error"]({
        message: "Server Error",
        description: "Something went wrong",
      });
      return;
    }

    if (code === 1000) {
      openNotificationWithIcon("error", code);
      clearCredential();
      this.props.history.push("/");
      return;
    }
    openNotificationWithIcon("error", code);
  };

  onCheckIn = (id) => {
    console.log("checkin id", id);
    ManifestService.checkParcelById(id).then((e) => {
      console.log("e checkParcelById", e);
      window.location.reload(true);
    });
  };

  SwitchView = () => {
    let View = null;
    switch (this.state.currentView) {
      case 1:
        View = (
          <div className="right-content-section">
            <Row>
              <Col span={24}>
                <div className="search-container">
                  <Search
                    value={this.state.searchValue}
                    className="manifest-details-search-box"
                    placeholder="Sender | Receiver | QR Code"
                    onChange={(e) => this.doSearch(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              {this.state.isCardView ? (
                <div style={{ padding: "2rem" }}>
                  <CardView
                    onSelect={(record) => this.onSelect(record)}
                    dataSource={this.parseParcel()}
                  />
                </div>
              ) : (
                <>
                  {this.state.fetching ? (
                    <Skeleton active />
                  ) : (
                    <ManifestDetailsTable
                      onCheckIn={(tripId) => this.onCheckIn(tripId)}
                      dataSource={this.parseParcel()}
                      onSelect={(record) => this.onSelect(record)}
                    />
                  )}
                </>
              )}
            </Row>
          </div>
        );
        break;
      case 2:
        View = (
          <div className="manifest-review-details">
            <div className="manifest-review-details-header">
              <span>Preview</span>
              <Tooltip title="Close">
                <CloseCircleOutlined
                  onClick={() =>
                    this.setState({ currentView: TABLE_CARD_VIEW })
                  }
                  className="x-button-close"
                />
              </Tooltip>
            </div>
            <ReviewDetails
              viewMode={true}
              value={this.getReviewDetails(this.state.selectedItem)}
            />
            <Space>
              <Button
                className="default-delivery-button manifest-review-details-button-close"
                onClick={() => this.setState({ currentView: TICKET })}
              >
                Print
              </Button>
              <Button
                className="default-delivery-button manifest-review-details-button-close"
                onClick={() => this.setState({ currentView: TABLE_CARD_VIEW })}
              >
                Close
              </Button>
            </Space>
          </div>
        );
        break;

      case 3:
        View = (
          <div style={{ padding: "2rem" }}>
            <div className="manifest-review-details-header">
              <span>Print</span>
              <Tooltip title="Close">
                <CloseCircleOutlined
                  onClick={() =>
                    this.setState({ currentView: TABLE_CARD_VIEW })
                  }
                  className="x-button-close"
                />
              </Tooltip>
            </div>

            <div ref={this.printEl}>
              <TicketView
                value={this.getReviewDetails(this.state.selectedItem)}
              />
            </div>
            <Space className="ticket-view-buttons">
              <ReactToPrint
                content={() => this.printEl.current}
                trigger={() => (
                  <Button className="default-delivery-button">Print</Button>
                )}
              />
              <Button
                className="default-delivery-button"
                onClick={() => this.setState({ currentView: TABLE_CARD_VIEW })}
              >
                Cancel
              </Button>
            </Space>
          </div>
        );
        break;

      default:
        break;
    }
    return View;
  };

  render() {
    const { width, currentView } = this.state;
    return (
      <Layout className="SearchModule">
        <Row justify="center" style={{margin:'1rem'}}>
          <div className="search-container">
            <Search
              value={this.state.searchValue}
              className="manifest-details-search-box"
              placeholder="Sender | Receiver | QR Code"
              onChange={(e) => this.doSearch(e.target.value)}
            />
          </div>
        </Row>
        <Content style={{ overflow: "scroll" }}>
          {this.state.fetching ? (
            <Skeleton active />
          ) : (
            <ManifestDetailsTable
              onCheckIn={(tripId) => this.onCheckIn(tripId)}
              dataSource={this.state.parcelList}
              onSelect={(record) => this.onSelect(record)}
            />
          )}
        </Content>
      </Layout>
    );
  }
}

export default SearchModule;
