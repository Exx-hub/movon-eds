import React from "react";
import "./searchModule.scss";
import moment from "moment";
import { config } from "../../config";
import ManifestService from "../../service/Manifest";
import Parcel from "../../service/Parcel";
import {
  openNotificationWithIcon,
  debounce,
  UserProfile,
  alterPath,
} from "../../utility";
import { notification, Table } from "antd";
import {
  Layout,
  Button,
  Col,
  Row,
  Input,
  Skeleton,
  Pagination,
  Space,
} from "antd";
import User from "../../service/User";

const { Search } = Input;
const { Content } = Layout;

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
      searchValue: "",
      status: 0,
      date: undefined,
      startStationId: undefined,
      endStationId: undefined,
      parcelList: [],
      page: 0,
      totalRecords: 0,
      columns: [],
    };
    this.printEl = React.createRef();
    this.fetchParcelList = debounce(this.fetchParcelList, 1000);
    this.userProfileObject = UserProfile;
  }

  componentDidMount() {
    this.fetchParcelList();
    this.setState({
      columns: [
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
          render: (text)=> (config.parcelStatus[text])
        },
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button disabled={!Boolean(record.travelStatus === 2)} size="small" onClick={() => {}}>
                Arraived 
              </Button>
              <Button disabled={!Boolean(record.travelStatus === 1)} size="small" onClick={() => {}}>
                Void
              </Button>
              <Button disabled={!Boolean(record.travelStatus === 1)} size="small" onClick={() => {}}>
                Edit
              </Button>
            </div>
          ),
        },
      ],
    });
  }

  doSearch = (el) => {
    const toSearch = el.toLowerCase();
    this.setState({ searchValue: toSearch, fetching: true }, () =>
      this.fetchParcelList()
    );
  };

  fetchParcelList = () => {
    Parcel.searchParcel(this.state.searchValue).then((e) => {
      const { data, errorCode } = e.data;

      if (errorCode) {
        this.handleErrorNotification(errorCode);
        return;
      }

      const parcelList = data.map((e, i) => {
        return {
          key: i,
          sentDate: moment(e.sentDate).format("MMM DD YYYY"),
          qrcode: e.scanCode,
          billOfLading: e.billOfLading,
          description: e.packageInfo.packageName,
          sender: e.senderInfo.senderName,
          receiver: e.recipientInfo.recipientName,
          qty: e.packageInfo.quantity,
          travelStatus: e.status,
          packageImg: e.packageInfo.packageImages,
          tripId: e.tripId,
          _id: e._id,
        };
      });
      this.setState({ parcelList, fetching: false });
    });
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
      this.userProfileObject.clearData()
      this.props.history.push(alterPath("/"));
      return;
    }
    openNotificationWithIcon("error", code);
  };

  render() {
    return (
      <Layout className="SearchModule">
        <Row justify="center" style={{ margin: "1rem" }}>
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
            <>
              <div
                className="SearchModule-table"
                style={{ padding: "1rem", overflow: "scroll" }}
              >
                <Table
                  style={{ overflow: "scroll" }}
                  pagination={false}
                  className="table"
                  columns={this.state.columns}
                  dataSource={this.state.parcelList}
                  onSelect={(record) => this.onSelect(record)}
                />
              </div>
              {this.state.parcelList.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Pagination
                    onChange={(page) => {
                      this.setState({ page });
                    }}
                    defaultCurrent={this.state.page}
                    total={this.state.totalRecords}
                  />
                </div>
              )}
            </>
          )}
        </Content>
      </Layout>
    );
  }
}

export default SearchModule;
