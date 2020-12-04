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
import RoutesService from "../../service/Routes";

import moment from "moment-timezone";
import "./salesReport.scss";
import ReactToPrint from "react-to-print";
import { config } from "../../config";

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
      endDay: moment().format(dateFormat),
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
      page: 1,
      limit: 15,
      totalRecords: 0,
      originId: null,
      destinationId: null,
      startStationRoutes: [],
      endStationRoutes: [],
      startStationRoutesTemp: [],
      endStationRoutesTemp: [],
    };
    this.userProfileObject = UserProfile;
  }

  componentDidMount() {
    this.printEl = React.createRef();
    RoutesService.getAllRoutes().then((e) => {
      const { data, errorCode } = e.data;
      if (errorCode) {
        this.handleErrorNotification(errorCode);
        return;
      }
      let state = { allRoutes: data };
      let clean = [];

      if (
        Number(UserProfile.getRole()) === Number(config.role["staff-admin"])
      ) {
        const _startStationRoutes = data
          .map((e) => ({ stationId: e.start, stationName: e.startStationName }))
          .filter((e) => {
            if (!clean.includes(e.stationName)) {
              clean.push(e.stationName);
              return true;
            }
            return false;
          });
        const startStationRoutes = [
          ...[{ stationId: "null", stationName: "-- All --" }],
          ..._startStationRoutes,
        ];
        state.startStationRoutes = startStationRoutes;
        state.startStationRoutesTemp = startStationRoutes;
      } else {
        state.originId = UserProfile.getAssignedStationId();
        const endStationRoutes = this.getEndDestination(data, state.originId);
        state.endStationRoutesTemp = endStationRoutes;
        state.endStationRoutes = endStationRoutes;
      }
      this.setState(state, () => this.getParcel());
    });
  }

  onSelectAutoComplete = (name, value) => {
    let selected = [];

    switch (name) {
      case "origin":
        selected =
          this.state.startStationRoutes.find((e) => e.stationName === value) ||
          null;
        if (selected) {
          const isAllIn = selected.stationId === "null"; //all
          let state = {};
          state.page =1;
          state.originId = isAllIn ? null : selected.stationId;
          state.endStationRoutes = isAllIn
            ? []
            : this.getEndDestination(this.state.allRoutes, selected.stationId);
          state.endStationRoutesTemp = isAllIn ? [] : state.endStationRoutes;
          state.tags = isAllIn ? [] : [...this.state.tags];
          this.setState(state, () => this.getParcel());
        }
        break;
      case "destination":
        selected =
          this.state.endStationRoutes.find((e) => e.endStationName === value) ||
          null;
        if (selected) {
          let tags = [];
          if (selected.end !== "null") {
            tags = [...this.state.tags];
            let exist = tags.find((e) => e.end === selected.end);
            if (!exist) {
              tags.push({ end: selected.end, name: selected.endStationName });
            }
          }
          this.setState({ page:1, destinationId: tags.map((e) => e.end), tags }, () =>
            this.getParcel()
          );
        }
        break;
      default:
        break;
    }
  };

  getEndDestination = (data, stationId) => {
    if (!stationId) return;

    let clean = [];
    const destinations = data
      .filter((e) => e.start === stationId)
      .filter((e) => {
        if (!clean.includes(e.endStationName)) {
          clean.push(e.endStationName);
          return true;
        }
        return false;
      })
      .map((e) => ({ endStationName: e.endStationName, end: e.end }));
    return [...[{ end: "null", endStationName: "-- All --" }], ...destinations];
  };

  getParcel = () => {
    let startStationId =
      Number(UserProfile.getRole()) === Number(config.role["staff-admin"])
        ? this.state.originId
        : UserProfile.getAssignedStationId();

    ParcelService.getAllParcel(
      startStationId,
      moment(this.state.startDay).format("YYYY-MM-DD"),
      moment(this.state.endDay).format("YYYY-MM-DD"),
      this.state.destinationId,
      this.userProfileObject.getBusCompanyId(),
      this.state.page -1,
      this.state.limit
    )
    .then((e) => this.parseParcel(e))
    .catch(e=>{
      console.log('[sales report module] error: ',e);
      this.setState({fetching:false})
    })
  };

  parseParcel = (dataResult) => {
    const { data, pagination, totalPrice, errorCode } = dataResult.data;
    if (errorCode) {
      this.setState({ fetching: false });
      this.handleErrorNotification(errorCode);
      return;
    }

    console.log(' dataResult.data;', dataResult.data)

    const records = data.map((e, i) => {
      let _sentDate = e.sentDate.split('T')[0];
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
        sentDate:  moment(_sentDate).tz("Asia/Manila").format('MMM DD, YYYY'),
        status: e.status,
        recipientPhoneNo: e.recipientPhoneNo,
        senderPhoneNo: e.senderPhoneNo,
        remarks: e.remarks === "undefined" ? "" : e.remarks,
      };
    });
    const { totalRecords } = pagination;
    this.setState({
      totalRecords,
      fetching: false,
      data: records,
      totalAmount: totalPrice.toFixed(2),
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

  onChangeDatePicker = (date) => {
    const startDay = date[0];
    const endDay = date[1];

    if (startDay && endDay) {
      this.setState({ page:1, fetching: true, startDay, endDay }, () =>
        this.getParcel()
      );
    }
  };

  getPreparedBy = () => {
    return this.userProfileObject.getPersonFullName() || "";
  };

  getTotalAmount = () => {
    return this.state.totalAmount;
  };

  getDestination = () => {
    const tags = [...this.state.tags];
    const _tags = tags.map((e) => e.name);
    return (_tags.length > 0 && _tags.join(", ")) || "All";
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
    const isP2P = this.props.isP2P || false;
    const endStation = this.state.tags

    let originId = this.state.originId;
    const isAdmin =
      Number(UserProfile.getRole()) === Number(config.role["staff-admin"]);
    if (!isAdmin) {
      originId = this.userProfileObject.getAssignedStationId();
    }

    return ParcelService.exportCargoParcel(
      this.props.title || "SUMMARY OF CARGO SALES",
      moment(this.state.startDay).format("YYYY-MM-DD"),
      moment(this.state.endDay).format("YYYY-MM-DD"),
      originId,
      this.state.tags.map((e) => e.end),
      this.userProfileObject.getPersonFullName(),
      this.state.totalAmount,
      this.getDestination(),
      isP2P,
      this.userProfileObject.getBusCompanyId()
    );
  };

  doSearch = (name, el) => {
    const toSearch = el.toLowerCase();
    switch (name) {
      case "origin":
        let startStationRoutesTemp = this.state.startStationRoutes
          .map((e) => ({ stationName: e.stationName }))
          .filter((e) => e.stationName.toLowerCase().includes(toSearch));
        this.setState({ startStationRoutesTemp });
        break;
      case "destination":
        let endStationRoutesTemp = this.state.endStationRoutes
          .map((e) => ({ endStationName: e.endStationName }))
          .filter((e) => e.endStationName.toLowerCase().includes(toSearch));
        this.setState({ endStationRoutesTemp });
        break;
      default:
        break;
    }
  };

  onPageChange = (page) => {
    if(page !== this.state.page)
      this.setState({ page, fetching: true }, () =>
        this.getParcel()
    );
  };

  onRemoveTag = (e,val) =>{
    e.preventDefault();
    let tags = [...this.state.tags];
    const _tags = tags.filter((e) => e.end !== val.end);
    this.setState({ page:1, tags: _tags, destinationId: _tags.map((e) => e.end) },()=>this.getParcel());
  }

  render() {
    const isAdmin =
      Number(UserProfile.getRole()) === Number(config.role["staff-admin"]);

    return (
      <Layout>
        <Content style={{ padding: "1rem" }}>
          <Row style={{ marginBottom: ".5rem" }}>
            <Col span={12}>
              <div style={{ display: "flex", height: "500%" }}>
                <div>
                  {this.state.tags.map((e, i) => (
                    <Tag
                      key={e.end}
                      closable
                      color="cyan"
                      onClose={(c) => this.onRemoveTag(c, e)}>
                      {" "}
                      {e.name}
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
              {isAdmin && (
                <Col span={6}>
                  <AutoComplete
                    size="large"
                    style={{ width: "100%" }}
                    onSelect={(item) =>
                      this.onSelectAutoComplete("origin", item)
                    }
                    onSearch={(e) => this.doSearch("origin", e)}
                    placeholder="Origin Stations"
                  >
                    {this.state.startStationRoutesTemp.map((e, i) => (
                      <Option value={e.stationName}>{e.stationName}</Option>
                    ))}
                  </AutoComplete>
                </Col>
              )}

              <Col span={6}>
                <AutoComplete
                  size="large"
                  style={{ width: "100%", marginLeft: "0.5rem" }}
                  onChange={(item) =>
                    this.onSelectAutoComplete("destination", item)
                  }
                  onSearch={(e) => this.doSearch("destination", e)}
                  placeholder="Destination"
                >
                  {this.state.endStationRoutesTemp.map((e, i) => (
                    <Option value={e.endStationName}>{e.endStationName}</Option>
                  ))}
                </AutoComplete>
              </Col>

              <Col offset={isAdmin ? 0 : 6} span={12}>
                {" "}
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
                <div>
                  <Table
                    scroll={{ x: true }}
                    rowKey={(e) => e.key}
                    pagination={false}
                    columns={this.props.source}
                    dataSource={this.state.data}
                  />
                </div>
                {this.state.data.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <Pagination
                      onChange={(page) => this.onPageChange(page)}
                      defaultCurrent={this.state.page}
                      total={this.state.totalRecords}
                      showSizeChanger={false}
                    />
                  </div>
                )}
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
