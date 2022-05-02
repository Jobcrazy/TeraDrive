import React from "react";
import {
    Table,
    Row,
    Col,
    Input,
    Form,
    message,
    Button,
    Select,
    InputNumber,
    Upload,
    Space,
    Popconfirm,
    DatePicker,
} from "antd";
import moment from "moment";
import {
    DoubleLeftOutlined,
    FolderViewOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import utils from "../../common/Utils";
import constant from "../../common/Constant";
import axios from "axios";
import store from "../../store";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

const { Option } = Select;

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
        this.loadCustumers = this.loadCustumers.bind(this);
        this.attachmentTable = this.attachmentTable.bind(this);
        this.delAttachment = this.delAttachment.bind(this);
        this.onUpload = this.onUpload.bind(this);

        this.attachmentColumn = [
            {
                title: "File Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Action",
                key: "operation",
                fixed: "right",
                width: 150,
                render: (text, record) => (
                    <Space>
                        <a href={record.path} target="_blank" rel="noreferrer">
                            <Button
                                type="primary"
                                icon={<FolderViewOutlined />}
                                size="small"
                            >
                                View
                            </Button>
                        </a>
                        <Popconfirm
                            placement="left"
                            title="Are you sure to delete this file?"
                            onConfirm={() => this.delAttachment(record.id)}
                        >
                            <Button danger size="small">
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

        this.state = {
            customers: [],
            statements: [],
            attachments: [],
        };
    }

    setLoading(bLoading) {
        let action = {
            type: "setLoading",
            value: bLoading,
        };

        store.dispatch(action);
    }

    async loadCustumers() {
        this.setLoading(true);

        let self = this;
        const { cookies } = self.props;

        try {
            let res = await axios({
                method: "POST",
                url: utils.getDomain() + "/api/client/all",
                headers: { token: cookies.get("token") },
                data: {},
            });

            self.setLoading(false);
            if (1 === res.data.code) {
                self.props.history.push("/login");
            } else if (0 === res.data.code) {
                self.setState({
                    customers: res.data.data,
                });
            } else {
                message.error(res.data.message);
            }
        } catch (err) {
            self.setLoading(false);
            message.error(err.message);
        }
    }

    loadData(id) {
        this.setLoading(true);

        let self = this;
        const { cookies } = self.props;

        axios({
            method: "POST",
            url: utils.getDomain() + "/api/case/detail",
            headers: { token: cookies.get("token") },
            data: { id },
        })
            .then(function (res) {
                self.setLoading(false);
                if (1 === res.data.code) {
                    self.props.history.push("/login");
                } else if (0 === res.data.code) {
                    console.log(res.data.data);
                    self.formRef.current.setFieldsValue({
                        clientId: res.data.data.client.id,
                        drop: res.data.data.drop,
                        status: res.data.data.status,
                        progress: res.data.data.progress,
                        notes: res.data.data.notes,
                        type: res.data.data.type,
                        todo: res.data.data.todo,

                        malfunction: res.data.data.malfunction,
                        quote: res.data.data.quote,
                        paid: res.data.data.paid,
                        open: res.data.data.open,
                        format: res.data.data.format,
                        target: res.data.data.target,
                        referer: res.data.data.referer,
                        received: moment(
                            new Date(res.data.data.received),
                            "YYYY/MM/DD"
                        )
                            .endOf("day")
                            .add(0, "days"),
                        approved: moment(
                            new Date(res.data.data.approved),
                            "YYYY/MM/DD"
                        )
                            .endOf("day")
                            .add(0, "days"),
                    });
                    self.setState({
                        attachments: JSON.parse(res.data.data.files)
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

    async componentDidMount() {
        window.document.title = "Cases - TeraDrive";

        await this.loadCustumers();

        this.id = this.props.match.params.id;
        if ("0" !== this.id) {
            this.loadData(this.id);
        }

        store.dispatch({
            type: "setMenuItem",
            value: ["/main/cases"],
        });
    }

    onFinish(values) {
        this.setLoading(true);

        let url = "api/case/create";
        if ("0" !== this.id) {
            url = "api/case/update";
        }

        values.id = this.id;
        values.files = JSON.stringify(this.state.attachments);

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
                    self.props.history.push("/main/cases");
                } else {
                    message.error(res.data.message);
                }
            })
            .catch(function (err) {
                self.setLoading(false);
                message.error(err.message);
            });
    }

    onUpload(event) {
        this.setLoading(true);
        if (event.file.status === "done") {
            this.setLoading(false);
            let attachments = [...this.state.attachments];
            attachments.push(event.file.response.data);
            this.setState({
                attachments,
            });
        } else if (event.file.status === "error") {
            this.setLoading(false);
            message.error(event.file.name + ": Error while uploading");
        }
    }

    delAttachment(id) {
        let attachments = [...this.state.attachments];
        for (let index in attachments) {
            if (attachments[index].id === id) {
                attachments.splice(index, 1);
                break;
            }
        }
        this.setState({
            attachments: attachments,
        });
    }

    onGoback() {
        this.props.history.go(-1);
    }

    attachmentTable() {
        if (this.state.attachments && this.state.attachments.length) {
            return (
                <Form.Item colon={false} label="附件">
                    <Table
                        dataSource={this.state.attachments}
                        columns={this.attachmentColumn}
                        pagination={{
                            position: ["bottomLeft"],
                            pageSize: 100,
                            showQuickJumper: true,
                            pageSizeOptions: [20, 100, 500],
                            hideOnSinglePage: true,
                        }}
                        rowKey={(record) => record.id}
                    />
                </Form.Item>
            );
        }
        return null;
    }

    render() {
        const { cookies } = this.props;
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
                        label="Customer"
                        name="clientId"
                        rules={[
                            {
                                required: true,
                                message: "Please select a customer",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Please select a customer"
                            optionFilterProp="children"
                            //onChange={onChange}
                            filterOption={(input, option) =>
                                option.key
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {this.state.customers.map((value, index) => {
                                return (
                                    <Option
                                        value={value.id}
                                        key={
                                            value.id +
                                            " " +
                                            value.firstname +
                                            " " +
                                            value.lastname +
                                            " " +
                                            value.company
                                        }
                                    >
                                        {value.firstname} {value.lastname} -{" "}
                                        {value.company}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Drop Off Location"
                        name="drop"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Drop Off Location" />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Status"
                        name="status"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Please select a status"
                            optionFilterProp="children"
                            //onChange={onChange}
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {constant.status.map((value, index) => {
                                return (
                                    <Option value={value.id} key={value.id}>
                                        {value.text}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Progress"
                        name="progress"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Please select a status"
                            optionFilterProp="children"
                            //onChange={onChange}
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {constant.progress.map((value, index) => {
                                return (
                                    <Option value={value.id} key={value.id}>
                                        {value.text}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Notes"
                        name="notes"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Notes" />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Device Type"
                        name="type"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Device Type" />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Todo"
                        name="todo"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Todo" />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Malfunction"
                        name="malfunction"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="malfunction" />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Quote"
                        name="quote"
                        type="number"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Quote"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Paid"
                        name="paid"
                        type="number"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Paid"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="OK to Open"
                        name="open"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Please select a state"
                        >
                            {constant.yes_or_no.map((value, index) => {
                                return (
                                    <Option value={value.value} key={value.id}>
                                        {value.text}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Format to"
                        name="format"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Format to" />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Target Drive"
                        name="target"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Target Drive" />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Refered by"
                        name="referer"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Refered by" />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Received on"
                        name="received"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <DatePicker
                            picker="date"
                            format={"YYYY/MM/DD"}
                            placeholder="Received on"
                        />
                    </Form.Item>

                    <Form.Item
                        colon={false}
                        label="Approved on"
                        name="approved"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <DatePicker
                            picker="date"
                            format={"YYYY/MM/DD"}
                            placeholder="Approved on"
                        />
                    </Form.Item>

                    <this.attachmentTable />

                    <Form.Item
                        wrapperCol={{
                            offset: 3,
                        }}
                    >
                        <Upload
                            name="file"
                            action="/api/file/upload"
                            onChange={this.onUpload}
                            showUploadList={false}
                            headers={{
                                token: cookies.get("token"),
                            }}
                        >
                            <Button type="primary" icon={<UploadOutlined />}>
                                Upload File
                            </Button>
                        </Upload>
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
