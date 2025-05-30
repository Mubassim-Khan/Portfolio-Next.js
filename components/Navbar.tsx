"use client"

import React, { useEffect, useState } from 'react'
import { Container, Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

import { links } from "../PortfolioData";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const updateActiveLink = (value: string) => {
    setActiveLink(value);
  }

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const NavData = [
    { id: "home", label: "Home" },
    { id: "skills", label: "Skills" },
    { id: "certifications", label: "Certifications" },
    { id: "project", label: "Projects" }
  ]

  return (
    <BootstrapNavbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <BootstrapNavbar.Toggle aria-controls='basic-navbar-nav'>
          <span className="navbar-toggle-icon"></span>
        </BootstrapNavbar.Toggle>
        <BootstrapNavbar.Collapse id='basic-navbar-nav' className='justify-content-between'>
          <Nav className="me-auto">
            {NavData.map(({ id, label }) => (
              <Nav.Link
                key={id}
                href={`#${id}`}
                className={activeLink === id ? "active navbar-link" : "navbar-link"}
                onClick={() => updateActiveLink(id)}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>

          <div className="navbar-text d-flex align-items-center gap-3">
            <div className="social-icons d-flex gap-2">
              {links.slice(0, 3).map((link, id) => {
                return (
                  <Link
                    key={id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image src={link.icon} alt={link.alt} />
                  </Link>
                )
              })}
            </div>

            <span>
              <Link href="#connect">
                <button className="vvd">Let's Connect</button>
              </Link>
            </span>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar;