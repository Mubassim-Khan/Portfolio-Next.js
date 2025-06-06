import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'

import { SocialLinks } from '@/PortfolioData'
import Logo from "@/assets/images/logo.png"

const Footer = () => {
    return (
        <footer className='footer'>
            <Container>
                <Row className='align-items-center justify-content-center'>
                    <Col sm={6}>
                        <img className='w-[25%]' src={Logo.src} alt="Logo" />
                    </Col>
                    <Col sm={6} className='text-center text-sm-end'>
                        <div className='social-icons'>
                            {SocialLinks.slice(0, 4).map((link, id) => {
                                return (
                                    <Link
                                        key={id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='cursor--pointer'
                                    >
                                        <Image src={link.icon} alt={link.alt} />
                                    </Link>
                                )
                            })}
                        </div>
                        <p>Copyright 2025. All Rights Reserved</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer