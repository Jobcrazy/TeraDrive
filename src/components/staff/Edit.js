import React from "react";
import { Row, Col, Input, Form, message, Button, Checkbox } from "antd";
import { DoubleLeftOutlined } from "@ant-design/icons";
import utils from "../../common/Utils";
import axios from "axios";
import store from "../../store";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class UserEdit extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);

        this.id = 0;
        this.formRef = React.createRef();

        this.onFinish = this.onFinish.bind(this);
        this.onGoback = this.onGoback.bind(this);

        this.state = {
            isAdmin: false,
        };
    }

    setLoading(bLoading) {
        let action = {
            type: "setLoading",
            value: bLoading,
        };

        store.dispatch(action);
    }

    loadData(id) {
        this.setLoading(true);

        let self = this;
        const { cookies } = self.props;

        axios({
            method: "POST",
            url: utils.getDomain() + "/api/user/detail",
            headers: { token: cookies.get("token") },
            data: { id },
        })
            .then(function (res) {
                self.setLoading(false);
                if (1 === res.data.code) {
                    self.props.history.push("/login");
                } else if (0 === res.data.code) {
                    self.formRef.current.setFieldsValue({
                        username: res.data.data.username,
                        password: res.data.data.password,
                    });
                    self.setState({
                        isAdmin: res.data.data.isAdmin,
                    });
                } else {
                    message.error(res.data.message);
                }
            })
            .catch(function (err) {
                self.setLoading(false);
                message.error(err.message);
            });
    }

    componentDidMount() {
        window.document.title = "Staff - TeraDrive";

        this.id = this.props.match.params.id;
        if ("0" !== this.id) {
            this.loadData(this.id);
        }

        store.dispatch({
            type: "setMenuItem",
            value: ["/main/staff"],
        });
    }

    onFinish(values) {
        this.setLoading(true);
        // if has staaff ==?update, if not ===> create a new one
        let url = "api/user/create";
        if ("0" !== this.id) {
            url = "api/user/update";
        }

        values.id = this.id;
        values.isAdmin = this.state.isAdmin;

        let self = this;
        const { cookies } = self.props;

        axios({
            method: "POST",
            url: utils.getDomain() + url,
            headers: { token: cookies.get("token") },
            data: values,
        })
            .then(function (res) {
                self.setLoading(false);
                if (1 === res.data.code) {
                    self.props.history.push("/login");
                } else if (0 === res.data.code) {
                    self.props.history.push("/main/staff");
                } else {
                    message.error(res.data.message);
                }
            })
            .catch(function (err) {
                self.setLoading(false);
                message.error(err.message);
            });
    }

    onGoback() {
        this.props.history.go(-1);
    }

    render() {
        return (
            <Col span="24" style={{ backgroundColor: "#fff" }}>
                <Row style={{ marginBottom: "15px" }}>
                    <Button
                        type="link"
                        onClick={this.onGoback}
                        icon={<DoubleLeftOutlined />}
                    >
                        Back
                    </Button>
                </Row>
                {/* Enter Staff detail */}
                <Form
                    name="control-ref"
                    labelCol={{
                        span: 3,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
                    ref={this.formRef}
                >
                    <Form.Item
                        colon={false}
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "The length is at least 1",
                            },
                        ]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "The length is at least 5",
                                min: 5,
                            },
                        ]}
                    >
                        <Input placeholder="Password" type="password" />
                    </Form.Item>

                    <Form.Item colon={false} label="Is Admin">
                        <Checkbox
                            checked={this.state.isAdmin}
                            onChange={() => {
                                this.setState({
                                    isAdmin: !this.state.isAdmin,
                                });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 3,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        );
    }
}

export default withCookies(UserEdit);
