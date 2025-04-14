"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const defaultType = searchParams.get("type") || "worker"

  // Worker registration state
  const [workerForm, setWorkerForm] = useState({
    aadhaar: "",
    name: "",
    dob: "",
    phone: "",
    address: "",
    skills: [] as string[],
    employmentHistory: [{ employer: "", duration: "", role: "" }],
  })

  // Employer registration state
  const [employerForm, setEmployerForm] = useState({
    companyName: "",
    contactPerson: "",
    aadhaarGst: "",
    email: "",
    phone: "",
  })

  // Add state for Aadhaar verification
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false)
  const [aadhaarOtp, setAadhaarOtp] = useState("")
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false)

  // Add function to verify Aadhaar
  const verifyAadhaar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Prevent form submission
    if (workerForm.aadhaar.length >= 12 || employerForm.aadhaarGst.length >= 12) {
      setIsVerifyingAadhaar(true)
    }
  }

  // Add function to submit OTP
  const submitOtp = () => {
    // Simulate OTP verification
    // In a real app, this would make an API call to verify the OTP
    if (aadhaarOtp.length === 6) {
      setIsAadhaarVerified(true)
      setIsVerifyingAadhaar(false)
    }
  }

  // Add employment history field
  const addEmploymentHistory = () => {
    setWorkerForm({
      ...workerForm,
      employmentHistory: [...workerForm.employmentHistory, { employer: "", duration: "", role: "" }],
    })
  }

  // Remove employment history field
  const removeEmploymentHistory = (index: number) => {
    const updatedHistory = [...workerForm.employmentHistory]
    updatedHistory.splice(index, 1)
    setWorkerForm({
      ...workerForm,
      employmentHistory: updatedHistory,
    })
  }

  // Update employment history field
  const updateEmploymentHistory = (index: number, field: string, value: string) => {
    const updatedHistory = [...workerForm.employmentHistory]
    updatedHistory[index] = {
      ...updatedHistory[index],
      [field]: value,
    }
    setWorkerForm({
      ...workerForm,
      employmentHistory: updatedHistory,
    })
  }

  const handleWorkerRegister = async () => {
    try {
      const response = await fetch('/api/worker/register-worker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workerForm),
      });
      if (response.ok) {
        console.log("Worker registration successful.");
        router.push("/dashboard");
      } else {
        console.log("Error in registration");
      }
    } catch (error) {
      console.error("Error in worker registration:", error);
    }
  };
  
  const handleEmployerRegister = async () => {
    try {
      const response = await fetch('/api/employer/register-employer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employerForm),
      });
      if (response.ok) {
        console.log("Employer registration successful.");
        router.push("/employer/dashboard");
      } else {
        console.log("Error in registration");
      }
    } catch (error) {
      console.error("Error in employer registration:", error);
    }
  };
  
  // Handle skill selection
  const handleSkillSelect = (skill: string) => {
    if (workerForm.skills.includes(skill)) {
      setWorkerForm({
        ...workerForm,
        skills: workerForm.skills.filter((s) => s !== skill),
      })
    } else {
      setWorkerForm({
        ...workerForm,
        skills: [...workerForm.skills, skill],
      })
    }
  }

  return (
    <div className="container py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-2xl">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an Account</h1>
          <p className="text-sm text-muted-foreground">Register to access the MigrantConnect platform</p>
        </div>

        <Tabs defaultValue={defaultType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="worker">Worker Registration</TabsTrigger>
            <TabsTrigger value="employer">Employer Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="worker">
            <Card>
              <CardHeader>
                <CardTitle>Worker Registration</CardTitle>
                <CardDescription>Enter your details to register as a migrant worker</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Update the Aadhaar input in worker registration form to add verification */}
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="aadhaar"
                      placeholder="XXXX XXXX XXXX"
                      value={workerForm.aadhaar}
                      onChange={(e) => setWorkerForm({ ...workerForm, aadhaar: e.target.value })}
                      className={isAadhaarVerified ? "border-green-500" : ""}
                      disabled={isAadhaarVerified}
                    />
                    {!isAadhaarVerified ? (
                      <Button onClick={verifyAadhaar} disabled={workerForm.aadhaar.length < 12}>
                        Verify
                      </Button>
                    ) : (
                      <Badge className="flex items-center h-10" variant="default">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={workerForm.name}
                      onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={workerForm.dob}
                      onChange={(e) => setWorkerForm({ ...workerForm, dob: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={workerForm.phone}
                    onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your current address"
                    value={workerForm.address}
                    onChange={(e) => setWorkerForm({ ...workerForm, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Construction",
                      "Plumbing",
                      "Electrical",
                      "Carpentry",
                      "Painting",
                      "Masonry",
                      "Welding",
                      "Driving",
                      "Cooking",
                      "Cleaning",
                      "Agriculture",
                      "Other",
                    ].map((skill) => (
                      <Button
                        key={skill}
                        type="button"
                        variant={workerForm.skills.includes(skill) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSkillSelect(skill)}
                        className="justify-start"
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Employment History</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEmploymentHistory}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>

                  {workerForm.employmentHistory.map((job, index) => (
                    <div key={index} className="border rounded-md p-3 space-y-3 relative">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6"
                          onClick={() => removeEmploymentHistory(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor={`employer-${index}`}>Employer Name</Label>
                        <Input
                          id={`employer-${index}`}
                          placeholder="Previous employer name"
                          value={job.employer}
                          onChange={(e) => updateEmploymentHistory(index, "employer", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`role-${index}`}>Job Role</Label>
                          <Input
                            id={`role-${index}`}
                            placeholder="Your job role"
                            value={job.role}
                            onChange={(e) => updateEmploymentHistory(index, "role", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`duration-${index}`}>Duration</Label>
                          <Input
                            id={`duration-${index}`}
                            placeholder="e.g., 2 years"
                            value={job.duration}
                            onChange={(e) => updateEmploymentHistory(index, "duration", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleWorkerRegister}>
                  Register as Worker
                </Button>
                <div className="text-center text-sm">
                  Already registered?{" "}
                  <Link href="/login?type=worker" className="underline underline-offset-4 hover:text-primary">
                    Login here
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="employer">
            <Card>
              <CardHeader>
                <CardTitle>Employer Registration</CardTitle>
                <CardDescription>Enter your company details to register as an employer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    placeholder="Enter your company name"
                    value={employerForm.companyName}
                    onChange={(e) => setEmployerForm({ ...employerForm, companyName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-person">Contact Person Name</Label>
                  <Input
                    id="contact-person"
                    placeholder="Enter contact person name"
                    value={employerForm.contactPerson}
                    onChange={(e) => setEmployerForm({ ...employerForm, contactPerson: e.target.value })}
                  />
                </div>

                {/* Update the Aadhaar input in employer registration form */}
                <div className="space-y-2">
                  <Label htmlFor="aadhaar-gst">Aadhaar/GST Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="aadhaar-gst"
                      placeholder="Enter Aadhaar or GST number"
                      value={employerForm.aadhaarGst}
                      onChange={(e) => setEmployerForm({ ...employerForm, aadhaarGst: e.target.value })}
                      className={isAadhaarVerified ? "border-green-500" : ""}
                      disabled={isAadhaarVerified}
                    />
                    {!isAadhaarVerified ? (
                      <Button onClick={verifyAadhaar} disabled={employerForm.aadhaarGst.length < 12}>
                        Verify
                      </Button>
                    ) : (
                      <Badge className="flex items-center h-10" variant="default">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter contact email"
                      value={employerForm.email}
                      onChange={(e) => setEmployerForm({ ...employerForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employer-phone">Contact Phone</Label>
                    <Input
                      id="employer-phone"
                      placeholder="Enter contact phone number"
                      value={employerForm.phone}
                      onChange={(e) => setEmployerForm({ ...employerForm, phone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleEmployerRegister}>
                  Register as Employer
                </Button>
                <div className="text-center text-sm">
                  Already registered?{" "}
                  <Link href="/login?type=employer" className="underline underline-offset-4 hover:text-primary">
                    Login here
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
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input
                  id="otp"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value)}
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
            <Button onClick={submitOtp} disabled={aadhaarOtp.length !== 6}>
              Verify OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
