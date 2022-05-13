import React from "react";
import { Route, Redirect, withRouter, Switch } from "react-router-dom";
import { Layout, Menu, message } from "antd";
import axios from "axios";
import utils from "../../common/Utils";
import {
    FlagOutlined,
    DatabaseOutlined,
    SolutionOutlined,
    UsergroupAddOutlined,
    SettingOutlined,
    LogoutOutlined,
    FileWordOutlined,
} from "@ant-design/icons";
import store from "../../store";
import "./Main.css";

const WelcomePage = React.lazy(() => import("../welcome/Welcome"));
const CasePage = React.lazy(() => import("../case/Case"));
const CaseEdit = React.lazy(() => import("../case/Edit"));
const StaffPage = React.lazy(() => import("../staff/Staff"));
const StaffEdit = React.lazy(() => import("../staff/Edit"));
const CustomerPage = React.lazy(() => import("../customer/Customer"));
const CustomerEdit = React.lazy(() => import("../customer/Edit"));
const SMSPage = React.lazy(() => import("../template/sms/SMS"));
const SMSEdit = React.lazy(() => import("../template/sms/Edit"));
const EmailPage = React.lazy(() => import("../template/email/Email"));
const EmailEdit = React.lazy(() => import("../template/email/Edit"));
const StatusPage = React.lazy(() => import("../template/status/Status"));
const StatusEdit = React.lazy(() => import("../template/status/Edit"));
const ProgressPage = React.lazy(() => import("../template/progress/Progress"));
const ProgressEdit = React.lazy(() => import("../template/progress/Edit"));
const PasswordPage = React.lazy(() => import("../password/Password"));
const LogoutPage = React.lazy(() => import("../logout/Logout"));

const { Sider } = Layout;

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentItem: [],
        };

        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.setCurrentItem = this.setCurrentItem.bind(this);
        this.onClickLogout = this.onClickLogout.bind(this);
    }

    onMenuItemClick(event) {
        this.setCurrentItem(event.key);
        this.props.history.push(event.key);
    }

    setCurrentItem(item) {
        let action = {
            type: "setMenuItem",
            value: [item],
        };

        store.dispatch(action);
    }

    setLoading(bLoading) {
        let action = {
            type: "setLoading",
            value: bLoading,
        };

        store.dispatch(action);
    }

    onClickLogout() {
        this.setLoading(true);

        let self = this;
        axios
            .get(utils.getDomain() + "api/user/logout")
            .then(function (res) {
                if (
                    0 === parseInt(res.data.code) ||
                    1 === parseInt(res.data.code)
                ) {
                    self.props.history.push("/");
                } else {
                    message.error(res.data.message);
                }
                self.setLoading(false);
            })
            .catch(function (err) {
                message.error(err.message);
                self.setLoading(false);
            });
    }

    componentDidMount() {
        let self = this;
        self.setState({
            currentItem: store.getState().currentItem,
        });

        this.unsubscribe = store.subscribe(() => {
            if (
                self.state.currentItem.length !==
                    store.getState().currentItem.length ||
                self.state.currentItem[0] !== store.getState().currentItem[0]
            ) {
                self.setState({
                    currentItem: store.getState().currentItem,
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <Layout className="container">
                <Layout>
                    <Sider width={200} className="site-layout-background">
                        <div className="logo">TeraDrive</div>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={this.state.currentItem}
                            selectedKeys={this.state.currentItem}
                            style={{ height: "100%", borderRight: 0 }}
                            onClick={this.onMenuItemClick}
                            theme="dark"
                        >
                            {/* <Menu.Item
                                key="/main/welcome"
                                icon={<FlagOutlined />}
                            >
                                Welcome
                            </Menu.Item> */}
                            <Menu.Item
                                key="/main/cases"
                                icon={<DatabaseOutlined />}
                            >
                                Cases
                            </Menu.Item>
                            <Menu.Item
                                key="/main/customers"
                                icon={<SolutionOutlined />}
                            >
                                Customers
                            </Menu.Item>
                            <Menu.Item
                                key="/main/staff"
                                icon={<UsergroupAddOutlined />}
                            >
                                Staff
                            </Menu.Item>
                            <Menu.SubMenu
                                key="/main/templates"
                                title="Setting"
                                icon={<FileWordOutlined />}
                            >
                                <Menu.Item key="/main/templates/email">
                                    Email
                                </Menu.Item>
                                <Menu.Item key="/main/templates/sms">
                                    SMS
                                </Menu.Item>
                                <Menu.Item key="/main/templates/status">
                                    Status
                                </Menu.Item>
                                <Menu.Item key="/main/templates/progress">
                                    Progress
                                </Menu.Item>
                            </Menu.SubMenu>
                            <Menu.Item
                                key="/main/password"
                                icon={<SettingOutlined />}
                            >
                                Password
                            </Menu.Item>
                            <Menu.Item
                                key="/main/logout"
                                icon={<LogoutOutlined />}
                            >
                                Logout
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: "24px 24px 24px" }}>
                        <Switch>
                            <Redirect from="/main/" to="/main/cases" exact />
                            {/* <Route
                                path="/main/welcome"
                                component={WelcomePage}
                                exact
                            /> */}
                            <Route
                                path="/main/cases"
                                component={CasePage}
                                exact
                            />
                            <Route
                                path="/main/cases/edit/:id"
                                component={CaseEdit}
                                exact
                            />
                            <Route
                                path="/main/password"
                                component={PasswordPage}
                                exact
                            />
                            <Route
                                path="/main/staff"
                                component={StaffPage}
                                exact
                            />
                            <Route
                                path="/main/staff/edit/:id"
                                component={StaffEdit}
                                exact
                            />
                            <Route
                                path="/main/templates/sms"
                                component={SMSPage}
                                exact
                            />
                            <Route
                                path="/main/templates/sms/edit/:id"
                                component={SMSEdit}
                                exact
                            />
                            <Route
                                path="/main/templates/email"
                                component={EmailPage}
                                exact
                            />
                            <Route
                                path="/main/templates/email/edit/:id"
                                component={EmailEdit}
                                exact
                            />
                            <Route
                                path="/main/templates/status"
                                component={StatusPage}
                                exact
                            />
                            <Route
                                path="/main/templates/status/edit/:id"
                                component={StatusEdit}
                                exact
                            />
                            <Route
                                path="/main/templates/progress"
                                component={ProgressPage}
                                exact
                            />
                            <Route
                                path="/main/templates/progress/edit/:id"
                                component={ProgressEdit}
                                exact
                            />
                            <Route
                                path="/main/customers"
                                component={CustomerPage}
                                exact
                            />
                            <Route
                                path="/main/customer/edit/:id"
                                component={CustomerEdit}
                                exact
                            />
                            <Route
                                path="/main/logout"
                                component={LogoutPage}
                                exact
                            />
                        </Switch>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(Main);
