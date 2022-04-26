import React from "react";
import { Row, Form, Col, Input, Button, message } from "antd";
import axios from "axios";
import utils from "../../common/Utils";
import "./Login.css";
import "../../store";
import store from "../../store";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.onFinish = this.onFinish.bind(this);
    }

    componentDidMount() {
        window.document.title = "登录";

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
            .post(utils.getDomain() + "/api/user/login", values)
            .then(function (res) {
                if (0 === res.data.code) {
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
        axios
            .get(utils.getDomain() + "/api/user/info", {})
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

export default Login;
