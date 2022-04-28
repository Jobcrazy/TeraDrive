import React, { Suspense } from "react";
import {
    HashRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./App.css";
import store from "./store";

const Login = React.lazy(() => import("./components/login/Login"));
const Main = React.lazy(() => import("./components/main/Main"));

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bLoading: false,
        };
    }

    componentDidMount() {
        let self = this;
        this.unsubscribe = store.subscribe(() => {
            self.setState({
                bLoading: store.getState().bLoading,
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <CookiesProvider>
                <Suspense
                    fallback={
                        <Spin
                            size="large"
                            tip="Loading..."
                            indicator={
                                <LoadingOutlined
                                    style={{ fontSize: 24 }}
                                    spin
                                />
                            }
                        >
                            <div className="App" />
                        </Spin>
                    }
                >
                    <Spin
                        size="large"
                        spinning={this.state.bLoading}
                        tip="Loading..."
                        indicator={
                            <LoadingOutlined style={{ fontSize: 24 }} spin />
                        }
                    >
                        <div className="App">
                            <Router>
                                <Switch>
                                    <Redirect path="/" to="/login" exact />
                                    <Route
                                        path="/login"
                                        component={Login}
                                        exact
                                    />
                                    <Route path="/main" component={Main} />
                                </Switch>
                            </Router>
                        </div>
                    </Spin>
                </Suspense>
            </CookiesProvider>
        );
    }
}

export default App;
