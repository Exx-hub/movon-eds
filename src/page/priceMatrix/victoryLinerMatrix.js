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
} from "antd";

import { PlusOutlined, SaveOutlined, DeleteFilled } from "@ant-design/icons";
import MatrixService from "../../service/Matrix";
import ParcelService from "../../service/Parcel";
import {
  openNotificationWithIcon,
  UserProfile,
  alterPath,
} from "../../utility";
import FixPriceMatrix from './fixMatrix'

import "./priceMatrix.css";

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
  constructor() {
    super();
    this.state = {
      matrix: [{ ...initMatrix }],
      connectingMatrix: [{ ...initConnectingMatrix }],
      routes: undefined,
      selectedRoute: undefined,
      routesList: [],
      startStation: undefined,
      connectingRoutes: {
        name: "connectingRoutes",
        value: undefined,
        isRequired: true,
        accepted: true,
        options: [],
      },
      connectingRoutesOrigin: {
        name: "connectingRoutesOrigin",
        value: undefined,
        isRequired: true,
        accepted: true,
        options: [],
      },
      connectingCompany: {
        name: "connectingCompany",
        value: undefined,
        isRequired: true,
        accepted: true,
        options: [],
      },
      matrix:[],
      fixMatrix: [{}],
    };
    this.userProfileObject = UserProfile;
  }

  componentDidMount() {
    
    ParcelService.getTrips(this.userProfileObject.getAssignedStationId()).then((e) => {
      const { data, success, errorCode } = e.data;
      if (success) {
        if (data.trips) {
          let options = [];
          data.trips.data.forEach((e) => {
            options.push({
              name: e.endStation.name,
              value: e.endStation._id,
            });
          });

          let clean = [];
          options = options.filter((e) => {
            if (!clean.includes(e.value)) {
              clean.push(e.value);
              return true;
            }
            return false;
          });
          this.setState({
            routes: data,
            selectedRoute: data[0],
            routesList: { ...this.state.routesList, ...{ options } },
            startStation: this.userProfileObject.getAssignedStation(),
          });
        }
      } else {
        this.handleErrorNotification(errorCode);
      }
    });
    ParcelService.getConnectingBusPartners().then((e) => {
      const { success, data, errorCode } = e.data;
      if (success) {
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
      this.userProfileObject.clearData();
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
    const origin = this.state.connectingRoutesOrigin.value;
    const destination = this.state.connectingRoutes.value;
    const{matrix,fixMatrix}=this.state;

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
      stringValues: JSON.stringify({matrix,fixMatrix}),
    })
    .then((e) => {
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
    const origin = this.state.connectingRoutesOrigin.value;
    const destination = this.state.connectingRoutes.value;
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
            let connectingMatrix = [{ ...initConnectingMatrix }];
            let matrix = [];
            let fixMatrix = [];

            if (data && data.stringValues) {
              connectingMatrix = JSON.parse(data.stringValues);
              if(connectingMatrix){
                if(Array.isArray(connectingMatrix)){
                  matrix = [...connectingMatrix];
                  fixMatrix = [{name:"", price:0, declaredValue:0}]
                }else{
                  if(typeof connectingMatrix === 'object' && (connectingMatrix !== null || connectingMatrix !== undefined)){
                    matrix = [...connectingMatrix.matrix];
                    fixMatrix = [...connectingMatrix.fixMatrix];
                  }
                }
                this.setState({matrix,fixMatrix});
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

  getConnectingRoutes = (e) => {
    ParcelService.getConnectingRoutes(e).then((e) => {
      const { data, success, errorCode } = e.data;
      if (!success) this.handleErrorNotification(errorCode);
      else {
        const connectingRoutesOrigin = { ...this.state.connectingRoutesOrigin };
        const connectingRoutes = { ...this.state.connectingRoutes };
        connectingRoutes.options = data.map((e) => ({
          start: e.start,
          end: e.end,
          startStationName: e.startStationName,
          endStationName: e.endStationName,
        }));
        let clean = [];
        connectingRoutesOrigin.options = connectingRoutes.options.filter(
          (e) => {
            if (!clean.includes(e.start)) {
              clean.push(e.start);
              return true;
            }
            return false;
          }
        );

        this.setState({ connectingRoutes, connectingRoutesOrigin });
      }
    });
  };

  onFixMatrixChange = (index, name, value) => {
    let fixMatrix = [...this.state.fixMatrix];
    fixMatrix[index][name] = value;
    this.setState({ fixMatrix });
  };

  render() {
    const connectingRoutesOrigin = { ...this.state.connectingRoutesOrigin };
    const connectingRoutes = { ...this.state.connectingRoutes };
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
                          placeholder="Associate"
                          style={{ width: "100%" }}
                          value={connectingCompany.value}
                          defaultValue={
                            options && options.length > 0 && options[0]._id
                          }
                          onChange={(e) =>
                            this.setState(
                              {
                                connectingCompany: {
                                  ...{ connectingCompany },
                                  ...{ value: e },
                                },
                              },
                              () => this.getConnectingRoutes(e)
                            )
                          }
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
                    {connectingRoutesOrigin.options.length > 0 && (
                      <div className="select-padding">
                        <span>Origin</span>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Destination"
                          value={connectingRoutesOrigin.value}
                          onChange={(e) =>
                            this.setState(
                              {
                                connectingRoutesOrigin: {
                                  ...connectingRoutesOrigin,
                                  ...{ value: e },
                                },
                              },
                              () => this.fetchConnectingMatrix()
                            )
                          }
                        >
                          {connectingRoutesOrigin.options.map((e, i) => (
                            <Option key={i} value={e.start}>
                              {e.startStationName}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                  </Col>
                  <Col span={8}>
                    {connectingRoutes.options && (
                      <div className="select-padding">
                        <span>Destination</span>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Destination"
                          value={connectingRoutes.value}
                          onChange={(e) =>
                            this.setState(
                              {
                                connectingRoutes: {
                                  ...connectingRoutes,
                                  ...{ value: e },
                                },
                              },
                              () => this.fetchConnectingMatrix()
                            )
                          }
                        >
                          {connectingRoutes.options.map((e, i) => (
                            <Option value={e.end}>{e.endStationName}</Option>
                          ))}
                        </Select>
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

                {this.state.matrix.map((e, i) => (
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
                    <Button
                      className="btn-add-row"
                      block
                      icon={<PlusOutlined />}
                      onClick={() =>
                        this.setState({
                          connectingMatrix: [
                            ...this.state.connectingMatrix,
                            ...[{ ...initConnectingMatrix }],
                          ],
                        })
                      }
                    >
                      Add Row
                    </Button>
                  </Col>

                  <Col span={12}>
                    <Button
                      onClick={() => this.saveConnectingMatrix()}
                      type="danger"
                      block
                      icon={<SaveOutlined />}
                      disabled={true}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
                <Row><Col>
                <FixPriceMatrix 
                  onFixMatrixChange={this.onFixMatrixChange}
                  fixMatrix={this.state.fixMatrix}
                  onAddMoreItem={(fixMatrix)=>this.setState({fixMatrix})}
                  onDeleteItem={(fixMatrix)=>this.setState({fixMatrix})}
                  />
                </Col></Row>        
                </div>
            </Row>
          )}
        </div>
      </Layout>
    );
  }
}
