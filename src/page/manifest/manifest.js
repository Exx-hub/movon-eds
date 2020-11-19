import React from "react";
import {
  Table,
  DatePicker,
  Button,
  Row,
  Col,
  Select,
  Skeleton,
  notification,
  AutoComplete,
  Pagination
} from "antd";
import {
  openNotificationWithIcon,
  openNotificationWithDuration,
  alterPath,
  UserProfile,
} from "../../utility";
import ManifestService from "../../service/Manifest";
import { PromptModal } from '../../component/modal';
import moment from "moment";
import "./manifest.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;

const dateFormat = "MMM DD, YYYY";


const TableRoutesView = (props) => {
  const columns = [
    {
      title: "Trip Date",
      dataIndex: "date",
      defaultSortOrder: "descend",
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
    routes: undefined,
    routesList: {
      value: undefined,
      options: [],
    },
    listOfTripDates: undefined,
    selectedRoute: undefined,
    tempDestinationList: [],
    selected: undefined,
    page: 0,
    limit: 10,
    totalRecords: 50,
    visibleCheckIn:false,
    visibleArrive:false,
    disabledArrive:false,
    disabledCheckIn:false,
    selectedRecord:undefined
  };

  constructor(props){
    super(props);
    this.userProfileObject = UserProfile
  }

  componentDidMount() {
    this.setState({ fetching: true });
    try {
      ManifestService.getRoutes().then((e) => {
        const { errorCode, success, data } = e.data;
        if (errorCode) {
          this.handleErrorNotification(errorCode);
        } else {
          this.setState({ fetching: false });
          if (!data || (data && data.length < 1)) {
            return;
          }

          const options = data.map((e, i) => {
            return {
              data: e,
              value: i,
              name: e.endStationName,
            };
          });

          const params = new URLSearchParams(this.props.location.search);
          const routesIndex = params.get("route-id"); // bar

          const routesList = {
            ...this.state.routesList,
            ...{ options, value: Number(routesIndex) },
          };
          const tempDestinationList = data
            .filter((e) => e !== null || e !== "null")
            .map((e) => e.endStationName);

          this.setState({
            routes: data,
            selectedRoute: undefined,
            routesList,
            tempDestinationList,
          });

          this.getManifestByDestination(null,null)
        }
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
      this.userProfileObject.clearData();
      this.props.history.push(alterPath("/"));
      return;
    }
    openNotificationWithIcon("error", code);
  };

  getManifestByDestination = (startStationId, endStationId) => {
    this.setState({ fetching: true });
    try {
      ManifestService.getManifestDateRange(
        this.state.startDay,
        this.state.endDay,
        startStationId,
        endStationId,
        this.state.page,
        this.state.limit
      ).then((e) => {
        console.log("getManifestDateRange",e)
        const { data, success, errorCode } = e.data;
        if (success) {
          this.setState({
            listOfTripDates: data[0].data || [],
            fetching: false,
            totalRecords: (data && Array.isArray(data[0].pageInfo) && data[0].pageInfo.length > 0 && data[0].pageInfo[0].count) || 0
          },()=>{
            if (!this.state.listOfTripDates) {
              return null;
            }

              let _data = this.state.listOfTripDates.map((e, i) => {
              let name = this.state.routes.find(item=>item.start === e.startStation && item.end === e.endStation)
              const endStationName = (name && name.endStationName) || ""
              const startStationName = (name && name.startStationName) || "";

              return {
                key: i,
                tripId: e._id,
                date: moment(e.date).subtract(8,"hours").format("MMMM DD, YYYY"),
                count: e.count,
                startStationName,
                endStationName,
                startStationId: e.startStation,
                endStationId: e.endStation,
                status: e.status,
                showModalCheckIn:false,
                showModalArrived:false,
                disabled:false
              };
            });
            this.setState({dataSource:_data})
          });
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
    this.userProfileObject.clearData();
    this.props.history.push(alterPath("/login"));
  };

  onChangeTable = (pagination, filters, sorter, extra) => {};

  handleSelectChange = (value) => {
    const data = this.state.routes[value];
    this.setState(
      {
        selectedRoute: data,
        routesList: { ...this.state.routesList, ...{ value } },
      },
      () => {
        this.getManifestByDestination(data.start, data.end);
        this.props.history.push({
          pathname: alterPath("/manifest/list"),
          search: `?route-id=${value}`,
        });
      }
    );
  };

  dataSource = () => {

    if (!this.state.listOfTripDates) {
      return null;
    }

    let _data = this.state.listOfTripDates.map((e, i) => {
      let name = this.state.routes.find(item=>item.start === e.startStation && item.end === e.endStation)
      const endStationName = (name && name.endStationName) || ""
      const startStationName = (name && name.startStationName) || "";

      return {
        key: i,
        tripId: e._id,
        date: moment(e.date).subtract(8,"hours").format("MMMM DD, YYYY"),
        count: e.count,
        startStationName,
        endStationName,
        startStationId: e.startStation,
        endStationId: e.endStation,
        status: e.status,
        showModal:false
      };
    });
    return _data;
  };

  onChangeDatePicker = (date) => {
    const startDay = date[0];
    const endDay = date[1];

    if (startDay && endDay) {
      this.setState({ startDay, endDay, page:1 }, () => {
        const selectedRoute = this.state.selected;
        const start = (selectedRoute && selectedRoute.start) || null;
        const end = (selectedRoute && selectedRoute.end) || null;
        this.getManifestByDestination(start,end);
      });
    }
  };

  doSearch = (el) => {
    const data = this.state.routesList.options;
    const toSearch = el.toLowerCase();
    const tempDestinationList = data
    .filter((e) => {
      return e.name.toLowerCase().includes(toSearch);
    })
    .map((e) => e.name);
    this.setState({ tempDestinationList });
  };

  render() {
    const { routes, routesList, fetching } = this.state;
    return (
      <div className="manifest-page">
        <Row style={{ marginTop: "2rem", marginBottom: "1rem" }}>
          <Col span={8}>
            <div style={{ display: "none" }}>
              {routesList && (
                <Select
                  size="large"
                  value={routesList.value}
                  style={{ width: "90%" }}
                  onChange={this.handleSelectChange}
                >
                  {routesList.options.map((e) => (
                    <Option key={e.value} value={e.value}>
                      {e.name}
                    </Option>
                  ))}
                </Select>
              )}
            </div>
            <AutoComplete
              dataSource={this.state.tempDestinationList}
              style={{ width: "100%" }}
              onChange={(item) => {
                let selected = this.state.routes.find(
                  (e) => e.endStationName === item
                );
                if (selected) {
                  this.setState({ selected }, () =>
                    this.getManifestByDestination(selected.start, selected.end),
                  );
                } else {
                  this.getManifestByDestination(null, null);
                }
              }}
              onSearch={(e) => this.doSearch(e)}
              placeholder="Destination"
            />
          </Col>
          <Col offset={4} span={12}>
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
        {!fetching ? (
          <>
            <TableRoutesView
              routes={routes}
              pagination={false}
              dataSource={this.state.dataSource}
              onChange={this.onChangeTable}
              onCheckIn={(data)=>{
                const selectedRecord={...data};
                selectedRecord.showModalCheckIn = true;
                selectedRecord.disabled = false;
                this.setState({selectedRecord})
              }}
              onArrived={(data)=> {
                const selectedRecord={...data};
                selectedRecord.showModalArrived = true;
                selectedRecord.disabled = false;
                this.setState({selectedRecord})
              }}
              onPrint={(data) =>
                this.props.history.push(alterPath("/manifest/print"), {
                  date: data.date,
                  selected: data,
                })
              }
              onViewClick={(data) =>
                this.props.history.push(alterPath("/manifest/details"), {
                  date: data.date,
                  selected: data,
                })
              }
            />
          </>
        ) : (
          <Skeleton active />
        )}
        {this.dataSource() && this.dataSource().length > 0 && (
          <div style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'1rem'}}>
          <Pagination
            onChange={(page) =>{
              this.setState({ page: page -1 }, ()=>{
                const selectedRoute = this.state.selected;
                const start = (selectedRoute && selectedRoute.start) ||  null
                const end = (selectedRoute && selectedRoute.end) ||  null
                this.getManifestByDestination(start, end);
              })
            }}
            defaultCurrent={this.state.page}
            total={this.state.totalRecords}
            showSizeChanger={false}
          />
        </div>)}
        <PromptModal
          visible={(this.state.selectedRecord && this.state.selectedRecord.showModalArrived) || false}
          title="Are you sure you want to arrived?"
          message="Press OK to change the status to received"
          disabled={Boolean((this.state.selectedRecord && this.state.selectedRecord.disabled) || false)}
          buttonType="primary"
          action="Arrive"
          handleCancel={()=>this.setState({selectedRecord:undefined, visibleArrive:false})}
          handleOk={()=>{
            let selectedRecord = {...this.state.selectedRecord}
            let dataSource = [...this.state.dataSource]

            const index = dataSource.findIndex(e=>e.key === selectedRecord.key)
            selectedRecord.showModalArrived=false;
            selectedRecord.disabled=true;
            dataSource[index] = selectedRecord;

            const tripId = selectedRecord.tripId._id
            this.setState({selectedRecord,dataSource})

            ManifestService.arriveAllParcel(tripId)
            .then(e=>{
              this.setState({visibleArrive:false, disabledArrive:true, selectedRecord:undefined})
              const selectedRoute = this.state.selectedRoute;
              const start = (selectedRoute && selectedRoute.start) || null;
              const end = (selectedRoute && selectedRoute.end) || null;
              this.getManifestByDestination(start,end)
            })
          }} />

          <PromptModal
          onEdit={false}
          visible={(this.state.selectedRecord && this.state.selectedRecord.showModalCheckIn) || false}
          title="Are you sure you want to check-in?"
          message="Press OK to change the status to in-transit"
          buttonType="primary"
          action="Check In"
          handleCancel={()=>this.setState({selectedRecord:undefined, visibleCheckIn:false})}
          handleOk={()=>{
            let selectedRecord = {...this.state.selectedRecord}
            let dataSource = [...this.state.dataSource]

            const index = dataSource.findIndex(e=>e.key === selectedRecord.key)
            selectedRecord.showModalCheckIn=false;
            selectedRecord.disabled=true;
            dataSource[index] = selectedRecord;

            const tripId = selectedRecord.tripId._id
            this.setState({selectedRecord,dataSource})

            ManifestService.checkInAllParcel(tripId)
            .then(e=>{
              this.setState({visibleCheckIn:false, disabledCheckIn:false, selectedRecord:undefined})
              const selectedRoute = this.state.selectedRoute;
              const start = (selectedRoute && selectedRoute.start) || null;
              const end = (selectedRoute && selectedRoute.end) || null;

              this.getManifestByDestination(start,end)
            })
          }}
          disabled={Boolean((this.state.selectedRecord && this.state.selectedRecord.disabled) || false)}
          />
      </div>
    );
  }
}

export default Manifest;
