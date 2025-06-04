"use client";

import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import emailjs from "@emailjs/browser";
import { Col, Container, Row } from 'react-bootstrap';
import contactImg from "@/assets/images/contact-img.svg";

const Contact = () => {
  const formInitialDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };

  const [formDetails, setFormDetails] = useState(formInitialDetails);

  const onFormUpdate = (category: keyof typeof formInitialDetails, value: string) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  const form = useRef<HTMLFormElement | null>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { firstName, lastName, email, phone, message } = formDetails;
    if (!firstName || !email || !message) {
      toast.error("Please fill out all required fields!");
      return;
    }

    if (!form.current) {
      toast.error("Form reference is not available!");
      return;
    }

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        form.current,
        {
          publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        }
      )
      .then(
        () => {
          toast.success("Message sent successfully");
        },
        (error) => {
          toast.error("Something went wrong");
          console.log(error);
        }
      );
    setFormDetails(formInitialDetails);
  };
  return (
    <section className="contact relative p-6 text-center" id="connect">
      <Container>
        <div className="gradient-effect-5"></div>
        <Row className="align-items-center">
          <Col md={6}>
            <img src={contactImg.src} alt="Contact Us" />
          </Col>
          <Col md={6}>
            <h2>Get in touch with me!</h2>
            <form onSubmit={sendEmail} ref={form}>
              <Row>
                <Col sm={6} className="px-1">
                  <input
                    type="text"
                    value={formDetails.firstName}
                    name="first_name"
                    placeholder="*First name"
                    onChange={(e) => onFormUpdate("firstName", e.target.value)}
                    minLength={3} required
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
                    minLength={5} required
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
  )
}

export default Contact;