"use client";

import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Image from "next/image";
import { Col, Container, Row } from 'react-bootstrap';

import BlurText from "./BlurText";
import contactImg from "@/assets/images/contact-img.svg";
import { sendFormEmail } from '@/lib/email/sendFormEmail';

const Contact = () => {
  const formInitialDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };

  const [formDetails, setFormDetails] = useState(formInitialDetails);

  const onFormUpdate = (
    category: keyof typeof formInitialDetails,
    value: string
  ) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  const form = useRef<HTMLFormElement | null>(null);

  const sendContactEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return toast.error("Form ref missing!");

    const result = await sendFormEmail(process.env.NEXT_PUBLIC_TEMPLATE_ID!, form.current);
    if (result.success) {
      toast.success("Message sent successfully");
      setFormDetails(formInitialDetails);
    } else {
      toast.error("Failed to send message.");
    }
  };

  return (
    <section className="contact relative p-6 text-center" id="connect">
      <Container>
        <div className="gradient-effect-5"></div>
        <Row className="align-items-center">
          <Col md={6}>
            <Image src={contactImg} alt="Contact Us" width={400} height={400} />
          </Col>
          <Col md={6}>
            <h2>
              <BlurText
                text="Get in touch with me!"
                delay={250}
                animateBy="words"
                direction="top"
                className="text-[50px] font-bold text-center"
              />
            </h2>
            <form onSubmit={sendContactEmail} ref={form}>
              <Row>
                <Col sm={6} className="px-1">
                  <input
                    type="text"
                    value={formDetails.firstName}
                    name="first_name"
                    placeholder="*First name"
                    onChange={(e) => onFormUpdate("firstName", e.target.value)}
                    minLength={3}
                    required
                  />
                </Col>
                <Col sm={6} className="px-1">
                  <input
                    type="text"
                    value={formDetails.lastName}
                    name="last_name"
                    placeholder="Last name"
                    onChange={(e) => onFormUpdate("lastName", e.target.value)}
                  />
                </Col>
                <Col sm={6} className="px-1">
                  <input
                    type="email"
                    value={formDetails.email}
                    name="email"
                    placeholder="*Email address"
                    onChange={(e) => onFormUpdate("email", e.target.value)}
                  />
                </Col>
                <Col sm={6} className="px-1">
                  <input
                    type="tel"
                    value={formDetails.phone}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="phone_no"
                    placeholder="Phone number"
                    onChange={(e) => onFormUpdate("phone", e.target.value)}
                  />
                </Col>
                <Col>
                  <textarea
                    rows={6}
                    value={formDetails.message}
                    name="message"
                    placeholder="*Leave your message"
                    onChange={(e) => onFormUpdate("message", e.target.value)}
                    minLength={5}
                    required
                  ></textarea>
                  <button type="submit" value="send">
                    <span>Send</span>
                  </button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;
