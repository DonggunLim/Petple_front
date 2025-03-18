import { Outlet, useLocation } from "react-router-dom";
import "../index.css";
import Header from "./Header";
import MenuBar from "./MenuBar";
import HelmetMetaTags from "./HelmetMetaTags";

const BaseLayout = () => {
  const { pathname: currentPath } = useLocation();
  return (
    <>
      <HelmetMetaTags currentPath={currentPath} />
      <div className="wrapper">
        <Header />
        <div className="content">
          <Outlet />
        </div>
        <MenuBar />
      </div>
    </>
  );
};

export default BaseLayout;
