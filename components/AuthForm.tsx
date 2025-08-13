"use client"

import { email, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createAccount } from "@/lib/actions/users.actions"
import OtpModel from "./OtpModel"

type FormType = "sign-in" | "sign-up"
const authFormSchema = (formType:FormType) =>{
  return z.object({
    email: z.string().email(),
    fullName: formType === "sign-up" ? z.string().min(3).max(20) : z.string().optional()
  })
} 
const AuthForm = ({type}:{type: FormType}) => {
const [isLoading, setIsLoading]=useState(false)
const [errorMessage, setErrorMessage]=useState("")
const [accountId, setAccountId]= useState(null)

const formSchema= authFormSchema(type)
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",email:""
    },
  })

  // 2. Define a submit handler.
  const onSubmit=async(values: z.infer<typeof formSchema>)=>{
   setIsLoading(true)
   setErrorMessage("")
   try {
     const user =await createAccount({
      fullName: values.fullName || '',
      email: values.email
     })
     setAccountId(user.accountId)
   } catch{
    setErrorMessage("Failed to create account. please try again");
   }finally{
    setIsLoading(false)
   }

  }
  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
        <h1 className="form-title">
          {type === "sign-in" ? "Sign-In" : "Sign-Up" }
        </h1>
        {type === "sign-up" && (
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
              <FormLabel className="shad-form-label">Full Name</FormLabel>

              <FormControl>
                <Input placeholder="Enter your full name" {...field} className="shad-input"/>
              </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        )}
                <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
              <FormLabel className="shad-form-label">Email</FormLabel>

              <FormControl>
                <Input placeholder="Enter your Email" {...field} className="shad-input"/>
              </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <Button type="submit" className="form-submit-button" disabled={isLoading}>
          {type === "sign-in" ? "Sign-In" : "Sign-Up" }
          {isLoading && (
            <Image src="/assets/icons/loader.svg" alt="" width={20} height={20} className="ml-2 animate-spin" />
          )}
        </Button>
        {errorMessage  &&  <p className="error-message">{errorMessage}</p>}
        <div className="body-2 flex justify-center">
          <p>
           {type === "sign-in" ? "Don't have account" : "Already have a account" }
          </p>
          <Link href= {type === "sign-in" ? "/register" : "/login" } className="ml-2 font-medium text-brand"> 
          {type === "sign-in" ? "Sign-up" : "Sign-in" }</Link>
        </div>
      </form>
    </Form>
    {true && (
      <OtpModel email={form.getValues("email")} accountId={accountId} /> 
      )}
    </>
  )

}

export default AuthForm
