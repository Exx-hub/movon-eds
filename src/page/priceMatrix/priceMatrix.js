import React from 'react';
import ReactToPrint from 'react-to-print';
import moment from 'moment';
import { Layout, Button, Select, Col, Row, notification, Input, Space, Skeleton } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import './priceMatrix.css'
import ManifestService from '../../service/Manifest';
import MatrixService from '../../service/Matrix';
import ParcelService from '../../service/Parcel';

import { openNotificationWithIcon, getUser, clearCredential } from '../../utility'

const { Option } = Select;

const DefaultPriceMatrixLayout = [
  {
    minDeclaredValue: 0,
    maxDeclaredValue: 1000,
    minWeight: 1,
    maxWeight: 10,
    value: 0
  },
  {
    minDeclaredValue: 1001,
    maxDeclaredValue: 2000,
    minWeight: 11,
    maxWeight: 20,
    value: 0
  },
  {
    minDeclaredValue: 2001,
    maxDeclaredValue: 3000,
    minWeight: 21,
    maxWeight: 30,
    value: 0
  },
  {
    minDeclaredValue: 3001,
    maxDeclaredValue: 4000,
    minWeight: 31,
    maxWeight: 40,
    value: 0
  },
  {
    minDeclaredValue: 4001,
    maxDeclaredValue: 5000,
    minWeight: 41,
    maxWeight: 50,
    value: 0
  },
  {
    minDeclaredValue: 5001,
    maxDeclaredValue: 6000,
    minWeight: 51,
    maxWeight: 60,
    value: 0
  },
  {
    minDeclaredValue: 6001,
    maxDeclaredValue: 7000,
    minWeight: 61,
    maxWeight: 70,
    value: 0
  },
  {
    minDeclaredValue: 7001,
    maxDeclaredValue: 8000,
    minWeight: 71,
    maxWeight: 80,
    value: 0
  },
  {
    minDeclaredValue: 8001,
    maxDeclaredValue: 9000,
    minWeight: 81,
    maxWeight: 90,
    value: 0
  },
  {
    minDeclaredValue: 9001,
    maxDeclaredValue: 10000,
    minWeight: 91,
    maxWeight: 100,
    value: 0
  },
  {
    minDeclaredValue: 10001,
    maxDeclaredValue: 12000,
    minWeight: 101,
    maxWeight: 120,
    value: 0
  },
  {
    minDeclaredValue: 12001,
    maxDeclaredValue: 14000,
    minWeight: 121,
    maxWeight: 140,
    value: 0
  },
  {
    minDeclaredValue: 14001,
    maxDeclaredValue: 16000,
    minWeight: 141,
    maxWeight: 160,
    value: 0
  },
  {
    minDeclaredValue: 16001,
    maxDeclaredValue: 18000,
    minWeight: 161,
    maxWeight: 180,
    value: 0
  },
  {
    minDeclaredValue: 18001,
    maxDeclaredValue: 20000,
    minWeight: 181,
    maxWeight: 200,
    value: 0
  },
  {
    minDeclaredValue: 20001,
    maxDeclaredValue: 22000,
    minWeight: 201,
    maxWeight: 220,
    value: 0
  },
  {
    minDeclaredValue: 22001,
    maxDeclaredValue: 24000,
    minWeight: 221,
    maxWeight: 240,
    value: 0
  },
  {
    minDeclaredValue: 24001,
    maxDeclaredValue: 26000,
    minWeight: 241,
    maxWeight: 260,
    value: 0
  },
  {
    minDeclaredValue: 26001,
    maxDeclaredValue: 28000,
    minWeight: 261,
    maxWeight: 280,
    value: 0
  },
  {
    minDeclaredValue: 28001,
    maxDeclaredValue: 30000,
    minWeight: 281,
    maxWeight: 300,
    value: 0
  }
]

export default class PriceMatrix extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      matrix: [{
        price: 0,
        pricePerKilo: 0,
        declaredValueRate: 0,
        maxAllowedWeight: 0,
        maxAllowedLenght:0,
        lenghtRate:0
      }],
      hasContent: false,
      routes: undefined,
      selectedRoute: undefined,
      routesList: [],
      startStation: undefined
    }
  }

  componentDidMount() {
    this.user = getUser();
    if (!this.user) {
      this.props.history.push('/')
    }


    console.log('user', this.user)

    const stationId = this.use && this.use.assignedStation._id;
    ParcelService.getTrips(stationId).then(e=>{
      const{data, success, errorCode}=e.data;
      if(success){
        if(data.trips){
          const details = {...this.state.details}
          let options =[]
          data.trips.data.map(e=>{

            options.push({
              name:e.endStation.name,
              value:e.endStation._id,
            })
            
          })
         
          let clean=[]
          options = options.filter(e=>{
            if(!clean.includes(e.value)){
              clean.push(e.value)
              return true
            }
          })
          this.setState({
            routes: data,
            selectedRoute: data[0],
            routesList: { ...this.state.routesList, ...{ options } },
            startStation: this.user.assignedStation
          }, () => {
            console.log('state', this.state)
          });          
        }
      }else{
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

  parseMatrix = (matrix) => {
    return matrix.map(e => {
      return { ...e, ...{ disabled: true } }
    })
  }


  onAddItem = () => {
    const matrix = [...this.state.matrix, ...[{
      minDeclaredValue: 0,
      maxDeclaredValue: 0,
      minWeight: 0,
      maxWeight: 0,
      disabled: false,
      value: 0
    }]]
    this.setState({ matrix })
  }

  matrixItemChange = (name, value, index) => {
    console.log('name', name)
    let matrix = [...this.state.matrix];
    matrix[index].disabled = false;
    matrix[index][name] = value;
    this.setState({ matrix })
  }

  onSaveMatrixItem = (index) => {
    let matrix = [...this.state.matrix];
    matrix[index].disabled = true;
    this.setState({ matrix })
  }

  saveFiveStarMatrix = () => {

    const price = this.state.matrix[0].price;
    const pricePerKilo = this.state.matrix[0].pricePerKilo;
    const declaredValueRate = this.state.matrix[0].declaredValueRate;
    const maxAllowedWeight = this.state.matrix[0].maxAllowedWeight;
    const maxAllowedLenght = this.state.matrix[0].maxAllowedLenght;
    const lenghtRate = this.state.matrix[0].lenghtRate;

    if (price === 0 
          && pricePerKilo === 0 
            && declaredValueRate === 0 
              && maxAllowedWeight === 0
                && maxAllowedLenght === 0
                  && lenghtRate === 0) {

      notification['error']({
        message: "Input Fields Validation",
        description: "Please fill up missing fields",
      });

      return;
    }

    let data = {
      origin: this.state.startStation._id,
      destination: this.state.selectedRoute,
      price,
      pricePerKilo,
      declaredValueRate,
      maxAllowedWeight,
      maxAllowedLenght,
      lenghtRate
    }

    MatrixService.create(data).then(e => {
      const{success,errorCode}=e.data;
      if(success)
        notification['success']({
          message: "Updated Successfuly",
          description: "All data are updated",
        });
      else
        this.handleErrorNotification(errorCode)
    })
  }

  defaultMatrix = () => {
    return <>
      <Row>
        <Col span={8} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>Declared Value</Col>
        <Col span={8} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>Gross Weight</Col>
        <Col span={this.state.hasContent ? 5 : 8} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>Value</Col>
        {
          this.state.hasContent &&
          <Col span={3} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>Action</Col>
        }
      </Row>

      <Row>
        {
          this.state.matrix.map((e, i) => (
            <Row>
              <Col span={8}>
                <div className="matrix-item">
                  <Input
                    type="number"
                    value={e['minDeclaredValue']}
                    name="minDeclaredValue"
                    onChange={(e) => this.matrixItemChange(e.target.name, e.target.value, i)} />
                  <Input
                    type="number"
                    value={e['maxDeclaredValue']}
                    name="maxDeclaredValue"
                    onChange={(e) => this.matrixItemChange(e.target.name, e.target.value, i)} />
                </div>
              </Col>
              <Col span={8}>
                <div className="matrix-item">
                  <Input
                    type="number"
                    value={e['minWeight']}
                    onChange={(e) => this.matrixItemChange(e.target.name, e.target.value, i)} />
                  <Input
                    type="number"
                    value={e['maxWeight']}
                    onChange={(e) => this.matrixItemChange(e.target.name, e.target.value, i)} />
                </div>
              </Col>
              <Col span={this.state.hasContent ? 5 : 8}>
                <div className="matrix-item">
                  <Input
                    type="number"
                    value={e['value']}
                    onChange={(e) => this.matrixItemChange(e.target.name, e.target.value, i)} />
                </div>
              </Col>
              {
                this.state.hasContent &&
                <Col span={3}>
                  <div style={{
                    background: '#fff',
                    height: '100%',
                    border: '1px solid rgba(0,0,0,.2)'
                  }}>
                    <Button
                      onClick={() => this.onSaveMatrixItem(i)}
                      disabled={e.disabled}
                      style={{ height: '30px', color: `${e.disabled ? "gray" : "#28a745"}` }}
                      type="link"
                      icon={<SaveOutlined />}>Save</Button>
                  </div>
                </Col>
              }
            </Row>))
        }
      </Row>
      <Row style={{ marginTop: '1rem' }}>
        <Col span={12} style={{ paddingRight: '.5rem' }}>
          <Button
            style={{ background: "#28a745", color: "#fff" }}
            onClick={() => this.onAddItem()}
            block
            icon={<PlusOutlined />}>Add Row</Button>
        </Col>

        <Col span={12}>
          {
            !this.state.hasContent &&
            <Button
              type="danger"
              block
              icon={<SaveOutlined />}>Save</Button>
          }
        </Col>
      </Row>
    </>
  }

  onDestinationSelect = (e) => {
    const origin = this.state.startStation._id;
    const destination = e;
    this.setState({ selectedRoute: e }, () => {
      MatrixService.getMatrix({ origin, destination }).then(e => {
        const { data } = e.data;
        console.log('data',data)
        this.setState({
          matrix: [{
            declaredValueRate: data ? data.declaredValueRate : 0,
            maxAllowedWeight: data ? data.maxAllowedWeight : 0,
            price: data ? data.price : 0,
            pricePerKilo: data ? data.pricePerKilo : 0,
            maxAllowedLenght: data ? data.maxAllowedLenght : 0,
            lenghtRate: data ? data.lenghtRate : 0,
            pricePerKilo: data ? data.pricePerKilo : 0,
          }]
        })
      })
    })
  }

  fiveStartMatrix = () => {
    return <>
      <Row>
        <Col span={4} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>Declared Value Rate (%)</Col>
        <Col span={4} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>Max Allowed Weight</Col>
        <Col span={4} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>length Rate</Col>
        <Col span={4} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>Max Allowed length (Meter)</Col>
        <Col span={4} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>Price Per Kilo</Col>
        <Col span={4} style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,.2)', fontWeight: '200', padding: '.7rem' }}>Price</Col>
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
                  value={e['maxAllowedWeight']}
                  onChange={(e) => this.matrixItemChange("maxAllowedWeight", e.target.value, i)} />
              </div>
            </Col>
            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['lenghtRate']}
                  onChange={(e) => this.matrixItemChange("lenghtRate", e.target.value, i)} />
              </div>
            </Col>
            <Col span={4}>
              <div className="matrix-item">
                <Input
                  type="number"
                  value={e['maxAllowedLenght']}
                  onChange={(e) => this.matrixItemChange("maxAllowedLenght", e.target.value, i)} />
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
        <Col span={12} style={{ paddingRight: '.5rem' }}>
          {
            this.user && this.user.busCompanyId.config.parcel.tag !== "five-star" &&

            <Button
              style={{ background: "#28a745", color: "#fff" }}
              onClick={() => this.onAddItem()}
              block
              icon={<PlusOutlined />}>Add Row</Button>

          }
        </Col>

        <Col span={12}>
          {
            !this.state.hasContent &&
            <Button
              onClick={() => this.saveFiveStarMatrix()}
              type="danger"
              block
              icon={<SaveOutlined />}>Save</Button>
          }
        </Col>
      </Row>
    </>
  }

  render() {
    console.log('this.user',this.user)
    const isFiveStar = this.user && this.user.busCompanyId.config.parcel.tag === 'five-star'
    return (
      <Layout>

        <div style={{ width: '90%', alignSelf: 'center', padding: '1rem', marginTop: '1rem' }}>
          <Row><h1 style={{fontSize:'1.5rem'}}>{this.user && this.user.busCompanyId.name} Matrix</h1></Row>
          <Row justify="center" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
            <Col span={8} style={{ paddingRight: '.5rem', paddingLeft: '.5rem' }}>
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
            isFiveStar ? isFiveStar ? this.fiveStartMatrix() : this.defaultMatrix() : Skeleton
          }

        </div>
      </Layout>
    )
  }
}