import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CertificateCard from './CertificateCard'
import { CertificateData } from "@/PortfolioData";

const Certifications = () => {
    return (
        <section id="certifications" className="certifications">
            <Container>
                <Row>
                    <Col>
                        <div className="gradient-effect-3"></div>
                        <div className='pb-[50px] relative'>
                            <h2 className='text-[45px] font-bold text-center'>Certifications</h2>
                            <p className="text-center font-[500] text-[#B8B8B8] text-[18px] tracking-[0.8px] leading-[1.5em] my-[14px] mt-[14px] mb-[75px]">
                                Certifications that validate my skills and knowledge in the field
                            </p>
                            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                                {CertificateData.map((cert, idx) => (
                                    <CertificateCard
                                        key={idx}
                                        title={cert.title}
                                        skill={cert.skill}
                                        verifyLink={cert.verifyLink}
                                    />
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Certifications;