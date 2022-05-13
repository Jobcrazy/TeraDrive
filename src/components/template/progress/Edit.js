import React from "react";
import { Row, Col, Input, Form, message, Button } from "antd";
import { DoubleLeftOutlined } from "@ant-design/icons";
import utils from "../../../common/Utils";
import axios from "axios";
import store from "../../../store";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

const { TextArea } = Input;

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
            url: utils.getDomain() + "/api/progress/detail",
            headers: { token: cookies.get("token") },
            data: { id },
        })
            .then(function (res) {
                self.setLoading(false);
                if (1 === res.data.code) {
                    self.props.history.push("/login");
                } else if (0 === res.data.code) {
                    self.formRef.current.setFieldsValue({
                        id: res.data.data.id,
                        content: res.data.data.content,
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
        window.document.title = "progress - TeraDrive";

        this.id = this.props.match.params.id;
        if ("0" !== this.id) {
            this.loadData(this.id);
        }

        store.dispatch({
            type: "setMenuItem",
            value: ["/main/templates/progress"],
        });
    }

    onFinish(values) {
        this.setLoading(true);

        let url = "api/progress/create";
        if ("0" !== this.id) {
            url = "api/progress/update";
        }

        values.id = this.id;

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
                    self.props.history.push("/main/templates/progress");
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
                        label="Content"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: "The length is at least 1",
                                min: 1,
                            },
                        ]}
                    >
                        <TextArea placeholder="progress Content" maxLength="250"/>
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
