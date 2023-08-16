import React from "react";
import { useMemo } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

import TableContainer from "../../../components/Common/TableContainer";
import { productData } from "../../../common/data";

import { Idno, Pdate, Type, Value, ValueInUsd, Amount } from "./CryptoWalCol";

const WalletActivities = ({ activeTab, toggleTab }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id No",
        accessor: "idno",
        filterable: true,
        Cell: cellProps => {
          return <Idno {...cellProps} />;
        },
      },
      {
        Header: "Date",
        accessor: "pdate",
        filterable: true,
        Cell: cellProps => {
          return <Pdate {...cellProps} />;
        },
      },
      {
        Header: "Type",
        accessor: "type",
        filterable: true,
        Cell: cellProps => {
          return <Type {...cellProps} />;
        },
      },
      {
        Header: "Currency",
        accessor: "coin",
        filterable: true,
        Cell: cellProps => {
          return <Value {...cellProps} />;
        },
      },
      {
        Header: "Amount",
        accessor: "amount",
        filterable: true,
        Cell: cellProps => {
          return <Amount {...cellProps} />;
        },
      },
      {
        Header: "Amount in USD",
        accessor: "valueInUsd",
        filterable: true,
        Cell: cellProps => {
          return <ValueInUsd {...cellProps} />;
        },
      },
    ],
    []
  );

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">Activities</h4>
        <ul className="nav nav-tabs nav-tabs-custom">
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === "1",
              })}
              onClick={() => {
                toggleTab("1");
              }}
            >
              All
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === "2",
              })}
              onClick={() => {
                toggleTab("2");
              }}
            >
              Buy
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === "3",
              })}
              onClick={() => {
                toggleTab("3");
              }}
            >
              Sell
            </NavLink>
          </NavItem>
        </ul>

        <div className="mt-4">
          <TableContainer
            columns={columns}
            data={productData}
            isGlobalFilter={true}
            customPageSize={10}
          />
        </div>
      </CardBody>
    </Card>
  );
};

WalletActivities.propTypes = {
  walletHistory: PropTypes.array,
  activeTab: PropTypes.string,
  toggleTab: PropTypes.func,
};

export default WalletActivities;
