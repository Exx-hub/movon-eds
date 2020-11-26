import React from "react";
import Manifest from "../manifest";
import Reports from "../reports";
import User from "../../service/User";
import movonLogo from "../../assets/movoncargo.png";
import { UserProfile, alterPath } from "../../utility";
import { PriceMatrix, VictoryLinerMatrix } from "../priceMatrix";
import SalesReport from "../salesReport";
import SearchModule from "../searchModule";
import Transaction from "../transactionModule";
import {
  EditUserProfileModule,
  ViewUserProfileModule,
} from "../userProfileModule";
import { PromptModal } from "../../component/modal";

import moment from "moment";

import "./home.scss";

import { Switch, Route, Redirect } from "react-router-dom";

import { Layout, Row, Col, Button, Menu, Dropdown } from "antd";

import {
  FileMarkdownOutlined,
  UserOutlined,
  PoweroffOutlined,
  SettingOutlined,
  SnippetsOutlined,
  FileSearchOutlined,
  AppstoreAddOutlined,
  BarChartOutlined,
  SearchOutlined,
  InboxOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { config } from "../../config";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const tableSourceVliBitsi = [
  {
    title: "DATE",
    dataIndex: "sentDate",
    key: "sentDate",
    render: (text) => moment(text).format("MMM DD, YYYY"),
  },
  {
    title: "DESTINATION",
    dataIndex: "destination",
    key: "destination,",
  },
  {
    title: "SENDER",
    dataIndex: "sender",
    key: "sender,",
  },
  {
    title: "RECEIVER",
    dataIndex: "recipient",
    key: "recipient,",
  },
  {
    title: "WEIGHT",
    dataIndex: "packageWeight",
    key: "packageWeight",
  },
  {
    title: "DECLARED VALUE",
    dataIndex: "declaredValue",
    key: "declaredValue",
  },
  {
    title: "BL NO.",
    dataIndex: "billOfLading",
    key: "billOfLading",
  },
  {
    title: "OR NO.",
    dataIndex: "associatedORNumber",
    key: "associatedORNumber",
  },
  {
    title: "TARIFF",
    dataIndex: "associatedTariffRate",
    key: "associatedTariffRate",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "packageName",
    key: "packageName",
  },
  {
    title: "AMOUNT",
    dataIndex: "price",
    key: "price",
  },
];
const tableSourceBitsi = [
  {
    title: "DATE",
    dataIndex: "sentDate",
    key: "sentDate",
    render: (text) => moment(text).format("MMM DD, YYYY"),
  },
  {
    title: "BL NO.",
    dataIndex: "billOfLading",
    key: "billOfLading",
  },
  {
    title: "SENDER",
    dataIndex: "sender",
    key: "sender,",
  },
  {
    title: "SENDER PHONE#.",
    dataIndex: "senderPhoneNo",
    key: "senderPhoneNo,",
  },
  {
    title: "RECEIVER",
    dataIndex: "recipient",
    key: "recipient,",
  },
  {
    title: "RECEIVER PHONE#",
    dataIndex: "recipientPhoneNo",
    key: "recipientPhoneNo,",
  },
  {
    title: "DESTINATION",
    dataIndex: "destination",
    key: "destination,",
  },
  {
    title: "WEIGHT",
    dataIndex: "packageWeight",
    key: "packageWeight",
  },
  {
    title: "DECLARED VALUE",
    dataIndex: "declaredValue",
    key: "declaredValue",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "packageName",
    key: "packageName",
  },
  {
    title: "REMARKS",
    dataIndex: "remarks",
    key: "remarks",
  },
  {
    title: "AMOUNT",
    dataIndex: "price",
    key: "price",
  },
];

function Home(props) {
  //const [state, setState] = React.useState({});
  const [menuData, setMenuData] = React.useState([]);
  const [visibleLogout, setVisibleLogout] = React.useState(false);
  const [userProfileObject] = React.useState(UserProfile);

  console.info("UserProfile", UserProfile.getRole());

  React.useEffect(() => {
    if (menuData.length < 1) {
      setMenuData([
        {
          key: "create-parcel",
          destination: alterPath("/create-parcel"),
          action: () => {},
        },
        {
          key: "transaction-parcel",
          destination: alterPath("/transaction-parcel"),
          action: () => {},
        },
        {
          key: "search-parcel",
          destination: alterPath("/search-parcel"),
          action: () => {},
        },
        {
          key: "manifest-report",
          destination: alterPath("/manifest/list"),
          action: () => {},
        },
        {
          key: "matrix-own",
          destination: alterPath("/matrix/own"),
          action: () => {},
        },
        {
          key: "matrix-vli",
          destination: alterPath("/matrix/victory-liners"),
          action: () => {},
        },
        {
          key: "sales-vli-bitsi",
          destination: alterPath("/report/sales/vli-bitsi"),
          action: () => {},
        },
        {
          key: "sales-cargo",
          destination: alterPath("/report/sales/cargo"),
          action: () => {},
        },
        {
          key: "drop-down-user-profile",
          name: "User Profile",
          type: "menu",
          destination: alterPath("/user-profile"),
          icon: () => <UserOutlined />,
          action: () => {},
        },
        {
          key: "drop-down-setting",
          name: "About",
          type: "menu",
          destination: alterPath("/about"),
          icon: () => <InfoCircleOutlined />,
          action: () => {},
        },
        {
          key: "drop-down-logout",
          name: "Logout",
          type: "menu",
          destination: alterPath("/drop-down-logout"),
          icon: () => <PoweroffOutlined />,
          // action: () => userProfileObject.logout(User),
          action: () => {
            setVisibleLogout(true);
          },
        },
        {
          key: "about",
          destination: alterPath("/about"),
          action: () => {},
        },
      ]);
    }
  }, [menuData, userProfileObject]);

  const onNavigationMenuChange = (e) => {
    for (let i = 0; i < menuData.length; i++) {
      if (menuData[i].key === e.key) {
        menuData[i].action();
        props.history.push(menuData[i].destination || alterPath("/"));
        break;
      }
    }
  };

  const menu = () => {
    const menu = menuData.filter((e) => e.type === "menu");
    return (
      <Menu
        onClick={(e) => {
          onNavigationMenuChange(e);
        }}
      >
        {menu.map((e) => {
          const IconMenu = e.icon;
          return (
            <Menu.Item key={e.key}>
              {" "}
              <IconMenu /> {e.name}{" "}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  return (
    <Layout className="home-page-container">
      <Header className="home-header-view">
        <div>
          <img src={movonLogo} style={{ height: "50px" }} alt="logo" />
        </div>
        <div>
          {userProfileObject.getUser() && (
            <div className={"header-nav"}>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  className={"home-nav-link"}
                  type="link"
                  onClick={(e) => e.preventDefault()}
                >
                  Hi {userProfileObject.getUser().personalInfo.firstName}!
                  <UserOutlined style={{ fontSize: "24px" }} />
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
      </Header>
      <Layout className="home-body">
        <Sider width={250} className="home-sider">
          <div className="slider-container">
          <Menu
            style={{ marginTop: "1rem" }}
            theme="light"
            defaultOpenKeys={[]}
            mode="inline"
            onClick={(e) => {
              onNavigationMenuChange(e);
            }}
          >
            <Menu.Item key="search-parcel" icon={<SearchOutlined />}>
              Search
            </Menu.Item>

            <Menu.Item key="create-parcel" icon={<AppstoreAddOutlined />}>
              Create Parcel
            </Menu.Item>

            <Menu.Item key="manifest-report" icon={<InboxOutlined />}>
              Manifest
            </Menu.Item>

            <Menu.Item key="transaction-parcel" icon={<SnippetsOutlined />}>
              Void Transactions
            </Menu.Item>

            <SubMenu
              key="sales-report"
              icon={<BarChartOutlined />}
              title="Reports"
            >
              <Menu.Item key="sales-cargo" icon={<BarChartOutlined />}>
                Daily Sales
              </Menu.Item>
              {Boolean(false && userProfileObject.isIsarogLiners()) && (
                <Menu.Item key="sales-vli-bitsi" icon={<BarChartOutlined />}>
                  VLI - BITSI Sales
                </Menu.Item>
              )}
            </SubMenu>

            {Number(UserProfile.getRole()) === 2 && (
              <SubMenu
                key="matrix"
                icon={<FileMarkdownOutlined />}
                title="Matrix"
              >
                <Menu.Item key="matrix-own" icon={<FileMarkdownOutlined />}>
                  {userProfileObject.getBusCompany().name}
                </Menu.Item>
                {Boolean(userProfileObject.isIsarogLiners()) && (
                  <Menu.Item key="matrix-vli" icon={<FileMarkdownOutlined />}>
                    Victory Liners
                  </Menu.Item>
                )}
              </SubMenu>
            )}
          </Menu>
          <div className="version"><p>{process.env.NODE_ENV === "development" ? process.env.NODE_ENV : ""} {config.version.build}</p></div>
          </div>
        </Sider>
        <Layout>
          <Content className={"home-content"}>
            <Switch>

              <Route path={alterPath("/transaction-parcel")}>
                <Transaction {...props} />
              </Route>

              <Route path={alterPath("/manifest/list")}>
                <Manifest {...props} />
              </Route>

              <Route path={alterPath('/reports"')}>
                <Reports {...props} />
              </Route>

              <Route path={alterPath("/search-parcel")}>
                <SearchModule {...props} />
              </Route>

              <Route path={alterPath("/report/sales/cargo")}>
                <SalesReport
                  source={tableSourceBitsi}
                  {...props}
                  title="SUMMARY OF CARGO SALES"
                />
              </Route>

              <Route path={alterPath("/report/sales/cargo")}>
                <SalesReport
                  source={tableSourceBitsi}
                  {...props}
                  title="SUMMARY OF CARGO SALES"
                />
              </Route>

              <Route exact={true} path={alterPath("/user-profile")}>
                <ViewUserProfileModule {...props} />
              </Route>

              <Route exact={true} path={alterPath("/user-profile/edit")}>
                <EditUserProfileModule {...props} />
              </Route>

              <Route path={alterPath("/search-parcel")}>
                <SearchModule {...props} />
              </Route>

              { Number(UserProfile.getRole()) === Number(config.role["staff-admin"]) && (<Route path={alterPath("/matrix/own")}><PriceMatrix {...props} /></Route>) }
              { Number(UserProfile.getRole()) === Number(config.role["staff-admin"]) && (<Route path={alterPath("/matrix/victory-liners")}><VictoryLinerMatrix {...props} /></Route>) }
              { Number(UserProfile.getRole()) === Number(config.role["staff-admin"]) && (<Route path={alterPath("/report/sales/vli-bitsi")}><SalesReport source={tableSourceVliBitsi} isP2P={true} {...props} title="SUMMARY OF VLI-BITSI SALES" /></Route>) }
          
              <Redirect from="/" to={alterPath("/search-parcel")} />

            </Switch>
          </Content>
        </Layout>
      </Layout>
      <PromptModal
        visible={visibleLogout}
        title="Are you sure you want to log out?"
        message="Changes you made may not be saved."
        buttonType="danger"
        action="Logout"
        handleCancel={() => setVisibleLogout(false)}
        handleOk={() => {
          userProfileObject.logout(User);
          props.history.push(alterPath("/"));
        }}
      />
    </Layout>
  );
}
export default Home;
