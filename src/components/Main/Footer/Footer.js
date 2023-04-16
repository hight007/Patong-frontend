import React from "react";
import package_ from '../../../../package.json';

const Footer = () => {
  return (
    <footer className="main-footer bg-black">
      
      <div className="float-right d-none d-sm-inline-block">
        Develop by : Tarin Nuttee | <b >Version :</b> {package_.version}
      </div>
    </footer>
  );
};

export default Footer;
