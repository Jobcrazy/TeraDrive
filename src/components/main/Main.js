import React from "react";
import { Route, Redirect, withRouter, Switch } from "react-router-dom";
import { Layout, Menu, message, Image } from "antd";
import axios from "axios";
import utils from "../../common/Utils";
import {
    DatabaseOutlined,
    SolutionOutlined,
    UsergroupAddOutlined,
    SettingOutlined,
    LogoutOutlined,
    FileWordOutlined,
} from "@ant-design/icons";
import store from "../../store";
import "./Main.css";
import main_logo from "../../assets/images/main_logo.png";

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
                        <div className="logo">
                            <Image
                                preview={false}
                                src={main_logo}
                                fallback="data:image/png;base64,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"
                            />
                        </div>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={this.state.currentItem}
                            selectedKeys={this.state.currentItem}
                            style={{ height: "100%", borderRight: 0 }}
                            onClick={this.onMenuItemClick}
                            theme="dark"
                            //defaultOpenKeys={["/main/templates"]}
                        >
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
                                title="Settings"
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
