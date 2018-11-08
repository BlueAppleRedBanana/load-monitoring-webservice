import React from "react";

export default class AlertHistoryList extends React.Component {
    constructor(props) {
        super();
        const defaultState = {
            alertHistory: props.alertHistory,
        };
        this.state = defaultState;
    }

    renderList() {
        return (
            this.state.alertHistory.map(
                (item, index) => <Item key={index} {...item}/>
            )
        );
    }

    render() {
        return (
            <ul>
                {this.renderList()}
            </ul>
        )
    }
}

const Item = (props) => {
    return (
        <li>
            time: {props.timestamp} {props.message}  load: {props.load} index: {props.tickIndex}
        </li>
    );
}