"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { BsArrowRightCircle } from 'react-icons/bs';

import headerImg from "@/assets/images/header-img.svg"
import TrackVisibility from 'react-on-screen';
import Image from 'next/image';

const Banner = () => {
    const [text, setText] = useState("");
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = ["MERN Stack Developer", "Student", "Gen AI Enthusiast", "Web Developer"];
    // const toRotate = ["MERN Stack Developer", "ggkkndgdgdfg fgfdgfgfgh", "ggkkndgdgdfg fgfdgfgfgh", "ggkkndgdgdfg fgfdgfgfgh"];
    const [delta, setDelta] = useState(200 - Math.random() * 100);
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta)

        return () => {
            clearInterval(ticker)
        }
    }, [text])

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
        setText(updatedText);

        if (isDeleting) {
            setDelta(100);
        } else {
            setDelta(200 - Math.random() * 100);
        }

        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setDelta(period);
        } else if (isDeleting && updatedText === "") {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(200 - Math.random() * 100);
        }
    }

    return (
        <section className='banner' id='home'>
            <Container>
                <Row className='align-items-center'>
                    <Col xs={12} md={6} xl={7}>
                        <TrackVisibility>
                            {({ isVisible }) =>
                                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                                    <span className='tagLine'>Welcome to my Portfolio</span>
                                    <div className="pb-12 mt-2 mb-[150px] relative h-[100px]">
                                        <h1 className="font-bold mb-[125px] h-full">
                                            {`Hi, I'm a `} <span className="inline-block min-h-[50px]">{text}</span>
                                        </h1>
                                    </div>
                                    <p className='mt-[50px]'>My name is Mubassim Ahmed Khan, and I am currently pursuing a Bachelor of Science in Computer Science at the University of Karachi.</p>
                                    <button>
                                        <Link className='connect-btn' href="#connect">Let's Connect</Link>
                                        <BsArrowRightCircle size={25} />
                                    </button>
                                </div>
                            }
                        </TrackVisibility>
                    </Col>
                    <Col xs={12} md={6} xl={5}>
                        <TrackVisibility>
                            {({ isVisible }) =>
                                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                                    <Image src={headerImg} alt="Header Image" />
                                </div>
                            }
                        </TrackVisibility>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Banner