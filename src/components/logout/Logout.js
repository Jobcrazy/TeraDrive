import React from "react";
import store from "../../store";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class Logout extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.document.title = "Logout - TeraDrive";

        let action = {
            type: "setMenuItem",
            value: ["/main/logout"],
        };
        store.dispatch(action);

        const { cookies } = this.props;
        cookies.remove("token");

        this.props.history.replace("/");
    }

    render() {
        return (
            <></>
        );
    }
}

export default withCookies(Logout);
