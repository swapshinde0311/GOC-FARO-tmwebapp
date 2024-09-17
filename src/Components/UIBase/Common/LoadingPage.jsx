import React from "react";
import { Loader } from "@scuf/common";

LoadingPage.defaultProps = {
  loadingClass: "globalLoader",
};
export function LoadingPage({ message, loadingClass }) {
  return (
    <div className={`${loadingClass} authLoading`}>
      <Loader text=" " className={`${loadingClass}Position`}></Loader>
    </div>
  );
}
