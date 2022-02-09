import React from "react";
import Manifest from "../manifest";
import { UserProfile, alterPath } from "../../utility";
import { PriceMatrix, VictoryLinerMatrix } from "../priceMatrix";
import SalesReport from "../salesReport";
import SearchModule from "../searchModule";
import { Approved, Pending, Rejected } from "../voidModule";
import { LogoutModal } from "../../component/modal";


import "./home.scss";

import { Switch, Route, Redirect } from "react-router-dom";

import { Layout, Menu } from "antd";

import {
  FileMarkdownOutlined,
  SnippetsOutlined,
  AppstoreAddOutlined,
  BarChartOutlined,
  SearchOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { config } from "../../config";
import { Header } from "../../component/header";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

// Data table for daily sales report table VLI-BITSI ----- UNUSED for now //

// const tableSourceVliBitsi = [
//   {
//     title: "DATE",
//     dataIndex: "sentDate",
//     key: "sentDate",
//     render: (text) => moment(text).format("MMM DD, YYYY"),
//   },
//   {
//     title: "DESTINATION",
//     dataIndex: "destination",
//     key: "destination,",
//   },
//   {
//     title: "SENDER",
//     dataIndex: "sender",
//     key: "sender,",
//   },
//   {
//     title: "RECEIVER",
//     dataIndex: "recipient",
//     key: "recipient,",
//   },
//   {
//     title: "WEIGHT",
//     dataIndex: "packageWeight",
//     key: "packageWeight",
//   },
//   {
//     title: "DECLARED VALUE",
//     dataIndex: "declaredValue",
//     key: "declaredValue",
//   },
//   {
//     title: "BL NO.",
//     dataIndex: "billOfLading",
//     key: "billOfLading",
//   },
//   {
//     title: "OR NO.",
//     dataIndex: "associatedORNumber",
//     key: "associatedORNumber",
//   },
//   {
//     title: "TARIFF",
//     dataIndex: "associatedTariffRate",
//     key: "associatedTariffRate",
//   },
//   {
//     title: "DESCRIPTION",
//     dataIndex: "packageName",
//     key: "packageName",
//   },
//   {
//     title: "AMOUNT",
//     dataIndex: "systemFee",
//     key: "systemFee",
//   },
//   {
//     title: "AMOUNT",
//     dataIndex: "price",
//     key: "price",
//   },
// ];


function Home(props) {
  const [menuData, setMenuData] = React.useState([]);
  const [userProfileObject] = React.useState(UserProfile);
  const [logoutModal, setLogoutModal] = React.useState({ visible: false });

  // console.log("LOGGED FROM HOME.JS:", userProfileObject); // check if UserProfile has values already.

  // Side menu labels and routes
  React.useEffect(() => {
    // fills side menu with data like key and routes when clicked. action property has no use for now...
    if (menuData.length < 1) {
      setMenuData([
        {
          key: "search-parcel",
          destination: alterPath("/search-parcel"),
          action: () => {},
        },
        {
          key: "create-parcel",
          destination: alterPath("/create-parcel"),
          action: () => {},
        },
        {
          key: "approved-list",
          destination: alterPath("/transaction/approved-void"),
          action: () => {},
        },
        {
          key: "pending-list",
          destination: alterPath("/transaction/pending"),
          action: () => {},
        },
        {
          key: "rejected-list",
          destination: alterPath("/transaction/rejected-void"),
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
      ]);
    }
  }, [menuData, userProfileObject]);

  // Side menu navigation
  const onNavigationMenuChange = (e) => {
    for (let i = 0; i < menuData.length; i++) {
      if (menuData[i].key === e.key) {
        menuData[i].action();
        props.history.push(menuData[i].destination || alterPath("/"));
        break;
      }
    }
  };

  return (
    <Layout className="home-page-container">
      {/* HEADER -------------------------------------------- */}
      <Header
        {...props}
        setVisibleLogout={() =>
          setLogoutModal((oldState) => ({ ...oldState, ...{ visible: true } }))
        }
      />

      {/* WHOLE HOME BODY -- SIDER AND HOME LAYOUt ----------------------- */}
      <Layout className="home-body">
        {/* SIDE MENU UI AND ICONS LAYOUT HERE */}
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
              <Menu.Item
                key="search-parcel"
                icon={<SearchOutlined style={{ fontSize: "17px" }} />}
              >
                Search
              </Menu.Item>

              <Menu.Item
                key="create-parcel"
                icon={<AppstoreAddOutlined style={{ fontSize: "17px" }} />}
              >
                Create Parcel
              </Menu.Item>

              <Menu.Item
                key="manifest-report"
                icon={<InboxOutlined style={{ fontSize: "17px" }} />}
              >
                Manifest
              </Menu.Item>

              {/* VOID TRANSACTIONS --------------------- */}
              <SubMenu
                key="void-transactions"
                icon={<SnippetsOutlined />}
                title="Void Transactions"
              >
                <Menu.Item key="pending-list" icon={<ClockCircleOutlined />}>
                  Pending
                </Menu.Item>

                <Menu.Item key="approved-list" icon={<CheckCircleOutlined />}>
                  Approved
                </Menu.Item>

                <Menu.Item key="rejected-list" icon={<CloseCircleOutlined />}>
                  Rejected
                </Menu.Item>
              </SubMenu>

              {/* DAILY SALES SUBMENU ------------------ */}
              <SubMenu
                key="sales-report"
                icon={<BarChartOutlined />}
                title="Reports"
              >
                <Menu.Item key="sales-cargo" icon={<BarChartOutlined />}>
                  Daily Sales
                </Menu.Item>

                {/* I THINK THIS IS UNUSED ---------------- */}
                {Boolean(false && userProfileObject.isIsarogLiners()) && (
                  <Menu.Item key="sales-vli-bitsi" icon={<BarChartOutlined />}>
                    VLI - BITSI Sales
                  </Menu.Item>
                )}
              </SubMenu>

              {/* MATRIX SUB MENU ------------------- */}
              {Number(UserProfile.getRole()) === 2 && (
                <SubMenu
                  key="matrix"
                  icon={<FileMarkdownOutlined />}
                  title="Matrix"
                >
                  <Menu.Item key="matrix-own" icon={<FileMarkdownOutlined />}>
                    {UserProfile.getBusCompany() &&
                      UserProfile.getBusCompany().name}
                  </Menu.Item>
                  {Boolean(UserProfile.isIsarogLiners()) && (
                    <Menu.Item key="matrix-vli" icon={<FileMarkdownOutlined />}>
                      Victory Liners
                    </Menu.Item>
                  )}
                </SubMenu>
              )}
            </Menu>
            <div className="version">
              <p>
                {config.version.environment} build {config.version.build}
              </p>
            </div>
          </div>
        </Sider>
        {/* END OF SIDE MENU------------------------------- */}

        {/* ROUTES for page content depending on which side menu item is clicked -- HOME PAGE CONTENT---- */}
        <Layout>
          <Content className={"home-content"}>
            <Switch>
              <Route path={alterPath("/transaction/approved-void")}>
                <Approved {...props} />
              </Route>

              <Route path={alterPath("/transaction/pending")}>
                <Pending {...props} />
              </Route>

              <Route path={alterPath("/transaction/rejected-void")}>
                <Rejected {...props} />
              </Route>

              <Route path={alterPath("/manifest/list")}>
                <Manifest {...props} />
              </Route>

              <Route path={alterPath("/search-parcel")}>
                <SearchModule {...props} />
              </Route>

              <Route path={alterPath("/report/sales/cargo")}>
                <SalesReport
                  // source={tableSourceBitsi}
                  {...props}
                  title="SUMMARY OF CARGO SALES"
                />
              </Route>

              {/* CONDITIONAL MATRIX  ROUTES  */}
              {Number(UserProfile.getRole()) ===
                Number(config.role["staff-admin"]) && (
                <Route path={alterPath("/matrix/own")}>
                  <PriceMatrix {...props} />
                </Route>
              )}
              {Number(UserProfile.getRole()) ===
                Number(config.role["staff-admin"]) && (
                <Route path={alterPath("/matrix/victory-liners")}>
                  <VictoryLinerMatrix {...props} />
                </Route>
              )}
              {Number(UserProfile.getRole()) ===
                Number(config.role["staff-admin"]) && (
                <Route path={alterPath("/report/sales/vli-bitsi")}>
                  <SalesReport
                    // source={tableSourceVliBitsi} moved to salesReport.js
                    isP2P={true}
                    {...props}
                    title="SUMMARY OF VLI-BITSI SALES"
                  />
                </Route>
              )}
              {/* THIS IS THE DEFAULT ROUTE, GOES TO SEARCH AFTER LOGIN  */}
              <Redirect from="/" to={alterPath("/search-parcel")} />
            </Switch>
          </Content>
        </Layout>
        {/* END OF HOME PAGE CONTENT / ROUTES  */}
      </Layout>
      {/* END OF WHOLE SIDE MENU AND HOME PAGE  */}

      <LogoutModal
        {...props}
        visible={logoutModal.visible}
        handleCancel={() =>
          setLogoutModal((oldState) => ({ ...oldState, ...{ visible: false } }))
        }
      />
    </Layout>
  );
}
export default Home;
