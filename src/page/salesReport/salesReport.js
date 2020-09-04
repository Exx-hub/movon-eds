import React from 'react';
import { Table, Button, Row, Space, notification, Descriptions, Layout, Divider } from 'antd';
import { openNotificationWithIcon, openNotificationWithDuration, getUser, clearCredential } from '../../utility';
import ParcelService from '../../service/Parcel';
import moment from 'moment';
import './salesReport.scss';

const { Content } = Layout;
const { Item } = Descriptions;

const dateFormat = "MMM DD, YYYY";

const tableColumns = [
  {
    title: 'DATE',
    dataIndex: 'sentDate',
    key: 'sentDate',
    render: text => moment(text).format('MMM DD, YYYY')
  },
  {
    title: 'DESTINATION',
    dataIndex: 'destination',
    key: 'destination,'
  },
  {
    title: 'SENDER',
    dataIndex: 'sender',
    key: 'sender,'
  },
  {
    title: 'RECEIVER',
    dataIndex: 'receiver',
    key: 'receiver,'
  },
  {
    title: 'WEIGHT',
    dataIndex: 'weight',
    key: 'weight',
  },
  {
    title: 'DECLARED VALUE',
    dataIndex: 'declaredValue',
    key: 'declaredValue',
  },
  {
    title: 'BL NO.',
    dataIndex: 'billOfLading',
    key: 'billOfLading',
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'AMOUNT',
    dataIndex: 'amount',
    key: 'amount',
  }
];

class SalesReport extends React.Component {

  state = {
    endDay: moment().format(dateFormat),
    startDay: moment().subtract(3, 'd').format(dateFormat),
    fetching: false,
    exporting: false,
    transactions: null,
    summary: {},
    user: getUser(),
  };

  componentDidMount () {
    
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

  render() {
    return <Layout>
      <Content style={{padding:'1rem'}}>
        <div style={{marginBottom:'1rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
          <h3>SUMMARY OF CARGO SALES</h3>
          <h4>{moment().format('MMM DD, YYYY')}</h4>
        </div>
        <Table pagination={false} columns={tableColumns} dataSource={[1,2,3,4,5]} />
      </Content>
    </Layout>
  };
}


export default SalesReport;
