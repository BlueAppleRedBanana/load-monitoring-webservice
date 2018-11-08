import React from "react";

const AlertHistoryList = ({ alertHistory }) => {
    const renderList = () => alertHistory.map(
        (item, index) => <Item key={index} {...item}/>
    );
    return (
        <ul>
            {renderList()}
        </ul>
    );
};

const Item = (props) => {
    return (
        <li>
            time: {props.timestamp} {props.message}  load: {props.load} index: {props.tickIndex}
        </li>
    );
}

export default AlertHistoryList;