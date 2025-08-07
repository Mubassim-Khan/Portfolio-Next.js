'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

import ShinyText from '@/components/ShinyText';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const OTPPage = () => {
  const [otp, setOtp] = useState('')
  const router = useRouter()

  useEffect(() => {
    const sendOTP = async () => {
      const res = await fetch('/api/send-otp', { method: 'POST' });
      const data = await res.json();

      if (data.success && data.otp) {
        try {
          await emailjs.send(
            process.env.NEXT_PUBLIC_SERVICE_ID!,
            process.env.NEXT_PUBLIC_OTP_TEMPLATE_ID!,
            {
              to_email: process.env.NEXT_PUBLIC_MY_EMAIL!,
              otp: data.otp,
            },
            process.env.NEXT_PUBLIC_PUBLIC_KEY!
          );
          toast.success('OTP sent to your email');
        } catch (err) {
          console.error('EmailJS error:', err);
          toast.error('Failed to send OTP');
        }
      } else {
        toast.error('Failed to generate OTP');
      }
    };

    sendOTP();
  }, []);

  const handleChange = async (value: string) => {
    setOtp(value);

    if (value.length === 6) {
      try {
        const res = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: value }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success('OTP Verified!');
          console.log("Redirecting to dashboard...");
          router.refresh();
          router.push('/dashboard');
          console.log("should redirect");

        } else {
          toast.error(data.message || 'Invalid OTP');
        }
      } catch (err) {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <ShinyText
        text="Can't Rush Greatness"
        disabled={false}
        speed={3}
        className="text-4xl font-bold text-center mb-6"
      />

      <h1 className="text-2xl font-semibold mb-2">Enter OTP</h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Please enter the OTP sent to your registered email.
      </p>

      <InputOTP maxLength={6} value={otp} onChange={handleChange}>
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );

}

export default OTPPage;