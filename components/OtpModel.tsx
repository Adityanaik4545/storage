import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from 'next/image'
import { Flashlight } from 'lucide-react'
import { Button } from './ui/button'
const OtpModel = ({accountId,email}:{accountId:string,email:string}) => {
const [isOpen, setIsOpen]=useState(true)
const [password, setPassword]=useState('')
const [isLoading, setIsLoading]=useState(false)

const handleSubmit=async(e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    setIsLoading(true);

    try {
      // verify otp API
    } catch (error) {
      console.log("Failed to verify OTP",error);
      
    }
    setIsLoading(false)
}

const handleResendOtp=async()=>{
  // call api to resend the otp
}

  return (
<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  
  <AlertDialogContent className='shad-alert-dialog'>
    <AlertDialogHeader className='flex justify-center relative'>
      <AlertDialogTitle className='text-center h2'>
        Enter Your OTP
        <Image src="/assets/icons/close-dark.svg" onClick={()=>setIsOpen(false)} alt='close' height={20} width={20} className='otp-close-button' />
      </AlertDialogTitle>
      <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
        We&apos;ve sent code to <span className='text-brand-100 pl-1'>{email}</span>
      </AlertDialogDescription>
    </AlertDialogHeader>
  <InputOTP maxLength={6} value={password} onChange={setPassword} >
  <InputOTPGroup className='shad-otp'>
    <InputOTPSlot index={0} className='shad-otp-slot' />
    <InputOTPSlot index={1} className='shad-otp-slot' />
    <InputOTPSlot index={2} className='shad-otp-slot' />
    <InputOTPSlot index={3} className='shad-otp-slot' />
    <InputOTPSlot index={4} className='shad-otp-slot'/>
    <InputOTPSlot index={5} className='shad-otp-slot' />
  </InputOTPGroup>
</InputOTP>
    <AlertDialogFooter>
      <div className='flex flex-col w-full gap-4'>
      <AlertDialogAction onClick={handleSubmit} className='shad-submit-btn h-12' type='button'>Submit{isLoading && (<Image src="/assets/icons/loader.svg" alt='loader' width={24} height={24} className='ml-2 animate-spin'/>)}
      </AlertDialogAction>
      <div className='subtitle-2 mt-2 text-center text-light-100'>
        didn&apos;t get a code? <Button className='pl-1 text-brand' type='button' variant="link" onClick={handleResendOtp}>
          Click to resend code
        </Button>
      </div>
      </div>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default OtpModel
