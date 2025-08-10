'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import ShinyText from '@/components/ShinyText';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Link from 'next/link';

const OTPPage = () => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Function to send OTP
  const sendOTP = async () => {
    setCanResend(false);
    setCountdown(59);

    await toast.promise(
      (async () => {
        const res = await fetch('/api/send-otp', { method: 'POST' });
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to generate OTP');
        }
      })(),
      {
        loading: 'Sending OTP...',
        success: 'OTP sent to your email',
        error: (err) => err.message || 'Failed to send OTP',
      }
    );
  };

  // Send OTP on mount
  useEffect(() => {
    sendOTP();
  }, []);

  // Handle OTP change
  const handleChange = async (value: string) => {
    setOtp(value);

    if (value.length === 6) {
      await toast.promise(
        fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: value }),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Invalid OTP');
          router.push('/dashboard');
        }),
        {
          loading: 'Validating...',
          success: 'OTP Verified!',
          error: (err) => err.message || 'Invalid OTP',
        }
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="flex flex-col pt-5 mb-5 mt-[-5rem] text-[35px] font-medium text-center">
        <ShinyText text="Way more than just Portfolio" disabled={false} speed={3} />
        <ShinyText text="Enter world beyond your imagination" disabled={false} speed={3} />
      </div>

      <div className="text-center mt-3">
        <h1 className="text-[35px] font-semibold mb-2">Enter OTP</h1>
        <p className="text-gray-500 text-xl mb-6 text-center mt-3">
          Please enter the OTP sent to your registered email.
        </p>
      </div>

      <InputOTP maxLength={6} value={otp} onChange={handleChange}>
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="mt-4 text-center text-gray-500">
        Didn&apos;t receive email?
        {!canResend ? (
          <span>Try again in {countdown}s</span>
        ) : (
          <button
            onClick={sendOTP}
            className="text-blue-500 hover:underline disabled:opacity-50 ml-1"
          >
            Click here to resend
          </button>
        )}
      </div>

      <p className="text-gray-500 text-lg text-center mt-3">
        If you were not meant to be here, you can take a step back to
        <Link href="/" className='text-blue-500 hover:underline no-underline disabled:opacity-50 ml-1'>
          Portfolio
        </Link>
      </p>

      <div className="flex flex-col pt-5 mb-5 mt-1 text-[30px] font-medium text-center">
        <ShinyText text="Can&apos;t Rush Greatness..." disabled={false} speed={3} />
      </div>
    </div>
  );
};

export default OTPPage;
