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
import { z } from "zod"
import { useState } from "react"
import { handleSubmit } from "@/lib/form"
import { FieldError } from "@/components/field_error"

export const description =
    "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

const schema = z.object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    username: z.string().min(4, { message: "Username is required" }),
    password1: z
        .string()
        .min(1, { message: "Password is required" })
        .min(4, { message: "Password must be at least 4 characters" }),
    password2: z
        .string()
        .min(1, { message: "Password confirmation is required" })
        .min(4, { message: "Password must be at least 4 characters" }),
}).superRefine(({ password1, password2 }, ctx) => {
    if (password1 !== password2) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["password2"],
        });
    }
});






export default function RegisterForm() {

    const [errors, setErrors] = useState({});

    const onSubmit = (data: any) => {

        console.log(data) // dados validados já
    };

    return (
        <main className="h-screen w-full flex justify-center items-center bg-background">

            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4" onSubmit={handleSubmit(schema, setErrors, onSubmit)}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" placeholder="John" name="first_name" />
                                <FieldError errors={errors} path="first_name" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input id="last-name" placeholder="Doe" name="last_name" />
                                <FieldError errors={errors} path="last_name" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"

                            />
                            <FieldError errors={errors} path="email" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="john_doe"

                            />
                            <FieldError errors={errors} path="username" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password1">Password</Label>
                            <Input id="password1" type="password" name="password1" />
                            <FieldError errors={errors} path="password1" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password2">Confirm password</Label>
                            <Input id="password2" type="password" name="password2" />
                            <FieldError errors={errors} path="password2" />
                        </div>
                        <Button type="submit" className="w-full">
                            Create an account
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/sign_in" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>

    )
}
