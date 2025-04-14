"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, Building2 } from "lucide-react"
import axios from 'axios';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const defaultType = searchParams.get("type") || "worker"

  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false)
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false)
  const [workerId, setWorkerId] = useState("")

  // Add functions for Aadhaar verification
  const verifyAadhaar = (type: string) => {
    if ((type === "worker" && aadhaarNumber.length >= 12) || (type === "employer" && aadhaarNumber.length >= 10)) {
      setIsVerifyingAadhaar(true)
      // In a real app, this would make an API call to send OTP
      if (type === "worker") {
        setTimeout(() => {
          // Simulate getting workerId from backend after Aadhaar verification
          setWorkerId("MIG-" + Math.floor(10000 + Math.random() * 90000))
        }, 500)
      }
    }
  }

  const submitOtp = () => {
    // Simulate OTP verification
    if (otp.length === 6) {
      setIsAadhaarVerified(true)
      setIsVerifyingAadhaar(false)
    }
  }

  const handleLogin = async (type: string, aadhaar_number: string, otp: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        aadhaar_number,
        otp
      });
      
      // Optional: Save token
      localStorage.setItem('token', response.data.token);
  
      // Redirect based on user type
      if (type === 'worker') {
        router.push('/dashboard');
      } else {
        router.push('/employer/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid Aadhaar or password');
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to MigrantConnect</h1>
          <p className="text-sm text-muted-foreground">Login using your Aadhaar number</p>
        </div>

        <Tabs defaultValue={defaultType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="worker" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Worker
            </TabsTrigger>
            <TabsTrigger value="employer" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Employer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="worker">
            <Card>
              <CardHeader>
                <CardTitle>Worker Login</CardTitle>
                <CardDescription>Enter your Aadhaar number to login or register</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar-worker">Aadhaar Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="aadhaar-worker"
                      placeholder="XXXX XXXX XXXX"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      disabled={isAadhaarVerified}
                      className={isAadhaarVerified ? "border-green-500" : ""}
                    />
                    {!isAadhaarVerified && (
                      <Button onClick={() => verifyAadhaar("worker")} disabled={aadhaarNumber.length < 12}>
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="otp-worker">OTP</Label>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0"
                      disabled={!isAadhaarVerified}
                      onClick={() => setIsVerifyingAadhaar(true)}
                    >
                      Send OTP
                    </Button>
                  </div>
                  <Input
                    id="otp-worker"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={!isAadhaarVerified}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={() => handleLogin("worker")}
                  disabled={!isAadhaarVerified || otp.length < 6}
                >
                  Login
                </Button>
                <div className="text-center text-sm">
                  New user?{" "}
                  <Link href="/register?type=worker" className="underline underline-offset-4 hover:text-primary">
                    Register here
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="employer">
            <Card>
              <CardHeader>
                <CardTitle>Employer Login</CardTitle>
                <CardDescription>Enter your Aadhaar or GST number to login</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar-employer">Aadhaar/GST Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="aadhaar-employer"
                      placeholder="Enter Aadhaar or GST number"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      disabled={isAadhaarVerified}
                      className={isAadhaarVerified ? "border-green-500" : ""}
                    />
                    {!isAadhaarVerified && (
                      <Button onClick={() => verifyAadhaar("employer")} disabled={aadhaarNumber.length < 10}>
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="otp-employer">OTP</Label>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0"
                      disabled={!isAadhaarVerified}
                      onClick={() => setIsVerifyingAadhaar(true)}
                    >
                      Send OTP
                    </Button>
                  </div>
                  <Input
                    id="otp-employer"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={!isAadhaarVerified}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={() => handleLogin("employer")}
                  disabled={!isAadhaarVerified || otp.length < 6}
                >
                  Login
                </Button>
                <div className="text-center text-sm">
                  New employer?{" "}
                  <Link href="/register?type=employer" className="underline underline-offset-4 hover:text-primary">
                    Register here
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Aadhaar OTP Verification Dialog */}
      <Dialog open={isVerifyingAadhaar} onOpenChange={setIsVerifyingAadhaar}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Aadhaar</DialogTitle>
            <DialogDescription>Enter the OTP sent to your registered mobile number</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-verification">One-Time Password (OTP)</Label>
                <Input
                  id="otp-verification"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                OTP has been sent to your Aadhaar-linked mobile number. It will expire in 10 minutes.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyingAadhaar(false)}>
              Cancel
            </Button>
            <Button onClick={submitOtp} disabled={otp.length !== 6}>
              Verify OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
