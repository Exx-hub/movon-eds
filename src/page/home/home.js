import React from "react";
import Manifest from "../manifest";
import { UserProfile, alterPath } from "../../utility";
import { PriceMatrix, VictoryLinerMatrix } from "../priceMatrix";
import SalesReport from "../salesReport";
import SearchModule from "../searchModule";
import { Approved, Pending, Rejected } from "../voidModule";
import { LogoutModal } from "../../component/modal";

import moment from "moment";

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
    dataIndex: "systemFee",
    key: "systemFee",
  },
  {
    title: "AMOUNT",
    dataIndex: "price",
    key: "price",
  },
];

const tableSourceBitsi = [
  {
    title: "BL NO.",
    dataIndex: "billOfLading",
    key: "billOfLading",
    fixed: "left",
    width: 100,
  },
  {
    title: "DATE",
    dataIndex: "sentDate",
    key: "sentDate",
  },
  {
    title: "ORIGIN",
    dataIndex: "origin",
    key: "origin",
  },
  {
    title: "DESTINATION",
    dataIndex: "destination",
    key: "destination",
  },
  {
    title: "SENDER",
    dataIndex: "sender",
    key: "sender",
  },
  {
    title: "SENDER PHONE#.",
    dataIndex: "senderPhoneNo",
    key: "senderPhoneNo",
  },
  {
    title: "RECEIVER",
    dataIndex: "recipient",
    key: "recipient",
  },
  {
    title: "RECEIVER PHONE#",
    dataIndex: "recipientPhoneNo",
    key: "recipientPhoneNo,",
  },
  {
    title: "WEIGHT",
    dataIndex: "packageWeight",
    key: "packageWeight",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "packageName",
    key: "packageName",
  },
  {
    title: "PARCEL STATUS",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "REMARKS",
    dataIndex: "remarks",
    key: "remarks",
  },

  {
    title: "DECLARED VALUE",
    dataIndex: "declaredValue",
    key: "declaredValue",
    align: "right",
  },
  {
    title: "SYSTEM FEE",
    dataIndex: "systemFee",
    key: "systemFee",
    align: "right",
  },
  {
    title: "AMOUNT",
    dataIndex: "price",
    key: "price",
    align: "right",
  },
];

function Home(props) {
  const [menuData, setMenuData] = React.useState([]);
  const [userProfileObject] = React.useState(UserProfile);
  const [logoutModal, setLogoutModal] = React.useState({ visible: false });

  React.useEffect(() => {
    if (menuData.length < 1) {
      setMenuData([
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

  return (
    <Layout className="home-page-container">
      <Header
        {...props}
        setVisibleLogout={() =>
          setLogoutModal((oldState) => ({ ...oldState, ...{ visible: true } }))
        }
      />
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
                  source={tableSourceBitsi}
                  {...props}
                  title="SUMMARY OF CARGO SALES"
                />
              </Route>

              {/* <Route path={alterPath("/search-parcel")}>
                <SearchModule {...props} />
              </Route> */}

              {/* <Route path={alterPath("/report/sales/cargo")}>
                <SalesReport
                  source={tableSourceBitsi}
                  {...props}
                  title="SUMMARY OF CARGO SALES"
                />
              </Route> */}

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
                    source={tableSourceVliBitsi}
                    isP2P={true}
                    {...props}
                    title="SUMMARY OF VLI-BITSI SALES"
                  />
                </Route>
              )}

              <Redirect from="/" to={alterPath("/search-parcel")} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
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
