import React from 'react';
import { Table, Button, Row, Space, notification, Descriptions, Layout, Divider } from 'antd';
import { openNotificationWithIcon, openNotificationWithDuration, getUser, clearCredential } from '../../utility';
import ParcelService from '../../service/Parcel';
import moment from 'moment';
import './reports.scss';

const { Content } = Layout;
const { Item } = Descriptions;

const dateFormat = "MMM DD, YYYY";

const tableColumns = [
  {
    title: 'Date Sent',
    dataIndex: 'sentDate',
    key: 'sentDate',
    render: text => moment(text).format('MMM DD, YYYY hh:mm A')
  },
  {
    title: 'Origin Station',
    dataIndex: 'origin',
    key: 'origin,'
  },
  {
    title: 'Destination Station',
    dataIndex: 'destination',
    key: 'destination,'
  },
  {
    title: 'Scan Code',
    dataIndex: 'scanCode',
    key: 'scanCode,'
  },
  {
    title: 'Parcel Description',
    dataIndex: 'packageName',
    key: 'packageName',
  },
  {
    title: 'Parcel Weight',
    dataIndex: 'packageWeight',
    key: 'packageWeight',
  },
  {
    title: 'Charged Amount',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Sender',
    dataIndex: 'sender',
    key: 'sender',
  },
  {
    title: 'Recipient',
    dataIndex: 'recipient',
    key: 'recipient',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

class Reports extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      endDay: moment().format(dateFormat),
      startDay: moment().subtract(3, 'd').format(dateFormat),
      fetching: false,
      exporting: false,
      transactions: null,
      summary: {},
      user: getUser(),
    };
  }

  componentDidMount () {
    try {
      this.setState({ fetching: true });

      Promise.all([
        ParcelService.getTransactions(this.state.user.busCompanyId._id),
        ParcelService.getTransactionSummary(this.state.user.busCompanyId._id),
      ]).then(responses => {

        const { errorCode0, success: success0, parcels } = responses[0].data;
        const { errorCode1, success: success1 } = responses[1].data;

        if ((!success0 && errorCode0) || (!success1 && errorCode1)) {
          this.handleErrorNotification(errorCode0 || errorCode1);
        }

        this.setState({
          transactions: parcels,
          summary: responses[1].data,
          fetching: false,
        });
      });
    } catch (error) {
      this.handleErrorNotification();
    }
  }

  exportAll = () => {
    try {
      this.setState({ exporting: true });
      console.log('exporting transactions');
      ParcelService
      .exportTransactions(this.state.user.busCompanyId._id)
      .then(() => {
        this.setState({ exporting: false });
      });
    } catch (error) {
      this.handleErrorNotification();
    }
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
      this.props.history.push('/');
      return;
    }
    openNotificationWithIcon('error', code);
  }

  onForceLogout = (errorCode) => {
    openNotificationWithDuration('error', errorCode);
    clearCredential();
    this.props.history.push('/login')
  }

  render() {
    const{ fetching, exporting, transactions, summary, user } = this.state;
    return <Layout>
      <Content className='reports-page'>
        <Row className='title'>Parcel Summary</Row>
        <Row className='summary-info'>
          <Descriptions bordered size='small'>
            <Item label='Bus Company' span='3'>{user.busCompanyId.name}</Item>
            <Item label='Total Parcels' span='2'>{summary.bookingsCount || 0}</Item>
            <Item label='Net Amount'>{summary.totalPrice || 0}</Item>
            <Item label='No. of Parcels Confirmed'>{summary.confirmedCount || 0}</Item>
            <Item label='No. of Parcels On Going'>{summary.inTransitCount || 0}</Item>
            <Item label='No. of Parcels Delivered'>{summary.completedCount || 0}</Item>
          </Descriptions>
        </Row>
        <Divider orientation='center'>Transactions</Divider>
        <Row style={{ marginBottom: '16px' }}>
          <Space>
            <Button>Clear Filters</Button>
            <Button onClick={this.exportAll} disabled={exporting}>Export All</Button>
          </Space>
        </Row>
        <Table
          dataSource={transactions}
          columns={tableColumns}
          loading={fetching}
        />
      </Content>
    </Layout>
  };
}


export default Reports;
