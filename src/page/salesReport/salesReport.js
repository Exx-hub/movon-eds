import React from "react";
import {
  Table,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Space,
  notification,
  Skeleton,
  Layout,
  Tag,
  AutoComplete,
  Pagination,
} from "antd";
import { PrinterOutlined } from "@ant-design/icons";

import {
  openNotificationWithIcon,
  alterPath,
  UserProfile,
} from "../../utility";

import ParcelService from "../../service/Parcel";
import ManifestService from "../../service/Manifest";

import moment from "moment";
import "./salesReport.scss";
import ReactToPrint from "react-to-print";

const dateFormat = "MMM DD, YYYY";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

class SalesReport extends React.Component {
  constructor() {
    super();
    this.state = {
      fetching: false,
      exporting: false,
      transactions: null,
      summary: {},
      endDay: moment().add(1, "d").format(dateFormat),
      startDay: moment().format(dateFormat),
      destination: {
        options: [],
        value: undefined,
        name: "",
        data: undefined,
      },
      assignedStation: undefined,
      data: [],
      isPrinting: false,
      totalAmount: 0,
      tags: [],
      templist: [],
      templistValue: undefined,
      page: 0,
      totalRecords: 0,
    };
    this.userProfileObject = UserProfile();
  }

  componentDidMount() {
    this.printEl = React.createRef();
    Promise.all([ManifestService.getRoutes(), this.getParcel()]).then(
      (resonses) => {
        if (resonses[0]) {
          const { data, errorCode } = resonses[0].data;

          if (errorCode) {
            this.handleErrorNotification(errorCode);
            return;
          }

          if (data) {
            const options = data.map((e, i) => {
              return {
                key: i,
                data: e,
                value: i,
                name: e.endStationName,
              };
            });
            let destination = { ...this.state.destination };
            destination.options = options;
            destination.value = 0;
            destination.data = options[0].data;
            this.setState({
              destination,
              templist: options.map((e) => e.name),
            });
          }
        }
        if (resonses[1]) {
          const { data, success, errorCode } = resonses[1].data;
          if (errorCode) {
            this.handleErrorNotification(errorCode);
            return;
          }
          this.parseParcel(data);
        }
      }
    );
  }

  getParcel = () => {
    const startStation = this.user;
    const dateFrom = new Date(this.state.startDay);
    const dateTo = new Date(this.state.endDay);
    const endStation = this.state.destination.options
      .filter((e) => this.state.tags.includes(e.name))
      .map((e) => e.data.end);
    console.log("endStation", endStation);

    const busCompanyId = this.userProfileObject.getBusCompanyId();

    return ParcelService.getAllParcel(
      {
        startStation,
        dateFrom,
        dateTo,
        endStation,
      },
      busCompanyId
    );
  };

  parseParcel = (dataResult) => {
    try {
      const { parcels, errorCode, success } = dataResult.data;
      if (success && success === false) {
        this.handleErrorNotification(errorCode);
        return;
      }

      if (dataResult.status === 200) {
        let amout = 0;
        const data = parcels.map((e, i) => {
          amout += Number(e.price);
          return {
            key: i,
            associatedAmount: e.associatedAmount,
            associatedCompanyId: e.associatedCompanyId,
            associatedDestination: e.associatedDestination,
            associatedOrigin: e.associatedOrigin,
            associatedTariffRate: e.associatedTariffRate,
            billOfLading: e.billOfLading,
            declaredValue: e.declaredValue,
            destination: e.destination,
            origin: e.origin,
            packageName: e.packageName,
            packageWeight: e.packageWeight,
            price: e.price,
            quantity: e.quantity,
            recipient: e.recipient,
            scanCode: e.scanCode,
            sender: e.sender,
            sentDate: e.sentDate,
            status: e.status,
            recipientPhoneNo: e.recipientPhoneNo,
            senderPhoneNo: e.senderPhoneNo,
            remarks: e.remarks === "undefined" ? "" : e.remarks,
          };
        });
        this.setState({ fetching: false, data, totalAmount: amout.toFixed(2) });
      }
    } catch (error) {}
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

  onChangeDatePicker = (date) => {
    const startDay = date[0];
    const endDay = date[1];

    if (startDay && endDay) {
      this.setState({ fetching: true, startDay, endDay }, () => {
        this.getParcel().then((e) => {
          this.parseParcel(e);
        });
      });
    }
  };

  getPreparedBy = () => {
    return (this.userProfileObject.getPersonFullName()) || "";
  };

  getTotalAmount = () => {
    return this.state.totalAmount;
  };

  getDestination = () => {
    return (this.state.tags.length > 0 && this.state.tags.join()) || "All";
  };

  getDate = () => {
    return this.state.startDay === this.state.endDay
      ? this.state.endDay
      : `${this.state.startDay} - ${this.state.endDay}`;
  };

  handleSelectChange = (e) => {
    let destination = { ...this.state.destination };
    this.setState({
      destination: {
        ...destination,
        ...{ value: e, data: destination.options[e].data },
      },
    });
  };

  downloadXls = () => {
    const startStation = this.userProfileObject.getAssignedStationId();
    const dateFrom = new Date(this.state.startDay);
    const dateTo = new Date(this.state.endDay);
    const endStation = this.state.destination.options
      .filter((e) => this.state.tags.includes(e.name))
      .map((e) => e.data.end);
    const busCompanyId = this.userProfileObject.getBusCompanyId();
    const fullName = this.userProfileObject.getPersonFullName();
    const totalAmount = this.state.totalAmount;
    const destination = this.getDestination();
    const isP2P = this.props.isP2P || false;
    const title = this.props.title || "SUMMARY OF CARGO SALES";
    const fileName = isP2P ? "VLI-BITSI-Summary.XLSX" : "Cargo.XLSX";

    return ParcelService.exportCargoParcel(
      {
        title,
        dateFrom,
        dateTo,
        startStation,
        endStation,
        fullName,
        totalAmount,
        destination,
        isP2P,
      },
      busCompanyId,
      fileName
    ).then();
  };

  doSearch = (el) => {
    let data = this.state.destination.options.map((e) => e.name);
    if (this.state.tags.length > 0) {
      data = data.filter((e, i) => !this.state.tags.includes(e));
    }
    const toSearch = el.toLowerCase();
    const templist = data
      .filter((e) => e.toLowerCase().includes(toSearch))
      .map((e) => e);
    this.setState({ templist, templistValue: el });
  };

  render() {
    return (
      <Layout>
        <Content style={{ padding: "1rem" }}>
          <Row style={{ marginBottom: ".5rem" }}>
            <Col span={12}>
              <div style={{ display: "flex", height: "500%" }}>
                <div>
                  {this.state.tags.map((e, i) => (
                    <Tag
                      key={e}
                      closable
                      onClose={(val) => {
                        let tags = [...this.state.tags];
                        const _tags = tags.filter((e) => tags[i] !== e);
                        this.setState({ tags: _tags });
                      }}
                    >
                      {" "}
                      {e}
                    </Tag>
                  ))}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span>Download: </span>
                <ReactToPrint
                  onBeforeGetContent={() => this.setState({ isPrinting: true })}
                  onAfterPrint={() => this.setState({ isPrinting: false })}
                  content={() => this.printEl.current}
                  trigger={() => {
                    return (
                      <Button>
                        <PrinterOutlined /> <span>PDF</span>{" "}
                      </Button>
                    );
                  }}
                />
                <Button onClick={() => this.downloadXls()}>XLS</Button>
              </div>
            </Col>
          </Row>

          <div>
            <Row>
              <Col span={12}>
                <AutoComplete
                  style={{ width: "50%" }}
                  onSelect={(item) => {
                    let templist = [...this.state.templist];
                    let destination = { ...this.state.destination };
                    let tags = [...this.state.tags];
                    let selected = destination.options.findIndex(
                      (e) => e.name === item
                    );
                    templist = templist.filter((e, i) => item !== e);
                    // if (selected) {
                    tags.push(destination.options[selected].name);
                    this.setState({ tags, templist }, () => {
                      this.getParcel().then((e) => {
                        this.parseParcel(e);
                      });
                    });
                    //   console.log("selected", selected);
                    // }
                  }}
                  onSearch={(e) => this.doSearch(e)}
                  value={this.state.templistValue}
                  placeholder="Destination"
                >
                  {this.state.templist.map((e) => (
                    <Option key={e}>{e}</Option>
                  ))}
                </AutoComplete>
              </Col>
              <Col span={12}>
                <RangePicker
                  size="large"
                  style={{ float: "right" }}
                  defaultValue={[
                    moment(this.state.startDay, dateFormat),
                    moment(this.state.endDay, dateFormat),
                  ]}
                  onChange={(date, date2) => this.onChangeDatePicker(date2)}
                />
              </Col>
            </Row>
          </div>

          <div style={{ marginTop: "1.2rem" }} ref={this.printEl}>
            <Header date={this.getDate()} title={this.props.title} />

            <div style={{ padding: "1rem" }}>
              <Row>
                <Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  ></div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  ></div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <span style={{ width: 80, textAlign: "left" }}>
                      Total Sales:{" "}
                    </span>
                    <span style={{ width: 200, textAlign: "left" }}>
                      {this.getTotalAmount()}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <span style={{ width: 80 }}> Destination: </span>
                    <span>{this.getDestination()}</span>
                  </div>
                </Col>

                <Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <span style={{ width: 80 }}>Prepared: </span>
                    <span>{this.getPreparedBy()}</span>
                  </div>
                </Col>
              </Row>
            </div>

            {this.state.fetching ? (
              <Skeleton active />
            ) : (
              <>
                <div style={{ overflow: "scroll" }}>
                  <Table
                    rowKey={(e) => e.key}
                    pagination={false}
                    columns={this.props.source}
                    dataSource={this.state.data}
                  />
                </div>
                {
                  this.state.data.length > 0 && <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1rem",
                  }}
                >
                  <Pagination
                    onChange={(page) => {
                      this.setState({ page });
                    }}
                    defaultCurrent={this.state.page}
                    total={this.state.totalRecords}
                  />
                </div>
                }
                
              </>
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}

function Header(props) {
  return (
    <div
      style={{
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h3>{props.title}</h3>
      <Space>
        <span>{props.date}</span>
      </Space>
    </div>
  );
}

export default SalesReport;
