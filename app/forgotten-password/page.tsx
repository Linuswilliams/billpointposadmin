"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { Loader2, ArrowLeft, Router } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { axios } from "@/lib/axios"
import { useAppSelector } from "@/hooks/useAppSelector"
import { getUserInfo } from "@/lib/redux/reducers/storeUserInfo"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type FormData = {
  email: string
  otp: string
  newPassword: string
  confirmPassword: string
}

export default function ForgottenPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email')
  const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm<FormData>()
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
try{
 setIsLoading(true)
     // Move to next step
     const checkIfEmailExists = await axios.get(`admin/info/${data.email}`)

     console.log(checkIfEmailExists.data)

     if (step === 'email') {

   
        const body = {
            authId: checkIfEmailExists.data.message.authId,
            email: data.email
         }
         const response = await axios.post('admin/otp/email/send', body)
        
         console.log(response.data)

         toast("OTP Sent Successfully", {
            description: "Check your inbox for the otp being sent.",
            action: {
              label: "Cancel",
              onClick: () => console.log("Undo"),
            },
          })
        setStep('otp')
    }
        else if (step === 'otp') {
            const body = {
                authId: checkIfEmailExists.data.message.authId,
                otp: data.otp
             }
             const response = await axios.post('admin/otp/verify', body)

             toast("OTP verified successfully", {
                description: "The otp provided was successful",
                action: {
                  label: "Cancel",
                  onClick: () => console.log("Undo"),
                },
              })
             console.log(response.data)

    setStep('newPassword')

}
        else {

            const body = {
                password: data.newPassword,
                userId: checkIfEmailExists.data.message.authId
            }

            const response = await axios.patch('admin/update/password', body)

            console.log(response.data)

            toast("Password Changed successfully", {
                description: "Redirecting to login...",
                action: {
                  label: "Cancel",
                  onClick: () => console.log("Undo"),
                },
                
              })

            setTimeout(() => {
                router.push('/login')
            }, 1000);
          // Handle password reset completion
          console.log('Password reset complete')
        }
}
catch(err){
    if(err.response.data.message === 'Email does not exist'){
        console.log(true)
        toast("Email does not exist", {
            description: "Check the email and try again",
            action: {
              label: "Cancel",
              onClick: () => console.log("Undo"),
            },
          })
    }
    else if(err.response.data.message === 'AppwriteException: Invalid token passed in the request.'){
        toast("Invalid OTP entered", {
            description: "Please check the OTP and try again",
            action: {
              label: "Cancel",
              onClick: () => console.log("Undo"),
            },
          })
    }
    else if(err.response.data.message === 'Error: read ECONNRESET'){
        toast("Error connecting", {
            description: "Check your internet connection and try again",
            action: {
              label: "Cancel",
              onClick: () => console.log("Undo"),
            },
          })
    }

    else{

    }
    console.log(err)
}
finally{
    setIsLoading(false)
}

  }

  const watchNewPassword = watch("newPassword")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center text-gray-500">
              {step === 'email' && "Enter your admin email to receive a verification code"}
              {step === 'otp' && "Enter the 6-digit code sent to your email"}
              {step === 'newPassword' && "Create a new password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {step === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    {...register("email", { 
                      required: "Email is required", 
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address"
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              )}
              {step === 'otp' && (
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    {...register("otp", { 
                      required: "Verification code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Must be a 6-digit number"
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
                </div>
              )}
              {step === 'newPassword' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register("newPassword", { 
                        required: "New password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters"
                        }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register("confirmPassword", { 
                        required: "Please confirm your new password",
                        validate: (value) => value === watchNewPassword || "Passwords do not match"
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </>
              )}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Processing..." : (
                  step === 'email' ? "Send Verification Code" :
                  step === 'otp' ? "Verify Code" :
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              className="text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}