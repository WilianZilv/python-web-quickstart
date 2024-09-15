"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { handleSubmit } from "@/lib/form"
import { z } from "zod"
import { useState } from "react"
import { FieldError } from "@/components/field_error"

const schema = z.object({
    email_or_username: z.string().min(1, { message: "Email or username is required" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
}).superRefine(({ email_or_username }, ctx) => {

    if (email_or_username.includes("@")) {
        if (!z.string().email().safeParse(email_or_username).success) {
            ctx.addIssue({
                code: "custom",
                message: "Invalid email address",
                path: ["email_or_username"],
            });
        }
    }


})

export default function LoginForm() {

    const [errors, setErrors] = useState<Record<string | number, string>>({});

    function onSubmit(data: any) {

        console.log(data)

    }


    return (
        <main className="h-screen w-full flex justify-center items-center bg-background">



            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email or username below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4" onSubmit={handleSubmit(schema, setErrors, onSubmit)}>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email or Username</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="john_doe@example.com or john_doe"
                                name="email_or_username"
                            />
                            <FieldError errors={errors} path="email_or_username" />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input id="password" type="password" name="password" />
                            <FieldError errors={errors} path="password" />

                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign_up" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
