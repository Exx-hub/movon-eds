import React from "react";
import "./searchModule.scss";
import moment from "moment-timezone";
import { config } from "../../config";
import Parcel from "../../service/Parcel";
import { PromptModal } from '../../component/modal';
import {DefaultMatrixModal} from '../../component/modal'
import {
  openNotificationWithIcon,
  debounce,
  UserProfile,
  alterPath,
  modifyName,
} from "../../utility";
import { notification, Space, Table } from "antd";
import {Layout,Button,Row,Input,Skeleton,
  Pagination
} from "antd";
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
      columns: [],
      visibleVoid: false,
      remarks: "",
      page: 1,
      totalRecords: 0,
      limit: 10,
      checkInModal:{
        visible:true,
        data:undefined
      }
    };
    this.printEl = React.createRef();
    this.fetchParcelList = debounce(this.fetchParcelList, 1000);
    this.userProfileObject = UserProfile;
  }

  componentDidMount() {
    //this.fetchParcelList();
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
          title: "Origin",
          dataIndex: "startStationName",
          key: "startStationName",
        },
        {
          title: "Destination",
          dataIndex: "endStationName",
          key: "endStationName"
        },
        {
          title: "Sender",
          dataIndex: "sender",
          key: "sender"
        },
        {
          title: "Receiver",
          dataIndex: "receiver",
          key: "receiver"
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
            <div style={{ display: "flex", flexDirection: "row", justifyContent:'space-around'}}>
              <Button disabled={!Boolean(record.travelStatus === 1)} type="danger" size="small" style={{fontSize: '0.65rem'}} onClick={() => {
                  this.setState({remarks:"", selectedRecord: record, visibleVoid:true})
                }}>
                  Void
              </Button>
              <Button disabled={!Boolean(record.travelStatus === 1)} size="small" style={{fontSize: '0.65rem', background:`${record.travelStatus === 1 ? 'teal' : ""}`, color:`${record.travelStatus === 1 ? 'white' : ""}`}} onClick={() => {
                  this.setState({remarks:"", selectedRecord: record, visibleVoid:true})
                }}>
                  Check-In
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

    if (remarks) {
      TransactionService.voidParcel(record._id, remarks)
      .then(e=>{
        console.log("handleVoid e",e)
        const {errorCode} = e.data;
        if (errorCode) {
          this.handleErrorNotification(errorCode);
          return;
        }
        this.setState({page:1, selectedRecord: undefined, remarks: "", visibleVoid:false },
          ()=>this.fetchParcelList());
        ;
      })
    }
  };

  handleCancel = () => {
    this.setState({
      selectedRecord: null,
      visibleVoid:false,
      remarks:""
    });
  };

  doSearch = (el) => {
    console.info('doSearch',el)
    const toSearch = el.toLowerCase();
    this.setState({ page:1, searchValue: toSearch, fetching: true }, () =>
      this.fetchParcelList()
    );
  };

  fetchParcelList = () => {
    Parcel.parcelPagination(this.state.page - 1, this.state.limit, this.state.searchValue)
    .then((e) => {
      console.info('fetchParcelList',e)
      const { data, errorCode } = e.data;
      if (errorCode) {
        this.setState({fetching:false})
        this.handleErrorNotification(errorCode);
        return;
      }
      const parcelList = data.list.map((e, i) => {
        return {
          key: i,
          sentDate: moment.tz(e.createdAt,"Asia/Manila").format("MMM DD, YYYY"),
          qrcode: e.scanCode,
          billOfLading: e.billOfLading,
          description: e.packageInfo.packageName,
          sender: modifyName(e.senderInfo.senderName),
          receiver: modifyName(e.recipientInfo.recipientName),
          qty: e.packageInfo.quantity,
          travelStatus: e.status,
          packageImg: e.packageInfo.packageImages,
          tripId: e.tripId,
          startStationName: e.trips.startStation.name,
          endStationName: e.trips.endStation.name,
          _id: e._id
        };
      });
      this.setState({ fetching:false, parcelList, totalRecords: data.pagination.totalRecords });
    })
    .catch(e=>{
      console.log('[search module] error: ',e);
      this.setState({fetching:false})
    })
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

  onPageChange = (page) =>{
    if(page !== this.state.page)
      this.setState({page, fetching:true},
        ()=>this.fetchParcelList());
  }

  onNegativeCheckIn = () =>{
    const checkInModal = {...this.state.checkInModal}
    checkInModal.visible = false;
    this.setState({checkInModal})
  }

  onPositiveCheckIn = ()=>{

  }

  render() {
    return (
      <Layout className="SearchModule">
        <Row justify="center">
          <div style={{marginTop:'1rem', marginBottom:"1rem"}}>
            <Search
              className="manifest-details-search-box"
              placeholder="Sender | Receiver | QR Code | Bill of Lading"
              onSearch={(e) => this.doSearch(e)}
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
                    defaultCurrent={this.state.page}
                    onChange={(page) => this.onPageChange(page)}
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
          remarks={this.state.remarks}
          disabled={!this.state.remarks}
          onRemarksChange={(e)=>this.setState({remarks:e.target.value})}/>

          <DefaultMatrixModal 
            visible={this.state.checkInModal.visible} 
            title="Check In" 
            width={500}
            onNegativeEvent={()=>this.onNegativeCheckIn()}
            onPositiveEvent={()=>this.onPositiveCheckIn()}
            >
            <Space direction="vertical">
              <span>Are you sure you want to check-in the parcel?</span>
            </Space>
          </DefaultMatrixModal>
      </Layout>
    );
  }
}

export default SearchModule;
