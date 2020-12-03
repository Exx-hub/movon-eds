import React from "react";
import {
  Layout,
  Button,
  Select,
  Col,
  Row,
  notification,
  Input,
  Skeleton,
  Divider,
  AutoComplete,
} from "antd";

import { PlusOutlined, SaveOutlined, DeleteFilled } from "@ant-design/icons";
import MatrixService from "../../service/Matrix";
import ParcelService from "../../service/Parcel";
import {
  openNotificationWithIcon,
  UserProfile,
  alterPath,
} from "../../utility";
import FixPriceMatrix from "./fixMatrix";

import "./priceMatrix.css";
import RoutesService from "../../service/Routes";
import { config } from "../../config";

const { Option } = Select;

const initMatrix = {
  price: 0,
  pricePerKilo: 0,
  declaredValueRate: 0,
  maxAllowedWeight: 0,
  maxAllowedLengthRate1: 0,
  maxAllowedLengthRate2: 0,
  maxAllowedLength1: 0,
  maxAllowedLength2: 0,
  exceededPerKilo: 0,
  tariffRate: 0,
  excessOneMeter: 0,
  excessTwoMeter: 0,
};

const initConnectingMatrix = {
  price: 0,
  declaredValueMax: 0,
  declaredValueMin: 0,
  weightMax: 0,
  weightMin: 0,
  handlingFee: 0,
  tariffRate: 0,
};

export default class VictoryLinerMatrix extends React.Component {
  state = {
    //matrix: [{ ...initMatrix }],
    connectingMatrix: {fixMatrix:[], matrix:[...[{...initConnectingMatrix}]]},
    selectedRoute: undefined,
    routesList: [],
    startStation: undefined,
    // destinationRoutes: {
    //   name: "destinationRoutes",
    //   value: undefined,
    //   isRequired: true,
    //   accepted: true,
    //   options: [],
    // },
    connectingCompany: {
      name: "connectingCompany",
      value: undefined,
      isRequired: true,
      accepted: true,
      options: [],
    },
    matrix: [],
    fixMatrix: [{}],
    originId: null,
    destinationId: null,
    startStationRoutes: [],
    endStationRoutes: [],
    startStationRoutesTemp: [],
    endStationRoutesTemp: [],
    routes:undefined,
    originRoutes: [],
    destinationRoutes:[]
  };

  componentDidMount() {
    ParcelService.getConnectingBusPartners().then((e) => {
      const { data, errorCode } = e.data;
      if (!errorCode) {
        if (data.connectingRoutes.length > 0) {
          const connectingCompany = { ...this.state.connectingCompany };
          connectingCompany.options = data.connectingRoutes;
          this.getConnectingRoutes(data.connectingRoutes[0]._id);
          this.setState({ connectingCompany });
        }
      } else {
        this.handleErrorNotification(errorCode);
      }
    });
  }

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
      UserProfile.clearData();
      this.props.history.push(alterPath("/"));
      return;
    }
    openNotificationWithIcon("error", code);
  };

  connectingMatrixChange = (name, value, index) => {
    const connectingMatrix = [...this.state.connectingMatrix];
    connectingMatrix[index][name] = value;
    this.setState({ connectingMatrix });
  };

  saveConnectingMatrix = () => {
    const connectingCompany = this.state.connectingCompany;
    const origin = this.state.originId
    const destination = this.state.destinationId

    if (!origin || !destination) {
      notification["error"]({
        message: "Input Fields Validation",
        description: "Please fill up missing fields",
      });
      return;
    }

    const busCompanyId =
      connectingCompany.value ||
      (connectingCompany.options.length > 0
        ? connectingCompany.options[0]._id
        : undefined);

    MatrixService.create({
      busCompanyId,
      origin,
      destination,
      stringValues: JSON.stringify(this.state.connectingMatrix),
    }).then((e) => {
      const { success, errorCode } = e.data;
      if (success)
        notification["success"]({
          message: "Updated Successfuly",
          description: "All data are updated",
        });
      else this.handleErrorNotification(errorCode);
    });
  };

  fetchConnectingMatrix = () => {
    const origin = this.state.originId;
    const destination = this.state.destinationId;
    const connectingCompany = this.state.connectingCompany;
    const busCompanyId =
      connectingCompany.value ||
      (connectingCompany.options.length > 0
        ? connectingCompany.options[0]._id
        : undefined);

    if (busCompanyId && origin && destination) {
      MatrixService.getMatrix({ busCompanyId, origin, destination }).then(
        (e) => {
          const { data, success, errorCode } = e.data;
          if (success) {
            let connectingMatrix = {...this.state.connectingMatrix};
            let matrix = [];
            let fixMatrix = [];

            if (data && data.stringValues) {
              connectingMatrix = JSON.parse(data.stringValues);
              if (connectingMatrix) {
                if (Array.isArray(connectingMatrix)) {
                  matrix = [...connectingMatrix];
                  fixMatrix = [{ name: "", price: 0, declaredValue: 0 }];
                } else {
                  if (
                    typeof connectingMatrix === "object" &&
                    (connectingMatrix !== null ||
                      connectingMatrix !== undefined)
                  ) {
                    matrix = [...connectingMatrix.matrix];
                    fixMatrix = [...connectingMatrix.fixMatrix];
                  }
                }
                this.setState({ matrix, fixMatrix });
              }
            }
            this.setState({ connectingMatrix });
          } else {
            this.handleErrorNotification(errorCode);
          }
        }
      );
    }
  };

  getOriginList = (routes) =>{
    let clean = [];
    const originRoutes = routes.filter((e) => {
        if (!clean.includes(e.start)) {
          clean.push(e.start);
          return true;
        }
        return false;
      }).map(e=>(e.startStationName));
      return originRoutes;
  }

  getConnectingRoutes = (busCompanyId) => {
    ParcelService.getConnectingRoutes(busCompanyId).then((e) => {
      const { data, errorCode } = e.data;
      if (errorCode){
        this.handleErrorNotification(errorCode);
        return;
      } 
      const routes = data.map((e) => ({
        start: e.start,
        end: e.end,
        startStationName: e.startStationName,
        endStationName: e.endStationName,
      }));

      const originRoutes = this.getOriginList(routes)
      this.setState({routes, originRoutes });
    });
  };

  onFixMatrixChange = (index, name, value) => {
    let connectingMatrix = {...this.state.connectingMatrix};
    connectingMatrix.fixMatrix[index][name] = value
    this.setState({ connectingMatrix });
  };

  onAssociateChange = (value) => {
    const connectingCompany = { ...this.state.connectingCompany };
    this.setState(
      {
        connectingCompany: {
          ...{ connectingCompany },
          ...{ value },
        },
      },
      () => this.getConnectingRoutes(value)
    );
  };

  doSearch = (name, el) => {
    const toSearch = el.toLowerCase();
    switch (name) {
      case "origin":
        const originRoutesTemp = [...this.getOriginList(this.state.routes)]
        let startStationRoutesTemp = originRoutesTemp.filter((e) => e.toLowerCase().includes(toSearch));
        this.setState({ originRoutes:startStationRoutesTemp });
        break;
      case "destination":
        let destinationRoutes = this.state.routes.map(e=>e.endStationName).filter((e) => e.toLowerCase().includes(toSearch));
        this.setState({ destinationRoutes });
        break;
      default:
        break;
    }
  };

  onSelectAutoComplete = (name, value) => {
    let selected = null
    switch (name) {
      case "origin":
        selected = this.state.routes.find((e) => e.startStationName === value) || null;
        if (selected) {
          const destinationRoutes = this.state.routes.map(e=>(e.endStationName))
          this.setState({destinationRoutes, originId: selected.start});
        }
        break;
      case "destination":
        selected = this.state.routes.find((e) => e.endStationName === value) || null;
        if (selected) {
          this.setState({ destinationId: selected.end }, () =>
            this.fetchConnectingMatrix()
          );
        }
        break;
      default:
        break;
    }
  };

  onAddRow = () =>{
    const connectingMatrix = {...this.state.connectingMatrix};
    if(connectingMatrix.matrix.length > 0){
      connectingMatrix.matrix.push({...initConnectingMatrix})
      this.setState({connectingMatrix})
    }
  }

  onAddOrDelete = (name,val)=>{
    const connectingMatrix = {...this.state.connectingMatrix}
    connectingMatrix.fixMatrix = val;
    switch(name){
      case "delete": 
        if(val.length === 1){
          connectingMatrix.fixMatrix = [{declaredValue: 0, name: "",price: 0}]
        }
        break;
        default: break;
    }
    this.setState({connectingMatrix})
  }

  render() {
    const originRoutes = [...this.state.originRoutes]
    const destinationRoutes = [...this.state.destinationRoutes];
    const connectingCompany = { ...this.state.connectingCompany };
    const options = connectingCompany.options;

    return (
      <Layout>
        <div className="price-matrix-module">
          {connectingCompany.options.length > 0 && (
            <Row>
              <div className="bicol-isarog-matrix">
                <h1 className="bus-company-name">
                  {(options.value
                    ? options[options.map((e) => e._id).indexOf(options.value)]
                    : options.length > 0 && options[0].name) ||
                    "Connecting Routes"}{" "}
                  Matrix
                </h1>
                <Row justify="left" className="bicol-isarog-select-group">
                  <Col span={8} style={{ paddingRight: ".5rem" }}>
                    {options && options.length > 0 && (
                      <>
                        <span>Associate</span>
                        <Select
                          size="large"
                          placeholder="Associate"
                          style={{ width: "100%" }}
                          value={connectingCompany.value}
                          defaultValue={
                            options && options.length > 0 && options[0]._id
                          }
                          onChange={(e) => this.onAssociateChange(e)}
                        >
                          {options.map((e, i) => (
                            <Option key={i} value={e._id}>
                              {e.name}
                            </Option>
                          ))}
                        </Select>
                      </>
                    )}
                  </Col>
                  <Col span={8}>
                    {originRoutes && (
                      <div className="select-padding">
                        <span>Origin Station</span>
                        <AutoComplete
                          size="large"
                          style={{ width: "100%" }}
                          onSelect={(item) =>
                            this.onSelectAutoComplete("origin", item)
                          }
                          onSearch={(e) => this.doSearch("origin", e)}
                          placeholder="Origin Stations" >
                          {originRoutes.map((e, i) => (<Option key={i} value={e}>{e}</Option>))}
                        </AutoComplete>
                      </div>
                    )}
                  </Col>
                  <Col span={8}>
                    {destinationRoutes && (
                      <div className="select-padding">
                        <span>&nbsp;&nbsp;End Destination</span>
                        <AutoComplete
                          size="large"
                          style={{ width: "100%", marginLeft: "0.5rem" }}
                          onChange={(item) =>this.onSelectAutoComplete("destination", item)}
                          onSearch={(e) => this.doSearch("destination", e)}
                          placeholder="Destination">
                          {destinationRoutes.map((e, i) => ( <Option key={i} value={e}>{e}</Option>))}
                        </AutoComplete>
                      </div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={4} className="header-input-group">
                    Min Declared Value
                  </Col>
                  <Col span={4} className="header-input-group">
                    Max Declared Value
                  </Col>
                  <Col span={4} className="header-input-group">
                    Min Weight (kgs.)
                  </Col>
                  <Col span={3} className="header-input-group">
                    Max Weight (kgs.)
                  </Col>
                  <Col span={3} className="header-input-group">
                    Price
                  </Col>
                  <Col span={3} className="header-input-group">
                    Handling Fee
                  </Col>
                  <Col span={3} className="header-input-group">
                    Tarif Rate (%){" "}
                  </Col>
                </Row>

                {this.state.connectingMatrix.matrix.map((e, i) => (
                  <Row key={i}>
                    <Col span={4}>
                      <div className="matrix-item">
                        <Input
                          key={i}
                          type="number"
                          value={e["declaredValueMin"]}
                          onChange={(e) =>
                            this.connectingMatrixChange(
                              "declaredValueMin",
                              e.target.value,
                              i
                            )
                          }
                        />
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="matrix-item">
                        <Input
                          type="number"
                          value={e["declaredValueMax"]}
                          onChange={(e) =>
                            this.connectingMatrixChange(
                              "declaredValueMax",
                              e.target.value,
                              i
                            )
                          }
                        />
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="matrix-item">
                        <Input
                          type="number"
                          value={e["weightMin"]}
                          onChange={(e) =>
                            this.connectingMatrixChange(
                              "weightMin",
                              e.target.value,
                              i
                            )
                          }
                        />
                      </div>
                    </Col>
                    <Col span={3}>
                      <div className="matrix-item">
                        <Input
                          type="number"
                          value={e["weightMax"]}
                          onChange={(e) =>
                            this.connectingMatrixChange(
                              "weightMax",
                              e.target.value,
                              i
                            )
                          }
                        />
                      </div>
                    </Col>
                    <Col span={3}>
                      <div className="matrix-item">
                        <Input
                          type="number"
                          value={e["price"]}
                          onChange={(e) =>
                            this.connectingMatrixChange(
                              "price",
                              e.target.value,
                              i
                            )
                          }
                        />
                      </div>
                    </Col>
                    <Col span={3}>
                      <div className="matrix-item">
                        <Input
                          type="number"
                          value={e["handlingFee"]}
                          onChange={(e) =>
                            this.connectingMatrixChange(
                              "handlingFee",
                              e.target.value,
                              i
                            )
                          }
                        />
                      </div>
                    </Col>
                    <Col span={3}>
                      <div className="matrix-item">
                        <Input
                          type="number"
                          value={e["tariffRate"]}
                          onChange={(e) =>
                            this.connectingMatrixChange(
                              "tariffRate",
                              e.target.value,
                              i
                            )
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                ))}

                <Row style={{ marginTop: "1rem" }}>
                  <Col span={12} style={{ paddingRight: ".5rem" }}>
                    <Button className="btn-add-row" block  icon={<PlusOutlined />} onClick={() =>this.onAddRow()}>
                      Add Row
                    </Button>
                  </Col>

                  <Col span={12}>
                    <Button
                      onClick={() => this.saveConnectingMatrix()}
                      type="danger"
                      block
                      icon={<SaveOutlined />}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FixPriceMatrix
                      onFixMatrixChange={this.onFixMatrixChange}
                      fixMatrix={this.state.connectingMatrix.fixMatrix}
                      onAddMoreItem={(val) => this.onAddOrDelete("add",val)}
                      onDeleteItem={(val) => this.onAddOrDelete("delete",val)}
                    />
                  </Col>
                </Row>
              </div>
            </Row>
          )}
        </div>
      </Layout>
    );
  }
}
