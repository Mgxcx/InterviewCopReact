import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, Image } from "react-bootstrap";
import "../stylesheets/navbar.css";

function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" className="topbar">
      <Navbar.Brand>
        <div className="row">
          <Image src="../images/MikeChickenRight.png" className="logo" />
          <p className="title">InterviewCop</p>
        </div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <Link to="/home" className="linkstyle">
            Accueil
          </Link>
          <Link to="/account" className="linkstyle">
            Mon Compte
          </Link>
          <Link to="/interviewscreenhome" className="linkstyle">
            Entretien
          </Link>
          <Link to="/advices" className="linkstyle">
            Conseils
          </Link>
          <Link to="/shop" className="linkstyle">
            Shop
          </Link>
          <Link to="/" className="linkstyle">
            Déconnexion
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
