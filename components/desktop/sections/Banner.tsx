"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { motion } from "framer-motion";

import ShinyText from "../misc/ShinyText";
import Aurora from "../misc/Aurora";

const Banner = () => {
  const [text, setText] = useState("");
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(200 - Math.random() * 100);
  const period = 2000;

  const toRotate = useMemo(
    () => [
      "Software Developer",
      "Computer Vision Developer",
      "AI-Enhanced Website Developer",
    ],
    [],
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
      {/* Aurora Background */}
      <div className="absolute inset-0 w-full h-full">
        <Aurora
          colorStops={["#7cff67", "#4CC9F0", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <span className="relative inline-block rounded-2xl px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 after:absolute after:inset-0 after:rounded-xl after:content-[''] after:bg-gradient-to-r after:from-pink-500 after:via-purple-500 after:to-indigo-500 after:blur-[20px] after:opacity-50 after:animate-pulse after:-z-10">
            Welcome to my Portfolio
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
              text="My name is Mubassim Ahmed Khan, and I am an IT Intern at ChaseValue, Head Office"
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
