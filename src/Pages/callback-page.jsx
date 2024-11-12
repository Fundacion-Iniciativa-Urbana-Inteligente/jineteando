import React from "react";
import { NavBar } from "../Components/navigation/desktop/nav-bar-tabs.js";
import { MobileNavBar } from "../components/navigation/mobile/mobile-nav-bar";

export const CallbackPage = () => {
  return (
    <div className="page-layout">
      <NavBar />
      <MobileNavBar />
      <div className="page-layout__content" />
    </div>
  );
};
