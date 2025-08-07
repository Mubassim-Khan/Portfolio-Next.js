'use client'

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

const OTPPage = () => {
  const [otp, setOtp] = useState('')
  const router = useRouter()

  const handleChange = async (value: string) => {
    setOtp(value)

    if (value.length === 6) {
      try {
        const res = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: value }),
        })

        const data = await res.json()

        if (res.ok) {
          toast.success('OTP Verified!')
          router.push('/dashboard')
        } else {
          toast.error(data.message || 'Invalid OTP')
        }
      } catch (err) {
        toast.error('Something went wrong')
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <InputOTP maxLength={6} value={otp} onChange={handleChange}>
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}

export default OTPPage
