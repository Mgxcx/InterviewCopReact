import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, Image } from "react-bootstrap";
import "../stylesheets/navbar.css";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import StorefrontIcon from "@material-ui/icons/Storefront";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

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
            <HomeIcon style={{ color: "#fffefa", marginBottom: 5, marginRight: 5 }} />
            Accueil
          </Link>
          <Link to="/account" className="linkstyle">
            <PersonIcon style={{ color: "#fffefa", marginBottom: 5, marginRight: 5 }} />
            Mon Compte
          </Link>
          <Link to="/interviewscreenhome" className="linkstyle">
            <DirectionsRunIcon style={{ color: "#fffefa", marginBottom: 5, marginRight: 5 }} />
            Entretien
          </Link>
          <Link to="/advices" className="linkstyle">
            <MenuBookIcon style={{ color: "#fffefa", marginBottom: 5, marginRight: 5 }} />
            Conseils
          </Link>
          <Link to="/shop" className="linkstyle">
            <StorefrontIcon style={{ color: "#fffefa", marginBottom: 5, marginRight: 5 }} />
            Shop
          </Link>
          <Link to="/" className="linkstyle">
            <PowerSettingsNewIcon style={{ color: "#fffefa", marginBottom: 5, marginRight: 5 }} />
            Déconnexion
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
