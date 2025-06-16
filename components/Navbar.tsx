"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Navbar as BootstrapNavbar,
  Nav,
  Col,
} from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

import { SocialLinks } from "@/PortfolioData";
import Logo from "@/assets/images/logo.png";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef<HTMLDivElement | null>(null);

  const updateActiveLink = (value: string) => {
    setActiveLink(value);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setIsNavVisible(true);
        navRef.current?.classList.remove("floating-nav");
      } else if (currentScrollY > lastScrollY + 5) {
        // Scrolling down
        setIsNavVisible(false);
        navRef.current?.classList.add("floating-nav");
      } else if (currentScrollY < lastScrollY - 5) {
        // Scrolling up
        setIsNavVisible(true);
        navRef.current?.classList.add("floating-nav");
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Animate navbar visibility
  useEffect(() => {
    if (navRef.current) {
      navRef.current.style.transform = isNavVisible
        ? "translateY(0)"
        : "translateY(-100%)";
      navRef.current.style.opacity = isNavVisible ? "1" : "0";
      navRef.current.style.transition =
        "transform 0.3s ease, opacity 0.3s ease";
    }
  }, [isNavVisible]);

  const NavData = [
    { id: "home", label: "Home" },
    { id: "skills", label: "Skills" },
    { id: "project", label: "Projects" },
    { id: "certifications", label: "Certifications" },
  ];

  return (
    <div
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50"
      style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
    >
      <BootstrapNavbar expand="md" className="bg-transparent">
        <Container>
          <BootstrapNavbar.Brand href="#home" className="flex items-center">
            <img
              className="h-10 w-auto max-w-[120px] object-contain"
              src={Logo.src}
              alt="Logo"
            />
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggle-icon"></span>
          </BootstrapNavbar.Toggle>
          <BootstrapNavbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-between"
          >
            <Nav className="me-auto">
              {NavData.map(({ id, label }) => (
                <Nav.Link
                  key={id}
                  href={`#${id}`}
                  className={
                    activeLink === id ? "active navbar-link" : "navbar-link"
                  }
                  onClick={() => updateActiveLink(id)}
                >
                  {label}
                </Nav.Link>
              ))}
            </Nav>

            <div className="navbar-text d-flex align-items-center gap-3">
              <div className="social-icons d-flex gap-2">
                {SocialLinks.slice(0, 4).map((link, id) => {
                  return (
                    <Link
                      key={id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image src={link.icon} alt={link.alt} />
                    </Link>
                  );
                })}
              </div>

              <span>
                <Link href="#connect">
                  <button className="vvd">Let&apos;s Connect</button>
                </Link>
              </span>
            </div>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </div>
  );
};

export default Navbar;
