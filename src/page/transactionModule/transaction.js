import React from "react";
import {
  Table,
  Button,
  Space,
  notification,
  Pagination
} from "antd";
import {openNotificationWithIcon, alterPath, UserProfile} from "../../utility";
import "./transaction.scss";

const columns=[
  {
    title: 'Transaction Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Bill Of Lading',
    dataIndex: 'billOfLading',
    key: 'billOfLading',
  },
  
  {
    title: 'Type',
    dataIndex: 'billOfLading',
    key: 'billOfLading',
  },
  {
    title: 'Status',
    dataIndex: 'billOfLading',
    key: 'billOfLading',
  },
  {
    title: 'Remarks',
    dataIndex: 'billOfLading',
    key: 'billOfLading',
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <Space>
        <Button
          style={{ color: "white", fontWeight: "200", background: "teal" }}
          size="small"
          onClick={() => this.onViewClick(record)}
        > View </Button>
      </Space>
    ),
  },
];

class Transaction extends React.Component {
  state={
    data:[]
  }

  constructor(props){
    super(props);
    this.userProfileObject = UserProfile
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

  render() {
    return (
      <div className="trasaction-page">
      <>
      <Table
        rowKey={(e) => e.key}
        pagination={false}
        columns={columns}
        dataSource={this.state.data}
      />
      <div style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'1rem'}}>
      <Pagination
        onChange={page => this.setState({ page: page -1 })}
        defaultCurrent={this.state.page}
        total={this.state.totalRecords}
      />
    </div>
      </>
      </div>
    );
  }
}

export default Transaction;
