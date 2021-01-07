import React from "react";
import { Navbar, Image } from "react-bootstrap";
import "../stylesheets/navbar.css";

function NavBar2() {
  return (
    <Navbar expand="lg" variant="dark" className="topbar">
      <div className="row justify-items-center align-items-center">
        <Image src="../images/MikeChickenRight.png" className="logo" />
        <p className="title">InterviewCop</p>
      </div>
    </Navbar>
  );
}

export default NavBar2;
