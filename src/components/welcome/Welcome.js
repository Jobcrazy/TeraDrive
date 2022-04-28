import React from "react";
import store from "../../store";

class Welcome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    setLoading(bLoading) {
        let action = {
            type: "setLoading",
            value: bLoading,
        };

        store.dispatch(action);
    }

    componentDidMount() {
        window.document.title = "Welcome - TeraDrive";

        let action = {
            type: "setMenuItem",
            value: ["/main/welcome"],
        };
        store.dispatch(action);
    }

    render() {
        return (
            <span>Welcome!</span>
        );
    }
}

export default Welcome;
