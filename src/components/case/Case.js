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
    Descriptions,
} from "antd";
import axios from "axios";
import utils from "../../common/Utils";
import constant from "../../common/Constant";
import { UserAddOutlined, EditOutlined } from "@ant-design/icons";
import store from "../../store";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

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

        let self = this;

        this.state = {
            dataSource: [],
            count: 0,
            limit: 20,
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
                        return record.client.phone;
                    },
                },
                {
                    title: "Email",
                    key: "email",
                    render: function (text, record, index) {
                        return record.client.email;
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

    render() {
        return (
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
                            <Descriptions.Item label="Todo">
                                {record.todo}
                            </Descriptions.Item>
                            <Descriptions.Item label="Malfunction">
                                {record.malfunction}
                            </Descriptions.Item>
                            <Descriptions.Item label="Quote">
                                {record.quote}
                            </Descriptions.Item>
                            <Descriptions.Item label="Paid">
                                {record.paid}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ok to Open">
                                {record.open ? "Yes" : "No"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Format to">
                                {record.format}
                            </Descriptions.Item>
                            <Descriptions.Item label="Refered by">
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
                        </Descriptions>
                    ),
                    rowExpandable: (record) =>
                        record.username !== "Not Expandable",
                }}
            />
        );
    }
}

export default withCookies(Case);
