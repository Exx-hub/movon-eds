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
import TransactionService from '../../service/VoidTransaction';
import moment from 'moment'
import { config } from "../../config";



const columns=[
  {
    title: 'Transaction Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render:(e)=> moment(e).format("MMMM DD, YYYY")
  },
  {
    title: 'Bill Of Lading',
    dataIndex: 'billOfLading',
    key: 'billOfLading',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (text)=> (config.voidType[text].toUpperCase())
  },
  {
    title: 'Requested By',
    dataIndex: 'deliveryPersonId',
    key: 'deliveryPersonId',
  },
  {
    title: 'Reason',
    dataIndex: 'remarks',
    key: 'remarks',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text)=> (config.voidStatus[text].toUpperCase())
  }
];

class Transaction extends React.Component {

  state={
    data:[]
  }

  constructor(props){
    super(props);
    this.userProfileObject = UserProfile
  }

  componentDidMount(){
    TransactionService.getAllTransaction().then(e=>{
      console.log("eeeee",e)
      const{data,errorCode}=e.data
      if(errorCode){
        this.handleErrorNotification(errorCode)
      }else{
        console.log(data.list)
        this.setState({data:data.list})
      }
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
