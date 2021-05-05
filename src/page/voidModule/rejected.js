import React from "react";
import {Table,notification,Pagination,Tag,Input,Skeleton} from "antd";
import {openNotificationWithIcon, alterPath, UserProfile, debounce} from "../../utility";
import TransactionService from '../../service/VoidTransaction';
import moment from 'moment'
import { config } from "../../config";
import "./transaction.scss";

const { Search } = Input;

const getTag = (props) => {
  let color = "";
  let caption = ""
  switch(props) {
    case 1:
      color = "green"
      caption=config.voidStatus[1]
      break;
    case 2:
      caption=config.voidStatus[2]
      color = "blue"
      break;
    case 3:
      color = "red";
      caption=config.voidStatus[3]
      break;
    default:
        color = ""
        caption= "unknown status"
        break
  }
  return <Tag color={color}>{caption}</Tag>
}

const columns=[
  {
    title: 'Transaction Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render:(e)=> moment(e).format("MMMM DD, YYYY")
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
    render: (e) => e.personalInfo.fullName
  },
  {
    title: 'Reason',
    dataIndex: 'rejectReason',
    key: 'rejectReason',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text)=> getTag(text)
  }
];

class Rejected extends React.Component {

  constructor(props){
    super(props);
    this.state={
      data:[],
      search:'',
      page:1,
      limit:10,
      totalRecords:0,
      fetching:false
    }
    this.userProfileObject = UserProfile
    this.getVoidReport = debounce(this.getVoidReport, 1000);
  }

  componentDidMount(){
    this.setState({fetching:true},()=>this.getVoidReport());
  }

  getVoidReport = () =>{
    const{limit,page,search}=this.state;
    TransactionService.getTransactionsByStatus(search,page-1,limit,3).then(e=>{
      const{data,errorCode}=e.data
    
      if(errorCode){
        this.handleErrorNotification(errorCode)
      }else{
        const{list,pagination}=data
        const{ totalRecords }=pagination;
        this.setState({data:list, totalRecords, fetching:false})
      }
    }) 
    .catch(e=>{
      this.setState({fetching:false})
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

  doSearch = (val) =>{
    this.setState({search:val, page:1},()=>{
      this.getVoidReport()
    })
  }

  onPageChange = (page) =>{
    if(page !== this.state.page)
      this.setState({ page, fetching:true },
        ()=>this.getVoidReport())
  }

  render() {
    const{fetching}=this.state;
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
        fetching && <Skeleton active/>
      }
      { 
        !fetching && <Table
          scroll={{ x: true }}
          rowKey={(e) => e.key}
          pagination={false}
          columns={columns}
          dataSource={this.state.data}
        />
      }
      <div style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'1rem'}}>
      <Pagination
        onChange={page => this.onPageChange(page)}
        defaultCurrent={this.state.page}
        total={this.state.totalRecords}
        showSizeChanger={false}
      />
    </div>
      </>
      </div>
    );
  }
}

export default Rejected;
