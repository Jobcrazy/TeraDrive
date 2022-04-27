import React from "react";
import { Row, Form, Col, Input, Button, message } from "antd";
import axios from "axios";
import Utils from "../../common/Utils";
import "../../store";
import store from "../../store";
import "./Password.css";

class Password extends React.Component {
    constructor(props) {
        super(props);

        this.onFinish = this.onFinish.bind(this);
    }

    componentDidMount() {
        window.document.title = "Change Password";
    }

    setLoading(bLoading) {
        let action = {
            type: "setLoading",
            value: bLoading,
        };

        store.dispatch(action);
    }

    onFinish(values) {
        if (values.password != values.confirm) {
            message.error("Password doesn not match");
            return;
        }

        this.setLoading(true);

        let self = this;
        axios
            .post("/api/user/password/", values)
            .then(function (res) {
                if (0 === res.data.code) {
                    message.success("Password updated");
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

    render() {
        return (
            <Row justify="center" align="middle" className="container">
                <Form name="basic" onFinish={this.onFinish}>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Retype Password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Row>
        );
    }
}

export default Password;
