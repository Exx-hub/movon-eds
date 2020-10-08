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
import {openNotificationWithIcon,getUser,clearCredential, UserProfile} from "../../utility";
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

export default class PriceMatrix extends React.Component {

  
  constructor(){
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
      fixMatrix: [{}],
    };
    this.UserProfileObject = new UserProfile();
  }

  componentDidMount() {
    this.user = getUser();
    this.busCompanyId = (this.user && this.user.busCompanyId._id) || undefined;

    if (!this.user) {
      this.props.history.push("/");
    }

    const stationId = this.use && this.use.assignedStation._id;
    ParcelService.getTrips(stationId).then((e) => {
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
            startStation: this.user.assignedStation,
          });
        }
      } else {
        this.handleErrorNotification(errorCode);
      }
    });

    ParcelService.getConnectingBusPartners().then((e) => {
      const { success, data, errorCode } = e.data;
      console.log('getConnectingBusPartners',e.data)
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
      clearCredential();
      this.props.history.push("/");
      return;
    }
    openNotificationWithIcon("error", code);
  };

  matrixItemChange = (name, value, index) => {
    let matrix = [...this.state.matrix];
    matrix[index].disabled = false;
    matrix[index][name] = value;
    this.setState({ matrix });
  };

  connectingMatrixChange = (name, value, index) => {
    const connectingMatrix = [...this.state.connectingMatrix];
    connectingMatrix[index][name] = value;
    this.setState({ connectingMatrix });
  };

  saveBicolIsarogMatrix = () => {
    const matrix = [...this.state.matrix];
    let hasError = false;
    let fixMatrix = [...this.state.fixMatrix]

    for(let x=0; x < this.state.fixMatrix.length; x++){
      if(fixMatrix[x].name === '' || fixMatrix[x].price === 0){
        hasError = true;
        break;
      }
    }

    const isNull = item =>{
      return item === 0 || item === undefined || item === null || item === ""
    }

    hasError = isNull(matrix[0].tariffRate) || 
    isNull(matrix[0].exceededPerKilo) || 
    isNull(matrix[0].price) || 
    isNull(matrix[0].declaredValueRate) || 
    isNull(matrix[0].maxAllowedLength) || 
    isNull(matrix[0].maxAllowedLengthRate) || 
    isNull(matrix[0].maxAllowedWeight);

    if(hasError){
      notification["error"]({
        message: "Input Fields Validation",
        description: "Please fill up missing fields",
      });
      return;
    }

    const data = this.state.matrix.map((e) => ({
      price: e.price,
      declaredValueRate: e.declaredValueRate,
      maxAllowedWeight: e.maxAllowedWeight,
      exceededPerKilo: e.exceededPerKilo,
      tariffRate: e.tariffRate,
      maxAllowedLength: [e.maxAllowedLength1, e.maxAllowedLength2] ,
      maxAllowedLengthRate: [e.maxAllowedLengthRate1, e.maxAllowedLengthRate2],
    }));

    this.saveMatrix({
      busCompanyId: this.busCompanyId,
      origin: this.state.startStation._id,
      destination: this.state.selectedRoute,
      stringValues: JSON.stringify({ matrix: data, fixMatrix }),
    });
  };

  saveConnectingMatrix = () => {
    const connectingCompany = this.state.connectingCompany;
    const origin = this.state.connectingRoutesOrigin.value;
    const destination = this.state.connectingRoutes.value;

    if (!origin || !destination) {
      notification["error"]({
        message: "Input Fields Validation",
        description: "Please fill up missing fields",
      });
      return;
    }

    const stringValues = this.state.connectingMatrix.map((e) => ({
      price: e.price,
      declaredValueMax: e.declaredValueMax,
      declaredValueMin: e.declaredValueMin,
      weightMax: e.weightMax,
      weightMin: e.weightMin,
      handlingFee: e.handlingFee,
      tariffRate: e.tariffRate,
    }));

    const busCompanyId =
      connectingCompany.value ||
      (connectingCompany.options.length > 0
        ? connectingCompany.options[0]._id
        : undefined);

    this.saveMatrix({
      busCompanyId,
      origin,
      destination,
      stringValues: JSON.stringify(stringValues),
    });
  };

  saveFiveStarMatrix = () => {
    const origin = this.state.startStation._id;
    const destination = this.state.selectedRoute;
    const matrix = [...this.state.matrix];

    if (
      origin &&
      destination &&
      matrix[0].price === 0 &&
      matrix[0].pricePerKilo === 0 &&
      matrix[0].declaredValueRate === 0 &&
      matrix[0].maxAllowedWeight === 0 &&
      matrix[0].maxAllowedLength === 0 &&
      matrix[0].lenghtRate === 0
    ) {
      notification["error"]({
        message: "Input Fields Validation",
        description: "Please fill up missing fields",
      });
      return;
    }

    const stringValues = this.state.matrix.map((e) => ({
      price: e.price,
      pricePerKilo: e.pricePerKilo,
      declaredValueRate: e.declaredValueRate,
      maxAllowedWeight: e.maxAllowedWeight,
      maxAllowedLength: e.maxAllowedLength,
      lenghtRate: e.lenghtRate,
      excessOneMeter: e.excessOneMeter,
      excessTwoMeter: e.excessTwoMeter,
    }));

    this.saveMatrix({
      busCompanyId: this.busCompanyId,
      origin,
      destination,
      stringValues: JSON.stringify(stringValues),
    });
  };

  saveMatrix = (data) => {
    MatrixService.create(data).then((e) => {
      const { success, errorCode } = e.data;
      if (success)
        notification["success"]({
          message: "Updated Successfuly",
          description: "All data are updated",
        });
      else this.handleErrorNotification(errorCode);
    });
  };

  onDestinationSelect = (e) => {
    const origin = this.state.startStation._id;
    const destination = e;
    this.setState({ selectedRoute: e }, () => {
      MatrixService.getMatrix({
        busCompanyId: this.busCompanyId,
        origin,
        destination,
      }).then((e) => {
        const { data, success, errorCode } = e.data;

        if (Boolean(success)) {
          let result = (data &&
            data.stringValues &&
            JSON.parse(data.stringValues)) || {
            matrix: [initMatrix],
            fixMatrix: [],
          };

          if(Array.isArray(result)){
            this.setState({ matrix:result, fixMatrix:[{name:"", price:0, declaredValue:0}] });
          }else{
            let { matrix, fixMatrix } = result;
            if(fixMatrix.length === 0){
              fixMatrix = [...[{name:"", price:0, declaredValue:0}]]
            }
            
            let _matrix = [...matrix];
            _matrix[0].maxAllowedLength1 = _matrix[0].maxAllowedLength[0]
            _matrix[0].maxAllowedLength2 = _matrix[0].maxAllowedLength[1]
            _matrix[0].lenghtRate1 = _matrix[0].maxAllowedLengthRate[0]
            _matrix[0].lenghtRate2 = _matrix[0].maxAllowedLengthRate[1]
           
            delete _matrix[0].maxAllowedLength;
            delete _matrix[0].maxAllowedLengthRate;

            this.setState({ matrix, fixMatrix });
          }
         
        } else {
          this.handleErrorNotification(errorCode);
        }
      });
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
          console.log('fetchConnectingMatrix',e.data)
          if (success) {
            let connectingMatrix = [{ ...initConnectingMatrix }];
            if (data && data.stringValues) {
              connectingMatrix = JSON.parse(data.stringValues);
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

  fiveStartMatrix = () => {
    const matrix = [...this.state.matrix];
    return (
      <>
        <Row>
          <Col span={4} className="header-input-group">
            Declared Value Rate (%)
          </Col>
          <Col span={4} className="header-input-group">
            In excess of 1m (%)
          </Col>
          <Col span={4} className="header-input-group">
            In excess of 2m (%)
          </Col>
          <Col span={4} className="header-input-group">
            Allowed Weight (kgs.)
          </Col>
          <Col span={4} className="header-input-group">
            In Excess of {matrix[0]["maxAllowedWeight"] || 20} (PHP)
          </Col>
          <Col span={4} className="header-input-group">
            Price (PHP)
          </Col>
        </Row>

        {this.state.matrix.map((e, i) => (
          <Row>
            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e["declaredValueRate"]}
                  onChange={(e) =>
                    this.matrixItemChange(
                      "declaredValueRate",
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
                  value={e["excessOneMeter"]}
                  onChange={(e) =>
                    this.matrixItemChange("excessOneMeter", e.target.value, i)
                  }
                />
              </div>
            </Col>

            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e["excessTwoMeter"]}
                  onChange={(e) =>
                    this.matrixItemChange("excessTwoMeter", e.target.value, i)
                  }
                />
              </div>
            </Col>

            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e["maxAllowedWeight"]}
                  onChange={(e) =>
                    this.matrixItemChange("maxAllowedWeight", e.target.value, i)
                  }
                />
              </div>
            </Col>

            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  name="pricePerKilo"
                  value={e["pricePerKilo"]}
                  onChange={(e) =>
                    this.matrixItemChange("pricePerKilo", e.target.value, i)
                  }
                />
              </div>
            </Col>

            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  name="price"
                  value={e["price"]}
                  onChange={(e) =>
                    this.matrixItemChange("price", e.target.value, i)
                  }
                />
              </div>
            </Col>
          </Row>
        ))}
        <Row style={{ marginTop: "1rem" }}>
          <Col offset={12} span={12}>
            <Button
              onClick={() => this.saveFiveStarMatrix()}
              type="danger"
              block
              icon={<SaveOutlined />}
            >
              Save
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  onFixMatrixChange = (index, name, value) => {
    let fixMatrix = [...this.state.fixMatrix];
    fixMatrix[index][name] = value;
    this.setState({ fixMatrix });
  };

  bicolIsarogMatrix = () => {
    return (
      <>
        <Row>
          <Col className="header-input-group" span={4}>
            Declared Value Rate(%)
          </Col>

          <Col className="header-input-group" span={3}>
            Max Weight (kgs.)
          </Col>

          <Col className="header-input-group" span={3}>
            Excess Kilo Rate (kgs.)
          </Col>

          <Col className="header-input-group" span={4}>
            Max Length (meters)
          </Col>

          <Col className="header-input-group" span={4}>
            Excess Length Rate (%)
          </Col>
          
          <Col className="header-input-group" span={3}>
            Tariff Rate(%)
          </Col>

          <Col className="header-input-group" span={3}>
            Price (PHP)
          </Col>
        </Row>

        {this.state.matrix.map((e, i) => (
          <Row key={i}>
            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e["declaredValueRate"]}
                  onChange={(e) =>
                    this.matrixItemChange(
                      "declaredValueRate",
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
                  value={e["maxAllowedWeight"]}
                  onChange={(e) =>
                    this.matrixItemChange("maxAllowedWeight", e.target.value, i)
                  }
                />
              </div>
            </Col>
            <Col span={3}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e["exceededPerKilo"]}
                  onChange={(e) =>
                    this.matrixItemChange("exceededPerKilo", e.target.value, i)
                  }
                />
              </div>
            </Col>
            <Col span={4}>
            <div className="matrix-item">
              <Input
                type="number"
                value={e["maxAllowedLength1"]} 
                onChange={(e) =>
                  this.matrixItemChange("maxAllowedLength1", e.target.value, i)
                }
              />
              <Input
                type="number"
                value={e["maxAllowedLength2"]} 
                onChange={(e) =>
                  this.matrixItemChange("maxAllowedLength2", e.target.value, i)
                }
              />
            </div>
          </Col>
          <Col span={4}>
          <div className="matrix-item">
            <Input
              type="number"
              value={e["lenghtRate1"]}
              onChange={(e) =>
                this.matrixItemChange("lenghtRate1", e.target.value, i)
              }
            />
            <Input
              type="number"
              value={e["lenghtRate2"]}
              onChange={(e) =>
                this.matrixItemChange("lenghtRate2", e.target.value, i)
              }
            />
          </div>
        </Col>
            <Col span={3}>
              <div className="matrix-item">
                <Input
                  type="number"
                  name="tariffRate"
                  value={e["tariffRate"]}
                  onChange={(e) =>
                    this.matrixItemChange("tariffRate", e.target.value, i)
                  }
                />
              </div>
            </Col>
            <Col span={3}>
              <div className="matrix-item">
                <Input
                  type="number"
                  name="price"
                  value={e["price"]}
                  onChange={(e) =>
                    this.matrixItemChange("price", e.target.value, i)
                  }
                />
              </div>
            </Col>
          </Row>
        ))}
        
        <div style={{ display:`${this.state.fixMatrix.length > 0 ? 'block' : 'none'}`, marginTop: "3rem" }}>
          <span style={{paddingBottom:'2rem', paddingTop:'2rem', fontSize:'14px'}}>Fix Price</span>
          {this.state.fixMatrix.map((e, index) => {
            return (
              <div key={index} style={{ width: "100%" }}>
                <Row>
                  <Col style={{ paddingBottom: "0.2rem" }}>
                    <span style={{fontSize:'12px'}}>Description</span>
                    <Input
                      value={e.name}
                      onChange={(e) =>
                        this.onFixMatrixChange(index, "name", e.target.value)
                      }
                      name="description"
                    />
                  </Col>
                  <Col
                    style={{ paddingLeft: "0.2rem", paddingBottom: "0.2rem" }}
                  >
                    <span style={{fontSize:'12px'}}>Price</span>
                    <Input
                      type="number"
                      name="price"
                      onChange={(e) =>
                        this.onFixMatrixChange(index, "price", e.target.value)
                      }
                      value={e.price}
                    />
                  </Col>
                  <Col
                    style={{ paddingLeft: "0.2rem", paddingBottom: "0.2rem" }}
                  >
                    <span style={{fontSize:'12px'}}>Declared Value</span>
                    <Input
                      type="number"
                      name="declaredValue"
                      onChange={(e) =>
                        this.onFixMatrixChange(
                          index,
                          "declaredValue",
                          e.target.value
                        )
                      }
                      value={e.declaredValue}
                    />
                  </Col>
                  <Col
                    style={{ paddingLeft: "0.2rem", marginTop:'1.4rem', paddingBottom: "0.2rem" }}
                  >
                    <Button
                      onClick={() => {
                        let fixMatrix = [...this.state.fixMatrix];
                        fixMatrix.splice(index, 1);
                        this.setState({ fixMatrix });
                      }}
                      shape="circle"
                      type="danger"
                    >
                      {" "}
                      <DeleteFilled />{" "}
                    </Button>
                  </Col>
                </Row>
              </div>
            );
          })}

          <Row>
            <Button
              onClick={() => {
                const fixMatrix = [...this.state.fixMatrix];
                if(fixMatrix[fixMatrix.length-1].name === "" && fixMatrix[fixMatrix.length-1].price === 0){
                  notification["error"]({
                    description: "Description is required or Price should not be zero",
                    message: "Please fill up missing fields",
                  });
                  return;
                }
                fixMatrix.push({ name: "", price: 0, declaredValue:0 });
                this.setState({ fixMatrix });
              }}
            >
              Add More
            </Button>
          </Row>
        </div>

        <Row>
          <Col offset={12} span={12}>
            <Button
              className="btn-save"
              onClick={() => this.saveBicolIsarogMatrix()}
              type="danger"
              block
              icon={<SaveOutlined />}
            >
              Save
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  connectingMatrix = () => {
    return (
      <>
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

        {this.state.connectingMatrix.map((e, i) => (
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
                    this.connectingMatrixChange("weightMin", e.target.value, i)
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
                    this.connectingMatrixChange("weightMax", e.target.value, i)
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
                    this.connectingMatrixChange("price", e.target.value, i)
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
                    this.connectingMatrixChange("tariffRate", e.target.value, i)
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
            >
              Save
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  switchView = () => {
    const connectingRoutesOrigin = { ...this.state.connectingRoutesOrigin };
    const connectingRoutes = { ...this.state.connectingRoutes };
    const connectingCompany = { ...this.state.connectingCompany };
    const options = connectingCompany.options;

    let view = Skeleton;
    console.log('this.UserProfileObject.isIsarogLiners()',this.UserProfileObject.isIsarogLiners())
    if(this.UserProfileObject.isIsarogLiners()){
      view = (
        <>
          {this.bicolIsarogMatrix()}
          {connectingCompany.options.length > 0 && (
            <Row>
              <div className="bicol-isarog-matrix">
                <Divider />
                <h1 className="bus-company-name">
                  {(options.value
                    ? options[
                        options.map((e) => e._id).indexOf(options.value)
                      ]
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
                {this.connectingMatrix()}
              </div>
            </Row>
          )}
        </>
      )
    }

    if(this.UserProfileObject.isFiveStar()){
      view = this.fiveStartMatrix();
    }

    return view;
  };

  render() {
    return (
      <Layout>
        <div className="price-matrix-module">
          <h1 className="bus-company-name">
            {this.user && this.user.busCompanyId.name} Matrix
          </h1>
          <Row justify="left" className="select-group-origin-destination">
            <Col span={8} style={{ paddingRight: ".5rem" }}>
              {this.state.startStation && (
                <>
                  <span>Origin</span>
                  <Select
                    style={{ width: "100%" }}
                    defaultValue={this.state.startStation.name}
                    placeholder="Start Station"
                  >
                    <Option value={this.state.startStation.name}>
                      {this.state.startStation.name}
                    </Option>
                  </Select>
                </>
              )}
            </Col>
            <Col span={8} style={{ paddingLeft: "1rem" }}>
              {this.state.routesList.options && (
                <>
                  <span>Destination</span>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Destination"
                    onChange={(e) => this.onDestinationSelect(e)}
                  >
                    {this.state.routesList.options.map((e, i) => (
                      <Option value={e.value}>{e.name}</Option>
                    ))}
                  </Select>
                </>
              )}
            </Col>
          </Row>

          {this.switchView()}
        </div>
      </Layout>
    );
  }
}
