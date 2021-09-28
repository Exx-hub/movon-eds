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
  Menu,
  Dropdown,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  openNotificationWithIcon,
  alterPath,
  UserProfile,
} from "../../utility";
import ParcelService from "../../service/Parcel";
import RoutesService from "../../service/Routes";
import moment from "moment-timezone";
import "./salesReport.scss";
import { config } from "../../config";
import { FilePdfOutlined, ProfileOutlined } from "@ant-design/icons";

const dateFormat = "MMM DD, YYYY hh:mm";
const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;


const getTag = (props) => {
  let color = "";
  let caption = ""
  switch(props) {
    case "created":
      color = "success"
      caption= "Active"
      break;
    case "in-transit":
      color = "success"
      caption= "Active"
      break;
    case "received":
      color = "default"
      caption= "Closed"
      break;
    case "void": 
      color = "default";
      caption= "Closed"
      break;
      case "modified": 
      color = "default";
      caption= "Closed"
      break;
      case "accompanied": 
      color = "default";
      caption= "Closed"
      break;  
    default:
        break
  }
  return <Tag color={color} >{caption}</Tag>
}

// Data table for daily sales report table CARGO Sales//
const tableSourceDLTB = [
  {
    title: "BL NO.",
    dataIndex: "billOfLading",
    key: "billOfLading",
    fixed: "left",
    align: "center",
  },
  {
    title: "DATE",
    dataIndex: "sentDate",
    key: "sentDate",
    align: "center",
  },
  {
    title: "ORIGIN",
    dataIndex: "origin",
    key: "origin",
    align: "center",
  },
  {
    title: "DESTINATION",
    dataIndex: "destination",
    key: "destination",
    align: "center",
  },
  {
    title: "SENDER",
    dataIndex: "sender",
    key: "sender",
    align: "center",
  },
  {
    title: "SENDER PHONE#.",
    dataIndex: "senderPhoneNo",
    key: "senderPhoneNo",
    align: "center",
  },
  {
    title: "RECEIVER",
    dataIndex: "recipient",
    key: "recipient",
    align: "center",
  },
  {
    title: "RECEIVER PHONE#",
    dataIndex: "recipientPhoneNo",
    key: "recipientPhoneNo,",
    align: "center",
  },
  {
    title: "WEIGHT",
    dataIndex: "packageWeight",
    key: "packageWeight",
    align: "center",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "packageName",
    key: "packageName",
    align: "center",
  },
  {
    title: "PARCEL STATUS",
    dataIndex: "status",
    key: "status",
    align: "center",
  },
  {
    title: "REMARKS",
    dataIndex: "remarks",
    key: "remarks",
    align: "center",
  },
  {
    title: "DECLARED VALUE",
    dataIndex: "declaredValue",
    key: "declaredValue",
    align: "center",
  },
  {
    title: "SYSTEM FEE",
    dataIndex: "systemFee",
    key: "systemFee",
    align: "center",
  },
  {
    title: "AMOUNT",
    dataIndex: "price",
    key: "price",
    align: "center",
  },
  {
    title: "CASHIER",
    dataIndex: "cashier",
    key: "cashier",
    align: "center",
  },
  {
    title: "CHECKED-IN",
    dataIndex: "checkedIn",
    key: "checkedIn",
    align: "center",
  },
  {
    title: "ARRIVED",
    dataIndex: "arrived",
    key: "arrived",
    align: "center",
  },
  {
    title: "CARGO TYPE",
    dataIndex: "cargoType",
    key: "cargoType",
    align: "center",
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (text)=> getTag(text)
  },
];

const tableSourceStaffDLTB = [
  {
    title: "BL NO.",
    dataIndex: "billOfLading",
    key: "billOfLading",
    fixed: "left",
    align: "center",
  },
  {
    title: "DATE",
    dataIndex: "sentDate",
    key: "sentDate",
    align: "center",
  },
  {
    title: "ORIGIN",
    dataIndex: "origin",
    key: "origin",
    align: "center",
  },
  {
    title: "DESTINATION",
    dataIndex: "destination",
    key: "destination",
    align: "center",
  },
  {
    title: "SENDER",
    dataIndex: "sender",
    key: "sender",
    align: "center",
  },
  {
    title: "SENDER PHONE#.",
    dataIndex: "senderPhoneNo",
    key: "senderPhoneNo",
    align: "center",
  },
  {
    title: "RECEIVER",
    dataIndex: "recipient",
    key: "recipient",
    align: "center",
  },
  {
    title: "RECEIVER PHONE#",
    dataIndex: "recipientPhoneNo",
    key: "recipientPhoneNo,",
    align: "center",
  },
  {
    title: "WEIGHT",
    dataIndex: "packageWeight",
    key: "packageWeight",
    align: "center",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "packageName",
    key: "packageName",
    align: "center",
  },
  {
    title: "PARCEL STATUS",
    dataIndex: "status",
    key: "status",
    align: "center",
  },
  {
    title: "REMARKS",
    dataIndex: "remarks",
    key: "remarks",
    align: "center",
  },
  {
    title: "DECLARED VALUE",
    dataIndex: "declaredValue",
    key: "declaredValue",
    align: "center",
  },
  {
    title: "SYSTEM FEE",
    dataIndex: "systemFee",
    key: "systemFee",
    align: "center",
  },
  {
    title: "AMOUNT",
    dataIndex: "price",
    key: "price",
    align: "center",
  },
  {
    title: "CASHIER",
    dataIndex: "cashier",
    key: "cashier",
    align: "center",
  },
  {
    title: "CARGO TYPE",
    dataIndex: "cargoType",
    key: "cargoType",
    align: "center",
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (text)=> getTag(text)
  },
];

const tableSourceBitsi = [
  {
    title: "BL NO.",
    dataIndex: "billOfLading",
    key: "billOfLading",
    fixed: "left",
    align: "center",
  },
  {
    title: "DATE",
    dataIndex: "sentDate",
    key: "sentDate",
    align: "center",
  },
  {
    title: "ORIGIN",
    dataIndex: "origin",
    key: "origin",
    align: "center",
  },
  {
    title: "DESTINATION",
    dataIndex: "destination",
    key: "destination",
    align: "center",
  },
  {
    title: "SENDER",
    dataIndex: "sender",
    key: "sender",
    align: "center",
  },
  {
    title: "SENDER PHONE#.",
    dataIndex: "senderPhoneNo",
    key: "senderPhoneNo",
    align: "center",
  },
  {
    title: "RECEIVER",
    dataIndex: "recipient",
    key: "recipient",
    align: "center",
  },
  {
    title: "RECEIVER PHONE#",
    dataIndex: "recipientPhoneNo",
    key: "recipientPhoneNo,",
    align: "center",
  },
  {
    title: "WEIGHT",
    dataIndex: "packageWeight",
    key: "packageWeight",
    align: "center",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "packageName",
    key: "packageName",
    align: "center",
  },
  {
    title: "PARCEL STATUS",
    dataIndex: "status",
    key: "status",
    align: "center",
  },
  {
    title: "REMARKS",
    dataIndex: "remarks",
    key: "remarks",
    align: "center",
  },
  {
    title: "DECLARED VALUE",
    dataIndex: "declaredValue",
    key: "declaredValue",
    align: "center",
  },
  {
    title: "SYSTEM FEE",
    dataIndex: "systemFee",
    key: "systemFee",
    align: "center",
  },
  {
    title: "AMOUNT",
    dataIndex: "price",
    key: "price",
    align: "center",
  },
  {
    title: "CASHIER",
    dataIndex: "cashier",
    key: "cashier",
    align: "center",
  },
  {
    title: "CHECKED-IN",
    dataIndex: "checkedIn",
    key: "checkedIn",
    align: "center",
  },
  {
    title: "ARRIVED",
    dataIndex: "arrived",
    key: "arrived",
    align: "center",
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (text)=> getTag(text)
  },
];

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
      parcelStatusVisible: false,
      parcelStatusFilter: [],
      cargoTypeVisible: false,
      cargoTypeFilter: []
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

        console.log("GET PARCEL API CALLING...")
        console.log("STATUS FILTER TO BE PASSED:", this.state.parcelStatusFilter)
        console.log("CARGO TYPE FILTER TO BE PASSED:", this.state.cargoTypeFilter)

    ParcelService.getAllParcel(
      startStationId,
      moment(this.state.startDay).format("YYYY-MM-DD"),
      moment(this.state.endDay).format("YYYY-MM-DD"),
      this.state.destinationId,
      this.userProfileObject.getBusCompanyId(),
      this.state.page - 1,
      this.state.limit,
      this.state.parcelStatusFilter,
      this.state.cargoTypeFilter
    )
      .then((e) => {
        const { errorCode } = e.data;
        if (errorCode) {
          this.handleErrorNotification(errorCode);
          return;
        }
        this.parseParcel(e);
        console.log("SUCCESS CALLING API")
      })
      .catch((e) => {
        this.setState({ fetching: false });
      });
  };

  parseParcel = (dataResult) => {
    const { data, pagination, totalPrice, errorCode } = dataResult.data;
    if (errorCode) {
      this.setState({ fetching: false });
      this.handleErrorNotification(errorCode);
      return;
    }

    const records = data.map((e, i) => {
      console.log("RECORD:",e);
      return {
        key: i,
        associatedAmount: e.associatedAmount,
        associatedCompanyId: e.associatedCompanyId,
        associatedDestination: e.associatedDestination,
        associatedOrigin: e.associatedOrigin,
        associatedTariffRate: e.associatedTariffRate,
        billOfLading: e.billOfLading,
        declaredValue: `₱ ${Number(e.declaredValue || 0).toFixed(2)}`,
        destination: e.destination,
        origin: e.origin === "DLTB Cubao" ? "DLTB GMA" : e.origin,
        packageName: e.packageName,
        packageWeight: `${e.packageWeight} kg`,
        price: `₱ ${Number(e.price || 0).toFixed(2)}`,
        quantity: e.quantity,
        recipient: e.recipient,
        scanCode: e.scanCode,
        cashier: e.cashier,
        cargoType: e.cargoType === 2 ? "Accompanied" : "Cargo",
        arrived: e.arrivedDate ? moment
        .tz(e.arrivedDate, "Asia/Manila")
        .format("MMM DD, YYYY hh:mm:ss A") : "",  
        checkedIn: e.checkedInDate ? moment
        .tz(e.checkedInDate, "Asia/Manila")
        .format("MMM DD, YYYY hh:mm:ss A") : "", 
        sender: e.sender,
        sentDate: moment
          .tz(e.createdAt, "Asia/Manila")
          .format("MMM DD, YYYY hh:mm:ss A"),
        status: e.cargoType === 2 ? "accompanied" : config.parcelStatus[e.status],
        recipientPhoneNo: e.recipientPhoneNo,
        senderPhoneNo: e.senderPhoneNo,
        systemFee: `₱ ${Number(e.systemFee || 0).toFixed(2)}`,
        remarks: e.remarks
          ? e.remarks !== "undefined"
            ? e.remarks
            : "*******"
          : "*******",
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
      this.setState({ page: 1, fetching: true, startDay, endDay }, () =>
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

  showTextDetails = (caption, value) => {
    return (
      <div>
        <span style={{ width: 80, textAlign: "left", fontWeight: 200 }}>
          {caption}
        </span>
        <span style={{ width: 200, textAlign: "left", fontWeight: "bold" }}>
          {value}
        </span>
      </div>
    );
  };

  onHandleMenu = (item) => {
    switch (item.key) {
      case "downloadPdf":
        this.downloadPdf();
        break;
      case "downloadXls":
        this.downloadXls();
        break;
      default:
        break;
    }
  };

  isAdmin = () => {
    if (Number(UserProfile.getRole()) === Number(config.role["staff-admin"])){
      return true;
    } else {
      return false;
    }
  }

  menu = (
    <Menu onClick={(e) => this.onHandleMenu(e)}>
      <Menu.Item
        style={{ display: "none" }}
        key="downloadPdf"
        icon={<FilePdfOutlined />}
      >
        Download PDF
      </Menu.Item>
      
      {/* {this.isAdmin() &&  */}
      <Menu.Item 
      key="downloadXls" 
      icon={<ProfileOutlined />}
      >
        Download XLS
      </Menu.Item>
      {/* } */}
      
    </Menu>
  );

  downloadPdf = () => {
    const isP2P = this.props.isP2P || false;
    let originId = this.state.originId;
    const isAdmin =
      Number(UserProfile.getRole()) === Number(config.role["staff-admin"]);
    if (!isAdmin) {
      originId = this.userProfileObject.getAssignedStationId();
    }

    return ParcelService.exportCargoParcelPDF(
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

  downloadXls = () => {
    const isP2P = this.props.isP2P || false;
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
    if (page !== this.state.page)
      this.setState({ page, fetching: true }, () => this.getParcel());
  };

  onRemoveTag = (e, val) => {
    e.preventDefault();
    let tags = [...this.state.tags];
    const _tags = tags.filter((e) => e.end !== val.end);
    this.setState(
      { page: 1, tags: _tags, destinationId: _tags.map((e) => e.end) },
      () => this.getParcel()
    );
  };

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
          state.page = 1;
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
          this.setState(
            { page: 1, destinationId: tags.map((e) => e.end), tags },
            () => this.getParcel()
          );
        }
        break;
      case "parcelStatus":
        return;
        break;
      default:
        break;
    }
  };

  // PARCEL STATUS VISIBILITY TOGGLER
  handleVisibleChange = (flag) => {
    this.setState({ parcelStatusVisible: flag });
  };

   // Cargo TYPE VISIBILITY TOGGLER
   cargoTypeVisibleChange = (flag) => {
    this.setState({ cargoTypeVisible: flag });
  };


  // Includes checked status checkbox in filter array then call api, also removes item from array
  handleFilter = (status) => {
    let filtered;
    switch (status) {
      case "Created":
        if(!this.state.parcelStatusFilter.includes(1)){
          this.setState( {parcelStatusFilter: [...this.state.parcelStatusFilter, 1] }, () => this.getFilteredParcels() )
        } else {
          console.log("UNCHECKED and REMOVED")
          filtered = this.state.parcelStatusFilter.filter(num => num !== 1)
          this.setState({parcelStatusFilter: filtered} , () => this.getFilteredParcels())
        }
        break;
      case "In-Transit":
        if(!this.state.parcelStatusFilter.includes(2)){
          this.setState( {parcelStatusFilter: [...this.state.parcelStatusFilter, 2] }, () => this.getFilteredParcels() )
        } else {
          console.log("UNCHECKED and REMOVED")
          filtered = this.state.parcelStatusFilter.filter(num => num !== 2)
          this.setState({parcelStatusFilter: filtered} , () => this.getFilteredParcels())
        }
        break;
      case "Received":
        if(!this.state.parcelStatusFilter.includes(3)){
            this.setState( {parcelStatusFilter: [...this.state.parcelStatusFilter, 3] }, () => this.getFilteredParcels() )
        } else {
          console.log("UNCHECKED and REMOVED")
          filtered = this.state.parcelStatusFilter.filter(num => num !== 3)
          this.setState({parcelStatusFilter: filtered} , () => this.getFilteredParcels())
        }
        break;
      case "Voided":
          if(!this.state.parcelStatusFilter.includes(6)){
            this.setState( {parcelStatusFilter: [...this.state.parcelStatusFilter, 6] }, () => this.getFilteredParcels() )
            } else {
              console.log("UNCHECKED and REMOVED")
              filtered = this.state.parcelStatusFilter.filter(num => num !== 6)
              this.setState({parcelStatusFilter: filtered} , () => this.getFilteredParcels())
            }
            break;
      // case "Claimed":
      //   if(!this.state.parcelStatusFilter.includes(4)){
      //       this.setState( {parcelStatusFilter: [...this.state.parcelStatusFilter, 4] }, () => this.getFilteredParcels() )
      //       } else {
      //       console.log("UNCHECKED and REMOVED")
      //       filtered = this.state.parcelStatusFilter.filter(num => num !== 4)
      //       this.setState({parcelStatusFilter: filtered} , () => this.getFilteredParcels())
      //     }
      //   break;
      // case "Delivered":
      //   if(!this.state.parcelStatusFilter.includes(5)){
      //       this.setState( {parcelStatusFilter: [...this.state.parcelStatusFilter, 5] }, () => this.getFilteredParcels() )
      //     } else {
      //       console.log("UNCHECKED and REMOVED")
      //       filtered = this.state.parcelStatusFilter.filter(num => num !== 5)
      //       this.setState({parcelStatusFilter: filtered} , () => this.getFilteredParcels())
      //     }
      //   break;
     
      case "Modified":
        if(!this.state.parcelStatusFilter.includes(7)){
          this.setState( {parcelStatusFilter: [...this.state.parcelStatusFilter, 7] }, () => this.getFilteredParcels() )
        } else {
          console.log("UNCHECKED and REMOVED")
          filtered = this.state.parcelStatusFilter.filter(num => num !== 7)
          this.setState({parcelStatusFilter: filtered} , () => this.getFilteredParcels())
        }
      default:
        break;
    }
    console.log(status, "parcel status filter ticked/unticked");
  };

   // Includes checked status checkbox in filter array then call api, also removes item from array for caargotype
  cargoTypeFilter = (status) => {
    let filtered;
    switch (status) {
      case "Cargo":
        if(!this.state.cargoTypeFilter.includes(1)){
          this.setState( {cargoTypeFilter: [...this.state.cargoTypeFilter, 1] }, () => this.getCargoTypeFilteredParcels() )
        } else {
          console.log("UNCHECKED and REMOVED")
          filtered = this.state.cargoTypeFilter.filter(num => num !== 1)
          this.setState({cargoTypeFilter: filtered} , () => this.getCargoTypeFilteredParcels())
        }
        break;
      case "Accompanied":
        if(!this.state.cargoTypeFilter.includes(2)){
          this.setState( {cargoTypeFilter: [...this.state.cargoTypeFilter, 2] }, () => this.getCargoTypeFilteredParcels() )
        } else {
          console.log("UNCHECKED and REMOVED")
          filtered = this.state.cargoTypeFilter.filter(num => num !== 2)
          this.setState({cargoTypeFilter: filtered} , () => this.getCargoTypeFilteredParcels())
        }
        break;
      default:
        break;
    }
    console.log(status, "cargo type ticked/unticked");
  }

  // Function to call getParcel API everytime a filter checkbox is checked or unchecked to display filtered/unfiltered data
  getFilteredParcels = () => {
    console.log("CALL GET PARCEL API passing filter parcel status array:", this.state.parcelStatusFilter);
    this.getParcel()
  };

   // Function to call getParcel API everytime a filter checkbox is checked or unchecked to display filtered/unfiltered data
   getCargoTypeFilteredParcels = () => {
    console.log("CALL GET PARCEL API passing cargo type array:", this.state.cargoTypeFilter);
    this.getParcel()
  };

  // PARCEL STATUS DROP DOWN MENU ITEMS
  parcelStatuses = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        marginTop: ".3rem",
      }}
    >
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Created"
          onChange={(e) => this.handleFilter(e.target.name)}
        />
        Created
      </div>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="In-Transit"
          onChange={(e) => this.handleFilter(e.target.name)}
        />
        In-transit
      </div>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Received"
          onChange={(e) => this.handleFilter(e.target.name)}
        />
        Received
      </div>
      {/* <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Claimed"
          onChange={(e) => this.handleFilter(e.target.name)}
        />
        Claimed
      </div> */}
      {/* <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Delivered"
          onChange={(e) => this.handleFilter(e.target.name)}
        />
        Delivered
      </div> */}
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Voided"
          onChange={(e) => this.handleFilter(e.target.name)}
        />
        Voided
      </div>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Modified"
          onChange={(e) => this.handleFilter(e.target.name)}
        />
        Modified
      </div>
      {/* <Button onClick={this.handleFilter}>Filter</Button> */}
    </div>
  );

  // CARGO TYPE DROP DOWN MENU ITEMS
  cargoTypes = (
    <div
    style={{
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white",
      marginTop: ".3rem",
    }}
  >
    <div>
      <input
        type="checkbox"
        style={{ marginRight: ".3rem", marginLeft: ".5rem" }}
        name="Cargo"
        onChange={(e) => this.cargoTypeFilter(e.target.name)}
      />
      Cargo Padala
    </div>
    <div>
      <input
        type="checkbox"
        style={{ marginRight: ".3rem", marginLeft: ".5rem" }}
        name="Accompanied"
        onChange={(e) => this.cargoTypeFilter(e.target.name)}
      />
      Accompanied
    </div>
  </div>
  )

  render() {
    const isAdmin =
      Number(UserProfile.getRole()) === Number(config.role["staff-admin"]);
 
    console.log("STATE:",this.state);


    return (
      <Layout>
        <Content style={{ padding: "1rem", paddingTop: "2rem" }}>
          <Row style={{ display: "flex", justifyContent: "space-evenly" }}>
            {isAdmin && (
              <Col style={{ flex: 0.5 }}>
                <AutoComplete
                  size="large"
                  style={{ width: "100%" }}
                  onSelect={(item) => this.onSelectAutoComplete("origin", item)}
                  onSearch={(e) => this.doSearch("origin", e)}
                  placeholder="Origin Stations"
                >
                  {this.state.startStationRoutesTemp.map((e, i) => (
                    <Option value={e.stationName}>{e.stationName}</Option>
                  ))}
                </AutoComplete>
              </Col>
            )}

            <Col style={{ flex: 0.5 }}>
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

            <Col style={{ flex: 1 }}>
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
          <Row style={{ marginTop: ".5rem" }}>
            <Col span={12}>
              <div
                style={{
                  padding: "0.5rem",
                  border: "dashed 2px rgba(128,128,128,0.2)",
                  display: "flex",
                  background: "white",
                  minHeight: "2rem",
                  overflow: "hidden",
                  marginLeft: isAdmin ? "" : ".5rem",
                }}
              >
                <div>
                  {this.state.tags.map((e, i) => (
                    <Tag
                      key={e.end}
                      closable
                      color="cyan"
                      onClose={(c) => this.onRemoveTag(c, e)}
                    >
                      {" "}
                      {e.name}
                    </Tag>
                  ))}
                </div>
              </div>
            </Col>
            <Col offset={6} span={6} justifyContent="flex-end">
              {
                // <span>Download: </span>
                // <ReactToPrint
                //   onBeforeGetContent={() => this.setState({ isPrinting: true })}
                //   onAfterPrint={() => this.setState({ isPrinting: false })}
                //   content={() => this.printEl.current}
                //   trigger={() => {
                //     return (
                //       <Button>
                //         <PrinterOutlined /> <span>PDF</span>{" "}
                //       </Button>
                //     );
                //   }}
                // />
                // <Button onClick={() => this.downloadXls()}>XLS</Button>
              }

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Dropdown
                  disabled={!this.state.data.length}
                  overlay={this.menu}
                >
                  <Button>
                    <DownOutlined /> Download
                  </Button>
                </Dropdown>
              </div>
            </Col>
          </Row>

          {/* Parcel Status and Cargo Type dropdown filters  */}
          <Row style={{ marginTop: "1rem" }}>
            <Col style={{ marginRight: ".3rem" }}>
              <Dropdown
                onVisibleChange={this.handleVisibleChange}
                visible={this.state.parcelStatusVisible}
                overlay={this.parcelStatuses}
                // trigger="click"
              >
                <Button>
                  Parcel Status <DownOutlined />
                </Button>
              </Dropdown>
            </Col>
            {UserProfile.getBusCompanyTag() !== "isarog-liner" && (
              <Col>
                <Dropdown
                  onVisibleChange={this.cargoTypeVisibleChange}
                  visible={this.state.cargoTypeVisible}
                  overlay={this.cargoTypes}
                  // trigger="click"
                >
                  <Button>
                    Cargo Type <DownOutlined />
                  </Button>
                </Dropdown>
              </Col>
            )}
          </Row>

          <div
            style={{
              marginTop: "1rem",
              borderBottom: "dashed  rgba(125,125,125,0.5)  1px",
            }}
          />

          <div style={{ marginTop: "1.2rem" }} ref={this.printEl}>
            <Header date={this.getDate()} title={this.props.title} />
            <div
              style={{
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                {this.showTextDetails("Destination: ", this.getDestination())}
                {this.showTextDetails("Prepared: ", this.getPreparedBy())}
              </div>
              <div>
                {this.showTextDetails("Total Sales: ", this.getTotalAmount())}
                {this.showTextDetails(
                  "Total Number of Transaction: ",
                  this.state.totalRecords
                )}
              </div>
            </div>

            {false ? (
              <Skeleton active />
            ) : (
              <>
                <div className="cargo-table">
                  <Table
                    loading={this.state.fetching}
                    scroll={{ x: true }}
                    rowKey={(e) => e.key}
                    pagination={false}
                    // columns={this.props.source}
                    columns={
                      UserProfile.getBusCompanyTag() === "isarog-liner"
                        ? tableSourceBitsi
                        : isAdmin
                        ? tableSourceDLTB
                        : tableSourceStaffDLTB
                    }
                    dataSource={this.state.data}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1rem",
                    marginBottom: "3rem",
                  }}
                >
                  <Pagination
                    current={this.state.page}
                    onChange={(page) => this.onPageChange(page)}
                    total={this.state.totalRecords}
                    pageSize={this.state.limit}
                    showSizeChanger={false}
                  />
                </div>
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
      <span style={{ fontWeight: 600, fontSize: "1.4rem" }}>{props.title}</span>
      <Space>
        <span style={{ fontWeight: 200, fontSize: "1rem" }}>{props.date}</span>
      </Space>
    </div>
  );
}

export default SalesReport;
