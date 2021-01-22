import React from 'react'
import { ArrowLeftOutlined, NumberOutlined } from "@ant-design/icons";
import { Button, notification, Layout, Checkbox } from "antd";

const { Header } = Layout;

export default (props)=>{
    return(<>
    <Header className="home-header-view" style={{ padding: 0 }}>
          <div style={{ 
              width:'100%', 
              display:'flex', 
              alignItems:'center',
              justifyContent:'space-between'}}>
            <div>
                <Button
                type="link"
                onClick={props.onNavigation}>
                <ArrowLeftOutlined style={{ fontSize: "20px", color: "#fff" }} />
                <span style={{ fontSize: "20px", color: "#fff" }}>{props.title}</span>
                </Button>
            </div>
            <div>
                { props.children }
            </div>
          </div>
        </Header>
    </>)
}