"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { motion } from "framer-motion";
import Image from "next/image";

import ShinyText from "./ShinyText";
import headerImg from "@/assets/images/header-img.svg";

const Banner = () => {
  const [text, setText] = useState("");
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(200 - Math.random() * 100);
  const period = 2000;

  const toRotate = useMemo(
    () => [
      "MERN Stack Developer",
      "Student",
      "Gen AI Enthusiast",
      "Web Developer",
    ],
    []
  );

  const tick = useCallback(() => {
    const i = loopNum % toRotate.length;
    const fullText = toRotate[i];
    const updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);
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
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [delta, tick]);

  return (
    <section
      className="relative w-full h-screen banner py-24 overflow-hidden"
      id="home"
    >
      {/* Gradient Blobs */}
      <div className="absolute -left-48 top-1/2 -translate-y-1/2 w-[35rem] h-[25rem] bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 rounded-full blur-[120px] opacity-40 animate-pulse"></div>

      <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-[35rem] h-[32rem] bg-gradient-to-br from-blue-600 via-purple-600 to-fuchsia-500 rounded-full blur-[120px] opacity-40 animate-pulse"></div>

      <div className="relative max-w-4xl mx-auto px-4 text-center mt-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <span className=" relative inline-block rounded-xl p-[2px]  bg-gradient-to-r from-pink-500 via-purple-5 to-indigo-500 after:absolute after:inset-0 after:rounded- after:content-[''] after:bg-gradient-to-r after:from-pink-5 after:via-purple-500 after:to-indigo-500 after:blur-[20px] after:opacity-50 after:animate-puls after:-z-10">
            <span className="relative z-10 block rounded-2xl px-4 py-2 text-white font-semibold text-[20px]">
              Welcome to my Portfolio
            </span>
          </span>

          <h1 className="font-bold mt-6 text-white text-4xl md:text-5xl">
            {`Hi, I'm a `}
            <span className="inline-block min-h-[50px]">
              {text}
              <span className="inline-block animate-blink">|</span>
            </span>
          </h1>

          <div className="mt-6 max-w-2xl mx-auto">
            <ShinyText
              text="My name is Mubassim Ahmed Khan, and I am currently pursuing a Bachelor of Science in Computer Science at the University of Karachi."
              disabled={false}
              speed={3}
              className="text-[20px] font-medium"
            />
          </div>

          <button className="mt-8 flex items-center gap-0.5 connect-btn mx-auto">
            <Link className="connect-btn" href="#connect">
              Let&apos;s Connect
            </Link>
            <BsArrowRightCircle size={25} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
