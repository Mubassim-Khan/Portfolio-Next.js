"use client";

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

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

    const { firstName, email, message } = formDetails;
    if (!firstName || !email || !message) {
      toast.error("Please fill out all required fields!");
      return;
    }

    if (!form.current) {
      toast.error("Form reference is not available!");
      return;
    }

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
      <div className="max-w-7xl mx-auto px-4">
        <div className="gradient-effect-5"></div>

        <div className="flex flex-wrap items-center">
          {/* Image column */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
            <Image
              src={contactImg}
              alt="Contact Us"
              width={400}
              height={400}
            />
          </div>

          {/* Form column */}
          <div className="w-full md:w-1/2">
            <h2>
              <BlurText
                text="Get in touch with me!"
                delay={250}
                animateBy="words"
                direction="top"
                className="text-[50px] font-bold text-center"
              />
            </h2>

            <form onSubmit={sendContactEmail} ref={form} className="mt-6">
              {/* Name fields */}
              <div className="flex flex-wrap -mx-1">
                <div className="w-full sm:w-1/2 px-1 mb-4">
                  <input
                    type="text"
                    value={formDetails.firstName}
                    name="first_name"
                    placeholder="*First name"
                    onChange={(e) => onFormUpdate("firstName", e.target.value)}
                    minLength={3}
                    required
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>

                <div className="w-full sm:w-1/2 px-1 mb-4">
                  <input
                    type="text"
                    value={formDetails.lastName}
                    name="last_name"
                    placeholder="Last name"
                    onChange={(e) => onFormUpdate("lastName", e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>

                <div className="w-full sm:w-1/2 px-1 mb-4">
                  <input
                    type="email"
                    value={formDetails.email}
                    name="email"
                    placeholder="*Email address"
                    onChange={(e) => onFormUpdate("email", e.target.value)}
                    required
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>

                <div className="w-full sm:w-1/2 px-1 mb-4">
                  <input
                    type="tel"
                    value={formDetails.phone}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="phone_no"
                    placeholder="Phone number"
                    onChange={(e) => onFormUpdate("phone", e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Message field */}
              <div className="mb-4">
                <textarea
                  rows={6}
                  value={formDetails.message}
                  name="message"
                  placeholder="*Leave your message"
                  onChange={(e) => onFormUpdate("message", e.target.value)}
                  minLength={5}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                ></textarea>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                value="send"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
              >
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
