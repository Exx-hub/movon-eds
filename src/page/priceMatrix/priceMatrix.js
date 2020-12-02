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
  AutoComplete
} from "antd";

import { PlusOutlined, SaveOutlined, DeleteFilled } from "@ant-design/icons";
import MatrixService from "../../service/Matrix";
import ParcelService from "../../service/Parcel";
import {openNotificationWithIcon, UserProfile, alterPath} from "../../utility";
import FixPriceMatrix from './fixMatrix'
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

export default class PriceMatrix extends React.Component {

  state = {
    matrix: [{ ...initMatrix }],
    routes: undefined,
    selectedRoute: undefined,
    routesList: [],
    startStation: undefined,
    fixMatrix: [{}],
    originId: null,
    destinationId: null,
    startStationRoutes: [],
    endStationRoutes: [],
    startStationRoutesTemp:[],
    endStationRoutesTemp:[],
  };

  componentDidMount() {
    this.busCompanyId = UserProfile.getBusCompanyId();

    RoutesService.getAllRoutes().then((e) => {
      const { data, errorCode } = e.data;
      if (errorCode) {
        this.handleErrorNotification(errorCode);
        return;
      }
      let clean = [];
      if(Number(UserProfile.getRole()) === Number(config.role["staff-admin"])){
        const _startStationRoutes = data
        .map((e) => ({ stationId: e.start, stationName: e.startStationName }))
        .filter((e) => {
          if (!clean.includes(e.stationName)) {
            clean.push(e.stationName);
            return true;
          }
          return false;
        });
        const startStationRoutes = [..._startStationRoutes]
        this.setState({allRoutes:data, startStationRoutes, startStationRoutesTemp:startStationRoutes});
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

    const hasMatrixError = isNull(matrix[0].tariffRate) || 
    isNull(matrix[0].exceededPerKilo) || 
    isNull(matrix[0].price) || 
    isNull(matrix[0].declaredValueRate) || 
    isNull(matrix[0].maxAllowedLengthRate1) || 
    isNull(matrix[0].maxAllowedLengthRate2) || 
    isNull(matrix[0].maxAllowedLength1) || 
    isNull(matrix[0].maxAllowedLength2) || 
    isNull(matrix[0].maxAllowedWeight);

    if(hasError || hasMatrixError){
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
      origin: this.state.originId,
      destination: this.state.destinationId,
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
    let index = this.state.routesList.options.find(i=>String(i.name) === String(e));
    const destination = (index && index.value) || undefined;
    this.setState({ selectedRoute: destination })
  };

  onFetchMatrix = () =>{
    MatrixService.getMatrix({
      busCompanyId: this.busCompanyId,
      origin:this.state.originId,
      destination: this.state.destinationId,
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
          this.setState({ matrix:result, fixMatrix:[{name:"", price:0, declaredValue:0}]});
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
  }

  onFixMatrixChange = (index, name, value) => {
    let fixMatrix = [...this.state.fixMatrix];
    fixMatrix[index][name] = value;
    this.setState({ fixMatrix });
  };

  doSearch = (name,el) => {
    const toSearch = el.toLowerCase();
    switch(name){
      case 'origin': 
        let startStationRoutesTemp = this.state.startStationRoutes.map(e=>({stationName:e.stationName}))
        .filter((e) => e.stationName.toLowerCase().includes(toSearch))
        this.setState({ startStationRoutesTemp });
        break;
      case 'destination':
        let endStationRoutesTemp = this.state.endStationRoutes.map(e=>({endStationName:e.endStationName}))
        .filter((e) => e.endStationName.toLowerCase().includes(toSearch))
        this.setState({ endStationRoutesTemp });
      break;
      default: break;
    }
  };

  getEndDestination = (data,stationId) => {
    if(!stationId)
    return;

    let clean = [];
    const destinations = data
      .filter((e) => e.start === stationId)
      .filter((e) => {
        if (!clean.includes(e.endStationName)) {
          clean.push(e.endStationName);
          return true;
        }
        return false;
      }).map(e=>({endStationName:e.endStationName, end:e.end}));
      return [...destinations]
  };

  onSelectAutoComplete = (name, value) => {
    let selected = [];

    switch (name) {
      case "origin":
        selected = this.state.startStationRoutes
        .find((e) => e.stationName === value) || null;
        if(selected){
          const endStationRoutes = this.getEndDestination(this.state.allRoutes, selected.stationId);
          this.setState({ originId: selected.stationId, endStationRoutes, endStationRoutesTemp:endStationRoutes });
        }
        break;
      case "destination":
        selected = this.state.endStationRoutes
        .find((e) => e.endStationName === value) || null;
        if(selected){
          this.setState({destinationId:selected.end},()=>this.onFetchMatrix())
        }
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <Layout>
        <div className="price-matrix-module">
          <h1 className="bus-company-name">
            {UserProfile.getBusCompanyName()}
          </h1>
          <Row justify="left" className="select-group-origin-destination">
            <Col span={8} style={{ paddingRight: ".5rem" }}>
              {this.state.startStationRoutesTemp && (
                <>
                  <span>Origin</span>
                  <AutoComplete
                    size="large"
                    style={{ width: "100%" }}
                    onSelect={(item) => this.onSelectAutoComplete("origin", item)}
                    onSearch={(e) => this.doSearch('origin',e)}
                    placeholder="Origin Stations"
                  >
                    {this.state.startStationRoutesTemp.map((e, i) => (
                      <Option value={e.stationName}>{e.stationName}</Option>
                    ))}
                  </AutoComplete>
                </>
              )}
            </Col>
            <Col span={8} style={{ paddingLeft: "1rem" }}>
              {this.state.endStationRoutesTemp && (
                <>
                  <span>Destination</span>
                  <AutoComplete
                    size="large"
                    style={{ width: "100%", marginLeft: "0.5rem" }}
                    onChange={(item) => this.onSelectAutoComplete("destination", item)}
                    onSearch={(e) => this.doSearch('destination',e)}
                    placeholder="Destination">
                    {this.state.endStationRoutesTemp.map((e, i) => (
                      <Option value={e.endStationName}>{e.endStationName}</Option>
                    ))}
                  </AutoComplete>
                  
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
        
        <Row><Col>
          <FixPriceMatrix 
            onFixMatrixChange={this.onFixMatrixChange}
            fixMatrix={this.state.fixMatrix}
            onAddMoreItem={(fixMatrix)=>this.setState({fixMatrix})}
            onDeleteItem={(fixMatrix)=>this.setState({fixMatrix})}
            />
        </Col></Row>

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


