"use client"

import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { BsArrowRightCircle } from 'react-icons/bs';
import { motion } from "framer-motion";
import Image from 'next/image';

import headerImg from "@/assets/images/header-img.svg"

const Banner = () => {
    const [text, setText] = useState("");
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = ["MERN Stack Developer", "Student", "Gen AI Enthusiast", "Web Developer"];
    const [delta, setDelta] = useState(200 - Math.random() * 100);
    const period = 2000;

    const tick = useCallback(() => {
        const i = loopNum % toRotate.length;
        const fullText = toRotate[i];
        const updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
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
    }, [isDeleting, loopNum, text]);

    useEffect(() => {
        const ticker = setInterval(() => {
            tick();
        }, delta)

        return () => {
            clearInterval(ticker)
        }
    }, [delta, tick])

    return (
        <section className='banner' id='home'>
            <Container>
                <Row className='align-items-center'>
                    <Col xs={12} md={6} xl={7}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1.5 }}
                        >                                    <span className='tagLine'>Welcome to my Portfolio</span>
                            <div className="pb-12 mt-2 mb-[150px] relative h-[100px]">
                                <h1 className="font-bold mb-[125px] h-full">
                                    {`Hi, I'm a `}
                                    <span className="inline-block min-h-[50px]">
                                        {text}
                                        <span className="inline-block animate-blink">|</span>
                                    </span>
                                </h1>
                            </div>
                            <p className='mt-[50px]'>My name is Mubassim Ahmed Khan, and I am currently pursuing a Bachelor of Science in Computer Science at the University of Karachi.</p>
                            <button>
                                <Link className='connect-btn' href="#connect">Let&apos;s Connect</Link>
                                <BsArrowRightCircle size={25} />
                            </button>
                        </motion.div>
                    </Col>
                    <Col xs={12} md={6} xl={5}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1.5 }}
                        >
                            <Image src={headerImg} alt="Header Image" />
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Banner;