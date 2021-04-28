import React from "react";
import { Button, Table, notification, Pagination, Tag, Input, Skeleton } from "antd";
import { openNotificationWithIcon, alterPath, UserProfile, debounce } from "../../utility";
import TransactionService from '../../service/VoidTransaction';
import moment from 'moment'
import { config } from "../../config";
import { PromptModal } from '../../component/modal'
import "./transaction.scss";

const { Search } = Input;

const getTag = (props) => {
  let color = "";
  let caption = ""
  switch (props) {
    case 1:
      color = "green"
      caption = config.voidStatus[1]
      break;
    case 2:
      caption = config.voidStatus[2]
      color = "blue"
      break;
    case 3:
      color = "red";
      caption = config.voidStatus[3]
      break;
    default:
      color = ""
      caption = "unknown status"
      break
  }
  return <Tag color={color}>{caption}</Tag>
}

class Pending extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      search: '',
      page: 1,
      limit: 10,
      totalRecords: 0,
      fetching: false,
      visibleAccept: false,
      visibleReject: false,
      remarks: '',
      parcelId: undefined
    }
    this.userProfileObject = UserProfile
    this.getPendingReport = debounce(this.getPendingReport, 1000);
  }

  columns = [
    {
      title: 'Transaction Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (e) => moment(e).format("MMMM DD, YYYY")
    },
    {
      title: 'Bl No.',
      dataIndex: 'billOfLading',
      key: 'billOfLading',
    },
    {
      title: 'Requested By',
      dataIndex: 'deliveryPersonId',
      key: 'deliveryPersonId',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => getTag(text)
    },
    {
      title: 'Action',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button size="small" style={{ borderRadius: '7.5px', border: 0, fontSize: '0.65rem', marginBottom: '0.25rem', backgroundColor: '#006600', color: 'white' }} onClick={() => {
            this.setState({ parcelId: record.parcelId, visibleAccept: true })
          }}>
            Approve Void
          </Button>
          <Button type="danger" size="small" style={{ borderRadius: '7.5px', fontSize: '0.65rem' }} onClick={() => {
            this.setState({ parcelId: record.parcelId, visibleReject: true })
          }}>
            Reject Void
          </Button>
        </div>
      ),
    }
  ];

  componentDidMount() {
    this.setState({ fetching: true }, () => this.getPendingReport());
  }

  getPendingReport = () => {
    const { limit, page, search } = this.state;
    TransactionService.getTransactionsByStatus(search, page - 1, limit, 2).then(e => {
      const { data, errorCode } = e.data

      if (errorCode) {
        this.handleErrorNotification(errorCode)
      } else {
        const { list, pagination } = data
        const { totalRecords } = pagination;
        this.setState({ data: list, totalRecords, fetching: false })
      }
    })
      .catch(e => {
        this.setState({ fetching: false })
      })
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

  doSearch = (val) => {
    this.setState({ search: val, page: 1 }, () => {
      this.getPendingReport()
    })
  }

  onPageChange = (page) => {
    if (page !== this.state.page)
      this.setState({ page, fetching: true },
        () => this.getPendingReport())
  }

  handleCancel = () => {
    this.setState({
      visibleAccept: false,
      visibleReject: false
    });
  };

  handleAcceptVoid = () => {
    TransactionService.acceptVoid(this.state.parcelId).then(() => {
      this.getPendingReport()
      this.setState({ visibleAccept: false, parcelId: undefined })
    });
  }

  handleRejectVoid = () => {
    TransactionService.rejectVoid(this.state.parcelId, this.state.remarks).then(() => {
      this.getPendingReport();
      this.setState({ visibleReject: false, parcelId: undefined })
    })
  };

  render() {
    const { fetching } = this.state;
    return (
      <div className="trasaction-page">
        <>
          <div className="search-container">
            <Search
              value={this.state.searchValue}
              onChange={(e) => this.doSearch(e.target.value)}
              className="manifest-details-search-box"
              placeholder="Bill of Lading, Staff Name"
            />
          </div>
          {
            fetching && <Skeleton active />
          }
          {
            !fetching && <Table
              scroll={{ x: true }}
              rowKey={(e) => e.key}
              pagination={false}
              columns={this.columns}
              dataSource={this.state.data}
            />
          }
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '1rem' }}>
            <Pagination
              onChange={page => this.onPageChange(page)}
              defaultCurrent={this.state.page}
              total={this.state.totalRecords}
              showSizeChanger={false}
            />
          </div>
        </>
        <PromptModal
          handleOk={() => this.handleAcceptVoid()}
          handleCancel={() => this.handleCancel()}
          visible={this.state.visibleAccept}
          title={<span class="title"> Void Request </span>}
          message="Are you sure you want to reject this void request?"
          buttonType="danger"
          action="Void Parcel" />
        <PromptModal
          handleOk={() => this.handleRejectVoid()}
          handleCancel={() => this.handleCancel()}
          visible={this.state.visibleReject}
          title={<span class="title"> Are you sure you want to reject this void request? </span>}
          message="Enter reason/s for rejecting the void request:"
          buttonType="danger"
          action="Send Request"
          remarks={this.state.remarks}
          disabled={!this.state.remarks}
          onRemarksChange={(e) => this.setState({ remarks: e.target.value })} />
      </div>
    );
  }
}

export default Pending;
