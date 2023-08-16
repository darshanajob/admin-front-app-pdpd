import React from 'react';
import { Link } from 'react-router-dom';
import * as moment from "moment";
import { size, map } from "lodash";
import { Badge } from "reactstrap"


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


const Agent_name = (cell) => {
    return cell.value ? cell.value : '';
};

const ReferenceNumber = (cell) => {
    return cell.value ? cell.value : '';
};

/*const Status = (cell) => {
  return cell.value ? cell.value : '';
};*/

/*const Status = (cell) => {
    return (
        <Badge
            className={"font-size-12 badge-soft-" +
                (cell.value === "SUCCESS" ? "success" : "danger" && cell.value === "NOT_APPROVED" ? "warning" : "danger")}
        >
            {cell.value}
        </Badge>
    )
};*/
const Student_name = (cell) => {
    return cell.value ? cell.value : '';
};

/*const PaymentDate = (cell) => {

    return moment(cell.value).utc().format('YYYY-MM-DD') ? moment(cell.value).utc().format('YYYY-MM-DD') : '';
};*/

const Agent_call_status = (cell) => {
    return cell.value ? cell.value : '';
};

const Payment_status = (cell) => {
    return cell.value ? cell.value : '';
};

const Student_nic = (cell) => {
    return cell.value ? cell.value : '';
};

const MobileNoS = (cell) => {
    return '0'+cell.value ? cell.value : '';
};

const S_half = (cell) => {
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
    ReferenceNumber,

    Agent_name,
    Student_name,
    Agent_call_status,
    Payment_status,
    Student_nic,
    Img,
    MobileNoS,
    S_half
};
