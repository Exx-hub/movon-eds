import React from "react";
import {
  Table,
  DatePicker,
  Button,
  Row,
  Col,
  Select,
  Skeleton,
  Space,
  notification,
  AutoComplete,
  Pagination,
  Menu,
  Dropdown
} from "antd";
import {
  openNotificationWithIcon,
  openNotificationWithDuration,
  alterPath,
  UserProfile,
} from "../../utility";
import ManifestService from "../../service/Manifest";
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
        <Space>
          <Dropdown
                trigger={['click']}
                placement="bottomCenter"
                overlay={
                  <Menu>
                    <Menu.Item
                      disabled={!Boolean(record.status === 1)}
                      size="small"
                      onClick={() => props.onArrived(record)}
                    >
                      Arrived
                    </Menu.Item>
                    <Menu.Item className="menu-item"
                      size="small"
                      onClick={() => props.onViewClick(record)}
                    >
                      View
                    </Menu.Item>
                    <Menu.Item
                      size="small"
                      onClick={() => props.onPrint(record)}
                    >
                      Print
                    </Menu.Item>
                  </Menu>
                }>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  Edit
                </a>
              </Dropdown>
        </Space>
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
            selectedRoute: data[Number(routesIndex || 0)],
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
        console.log('manifest--->>',e)
        const { data, success, errorCode } = e.data;
        if (success) {
          this.setState({
            listOfTripDates: data[0].data || [],
            fetching: false,
            totalRecords: (data && Array.isArray(data[0].pageInfo) && data[0].pageInfo.length > 0 && data[0].pageInfo[0].count) || 0
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

    console.log('dataSource',this.state.routes)
    console.log('dataSource',this.state.routes)
    console.log('dataSource',this.state.routes)
    console.log('dataSource',this.state.routes)

    if (!this.state.listOfTripDates) {
      return null;
    }

    return this.state.listOfTripDates.map((e, i) => {
      let name = this.state.routes.find(item=>item.start === e.startStation && item.end === e.endStation)
      const endStationName = (name && name.endStationName) || ""
      const startStationName = (name && name.startStationName) || "";

      return {
        key: i,
        tripId: e._id,
        date: moment(e.date).subtract(8,'hours').format("MMMM DD, YYYY"),
        count: e.count,
        startStationName,
        endStationName,
        startStationId: e.startStation,
        endStationId: e.endStation,
        status: e.status
      };
    });
  };

  onChangeDatePicker = (date) => {
    const startDay = date[0];
    const endDay = date[1];

    if (startDay && endDay) {
      this.setState({ startDay, endDay }, () => {
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
              onSelect={(item) => {
                let selected = this.state.routes.find(
                  (e) => e.endStationName === item
                );
                if (selected) {
                  this.setState({ selected }, () =>
                    this.getManifestByDestination(selected.start, selected.end)
                  );
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
              dataSource={this.dataSource()}
              onChange={this.onChangeTable}
              onArrived={(data)=> {
                ManifestService.arriveAllParcel(data.tripId._id)
                .then(e=>{
                  const selectedRoute = this.state.selected;
                  const start = (selectedRoute && selectedRoute.start) || null;
                  const end = (selectedRoute && selectedRoute.end) || null;
                  this.getManifestByDestination(start,end);
                })
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
                if (selectedRoute) {
                  this.getManifestByDestination(selectedRoute.start, selectedRoute.end);
                }
              })
            }}
            defaultCurrent={this.state.page}
            total={this.state.totalRecords}
          />
        </div>)}
      </div>
    );
  }
}

export default Manifest;
