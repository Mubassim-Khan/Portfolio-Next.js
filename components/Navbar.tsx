"use client"

import React, { useEffect, useState } from 'react'
import { Container, Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import Link from 'next/link';

import { links } from "../SocialLinks";

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

  return (
    <BootstrapNavbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <BootstrapNavbar.Toggle aria-controls='basic-navbar-nav'>
          <span className="navbar-toggle-icon"></span>
        </BootstrapNavbar.Toggle>
        <BootstrapNavbar.Collapse id='basic-navbar-nav' className='justify-content-between'>
          <Nav className="me-auto">
            {/* Home Section link */}
            <Nav.Link
              href="#home"
              className={activeLink === 'home' ? "active navbar-link" : "navbar-link"}
              onClick={() => updateActiveLink('home')}
            >
              Home
            </Nav.Link>
            {/* Skills Section link */}
            <Nav.Link
              href="#skills"
              className={activeLink === 'skills' ? "active navbar-link" : "navbar-link"}
              onClick={() => updateActiveLink('skills')}
            >
              Skills
            </Nav.Link>
            {/* Project Section link */}
            <Nav.Link
              href="#projects"
              className={activeLink === 'projects' ? "active navbar-link" : "navbar-link"}
              onClick={() => updateActiveLink('projects')}
            >
              Projects
            </Nav.Link>
          </Nav>

          <div className="navbar-text d-flex align-items-center gap-3">
            <div className="social-icons d-flex gap-2">
              {links.slice(0, 3).map(({ url, id, icon: Icon }) => {
                return (
                  <Link
                    key={id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className='text-white hover:text-black' />
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

export default Navbar
