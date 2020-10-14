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
import {openNotificationWithIcon,getUser,clearCredential, UserProfile, alterPath} from "../../utility";
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

export default class PriceMatrix extends React.Component {

  constructor(){
    super();
    this.state = {
      matrix: [{ ...initMatrix }],
      routes: undefined,
      selectedRoute: undefined,
      routesList: [],
      startStation: undefined,
      fixMatrix: [{}],
    };
    this.UserProfileObject = new UserProfile();
  }

  componentDidMount() {
    this.user = getUser();
    this.busCompanyId = (this.user && this.user.busCompanyId._id) || undefined;

    if (!this.user) {
      this.props.history.push(alterPath("/"));
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
      this.props.history.push(alterPath("/"));
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
    isNull(matrix[0].maxAllowedLengthRate1) || 
    isNull(matrix[0].maxAllowedLengthRate2) || 
    isNull(matrix[0].maxAllowedLength1) || 
    isNull(matrix[0].maxAllowedLength2) || 
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

    MatrixService.create({
      busCompanyId: this.busCompanyId,
      origin: this.state.startStation._id,
      destination: this.state.selectedRoute,
      stringValues: JSON.stringify({ matrix: data, fixMatrix }),
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
            if(_matrix.length > 0 && _matrix[0].maxAllowedLength && _matrix[0].maxAllowedLengthRate){
              _matrix[0].maxAllowedLength1 = _matrix[0].maxAllowedLength[0]
              _matrix[0].maxAllowedLength2 = _matrix[0].maxAllowedLength[1]
              _matrix[0].maxAllowedLengthRate1 = _matrix[0].maxAllowedLengthRate[0]
              _matrix[0].maxAllowedLengthRate2 = _matrix[0].maxAllowedLengthRate[1]
            
              delete _matrix[0].maxAllowedLength;
              delete _matrix[0].maxAllowedLengthRate;
            }
            

            this.setState({ matrix:_matrix, fixMatrix });
          }
         
        } else {
          this.handleErrorNotification(errorCode);
        }
      });
    });
  };

  onFixMatrixChange = (index, name, value) => {
    let fixMatrix = [...this.state.fixMatrix];
    fixMatrix[index][name] = value;
    this.setState({ fixMatrix });
  };

  render() {
    return (
      <Layout>
        <div className="price-matrix-module">
          <h1 className="bus-company-name">
            {this.user && this.user.busCompanyId.name}
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
              value={e["maxAllowedLengthRate1"]}
              onChange={(e) =>
                this.matrixItemChange("maxAllowedLengthRate1", e.target.value, i)
              }
            />
            <Input
              type="number"
              value={e["maxAllowedLengthRate2"]}
              onChange={(e) =>
                this.matrixItemChange("maxAllowedLengthRate2", e.target.value, i)
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
        </div>
      </Layout>
    );
  }
}
