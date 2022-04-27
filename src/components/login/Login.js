import React from "react";
import { Row, Form, Col, Input, Button, message } from "antd";
import axios from "axios";
import utils from "../../common/Utils";
import "./Login.css";
import "../../store";
import store from "../../store";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class Login extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);

        this.onFinish = this.onFinish.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
    }

    componentDidMount() {
        window.document.title = "Login - TeraDrive";

        this.checkLogin();
    }

    setLoading(bLoading) {
        let action = {
            type: "setLoading",
            value: bLoading,
        };

        store.dispatch(action);
    }

    onFinish(values) {
        this.setLoading(true);

        let self = this;
        axios
            .post(utils.getDomain() + "api/user/login", values)
            .then(function (res) {
                if (0 === res.data.code) {
                    const { cookies } = self.props;
                    cookies.set("token", res.data.data.token, { path: "/" });

                    self.props.history.push("/main");
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

    checkLogin() {
        let self = this;
        const { cookies } = self.props;

        if(!cookies.get("token")){
            return;
        }

        axios({
            method: "GET",
            url: utils.getDomain() + "api/user/info",
            headers: { token: cookies.get("token") },
        })
            .then(function (res) {
                if (0 === res.data.code) {
                    self.props.history.push("/main");
                }
            })
            .catch(function (err) {
                message.error(err.message);
            });
    }

    render() {
        return (
            <Row justify="center" align="middle" className="container">
                <Col span={10}>
                    <Form name="basic" onFinish={this.onFinish}>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the username",
                                },
                            ]}
                        >
                            <Input placeholder="Username" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the password",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default withCookies(Login);
