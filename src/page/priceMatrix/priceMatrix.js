import React from 'react';
import { Layout, Button, Select, Col, Row, notification, Input, Skeleton, Divider } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import MatrixService from '../../service/Matrix';
import ParcelService from '../../service/Parcel';
import { openNotificationWithIcon, getUser, clearCredential } from '../../utility'
import './priceMatrix.css'

const { Option } = Select;

const initMatrix = {
  price: 0,
  pricePerKilo: 0,
  declaredValueRate: 0,
  maxAllowedWeight: 0,
  maxAllowedLenght: 0,
  lenghtRate: 0,
  exceededPerKilo: 0,
  tariffRate: 0,
  excessOneMeter:0,
  excessTwoMeter:0
};

const initConnectingMatrix = {
  price: 0,
  declaredValueMax: 0,
  declaredValueMin: 0,
  weightMax: 0,
  weightMin: 0,
  handlingFee: 0,
  tariffRate: 0
}

export default class PriceMatrix extends React.Component {

  constructor(props) {
    super(props);
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
    }
  }

  componentDidMount() {
    this.user = getUser();
    this.busCompanyId = (this.user && this.user.busCompanyId._id) || undefined;

    if (!this.user) {
      this.props.history.push('/')
    }

    const stationId = this.use && this.use.assignedStation._id;
    ParcelService.getTrips(stationId).then(e => {
      const { data, success, errorCode } = e.data;
      if (success) {

        if (data.trips) {
          let options = []
          data.trips.data.forEach(e => {
            options.push({
              name: e.endStation.name,
              value: e.endStation._id,
            })
          })

          let clean = []
          options = options.filter(e => {
            if (!clean.includes(e.value)) {
              clean.push(e.value)
              return true
            }
            return false
          })
          this.setState({
            routes: data,
            selectedRoute: data[0],
            routesList: { ...this.state.routesList, ...{ options } },
            startStation: this.user.assignedStation
          });
        }
      } else {
        this.handleErrorNotification(errorCode)
      }
    })

    ParcelService.getConnectingBusPartners()
      .then((e) => {
        console.log('getConnectingBusPartners',e)
        const { success, data, errorCode } = e.data;
        if (success) {
          if(data.connectingRoutes.length > 0){
            const connectingCompany = { ...this.state.connectingCompany };
            connectingCompany.options = data.connectingRoutes;
            this.getConnectingRoutes(data.connectingRoutes[0]._id);
            this.setState({ connectingCompany })
          }
        } else {
          this.handleErrorNotification(errorCode)
        }
      })
  }

  handleErrorNotification = (code) => {
    if (!code) {
      notification['error']({
        message: "Server Error",
        description: "Something went wrong",
      });
      return;
    }

    if (code === 1000) {
      openNotificationWithIcon('error', code);
      clearCredential();
      this.props.history.push('/')
      return;
    }
    openNotificationWithIcon('error', code);
  }

  matrixItemChange = (name, value, index) => {
    let matrix = [...this.state.matrix];
    matrix[index].disabled = false;
    matrix[index][name] = value;
    this.setState({ matrix })
  }

  connectingMatrixChange = (name, value, index) => {
    const connectingMatrix = [...this.state.connectingMatrix]
    connectingMatrix[index][name] = value;
    this.setState({ connectingMatrix })
  }

  saveBicolIsarogMatrix = () => {
    const matrix = [...this.state.matrix]

    if(matrix[0].tariffRate === 0 && matrix[0].exceededPerKilo === 0 
        && matrix[0].price === 0 && matrix[0].declaredValueRate === 0 
          && matrix[0].maxAllowedWeight === 0) {

      notification['error']({
        message: "Input Fields Validation",
        description: "Please fill up missing fields",
      });

      return;
    }

    const data = this.state.matrix.map(e => ({
      price: e.price,
      declaredValueRate: e.declaredValueRate,
      maxAllowedWeight: e.maxAllowedWeight,
      exceededPerKilo: e.exceededPerKilo,
      tariffRate: e.tariffRate
    }))

    this.saveMatrix({
      busCompanyId: this.busCompanyId,
      origin: this.state.startStation._id,
      destination: this.state.selectedRoute,
      stringValues: JSON.stringify(data)
    })
  }

  saveConnectingMatrix = () => {
    const connectingCompany = this.state.connectingCompany;
    const origin = this.state.connectingRoutesOrigin.value;
    const destination = this.state.connectingRoutes.value;

    if (!origin || !destination) {
      notification['error']({
        message: "Input Fields Validation",
        description: "Please fill up missing fields",
      });
      return;
    }

    const stringValues = this.state.connectingMatrix.map(e => ({
      price: e.price,
      declaredValueMax: e.declaredValueMax,
      declaredValueMin: e.declaredValueMin,
      weightMax: e.weightMax,
      weightMin: e.weightMin,
      handlingFee: e.handlingFee,
      tariffRate: e.tariffRate
    }));

    const busCompanyId = connectingCompany.value || (connectingCompany.options.length > 0 ? connectingCompany.options[0]._id : undefined)

    this.saveMatrix({
      busCompanyId,
      origin,
      destination,
      stringValues: JSON.stringify(stringValues)
    })
  }

  saveFiveStarMatrix = () => {
    const origin = this.state.startStation._id;
    const destination = this.state.selectedRoute;
    const matrix = [...this.state.matrix];

    if (origin && destination && matrix[0].price === 0 && matrix[0].pricePerKilo === 0 
        && matrix[0].declaredValueRate === 0 && matrix[0].maxAllowedWeight === 0 
          && matrix[0].maxAllowedLenght === 0 && matrix[0].lenghtRate === 0) {

      notification['error']({
        message: "Input Fields Validation",
        description: "Please fill up missing fields",
      });
      return;
    }

    const stringValues = this.state.matrix.map(e => ({
      price: e.price,
      pricePerKilo: e.pricePerKilo,
      declaredValueRate: e.declaredValueRate,
      maxAllowedWeight: e.maxAllowedWeight,
      maxAllowedLenght: e.maxAllowedLenght,
      lenghtRate: e.lenghtRate,
      excessOneMeter: e.excessOneMeter,
      excessTwoMeter: e.excessTwoMeter
    }))

    this.saveMatrix({
      busCompanyId: this.busCompanyId,
      origin,
      destination,
      stringValues: JSON.stringify(stringValues)
    })
  }

  saveMatrix = (data) => {
    MatrixService.create(data).then(e => {
      const { success, errorCode } = e.data;
      if (success)
        notification['success']({
          message: "Updated Successfuly",
          description: "All data are updated",
        });
      else
        this.handleErrorNotification(errorCode)
    })
  }

  onDestinationSelect = (e) => {
    const origin = this.state.startStation._id;
    const destination = e;
    this.setState({ selectedRoute: e }, () => {
      MatrixService.getMatrix({ busCompanyId: this.busCompanyId, origin, destination })
        .then(e => {
          console.log('getMatrix',e)
          const { data, success, errorCode } = e.data;
          if (success) {
            let matrix = data && data.stringValues ? JSON.parse(data.stringValues) : [initMatrix];
            this.setState({ matrix });
          } else {
            this.handleErrorNotification(errorCode);
          }
        })
    })
  }

  fetchConnectingMatrix = () => {
    const origin = this.state.connectingRoutesOrigin.value;
    const destination = this.state.connectingRoutes.value
    const connectingCompany = this.state.connectingCompany;
    const busCompanyId = connectingCompany.value || (connectingCompany.options.length > 0 ? connectingCompany.options[0]._id : undefined)

    if (busCompanyId && origin && destination) {
      MatrixService.getMatrix({ busCompanyId, origin, destination })
        .then(e => {
          const { data, success, errorCode } = e.data;
          if (success) {
            let connectingMatrix = [{ ...initConnectingMatrix }];
            if (data && data.stringValues) {
              connectingMatrix = JSON.parse(data.stringValues)
            }
            this.setState({ connectingMatrix });
          } else {
            this.handleErrorNotification(errorCode);
          }
        })
    }

  }

  getConnectingRoutes = (e) => {
    ParcelService.getConnectingRoutes(e).then((e) => {
      const { data, success, errorCode } = e.data;
      if (!success)
        this.handleErrorNotification(errorCode);
      else {
        const connectingRoutesOrigin = { ...this.state.connectingRoutesOrigin };
        const connectingRoutes = { ...this.state.connectingRoutes };
        connectingRoutes.options = data.map(e => ({ start: e.start, end: e.end, startStationName: e.startStationName, endStationName: e.endStationName }))

        let clean = []
        connectingRoutesOrigin.options = connectingRoutes.options.filter(e => {
          if (!clean.includes(e.start)) {
            clean.push(e.start)
            return true
          }
          return false;
        })

        this.setState({ connectingRoutes, connectingRoutesOrigin })
      }
    });
  }

  fiveStartMatrix = () => {
    const matrix = [...this.state.matrix]
    return <>
      <Row>
        <Col span={4} className="header-input-group">Declared Value Rate (%)</Col>
        <Col span={4} className="header-input-group">In excess of 1m (%)</Col>
        <Col span={4} className="header-input-group">In excess of 2m (%)</Col>
        <Col span={4} className="header-input-group">Allowed Weight (kgs.)</Col>
        <Col span={4} className="header-input-group">In Excess of { matrix[0]['maxAllowedWeight'] || 20 } (PHP)</Col>
        <Col span={4} className="header-input-group">Price (PHP)</Col>
      </Row>

      {
        this.state.matrix.map((e, i) => (
          <Row>
            <Col span={4} >
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['declaredValueRate']}
                  onChange={(e) => this.matrixItemChange("declaredValueRate", e.target.value, i)} />
              </div>
            </Col>
            
            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['excessOneMeter']} 
                  onChange={(e) => this.matrixItemChange("excessOneMeter", e.target.value, i)} />
              </div>
            </Col>

            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['excessTwoMeter']}
                  onChange={(e) => this.matrixItemChange("excessTwoMeter", e.target.value, i)} />
              </div>
            </Col>

            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['maxAllowedWeight']}
                  onChange={(e) => this.matrixItemChange("maxAllowedWeight", e.target.value, i)} />
              </div>
            </Col>

            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  name="pricePerKilo"
                  value={e['pricePerKilo']}
                  onChange={(e) => this.matrixItemChange("pricePerKilo", e.target.value, i)} />
              </div>
            </Col>

            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  name="price"
                  value={e['price']}
                  onChange={(e) => this.matrixItemChange("price", e.target.value, i)} />
              </div>
            </Col>
          </Row>))
      }
      <Row style={{ marginTop: '1rem' }}>
        <Col offset={12} span={12}>
          <Button onClick={() => this.saveFiveStarMatrix()} type="danger" block icon={<SaveOutlined />}>Save</Button>
        </Col>
      </Row>
    </>
  }

  bicolIsarogMatrix = () => {
    return <>
      <Row>
        <Col className="header-input-group" span={5}>Declared Value Rate(%)</Col>
        <Col className="header-input-group" span={5}>Allowed Weight (kgs.)</Col>
        <Col className="header-input-group" span={5}>Exceeded Per Kilo (kgs.)</Col>
        <Col className="header-input-group" span={4}>Tariff Rate(%)</Col>
        <Col className="header-input-group" span={5}>Price (PHP)</Col>
      </Row>

      {
        this.state.matrix.map((e, i) => (
          <Row>
            <Col span={5} >
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['declaredValueRate']}
                  onChange={(e) => this.matrixItemChange("declaredValueRate", e.target.value, i)} />
              </div>
            </Col>
            <Col span={5}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['maxAllowedWeight']}
                  onChange={(e) => this.matrixItemChange("maxAllowedWeight", e.target.value, i)} />
              </div>
            </Col>
            <Col span={5}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['exceededPerKilo']}
                  onChange={(e) => this.matrixItemChange("exceededPerKilo", e.target.value, i)} />
              </div>
            </Col>
            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  name="tariffRate"
                  value={e['tariffRate']}
                  onChange={(e) => this.matrixItemChange("tariffRate", e.target.value, i)} />
              </div>
            </Col>
            <Col span={5}>
              <div className="matrix-item">
                <Input
                  type="number"
                  name="price"
                  value={e['price']}
                  onChange={(e) => this.matrixItemChange("price", e.target.value, i)} />
              </div>
            </Col>
          </Row>))
      }
      <Row>
        <Col offset={12} span={12}>
          <Button className="btn-save" onClick={() => this.saveBicolIsarogMatrix()} type="danger" block icon={<SaveOutlined />}>Save</Button>
        </Col>
      </Row>
    </>
  }

  connectingMatrix = () => {
    return <>
      <Row>
        <Col span={4} className="header-input-group">Min Declared Value</Col>
        <Col span={4} className="header-input-group">Max Declared Value</Col>
        <Col span={4} className="header-input-group">Min Weight (kgs.)</Col>
        <Col span={3} className="header-input-group">Max Weight (kgs.)</Col>
        <Col span={3} className="header-input-group">Price</Col>
        <Col span={3} className="header-input-group">Handling Fee</Col>
        <Col span={3} className="header-input-group">Tarif Rate (%) </Col>
      </Row>

      {
        this.state.connectingMatrix.map((e, i) => (
          <Row key={i}>
            <Col span={4} >
              <div className="matrix-item">
                <Input
                  key={i}
                  type="number"
                  value={e['declaredValueMin']}
                  onChange={(e) => this.connectingMatrixChange("declaredValueMin", e.target.value, i)} />
              </div>
            </Col>
            <Col span={4} >
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['declaredValueMax']}
                  onChange={(e) => this.connectingMatrixChange("declaredValueMax", e.target.value, i)} />
              </div>
            </Col>
            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['weightMin']}
                  onChange={(e) => this.connectingMatrixChange("weightMin", e.target.value, i)} />
              </div>
            </Col>
            <Col span={3}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['weightMax']}
                  onChange={(e) => this.connectingMatrixChange("weightMax", e.target.value, i)} />
              </div>
            </Col>
            <Col span={3}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['price']}
                  onChange={(e) => this.connectingMatrixChange("price", e.target.value, i)} />
              </div>
            </Col>
            <Col span={3}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['handlingFee']}
                  onChange={(e) => this.connectingMatrixChange("handlingFee", e.target.value, i)} />
              </div>
            </Col>
            <Col span={3}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['tariffRate']}
                  onChange={(e) => this.connectingMatrixChange("tariffRate", e.target.value, i)} />
              </div>
            </Col>
          </Row>))
      }
      <Row style={{ marginTop: '1rem' }}>
        <Col span={12} style={{ paddingRight: '.5rem' }}>
            <Button className="btn-add-row" block icon={<PlusOutlined />} onClick={() => this.setState({ connectingMatrix:[...this.state.connectingMatrix, ...[{ ...initConnectingMatrix }]] })}>Add Row</Button>
        </Col>

        <Col span={12}>
          <Button
            onClick={() => this.saveConnectingMatrix()}
            type="danger"
            block
            icon={<SaveOutlined />}>Save</Button>
        </Col>
      </Row>
    </>
  }

  switchView = () => {
    const connectingRoutesOrigin = { ...this.state.connectingRoutesOrigin };
    const connectingRoutes = { ...this.state.connectingRoutes };
    const connectingCompany = { ...this.state.connectingCompany };
    const options = connectingCompany.options;
    const tag = this.user && this.user.busCompanyId.config.parcel.tag;

    let view = Skeleton;

    switch (tag) {
      case 'five-star':
        view = this.fiveStartMatrix();
        break;

      case 'bicol-isarog':
        view = <>
          {this.bicolIsarogMatrix()}
          {
            connectingCompany.options.length > 0 && <Row>
              <div className="bicol-isarog-matrix">
                <Divider />
                <h1 className="bus-company-name" >{(options.value ? options[options.map(e => (e._id)).indexOf(options.value)] : (options.length > 0 && options[0].name)) || 'Connecting Routes'} Matrix</h1>
                <Row justify="left" className="bicol-isarog-select-group">
                  <Col span={8} style={{ paddingRight: '.5rem' }}>
                    {
                      options && options.length > 0 &&
                      <>
                        <span>Associate</span>
                        <Select
                          placeholder="Associate"
                          style={{ width: '100%' }}
                          value={connectingCompany.value}
                          defaultValue={options && options.length > 0 && options[0]._id}
                          onChange={(e) => this.setState({ connectingCompany: { ...{ connectingCompany }, ...{ value: e } } }, () => this.getConnectingRoutes(e))}
                        >
                          {options.map((e, i) => (<Option key={i} value={e._id}>{e.name}</Option>))}
                        </Select>
                      </>
                    }

                  </Col>
                  <Col span={8}>
                    {
                      connectingRoutesOrigin.options.length > 0 &&
                      <div className="select-padding">
                        <span>Origin</span>
                        <Select
                          style={{ width: '100%' }}
                          placeholder="Destination"
                          value={connectingRoutesOrigin.value}
                          onChange={(e) => this.setState({ connectingRoutesOrigin: { ...connectingRoutesOrigin, ...{ value: e } } }, () => this.fetchConnectingMatrix())}>
                          {
                            connectingRoutesOrigin.options.map((e, i) => (<Option key={i} value={e.start}>{e.startStationName}</Option>))
                          }
                        </Select>
                      </div>
                    }
                  </Col>
                  <Col span={8}>
                    {
                      connectingRoutes.options &&
                      <div className="select-padding">
                        <span>Destination</span>
                        <Select
                          style={{ width: '100%' }}
                          placeholder="Destination"
                          value={connectingRoutes.value}
                          onChange={(e) => this.setState({ connectingRoutes: { ...connectingRoutes, ...{ value: e } } }, () => this.fetchConnectingMatrix())}>
                          {
                            connectingRoutes.options.map((e, i) => (<Option value={e.end}>{e.endStationName}</Option>))
                          }
                        </Select>
                      </div>
                    }
                  </Col>
                </Row>
                {this.connectingMatrix()}
              </div>
            </Row>
          }
        </>
        break;

      default:
        break;
    }
    return view;
  }

  render() {
    return (
      <Layout>

        <div className="price-matrix-module">
          <h1 className="bus-company-name">{this.user && this.user.busCompanyId.name} Matrix</h1>
          <Row justify="left" className="select-group-origin-destination">
            <Col span={8} style={{ paddingRight: '.5rem' }}>
              {
                this.state.startStation &&
                <>
                  <span>Origin</span>
                  <Select
                    style={{ width: '100%' }}
                    defaultValue={this.state.startStation.name}
                    placeholder="Start Station" >
                    <Option value={this.state.startStation.name}>{this.state.startStation.name}</Option>
                  </Select>
                </>
              }

            </Col>
            <Col span={8} style={{ paddingLeft: '1rem' }}>
              {
                this.state.routesList.options &&
                <>
                  <span>Destination</span>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Destination"
                    onChange={(e) => this.onDestinationSelect(e)}>
                    {
                      this.state.routesList.options.map((e, i) => (<Option value={e.value}>{e.name}</Option>))
                    }
                  </Select>
                </>
              }
            </Col>
          </Row>

          {
            this.switchView()
          }

        </div>
      </Layout>
    )
  }
}