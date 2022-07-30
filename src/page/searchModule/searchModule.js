import React from "react";
import "./searchModule.scss";
import moment from "moment-timezone";
import { config } from "../../config";
import Parcel from "../../service/Parcel";
import { PromptModal } from "../../component/modal";
import { DefaultMatrixModal } from "../../component/modal";
import {
  openNotificationWithIcon,
  debounce,
  UserProfile,
  alterPath,
  modifyName,
  openNotification,
} from "../../utility";
import { Layout, Button, Row, Input, Pagination, notification, Space, Table, Modal } from "antd";
import { FormOutlined } from "@ant-design/icons";
import TransactionService from "../../service/VoidTransaction";
import ManifestService from "../../service/Manifest";
import getTag from "../../component/statusTag";


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
      checkInModal: {
        visible: false,
        data: undefined,
      },
      arrivedModal: {
        visible: false,
        data: undefined,
      },
      updateBusNumberVisible: false, // update modal
      busNumberUpdate: "",
      billOfLadingToUpdate: ""
    };
    this.printEl = React.createRef();
    this.fetchParcelList = debounce(this.fetchParcelList, 1000);
    this.userProfileObject = UserProfile;
  }

  componentDidMount() {
    // SET THE TABLE HEADER AND DETAILS -----------------
    UserProfile.getBusCompanyTag() === 'isarog-liner' ? 
    // BITSI
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
          title: "Bus No.",
          dataIndex: "busNumber",
          key: "busNumber",
          render: (text, item) => (
            <>
              <span>{ item.busNumber === "undefined" ? "----" : item.busNumber}</span>{" "}
                 <FormOutlined
                   className="edit-busNumber-icon"
                   onClick={() =>
                     this.setState({
                       updateBusNumberVisible: true,
                       busNumberUpdate: item.busNumber === "undefined" ? undefined : item.busNumber,
                       billOfLadingToUpdate: item.billOfLading
                    })
                  }
              />
           </>
          ),
        },
        {
          title: "Origin",
          dataIndex: "startStationName",
          key: "startStationName",
        },
        {
          title: "Destination",
          dataIndex: "endStationName",
          key: "endStationName",
        },
        {
          title: "Sender",
          dataIndex: "sender",
          key: "sender",
        },
        {
          title: "Receiver",
          dataIndex: "receiver",
          key: "receiver",
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
          render: (text) => config.parcelStatus[text].toUpperCase(),
        },
        {
          title: "Action",
          key: "action",
          align: "center",
          render: (text, record) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Button
                disabled={!Boolean(record.travelStatus === 1)}
                type="danger"
                size="small"
                style={{ fontSize: "0.65rem" }}
                onClick={() => {
                  this.setState({
                    remarks: "",
                    selectedRecord: record,
                    visibleVoid: true,
                  });
                }}
              >
                Void
              </Button>

              {/* CHECK IN BUTTON visible if created only  */}
              {record.travelStatus === 1 && (
                <Button
                  disabled={record.cargoType === 2}
                  size="small"
                  style={{
                    fontSize: "0.65rem",
                    background: `${record.cargoType === 2 ? "" : "teal"}`,
                    color: `${record.cargoType === 2 ? "" : "white"}`,
                  }}
                  onClick={() => {
                    const checkInModal = { ...this.state.checkInModal };
                    checkInModal.visible = true;
                    checkInModal.data = record;
                    this.setState({ checkInModal });
                  }}
                >
                  Check-In
                </Button>
              )}

              {/* ARRIVED BUTTON visible only if in transit  */}
              {/* if travelStatus if 2 or in transit, arrived button will appear. if cargotype is accompanied, button will be disabled  */}
              {/* and color and bg color will be gray. if cargoType is cargo, button will be colored and enabled. same with check in button  */}
              {record.travelStatus === 2 && (
                <Button
                  disabled={record.cargoType === 2}
                  size="small"
                  style={{
                    fontSize: "0.65rem",
                    background: `${record.cargoType === 2 ? "" : "teal"}`,
                    color: `${record.cargoType === 2 ? "" : "white"}`,
                  }}
                  onClick={() => {
                    const arrivedModal = { ...this.state.arrivedModal };
                    arrivedModal.visible = true;
                    arrivedModal.data = record;
                    this.setState({ arrivedModal });
                  }}
                >
                  Arrived
                </Button>
              )}
            </div>
          ),
        },
      ],
    })
    :
    // DLTB
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
          title: "Bus No.",
          dataIndex: "busNumber",
          key: "busNumber",
          render: (text, item) => (
            <>
             <span>{ item.busNumber === "undefined" ? "----" : item.busNumber}</span>{" "}
                  <FormOutlined
                    className="edit-busNumber-icon"
                    onClick={() =>
                      this.setState({
                        updateBusNumberVisible: true,
                        busNumberUpdate: item.busNumber === "undefined" ? undefined : item.busNumber,
                        billOfLadingToUpdate: item.billOfLading
                      })
                    }
                  />
            </>
          ),
        },
        {
          title: "Origin",
          dataIndex: "startStationName",
          key: "startStationName",
        },
        {
          title: "Destination",
          dataIndex: "endStationName",
          key: "endStationName",
        },
        {
          title: "Sender",
          dataIndex: "sender",
          key: "sender",
        },
        {
          title: "Receiver",
          dataIndex: "receiver",
          key: "receiver",
        },
        {
          title: "Pack. Count",
          dataIndex: "qty",
          key: "qty",
          // width: 150,
          align: 'center',
          sorter: (a, b) => a.qty - b.qty,
        },
        {
          title: "Parcel Status",
          dataIndex: "travelStatus",
          key: "travelStatus",
          sorter: (a, b) => a.travelStatus - b.travelStatus,
          render: (text) => config.parcelStatus[text].toUpperCase(),
        },
        {
          title: "Cargo Type",
          dataIndex: "cargoType",
          key: "cargoType",
          render: (text) => text === 2 ? "accompanied" : "cargo",
        },
        {
          title: "Action",
          key: "action",
          align: "center",
          render: (text, record) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Button
                disabled={!Boolean(record.travelStatus === 1)}
                type="danger"
                size="small"
                style={{ fontSize: "0.65rem" }}
                onClick={() => {
                  this.setState({
                    remarks: "",
                    selectedRecord: record,
                    visibleVoid: true,
                  });
                }}
              >
                Void
              </Button>

              {record.travelStatus === 1 && (
                <Button
                  disabled={record.cargoType === 2}
                  size="small"
                  style={{
                    fontSize: "0.65rem",
                    background: `${record.cargoType === 2 ? "" : "teal"}`,
                    color: `${record.cargoType === 2 ? "" : "white"}`,
                  }}
                  onClick={() => {
                    const checkInModal = { ...this.state.checkInModal };
                    checkInModal.visible = true;
                    checkInModal.data = record;
                    this.setState({ checkInModal });
                  }}
                >
                  Check-In
                </Button>
              )}

              {record.travelStatus === 2 && (
                <Button
                  disabled={record.cargoType === 2}
                  size="small"
                  style={{
                    fontSize: "0.65rem",
                    background: `${record.cargoType === 2 ? "" : "teal"}`,
                    color: `${record.cargoType === 2 ? "" : "white"}`,
                  }}
                  onClick={() => {
                    const arrivedModal = { ...this.state.arrivedModal };
                    arrivedModal.visible = true;
                    arrivedModal.data = record;
                    this.setState({ arrivedModal });
                  }}
                >
                  Arrived
                </Button>
              )}
            </div>
          ),
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          align: "center",
          render: (text) => getTag(text),
        },
      ],
    });
  }

  handleVoid = () => {
    let record = this.state.selectedRecord;
    let remarks = this.state.remarks;

    if (remarks) {
      TransactionService.voidParcel(
        record.billOfLading,
        record._id,
        remarks
      ).then((e) => {
        const { errorCode } = e.data;
        if (errorCode) {
          this.handleErrorNotification(errorCode);
          return;
        }
        this.setState(
          {
            page: 1,
            selectedRecord: undefined,
            remarks: "",
            visibleVoid: false,
          },
          () => this.fetchParcelList()
        );
      });
    }
  };

  handleCancel = () => {
    this.setState({
      selectedRecord: null,
      visibleVoid: false,
      remarks: "",
    });
  };

  doSearch = (el) => {
    const toSearch = el.toLowerCase();
    this.setState({ page: 1, searchValue: toSearch, fetching: true }, () =>
      this.fetchParcelList()
    );
  };

  // this is where it gets the parcel transactions..
  fetchParcelList = () => {
    Parcel.parcelPagination(
      this.state.page - 1,
      this.state.limit,
      this.state.searchValue
    )
      .then((e) => {
        const { data, errorCode } = e.data;
        if (errorCode) {
          this.setState({ fetching: false });
          this.handleErrorNotification(errorCode);
          return;
        }
        const parcelList = data.list.map((e, i) => {
          console.log("RECORD HERE:",e)
          console.log("CARGOTYPE:", e.cargoType)
          return {
            key: i,
            sentDate: moment
              .tz(e.createdAt, "Asia/Manila")
              .format("MMM DD, YYYY"),
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
            _id: e._id,
            cargoType: e.cargoType,
            status: e.cargoType === 2 ? "accompanied" : config.parcelStatus[e.status],
            busNumber: e.busNumber
          };
        });
        this.setState({
          fetching: false,
          parcelList,
          totalRecords: data.pagination.totalRecords,
        });
      })
      .catch((e) => {
        this.setState({ fetching: false });
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
      this.userProfileObject.clearData();
      this.props.history.push(alterPath("/"));
      return;
    }
    openNotificationWithIcon("error", code);
  };

  onPageChange = (page) => {
    if (page !== this.state.page)
      this.setState({ page, fetching: true }, () => this.fetchParcelList());
  };

  onNegativeCheckIn = () => {
    const checkInModal = { ...this.state.checkInModal };
    checkInModal.visible = false;
    checkInModal.data = undefined;
    this.setState({ checkInModal });
  };

  onPositiveCheckIn = () => {
    const data = this.state.checkInModal.data;
    const parcelId = data._id;
    ManifestService.checkInByParcel(parcelId).then((e) => {
      const { data } = e.data;
      let parcelList = [...this.state.parcelList];
      if (data) {
        let index = parcelList.findIndex((e) => e._id === data._id);
        if (index > -1) {
          parcelList[index] = {
            ...parcelList[index],
            ...{ travelStatus: data.status },
          };
        }
      }

      const checkInModal = { ...this.state.checkInModal };
      checkInModal.visible = false;
      checkInModal.data = undefined;
      this.setState({
        parcelList,
        checkInModal,
      });
    });
  };

  //Arrived
  onNegativeArrived = () => {
    const arrivedModal = { ...this.state.arrivedModal };
    arrivedModal.visible = false;
    arrivedModal.data = undefined;
    this.setState({ arrivedModal });
  };

  onPositiveArrived = () => {
    const data = this.state.arrivedModal.data;
    const parcelId = data._id;
    ManifestService.arrivedByParcel(parcelId).then((e) => {
      const { data } = e.data;
      let parcelList = [...this.state.parcelList];
      if (data) {
        let index = parcelList.findIndex((e) => e._id === data._id);
        if (index > -1) {
          parcelList[index] = {
            ...parcelList[index],
            ...{ travelStatus: data.status },
          };
        }
      }

      const arrivedModal = { ...this.state.arrivedModal };
      arrivedModal.visible = false;
      arrivedModal.data = undefined;
      this.setState({
        parcelList,
        arrivedModal,
      });
      this.fetchParcelList();
    });
  };

  // update bus number function
  onEditConfirm = () => {
    const billOfLading = this.state.billOfLadingToUpdate
    const busNumber = this.state.busNumberUpdate
    // add update bus number api here

    if(busNumber && billOfLading){

      Parcel.updateBusNumber(billOfLading,busNumber).then(e => {
        const {success,data,errorCode} = e.data;
        console.log(e.data)
        
        if(!success || errorCode || data === "update failed"){
         notification.error({
          message: "Error",
          description: "Something went wrong."
         }) 

         return;
        }
        
        if(success){
         notification.success({
          message: "Success",
          description: "Bus Number Updated."
         })
        }
        
      })
      
      
      this.setState({ busNumberUpdate: "", updateBusNumberVisible: false });
      this.fetchParcelList();
    }
  };

  render() {
    return (
      <Layout className="SearchModule">
        <Row justify="center">
          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <Search
              className="manifest-details-search-box"
              placeholder="Sender | Receiver | QR Code | Bill of Lading"
              onSearch={(e) => this.doSearch(e)}
            />
          </div>
        </Row>
        <Content>
          <>
            <div className="SearchModule-table">
              <Table
                loading={this.state.fetching}
                scroll={{ x: true }}
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
        </Content>
        <PromptModal
          handleOk={() => this.handleVoid()}
          handleCancel={() => this.handleCancel()}
          visible={this.state.visibleVoid}
          title="Are you sure you want to void this transaction?"
          message="Transaction will NOT be voided immediately. Request will be sent to the bus administrator for approval."
          reason="Enter reason/s:"
          buttonType="danger"
          action="Send Request"
          remarks={this.state.remarks}
          disabled={!this.state.remarks}
          onRemarksChange={(e) => this.setState({ remarks: e.target.value })}
        />

        <DefaultMatrixModal
          onCancel={() => this.onNegativeCheckIn()}
          visible={this.state.checkInModal.visible}
          title="Parcel Check In"
          width={500}
          onNegativeEvent={() => this.onNegativeCheckIn()}
          onPositiveEvent={() => this.onPositiveCheckIn()}
        >
          <Space direction="vertical">
            {this.state.checkInModal.data && (
              <p style={{ fontSize: "16px", fontStyle: "italic" }}>
                Are you sure you would like to check-in this parcel with bill of
                lading no.
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  &nbsp;{this.state.checkInModal.data.billOfLading}
                </span>
                ?
              </p>
            )}
          </Space>
        </DefaultMatrixModal>
        <DefaultMatrixModal
          onCancel={() => this.onNegativeArrived()}
          visible={this.state.arrivedModal.visible}
          title="Parcel Arrived"
          width={500}
          onNegativeEvent={() => this.onNegativeArrived()}
          onPositiveEvent={() => this.onPositiveArrived()}
        >
          <Space direction="vertical">
            {this.state.arrivedModal.data && (
              <p style={{ fontSize: "16px", fontStyle: "italic" }}>
                Press OK to change the status to received
              </p>
            )}
          </Space>
        </DefaultMatrixModal>

        <Modal
          closable={true}
          onOk={this.onEditConfirm}
          onCancel={() => this.setState({ updateBusNumberVisible: false })}
          destroyOnClose={true}
          width={400}
          title={"Update Bus Number"}
          visible={this.state.updateBusNumberVisible}
        >
          <Input
            value={this.state.busNumberUpdate}
            onChange={(e) => this.setState({ busNumberUpdate: e.target.value })}
          />
        </Modal>
      </Layout>
    );
  }
}

export default SearchModule;
