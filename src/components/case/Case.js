import React from "react";
import { Link } from "react-router-dom";
import {
    Space,
    Row,
    Col,
    Popconfirm,
    Table,
    message,
    Button,
    Form,
    Input,
    Select,
    Modal,
    Descriptions,
} from "antd";
import axios from "axios";
import utils from "../../common/Utils";
import constant from "../../common/Constant";
import { UserAddOutlined, EditOutlined } from "@ant-design/icons";
import store from "../../store";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

const { TextArea } = Input;
const { Option } = Select;

class Case extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);

        this.onTableTitle = this.onTableTitle.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
        this.onAddSupplier = this.onAddSupplier.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.handleDel = this.handleDel.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.loadSMSTemplates = this.loadSMSTemplates.bind(this);
        this.loadEmailTemplates = this.loadEmailTemplates.bind(this);
        this.onSMSChange = this.onSMSChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onSMSSend = this.onSMSSend.bind(this);

        this.smsTemplates = [];
        this.emailTemplates = [];
        this.formRef = React.createRef();
        this.formEmailRef = React.createRef();

        let self = this;

        this.state = {
            isModalVisible: false,
            dataSource: [],
            count: 0,
            emailContent: "",
            limit: 20,
            smsReceiver: "",
            emailReceiver: "",
            bSearchMode: false,
            columns: [
                {
                    title: "ID",
                    dataIndex: "id",
                    key: "id",
                    width: 80,
                },
                {
                    title: "Name",
                    key: "name",
                    render: function (text, record, index) {
                        return (
                            record.client.firstname +
                            " " +
                            record.client.lastname
                        );
                    },
                },
                {
                    title: "Phone",
                    key: "phone",
                    render: function (text, record, index) {
                        return (
                            <Button
                                type="link"
                                size="small"
                                onClick={() => {
                                    self.setState({
                                        smsReceiver: record.client.phone,
                                        isModalVisible: true,
                                    });
                                }}
                            >
                                {record.client.phone}
                            </Button>
                        );
                    },
                },
                {
                    title: "Email",
                    key: "email",
                    render: function (text, record, index) {
                        return (
                            <Button
                                type="link"
                                size="small"
                                onClick={() => {
                                    self.setState({
                                        emailReceiver: record.client.email,
                                        isEmailModalVisible: true,
                                    });
                                }}
                            >
                                {record.client.email}
                            </Button>
                        );
                    },
                },
                {
                    title: "DropOff Location",
                    render: function (text, record, index) {
                        return record.drop;
                    },
                },
                {
                    title: "Status",
                    render: function (text, record, index) {
                        return constant.status[record.status - 1].text;
                    },
                },
                {
                    title: "Progress",
                    render: function (text, record, index) {
                        return constant.progress[record.progress - 1].text;
                    },
                },
                {
                    title: "Assigned To",
                    render: function (text, record, index) {
                        return constant.assigned[record.assigned - 1].text;
                    },
                },
                {
                    title: "Notes",
                    dataIndex: "notes",
                    key: "notes",
                },
                {
                    title: "Action",
                    key: "operation",
                    fixed: "right",
                    width: 150,
                    render: (text, record) => (
                        <Space>
                            <Link to={"/main/cases/edit/" + record.id}>
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<EditOutlined />}
                                >
                                    Edit
                                </Button>
                            </Link>

                            <Popconfirm
                                placement="right"
                                title="Are you sure to delete this case?"
                                onConfirm={() => this.handleDel(record.id)}
                            >
                                <Button danger size="small">
                                    Delete
                                </Button>
                            </Popconfirm>
                        </Space>
                    ),
                },
            ],
        };
    }

    sendEmail(address) {
        //window.location.href =
        //    "mailto:mail@example.org?subject=test&body=ddd";
        window.location.href = "mailto:" + address;
    }

    setLoading(bLoading) {
        let action = {
            type: "setLoading",
            value: bLoading,
        };

        store.dispatch(action);
    }

    onPageChange(page, size) {
        if (this.state.bSearchMode) {
            return;
        }
        this.loadPage(page, size);
    }

    onShowSizeChange(page, size) {
        this.setState({
            limit: size,
        });

        if (this.state.bSearchMode) {
            return;
        }

        this.loadPage(page, size);
    }

    onAddSupplier() {
        this.props.history.push("/main/cases/edit/0");
    }

    handleDel(id) {
        this.setLoading(true);

        let self = this;
        const { cookies } = self.props;

        axios({
            method: "POST",
            url: utils.getDomain() + "api/case/delete",
            headers: { token: cookies.get("token") },
            data: { id },
        })
            .then(function (res) {
                self.setLoading(false);
                if (1 === res.data.code) {
                    return self.props.history.push("/login");
                } else if (0 === res.data.code) {
                    self.reloadPage(1, self.state.limit);
                } else {
                    message.error(res.data.message);
                }
            })
            .catch(function (err) {
                message.error(err.message);
                self.setLoading(false);
            });
    }

    loadPage(page, pageSize) {
        this.setLoading(true);

        let self = this;
        const { cookies } = self.props;

        axios({
            method: "POST",
            url: utils.getDomain() + "api/case/list",
            headers: { token: cookies.get("token") },
            data: { page: page, limit: pageSize },
        })
            .then(function (res) {
                self.setLoading(false);
                if (1 === res.data.code) {
                    return self.props.history.push("/login");
                } else if (0 === res.data.code) {
                    self.setState({
                        dataSource: res.data.data.data,
                        count: res.data.data.count,
                    });
                } else {
                    message.error(res.data.message);
                }
            })
            .catch(function (err) {
                message.error(err.message);
                self.setLoading(false);
            });
    }

    componentDidMount() {
        window.document.title = "Cases - TeraDrive";

        this.loadSMSTemplates();
        this.loadEmailTemplates();

        this.loadPage(1, 20);

        let action = {
            type: "setMenuItem",
            value: ["/main/cases"],
        };
        store.dispatch(action);
    }

    reloadPage() {
        this.setState({ bSearchMode: false });
        this.loadPage(1, 20);
    }

    async loadSMSTemplates() {
        try {
            this.setLoading(true);

            const { cookies } = this.props;

            let res = await axios({
                method: "POST",
                url: utils.getDomain() + "api/template/sms/list",
                headers: { token: cookies.get("token") },
                data: {},
            });

            this.setLoading(false);

            if (1 === res.data.code) {
                return this.props.history.push("/login");
            } else if (0 === res.data.code) {
                this.smsTemplates = res.data.data.data;
            } else {
                message.error(res.data.message);
            }
        } catch (err) {
            message.error(err.message);
            this.setLoading(false);
        }
    }

    async loadEmailTemplates() {
        try {
            this.setLoading(true);

            const { cookies } = this.props;

            let res = await axios({
                method: "POST",
                url: utils.getDomain() + "api/template/email/list",
                headers: { token: cookies.get("token") },
                data: {},
            });

            this.setLoading(false);

            if (1 === res.data.code) {
                return this.props.history.push("/login");
            } else if (0 === res.data.code) {
                this.emailTemplates = res.data.data.data;
            } else {
                message.error(res.data.message);
            }
        } catch (err) {
            message.error(err.message);
            this.setLoading(false);
        }
    }

    onTableTitle() {
        return (
            <Row>
                <Col span="18"></Col>
                <Col span="6" style={{ textAlign: "right" }}>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={this.onAddSupplier}
                    >
                        New Case
                    </Button>
                </Col>
            </Row>
        );
    }

    onSMSChange(value) {
        for (let i = 0; i < this.smsTemplates.length; ++i) {
            if (this.smsTemplates[i].id === value) {
                this.formRef.current.setFieldsValue({
                    content: this.smsTemplates[i].content,
                });
            }
        }
    }

    onEmailChange(value) {
        for (let i = 0; i < this.emailTemplates.length; ++i) {
            if (this.emailTemplates[i].id === value) {
                this.setState({
                    emailContent: this.emailTemplates[i].content,
                });
            }
        }
    }

    async onSMSSend(values) {
        try {
            this.setLoading(true);
            this.setState({ isModalVisible: false });

            const { cookies } = this.props;

            let res = await axios({
                method: "POST",
                url: utils.getDomain() + "api/template/sms/send",
                headers: { token: cookies.get("token") },
                data: values,
            });

            this.setLoading(false);

            if (1 === res.data.code) {
                return this.props.history.push("/login");
            } else if (0 === res.data.code) {
                message.success("Message Sent");
            } else {
                message.error(res.data.message);
            }
        } catch (err) {
            message.error(err.message);
            this.setLoading(false);
        }
    }

    render() {
        return (
            <>
                <Modal
                    title="SMS"
                    visible={this.state.isModalVisible}
                    onOk={() => {
                        this.formRef.current.submit();
                    }}
                    onCancel={() => {
                        this.setState({
                            isModalVisible: false,
                        });
                    }}
                    destroyOnClose={true}
                >
                    <Form
                        name="control-ref"
                        initialValues={{
                            phone: this.state.smsReceiver,
                        }}
                        onFinish={this.onSMSSend}
                        ref={this.formRef}
                        preserve={false}
                        labelCol={{ span: 4 }}
                    >
                        <Form.Item
                            colon={false}
                            label="Receiver"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Input Your Receiver",
                                },
                            ]}
                        >
                            <Input placeholder="Your Receiver" disabled />
                        </Form.Item>

                        <Form.Item
                            colon={false}
                            label="Template"
                            name="template"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Please select a template"
                                optionFilterProp="children"
                                onChange={this.onSMSChange}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.smsTemplates.map((value, index) => {
                                    return (
                                        <Option value={value.id} key={value.id}>
                                            {value.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            colon={false}
                            label="Content"
                            name="content"
                            rules={[
                                {
                                    required: true,
                                    message: "The length is at least 5",
                                    min: 5,
                                },
                            ]}
                        >
                            <TextArea
                                placeholder="SMS Content"
                                maxLength="250"
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Email"
                    visible={this.state.isEmailModalVisible}
                    onOk={() => {
                        this.setState({
                            isEmailModalVisible: false,
                            emailContent: "",
                        });
                        this.sendEmail(this.state.emailReceiver);
                    }}
                    onCancel={() => {
                        this.setState({
                            isEmailModalVisible: false,
                            emailContent: "",
                        });
                    }}
                    destroyOnClose={true}
                    width="80vw"
                >
                    <Form
                        name="control-ref"
                        initialValues={{
                            email: this.state.emailReceiver,
                        }}
                        onFinish={this.onSMSSend}
                        ref={this.formEmailRef}
                        preserve={false}
                        labelCol={{ span: 4 }}
                    >
                        <Form.Item
                            colon={false}
                            label="Receiver"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Input Your Receiver",
                                },
                            ]}
                        >
                            <Input placeholder="Your Receiver" disabled />
                        </Form.Item>

                        <Form.Item
                            colon={false}
                            label="Template"
                            name="template"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Please select a template"
                                optionFilterProp="children"
                                onChange={this.onEmailChange}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.emailTemplates.map((value, index) => {
                                    return (
                                        <Option value={value.id} key={value.id}>
                                            {value.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Form>

                    <div
                        dangerouslySetInnerHTML={{
                            __html: this.state.emailContent,
                        }}
                    />
                </Modal>

                <Table
                    dataSource={this.state.dataSource}
                    columns={this.state.columns}
                    pagination={{
                        position: ["bottomLeft"],
                        total: this.state.count,
                        showTotal: (total, range) => `Total: ${total} `,
                        pageSize: this.state.limit,
                        showQuickJumper: true,
                        onChange: this.onPageChange,
                        pageSizeOptions: [20, 100, 500],
                        onShowSizeChange: this.onShowSizeChange,
                    }}
                    title={this.onTableTitle}
                    rowKey={(record) => record.id}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Descriptions size="small" column={3}>
                                <Descriptions.Item label="Device Type">
                                    {record.type}
                                </Descriptions.Item>
                                <Descriptions.Item label="Malfunction">
                                    {record.malfunction}
                                </Descriptions.Item>
                                <Descriptions.Item label="Quote">
                                    {record.quote}
                                </Descriptions.Item>
                                <Descriptions.Item label="Paid">
                                    {record.paid ? "Yes" : "No"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ok to Open">
                                    {record.open ? "Yes" : "No"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Format to">
                                    {constant.format[record.format - 1].text}
                                </Descriptions.Item>
                                <Descriptions.Item label="Referred by">
                                    {record.referer}
                                </Descriptions.Item>
                                <Descriptions.Item label="Target Drive">
                                    {record.target}
                                </Descriptions.Item>
                                <Descriptions.Item label="Received On">
                                    {record.received}
                                </Descriptions.Item>
                                <Descriptions.Item label="Approved On">
                                    {record.approved}
                                </Descriptions.Item>
                                <Descriptions.Item label="Quote sent on">
                                    {record.quoted}
                                </Descriptions.Item>
                                <Descriptions.Item label="Completed on">
                                    {record.completed}
                                </Descriptions.Item>
                                <Descriptions.Item label="Drop off Location">
                                    {record.client.drop}
                                </Descriptions.Item>
                            </Descriptions>
                        ),
                        rowExpandable: (record) =>
                            record.username !== "Not Expandable",
                    }}
                />
            </>
        );
    }
}

export default withCookies(Case);
