import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { user } = rest;
  return user ? <Element {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;
