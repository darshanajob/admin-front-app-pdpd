import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom";
// get user role
const user = JSON.parse(localStorage.getItem("authUser"));
const userRole = user?.roles[0].name;
console.log(userRole, 'userRole');

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isSuperAdmin,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (isAuthProtected && !localStorage.getItem("auth-token")) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }else{
        return(
          <Layout>
            <Component {...props} />
          </Layout>
        )
      /*  if (isSuperAdmin && userRole ==='super-admin' ) {
          return (
            <Layout>
              <Component {...props} />
            </Layout>
          )
        }else{
          return (
            <Redirect
              to={{ pathname: "/pages-404", state: { from: props.location } }}
            />
          )
        }*/
      }
    }}
  />
)

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
  isSuperAdmin:PropTypes.bool
}

export default Authmiddleware;
