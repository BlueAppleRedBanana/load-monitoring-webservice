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
            index: {props.tickIndex} - {props.message}
        </li>
    );
}

export default AlertHistoryList;