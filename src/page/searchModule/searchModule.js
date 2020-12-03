import React from "react";
import "./searchModule.scss";
import moment from "moment";
import { config } from "../../config";
import ManifestService from "../../service/Manifest";
import Transaction from "../../service/Transaction";
import Parcel from "../../service/Parcel";
import { PromptModal } from '../../component/modal';
import {
  openNotificationWithIcon,
  debounce,
  UserProfile,
  alterPath,
  modifyName,
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
  Menu,
  Dropdown
} from "antd";
import User from "../../service/User";
import TransactionService from '../../service/VoidTransaction'

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
      page: 1,
      totalRecords: 0,
      columns: [],
      limit: 10,
      visibleVoid: false,
      remarks: ""
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
          sorter: (a, b) => a.travelStatus - b.travelStatus,
          render: (text)=> (config.parcelStatus[text].toUpperCase())
        },
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button disabled={!Boolean(record.travelStatus === 1)} type="danger" size="small" style={{fontSize: '0.65rem'}} onClick={() => {
                  this.setState({selectedRecord: record, visibleVoid:true})
                }}>
                  Void
              </Button>
            </div>
          ),
        },
      ],
    });
  }

  handleVoid = () => {
    let record = this.state.selectedRecord;
    let remarks = this.state.remarks;

    console.info('handleVoid',record)

    if (remarks) {
      TransactionService.voidParcel(record._id, remarks)
      .then(e=>{
        const {errorCode} = e.data;
        if (errorCode) {
          this.handleErrorNotification(errorCode);
          return;
        }
        this.setState({selectedRecord: undefined, remarks: "", visibleVoid:false });
        this.fetchParcelList();
      })
    }
  };

  handleCancel = () => {
    this.setState({
      selectedRecord: null,
      visibleVoid:false
    });
  };

  doSearch = (el) => {
    const toSearch = el.toLowerCase();
    this.setState({ page:1, searchValue: toSearch, fetching: true }, () =>
      this.fetchParcelList()
    );
  };

  fetchParcelList = (onSearch) => {
    const page = this.state.page - 1;
    Parcel.parcelPagination(page, this.state.limit, this.state.searchValue).then((e) => {
      const { data, errorCode } = e.data;
      if (errorCode) {
        this.handleErrorNotification(errorCode);
        return;
      }

      const parcelList = data.list.map((e, i) => {
        return {
          key: i,
          sentDate: moment(e.sentDate).format("MMM DD YYYY"),
          qrcode: e.scanCode,
          billOfLading: e.billOfLading,
          description: e.packageInfo.packageName,
          sender: modifyName(e.senderInfo.senderName),
          receiver: modifyName(e.recipientInfo.recipientName),
          qty: e.packageInfo.quantity,
          travelStatus: e.status,
          packageImg: e.packageInfo.packageImages,
          tripId: e.tripId,
          _id: e._id
        };
      });
      this.setState({ parcelList, fetching: false, totalRecords: data.pagination.totalRecords });
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
        <Row justify="center">
          <div style={{marginTop:'1rem', marginBottom:"1rem"}}>
            <Search
              value={this.state.searchValue}
              className="manifest-details-search-box"
              placeholder="Sender | Receiver | QR Code | Bill of Lading"
              onChange={(e) => this.doSearch(e.target.value)}
            />
          </div>
        </Row>
        <Content>
          {this.state.fetching ? (
            <Skeleton active />
          ) : (
            <>
              <div
                className="SearchModule-table"
              >
                <Table
                  scroll={{x:true}}
                  pagination={false}
                  className="table"
                  columns={this.state.columns}
                  dataSource={this.state.parcelList}
                  onSelect={(record) => this.onSelect(record)}
                />
              </div>
              {this.state.parcelList.length > 0 && (
                <div className="pagination">
                  <Pagination
                    onChange={(page) => {
                      this.setState({page});
                      this.fetchParcelList();
                    }}
                    defaultCurrent={this.state.page}
                    total={this.state.totalRecords}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </Content>
        <PromptModal
          handleOk={() => this.handleVoid()}
          handleCancel={() => this.handleCancel()}
          visible={this.state.visibleVoid}
          title={<span class="title"> Are you sure you want to void this transcation? </span>}
          message="Transaction will NOT be voided immediately. Request will be sent to the bus administrator for approval."
          reason="Enter reason/s:"
          buttonType="danger"
          action="Send Request"
          disabled={!this.state.remarks}
          onRemarksChange={(e)=>this.setState({remarks:e.target.value})}/>
      </Layout>
    );
  }
}

export default SearchModule;
