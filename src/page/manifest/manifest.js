import React from "react";
import {Table,DatePicker,Button,Row,Col,Select,Skeleton,notification,AutoComplete,Pagination} from "antd";
import {openNotificationWithIcon,openNotificationWithDuration,alterPath,UserProfile} from "../../utility";
import ManifestService from "../../service/Manifest";
import RoutesService from "../../service/Routes";
import { PromptModal } from '../../component/modal';
import moment from "moment";
import "./manifest.scss";
import { config } from "../../config";

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = "MMM DD, YYYY";

const TableRoutesView = (props) => {
  const columns = [
    {
      title: "Trip Date",
      dataIndex: "date",
      defaultSortOrder: 'ascend', //"descend",
      sorter: (a, b) => moment(a.date) - moment(b.date),
    },
    {
      title: "Origin",
      dataIndex: "startStationName",
      defaultSortOrder: "startStationName",
    },
    {
      title: "Destination",
      dataIndex: "endStationName",
      defaultSortOrder: "endStationName",
    },
    {
      title: "Parcel",
      dataIndex: "count",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
        {
          record.status && <>
          <Button style={{fontSize:'10px'}} onClick={()=>props.onViewClick(record)}>View</Button>
          <Button style={{fontSize:'10px'}} onClick={()=>props.onPrint(record)}>Print</Button>
          {(record && (record.status.filter(e => e === 1 )).length > 0) && <Button disabled={record.disabled} style={{fontSize:'10px'}} onClick={()=>props.onCheckIn(record)}>Check-In</Button>}
          {(record.status.filter(e => e === 2 && e !== 1).length > 0) && <Button disabled={record.disabled} style={{fontSize:'10px'}} onClick={()=>props.onArrived(record)} >Arrived</Button>}
          </>
        }
        </div>
      ),
    },
  ];
  return (
    <Table
      pagination={false}
      columns={columns}
      dataSource={props.dataSource}
      onChange={props.onChange}
    />
  );
};

class Manifest extends React.Component {
  state = {
    endDay: moment().format(dateFormat),
    startDay: moment().format(dateFormat),
    fetching: false,
    listOfTripDates: undefined,
    tempDestinationList: [],
    selected: undefined,
    page: 0,
    limit: 10,
    totalRecords: 50,
    visibleCheckIn: false,
    visibleArrive: false,
    disabledArrive: false,
    disabledCheckIn: false,
    selectedRecord: undefined,
    originId: null,
    destinationId: null,
    startStationRoutes: [],
    endStationRoutes: [],
    startStationRoutesTemp:[],
    endStationRoutesTemp:[],
    dataSource:[]
  };

  componentDidMount() {
    this.setState({ fetching: true });
    try {
      RoutesService.getAllRoutes().then((e) => {
        const { data, errorCode } = e.data;
        if (errorCode) {
          this.handleErrorNotification(errorCode);
          return;
        }
        let state = { allRoutes: data };
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
          const startStationRoutes = [...[{stationId:'null', stationName:'-- All --' }], ..._startStationRoutes]
          state.startStationRoutes = startStationRoutes;
          state.startStationRoutesTemp = startStationRoutes;
        }else{
          state.originId =  UserProfile.getAssignedStationId()
          const endStationRoutes = this.getEndDestination(data, state.originId);
          state.endStationRoutesTemp = endStationRoutes
          state.endStationRoutes = endStationRoutes
        }
        this.setState(state,()=>this.getManifestByDestination(null, null));

      });
    } catch (error) {
      this.handleErrorNotification();
    }
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

  getManifestByDestination = (_startStationId, endStationId) => {
    let startStationId = UserProfile.getAssignedStationId();
    if (Number(UserProfile.getRole()) === Number(config.role["staff-admin"])) {
      startStationId = this.state.originId;
    }

    this.setState({ fetching: true });
    try {
      ManifestService.getManifestDateRange(
        moment(this.state.startDay).format("YYYY-MM-DD"),
        moment(this.state.endDay).format("YYYY-MM-DD"),
        startStationId,
        endStationId,
        this.state.page,
        this.state.limit
      ).then((e) => {
        console.info('e.data',e.data)
        const { data, success, errorCode } = e.data;
        if (success) {
          this.setState(
            {
              listOfTripDates: data[0].data || [],
              fetching: false,
              totalRecords:
                (data &&
                  Array.isArray(data[0].pageInfo) &&
                  data[0].pageInfo.length > 0 &&
                  data[0].pageInfo[0].count) ||
                0,
            },
            () => {
              if (!this.state.listOfTripDates) {
                return null;
              }

              let _data = this.state.listOfTripDates.map((e, i) => {
                return {
                  key: i,
                  tripId: e._id,
                  date: moment(e.date).format("MMMM DD, YYYY"),
                  count: e.count,
                  startStationName: e.startStationName,
                  endStationName: e.endStationName,
                  startStationId: e.startStation,
                  endStationId: e.endStation,
                  status: e.status,
                  showModalCheckIn: false,
                  showModalArrived: false,
                  disabled: false,
                };
              });
              this.setState({ dataSource: _data });
            }
          );
          return;
        }
        this.handleErrorNotification(errorCode);
      });
    } catch (error) {
      this.setState({ fetching: false }, () => {
        this.handleErrorNotification();
      });
    }
  };

  onForceLogout = (errorCode) => {
    openNotificationWithDuration("error", errorCode);
    UserProfile.clearData();
    this.props.history.push(alterPath("/login"));
  };

  onChangeTable = (pagination, filters, sorter, extra) => {};

  onChangeDatePicker = (date) => {
    const startDay = date[0];
    const endDay = date[1];

    if (startDay && endDay) {
      this.setState({ startDay, endDay, page: 0 }, () => this.getManifestByDestination(null, this.state.destinationId));
    }
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
      return [...[{end:'null', endStationName:"-- All --"}], ...destinations]
  };

  onSelectAutoComplete = (name, value) => {
    let selected = [];

    switch (name) {
      case "origin":
        selected = this.state.startStationRoutes
        .find((e) => e.stationName === value) || null;
        if(selected){
          const endStationRoutes = this.getEndDestination(this.state.allRoutes, selected.stationId);
          this.setState({ originId: selected.stationId, endStationRoutes, endStationRoutesTemp:endStationRoutes },
            ()=>this.getManifestByDestination('', null));
        }
        break;
      case "destination":
        selected = this.state.endStationRoutes
        .find((e) => e.endStationName === value) || null;
        if(selected){
          this.setState({destinationId:selected.end},()=>this.getManifestByDestination('', selected.end))
        }
        break;
      default:
        break;
    }
  };

  onCheckIn = (data) =>{
    const selectedRecord = { ...data };
    selectedRecord.showModalCheckIn = true;
    selectedRecord.disabled = false;
    this.setState({ selectedRecord });
  }

  onArrived = (data) => {
    const selectedRecord = { ...data };
    selectedRecord.showModalArrived = true;
    selectedRecord.disabled = false;
    this.setState({ selectedRecord });
  }

  onPrint = (data)=>{
    this.props.history.push(alterPath("/manifest/print"), {
      date: data.date,
      selected: data,
    })
  }

  onViewClick = (data) =>{
    this.props.history.push(alterPath("/manifest/details"), {
      date: data.date,
      selected: data,
    })
  }

  onModalArriveOkCLick = () =>{
    let selectedRecord = { ...this.state.selectedRecord };
    let dataSource = [...this.state.dataSource];

    const index = dataSource.findIndex(
      (e) => e.key === selectedRecord.key
    );
    selectedRecord.showModalArrived = false;
    selectedRecord.disabled = true;
    dataSource[index] = selectedRecord;

    this.setState({ selectedRecord, dataSource },()=>{
      const tripId = selectedRecord.tripId._id;
      ManifestService.arriveAllParcel(tripId)
      .then((e) => {
        this.setState({
          visibleArrive: false,
          disabledArrive: true,
          selectedRecord: undefined,
        },()=>this.getManifestByDestination(null, this.state.destinationId));
      })
    });
  }

  render() {
    const isAdmin = (Number(UserProfile.getRole()) === Number(config.role["staff-admin"]))
    return (
      <div className="manifest-page">
        <Row style={{ marginTop: "2rem", marginBottom: "1rem" }}>
          
          {
            isAdmin && <Col span={6}>
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
            </Col>
          }

          <Col span={6}>
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
          </Col>

          <Col offset={isAdmin ? 0 : 6} span={12}>
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
        {
          !this.state.fetching ? <TableRoutesView
              pagination={false}
              dataSource={this.state.dataSource}
              onChange={this.onChangeTable}
              onCheckIn={(data) => this.onCheckIn(data)}
              onArrived={(data)=>this.onArrived(data)}
              onPrint={(data) => this.onPrint(data)}
              onViewClick={(data) => this.onViewClick(data)}
            /> 
            : 
            (<Skeleton active />)
        }
        {this.state.dataSource && this.state.dataSource.length > 0 && (
          <div className="pagination-container">
            <Pagination
              onChange={(page) => this.setState({ page }, () => this.getManifestByDestination(null, this.state.destinationId))}
              defaultCurrent={this.state.page}
              total={this.state.totalRecords}
              showSizeChanger={false}
            />
          </div>
        )}
        <PromptModal
          title="Are you sure you want to arrived?"
          message="Press OK to change the status to received"
          disabled={Boolean((this.state.selectedRecord && this.state.selectedRecord.disabled) || false)}
          buttonType="primary"
          action="Arrive"
          visible={(this.state.selectedRecord && this.state.selectedRecord.showModalArrived) || false }
          handleCancel={() =>this.setState({ selectedRecord: undefined, visibleArrive: false })}
          handleOk={() => this.onModalArriveOkCLick()}
        />

        <PromptModal
          onEdit={false}
          visible={
            (this.state.selectedRecord &&
              this.state.selectedRecord.showModalCheckIn) ||
            false
          }
          title="Are you sure you want to check-in?"
          message="Press OK to change the status to in-transit"
          buttonType="primary"
          action="Check In"
          handleCancel={() =>
            this.setState({ selectedRecord: undefined, visibleCheckIn: false })
          }
          handleOk={() => {
            let selectedRecord = { ...this.state.selectedRecord };
            let dataSource = [...this.state.dataSource];

            const index = dataSource.findIndex(
              (e) => e.key === selectedRecord.key
            );
            selectedRecord.showModalCheckIn = false;
            selectedRecord.disabled = true;
            dataSource[index] = selectedRecord;

            const tripId = selectedRecord.tripId._id;
            this.setState({ selectedRecord, dataSource });

            ManifestService.checkInAllParcel(tripId).then((e) => {
              this.setState({
                visibleCheckIn: false,
                disabledCheckIn: false,
                selectedRecord: undefined,
              },()=>this.getManifestByDestination(null, this.state.destinationId));
            });
          }}
          disabled={Boolean(
            (this.state.selectedRecord && this.state.selectedRecord.disabled) ||
              false
          )}
        />
      </div>
    );
  }
}

export default Manifest;
