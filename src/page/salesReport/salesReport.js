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
  Descriptions,
  Layout,
  Divider,
} from "antd";
import { PrinterOutlined } from "@ant-design/icons";

import {
  openNotificationWithIcon,
  openNotificationWithDuration,
  getUser,
  clearCredential,
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
  state = {
    fetching: false,
    exporting: false,
    transactions: null,
    summary: {},
    user: getUser(),
    endDay: moment().format(dateFormat),
    startDay: moment().subtract(1, "d").format(dateFormat),
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
  };

  componentDidMount() {
    this.printEl = React.createRef();
    console.log('user',this.state.user)

    Promise.all([ManifestService.getRoutes(), this.getParcel()]).then(
      (resonses) => {
        console.log("resonses", resonses);
        if (resonses[0]) {
          const { data } = resonses[0].data;
          if (data) {
            const options = data.map((e, i) => {
              return {
                data: e,
                value: i,
                name: e.name,
              };
            });
            let destination = { ...this.state.destination };
            destination.options = options;
            destination.value = 0;
            destination.data = options[0].data;
            this.setState({ destination });
          }
        }
        if (resonses[1]) {
          this.parseParcel(resonses[1].data);
        }
      }
    );
  }

  getParcel = () => {
    const startStation = this.state.user.assignedStation._id;
    const dateFrom = new Date(this.state.startDay);
    const dateTo = new Date(this.state.endDay);
    const endStation =
      (this.state.destination.data && this.state.destination.data.end) || null;
    const busCompanyId = this.state.user.busCompanyId._id;

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
      console.log("parseParcel", dataResult);
      const { parcels, errorCode } = dataResult.data;

      let amout = 0;
      const data = parcels.map((e) => {
        const {
          associatedAmount,
          associatedCompanyId,
          associatedDestination,
          associatedOrigin,
          associatedTariffRate,
          billOfLading,
          declaredValue,
          destination,
          origin,
          packageName,
          packageWeight,
          price,
          quantity,
          recipient,
          scanCode,
          sender,
          sentDate,
          status,
        } = e;
        amout += Number(e.price);
        return {
          associatedAmount,
          associatedCompanyId,
          associatedDestination,
          associatedOrigin,
          associatedTariffRate,
          billOfLading,
          declaredValue,
          destination,
          origin,
          packageName,
          packageWeight,
          price,
          quantity,
          recipient,
          scanCode,
          sender,
          sentDate,
          status,
        };
      });
      this.setState({ data, totalAmount: amout.toFixed(2) });
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
      clearCredential();
      this.props.history.push("/");
      return;
    }
    openNotificationWithIcon("error", code);
  };

  onChangeDatePicker = (date) => {
    const startDay = date[0];
    const endDay = date[1];

    if (startDay && endDay) {
      this.setState({ startDay, endDay }, () => {
        this.getParcel().then((e) => {
          console.log('e',e)
          this.parseParcel(e)
        });
      });
    }
  };

  getPreparedBy = () => {
    return this.state.user.personalInfo.fullName;
  };

  getTotalAmount = () => {
    return this.state.totalAmount;
  };

  getDestination = () => {
    return (
      (this.state.destination.data && this.state.destination.data.name) || ""
    );
  };

  handleSelectChange = (e) => {
    console.log("handleSelectChange", e);
    let destination = { ...this.state.destination };
    this.setState(
      {
        destination: {
          ...destination,
          ...{ value: e, data: destination.options[e].data },
        },
      },
      () => {
        console.log("destination", this.state.destination);
      }
    );
  };

  downloadXls = () =>{
    const startStation = this.state.user.assignedStation._id;
    const dateFrom = new Date(this.state.startDay);
    const dateTo = new Date(this.state.endDay);
    const endStation = (this.state.destination.data && this.state.destination.data.end) || null;
    const busCompanyId = this.state.user.busCompanyId._id;
    const fullName = this.state.user.personalInfo.fullName;
    const totalAmount = this.state.totalAmount;
    const destination = (this.state.destination.data && this.state.destination.data.name) || ""

    return ParcelService.exportCargoParcel({
      dateFrom,
      dateTo,
      startStation,
      endStation,
      fullName,
      totalAmount,
      destination
    },busCompanyId, "Cargo.XLSX").then(e=>console.log('parcel',e))
  }

  render() {
    return (
      <Layout>
        <Content style={{ padding: "1rem" }}>
          <Row justify="end" style={{ marginBottom: ".5rem" }}>
            <Space>
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
              <Button onClick={()=>this.downloadXls()}>XLS</Button>
            </Space>
          </Row>

          <div>
            <Row>
              <Col span={12}>
                <Select
                  size="large"
                  value={this.state.destination.value}
                  style={{ width: "50%" }}
                  onChange={this.handleSelectChange}
                >
                  {this.state.destination.options.map((e) => (
                    <Option key={e.value} value={e.value}>
                      {e.name}
                    </Option>
                  ))}
                </Select>
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
            <Header
              startDay={this.state.startDay}
              endDay={this.state.endDay}
              title={this.props.title}
            />

            <div style={{ padding: "1rem" }}>
              <Row>
                <Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  ></div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
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
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ width: 100, textAlign: "left" }}>
                      Destination :{" "}
                    </span>
                    <span>{this.getDestination()}</span>
                  </div>
                </Col>

                <Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ width: 80, textAlign: "left" }}>
                      Prepared:
                    </span>
                    <span style={{ width: 200, textAlign: "left" }}>
                      {this.getPreparedBy()}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            <Table
              pagination={false}
              columns={this.props.source}
              dataSource={this.state.data}
            />
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
        <span>{props.startDay}</span> -<span>{props.endDay}</span>
      </Space>
    </div>
  );
}

export default SalesReport;
