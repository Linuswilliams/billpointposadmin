"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { axios } from "@/lib/axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { getUserInfo } from "@/lib/redux/reducers/storeUserInfo"
import Link from "next/link"

type FormData = {
  email: string
  password: string
}

export default function RefinedLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const router = useRouter()
  const dispatch = useAppDispatch()


  const onSubmit = async (data: FormData) => {

    try{
        const {email,password} = data
        setIsLoading(true)

        const body = {
            email,
            password
        }

        const response = await axios.post('signin-admin', body)

        console.log(response.data)
        console.log(response.data.message)
        dispatch(getUserInfo(response.data.message))

        toast("Login successful", {
          description: "You have successfully logged in to admin account",
          action: {
            label: "Cancel",
            onClick: () => console.log("Undo"),
          },
        })


        setTimeout(() => {
          router.push('/dashboard')
        }, 1000);
    }
    catch(err){
        if(err.response.data.message === 'AppwriteException: Invalid credentials. Please check the email and password.'){
            toast("Invalid Credentials", {
                description: "The email or password you entered is incorrect",
                action: {
                  label: "Cancel",
                  onClick: () => console.log("Undo"),
                },
              })
        }
        else if(err.response.data.message === 'Admin does not exist'){
            toast("Admin does not exists", {
                description: "The email you entered does not exist",
                action: {
                  label: "Cancel",
                  onClick: () => console.log("Undo"),
                },
              })  
        }
        else{
          toast("Something went wrong", {
            description: "Please check your interent connection and try again",
            action: {
              label: "Cancel",
              onClick: () => console.log("Undo"),
            },
          })
        }
        console.log(err)
    }
    finally{
        setIsLoading(false)
    }
  }

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
            <CardTitle className="text-2xl font-semibold text-center">Welcome back Admin</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
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
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Password is required", 
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center">
            <motion.a
              href="/forgotten-password"
              className="text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href='/forgotten-password'>
              Forgot your password?
              </Link>
            </motion.a>
    
          </CardFooter>
        </Card>
      </motion.div>
   
    </div>
  )
}