"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { motion } from "framer-motion";
import ShinyText from "./ShinyText";

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
    return () => clearInterval(ticker);
  }, [delta, tick]);

  return (
    <section
      id="home"
      className="relative flex flex-col justify-center items-center text-center min-h-[110vh] px-6"
    >
      {/* Animated gradient blobs background */}
      <div className="absolute inset-0 -z-10">
        <div className="hidden md:block absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-500 opacity-40 blur-3xl rounded-full top-[-150px] left-[-150px] animate-pulse"></div>
        <div className="hidden md:block absolute w-[700px] h-[700px] bg-gradient-to-b from-purple-700 via-indigo-500 to-blue-400 opacity-40 blur-3xl rounded-full bottom-[-200px] right-[-200px] animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="max-w-3xl mx-auto"
      >
        <span className="tagLine block mb-4 text-sm tracking-widest uppercase text-indigo-300">
          Welcome to my Portfolio
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-white py-8 w-full">
          {`Hi, I'm a `}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400">
            {text}
          </span>
          <span className="inline-block animate-blink">|</span>
        </h1>

        <div className="text-lg md:text-xl mb-10 text-gray-200">
          <ShinyText
            text="My name is Mubassim Ahmed Khan, and I am currently pursuing a Bachelor of Science in Computer Science at the University of Karachi."
            disabled={false}
            speed={3}
            className="font-medium"
          />
        </div>

        <motion.div
          whileHover="hover"
          className="group relative inline-flex items-center gap-3 text-lg font-semibold text-white
             backdrop-blur-md bg-black/10 border border-white/40 
             px-6 py-3 rounded-full shadow-lg transition-all duration-300 overflow-hidden"
          variants={{ hover: { scale: 1.02 } }}
        >
          {/* ✨ Button content */}
          <Link href="#connect" className="relative z-10">
            Let&apos;s Connect
          </Link>

          <motion.span
            variants={{
              hover: { x: 6 },
              initial: { x: 0 },
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative z-10"
          >
            <BsArrowRightCircle size={25} />
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Banner;