import React from "react";
import { Row, Col, Input, Form, message, Button } from "antd";
import { DoubleLeftOutlined } from "@ant-design/icons";
import utils from "../../../common/Utils";
import axios from "axios";
import store from "../../../store";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./Edit.css";

const { TextArea } = Input;

class UserEdit extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);

        this.id = 0;
        this.formRef = React.createRef();
        this.editor = null;

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
            url: utils.getDomain() + "/api/template/email/detail",
            headers: { token: cookies.get("token") },
            data: { id },
        })
            .then(function (res) {
                self.setLoading(false);
                if (1 === res.data.code) {
                    self.props.history.push("/login");
                } else if (0 === res.data.code) {
                    self.formRef.current.setFieldsValue({
                        name: res.data.data.name,
                        //content: res.data.data.content,
                    });
                    self.editor.setData(res.data.data.content);
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
        window.document.title = "Email - Template - TeraDrive";

        store.dispatch({
            type: "setMenuItem",
            value: ["/main/templates/email"],
        });
    }

    onFinish(values) {
        this.setLoading(true);

        let url = "api/template/email/create";
        if ("0" !== this.id) {
            url = "api/template/email/update";
        }

        values.id = this.id;
        values.content = this.editor.getData();

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
                    self.props.history.push("/main/templates/email");
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
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "The length is at least 5",
                                min: 5,
                            },
                        ]}
                    >
                        <Input placeholder="Email Template Name" />
                    </Form.Item>

                    <Form.Item colon={false} label="Content">
                        <CKEditor
                            editor={ClassicEditor}
                            data=""
                            config={{
                                toolbar: {
                                    items: [
                                        "heading",
                                        "|",
                                        "bold",
                                        "italic",
                                        "|",
                                        "link",
                                        "|",
                                        "outdent",
                                        "indent",
                                        "|",
                                        "bulletedList",
                                        "numberedList",
                                        "|",
                                        "undo",
                                        "redo",
                                    ],
                                    shouldNotGroupWhenFull: true,
                                },
                            }}
                            onReady={(editor) => {
                                this.editor = editor;
                                this.id = this.props.match.params.id;
                                if ("0" !== this.id) {
                                    this.loadData(this.id);
                                }
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                console.log({ event, editor, data });
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
