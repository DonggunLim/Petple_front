import "../../../index.css";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../Header";
import MenuBar from "../../MenuBar";
import HelmetMetaTags from "../../HelmetMetaTags";
import { useMemo } from "react";
import { simpleLayoutPath } from "@/consts/simpleLayoutPath";

const BaseLayout = () => {
  const { pathname: currentPath } = useLocation();
  const isSimpleLayout = useMemo(
    () => simpleLayoutPath.some((path) => currentPath.startsWith(path)),
    [currentPath]
  );

  return (
    <>
      <HelmetMetaTags currentPath={currentPath} />
      <div className="wrapper">
        <Header />
        <div className="content">
          <Outlet />
        </div>
        {isSimpleLayout || <MenuBar />}
      </div>
    </>
  );
};

export default BaseLayout;
