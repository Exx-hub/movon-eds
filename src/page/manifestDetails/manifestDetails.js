import React from "react";
import "./manifestDetails.scss";
import ParcelCard from "../../component/parcelCard";
import ReviewDetails from "../../component/reviewDetails";
import moment from "moment";
import { config } from "../../config";
import { TableView } from "../../component/table";
import TicketView from "../../component/ticketView";
import ReactToPrint from "react-to-print";
import ManifestService from "../../service/Manifest";
import {
  openNotificationWithIcon,
  alterPath,
  modifyName,
  UserProfile,
} from "../../utility";
import { notification } from "antd";

import {
  FilterOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import {
  Layout,
  Button,
  Divider,
  Col,
  Row,
  Select,
  Input,
  Switch,
  Tooltip,
  Skeleton,
  Space,
} from "antd";

const { Search } = Input;
const { Option } = Select;
const { Header } = Layout;

const InputBox = (props) => {
  return (
    <div className="input-box" style={{ margin: ".5rem" }}>
      <span>{props.title}</span>
      <Input
        className="input-box-item"
        placeholder={props.placeholder}
        disabled
        value={props.value}
      />
    </div>
  );
};

function SiderContent(props) {
  return (
    <section>
      {!props.hidden && (
        <>
          <div className="filter-section">
            <FilterOutlined style={{ color: "teal" }} />
            <span> Filter</span>
          </div>

          <div className="view-toggle-section">
            <span>View</span>
            <Switch
              checkedChildren="Card"
              unCheckedChildren="Table"
              checked={props.isCardView}
              onChange={(e) =>
                props.onChange({ name: "switch-view", value: e })
              }
            />
          </div>
          <Row>
            <Col span={24} className="sider-content-col">
              <div className="manifest-details-select">
                <span>Parcel Status</span>
                <Select
                  defaultValue="all"
                  style={{ width: "100%" }}
                  onChange={(e) =>
                    props.onChange({ name: "parcelStatus", value: e })
                  }
                >
                  <Option value={0}>All</Option>
                  <Option value={1}>Created</Option>
                  <Option value={2}>Intransit</Option>
                  <Option value={3}>Received</Option>
                  <Option value={4}>Claimed</Option>
                  <Option value={5}>Delivered</Option>
                </Select>
              </div>
            </Col>
          </Row>
          <Divider />
        </>
      )}
      <Row>
        <Col span={24} style={{ padding: ".25rem" }}>
          <InputBox title="Routes" value={props.state.routes} />
          <InputBox title="Parcel Code" value={props.state.movonBillOfLading} />
          <InputBox
            title="Bill of Lading"
            value={props.state.coyBillOfLading}
          />
          <InputBox
            title="Transaction Date"
            value={props.state.departureTime}
          />
        </Col>
      </Row>
    </section>
  );
}

function CardView(props) {
  const dataSource = props.dataSource || [];
  return (
    <section className="card-view-section">
      {dataSource.map((e) => {
        return (
          <div style={{ width: "100%", marginBottom: "1rem" }}>
            <ParcelCard value={e} onSelect={(e) => props.onSelect(e)} />
          </div>
        );
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
      title: "Bill Of Lading",
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
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            size="small"
            style={{ fontSize: 10.5 }}
            onClick={() => props.onSelect(record)}
          >
            Preview
          </Button>
        </div>
      ),
    },
  ];
  return (
    <TableView
      columns={columns}
      dataSource={props.dataSource}
      onSelect={(record) => props.onSelect(record)}
    />
  );
};

const TABLE_CARD_VIEW = 1;
const PREVIEW = 2;
const TICKET = 3;

class ManifestDetails extends React.Component {
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
    };
    this.printEl = React.createRef();
    this.userProfileObject = UserProfile;
  }

  componentDidMount() {
    window.addEventListener("resize", (e) => {
      this.setState({
        height: e.currentTarget.innerHeight,
        width: e.currentTarget.innerWidth,
      });
    });

    if (this.props.location.state) {
      const {
        startStationId,
        endStationId,
        endStationName,
        startStationName,
        tripId,
      } = this.props.location.state.selected;

      console.info(
        "this.props.location.state.selected",
        this.props.location.state.selected
      );

      const date = moment(new Date(this.props.location.state.date)).format(
        "YYYY-MM-DD"
      );
      this.fetchManifest(
        tripId,
        date,
        startStationId,
        endStationId,
        `${startStationName} to ${endStationName}`
      );
    }
  }

  fetchManifest = (tripId, date, startStationId, endStationId, _routes) => {
    ManifestService.getManifestByDate(
      tripId,
      date,
      startStationId,
      endStationId
    ).then((e) => {
      if (e.data.errorCode) {
        this.handleErrorNotification(e.data.errorCode);
        return;
      }

      if (e.data && e.data.length > 0) {
        let data = e.data;
        const departureTime = date; //moment(date).format("MMM-DD-YYYY");
        const arrivalTime = date; //moment(date).format("MMM-DD-YYYY");
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

  parseParcel = () => {
    return this.state.tempParcelData
      ? this.state.tempParcelData.map((e, i) => {
          return {
            key: i,
            qrcode: e.scanCode,
            billOfLading: e.billOfLading,
            sentDate: moment(e.sentDate).format("MMM DD, YYYY"),
            description: e.packageInfo.packageName,
            sender: modifyName(e.senderInfo.senderName || ""),
            receiver: modifyName(e.recipientInfo.recipientName || ""),
            qty: e.packageInfo.quantity,
            travelStatus: config.parcelStatus[e.status],
            packageImg: e.packageInfo.packageImages,
            tripId: e.tripId,
            _id: e._id,
          };
        })
      : [];
  };

  onSelect = (value) => {
    const selectedItem = this.state.parcelData.filter(
      (e) => e._id === value._id
    )[0];
    this.setState({ selectedItem, currentView: PREVIEW });
  };

  getReviewDetails = (data) => {
    return {
      noOfSticker: this.userProfileObject.getStickerCount(),
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
    const data = this.state.parcelData;
    const toSearch = el.toLowerCase();
    const tempParcelData = data.filter((e) => {
      const firstCondition =
        e.scanCode.toLowerCase().includes(el.toLowerCase()) ||
        e.packageInfo.packageName.toLowerCase().includes(toSearch) ||
        e.senderInfo.senderName.toLowerCase().includes(toSearch) ||
        e.billOfLading.toLowerCase().includes(toSearch) ||
        e.recipientInfo.recipientName.toLowerCase().includes(toSearch);

      if (this.state.status !== 0) {
        return firstCondition && this.state.status === e.status;
      } else {
        return firstCondition;
      }
    });
    this.setState({ searchValue: el, tempParcelData });
  };

  handleErrorNotification = (code) => {
    if (!code) {
      notification["error"]({
        message: "Server Error",
        description: "Something went wrong",
      });
      return;
    }

    if (code === 1000) {
      openNotificationWithIcon("error", code);
      this.userProfileObject.clearData();
      this.props.history.push(alterPath("/"));
      return;
    }
    openNotificationWithIcon("error", code);
  };

  onCheckIn = (id) => {
    ManifestService.checkParcelById(id).then((e) => {
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
                  placeholder="Sender | Receiver | QR Code | Bill of Lading"
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

  doSorting = () => {};

  render() {
    return (
      <Layout className="manifest-details-page">
        <Header className="home-header-view">
          <Button
            type="link"
            onClick={() => {
              this.props.history.push(alterPath("/manifest/list"));
            }}
          >
            <ArrowLeftOutlined style={{ fontSize: "20px", color: "#fff" }} />
            <span style={{ fontSize: "20px", color: "#fff" }}>
              Manifest Details
            </span>
          </Button>

          {this.state.currentView !== TICKET &&
            this.state.currentView !== PREVIEW && (
              <>
                <div>
                  <Switch
                    checkedChildren="Card View"
                    unCheckedChildren="Table View"
                    checked={this.state.isCardView}
                    onChange={(e) => this.setState({ isCardView: e })}
                  />
                </div>
              </>
            )}
        </Header>

        <Layout className="manifest-details-page-body">
          {this.SwitchView()}
        </Layout>
      </Layout>
    );
  }
}

export default ManifestDetails;
