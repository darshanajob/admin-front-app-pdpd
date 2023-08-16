import React from 'react';
import { Link } from 'react-router-dom';
import * as moment from "moment";
import { size, map } from "lodash";


const formateDate = (date, format) => {
    const dateFormat = format ? format : "DD MMM Y";
    const date1 = moment(new Date(date)).format(dateFormat);
    return date1;
};
const toLowerCase1 = str => {
    return (
        str === "" || str === undefined ? "" : str.toLowerCase()
    );
};

const Name = (cell) => {
    return cell.value ? cell.value : '';
};

const Email = (cell) => {
    return cell.value ? cell.value : '';
};

const Mobile = (cell) => {
    return '0'+cell.value ? cell.value : '';
};

const Status = (cell) => {
    return cell.value ? cell.value : '';
    // if (cell.value === 1) {

    //     return cell.value ? "ADMIN ENTERED" : '';
    // } else if (cell.value === 2) {

    //     return cell.value ? "AGENT ENTERED" : '';
    // } else if (cell.value === 3) {

    //     return cell.value ? "Contacted (No Answer)" : '';
    // } else if (cell.value === 4) {

    //     return cell.value ? "Contacted (Number Busy)" : '';
    // } else if (cell.value === 5) {

    //     return cell.value ? "Contacted (Success)" : '';
    // }
};

const Agent = (cell) => {
    // console.log(cell.value, 'agent');
    return cell.value ? cell.value : '';
};

const Tags = (cell) => {
    return (
        <>
            {map(
                cell.value,
                (tag, index) =>
                    index < 2 && (
                        <Link
                            to="#"
                            className="badge badge-soft-primary font-size-11 m-1"
                            key={"_skill_" + cell.value + index}
                        >
                            {tag}
                        </Link>

                    )
            )}
            {size(cell.value) > 2 && (
                <Link
                    to="#"
                    className="badge badge-soft-primary font-size-11 m-1"
                    key={"_skill_" + cell.value}
                >
                    {size(cell.value) - 1} + more
                </Link>
            )}
        </>
    );
};

const Projects = (cell) => {
    return cell.value ? cell.value : '';
};

const Img = (cell) => {
    return (
        <>
            {!cell.value ? (
                <div className="avatar-xs">
                    <span className="avatar-title rounded-circle">
                        {console.log("cell", cell.data[0].name)}
                        {cell.data[0].name.charAt(0)}
                    </span>
                </div>
            ) : (
                <div>
                    <img
                        className="rounded-circle avatar-xs"
                        src={cell.value}
                        alt=""
                    />
                </div>
            )}
        </>
    );
};

export {
    Name,
    Email,
    Mobile,
    Status,
    Agent,
    Tags,
    Projects,
    Img
};
