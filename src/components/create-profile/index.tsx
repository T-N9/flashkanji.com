'use client'

import { useState } from "react";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "@/api/usersRoute";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const profileSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters long" }),

    occupation: z
        .string()
        .min(2, { message: "Please select or enter a valid occupation" }),

    japaneseLevel: z.enum(["N5", "N4", "N3"], {
        errorMap: () => ({ message: "Please select your Japanese level" }),
    }),

    dob: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Please enter a valid date of birth",
        }),
});


type ProfileFormData = z.infer<typeof profileSchema>;

export default function CreateProfileForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (formData: ProfileFormData) => {
        setLoading(true);

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            alert("Failed to retrieve user session.");
            setLoading(false);
            return;
        }

        const payload = {
            id: user.id,
            user_id : user.id,
            username: formData.username,
            occupation: formData.occupation,
            japanese_level: formData.japaneseLevel,
            dob: formData.dob,
        };

        try {
            const res = await createUser(payload);
            console.log({res})
            if (res.success) {
                router.push("/"); // or /dashboard
            } else {
                alert("Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <Input
                    label="Username"
                    {...register("username")}
                    isInvalid={!!errors.username}
                    errorMessage={errors.username?.message}
                />

               <div>
                 <Select
                     label="Occupation"
                     {...register("occupation")}
                     // defaultSelectedKeys={["Student"]}
                     placeholder="Select occupation"
                 >
                     {[
                         "Student",
                         "Teacher",
                         "Software Developer",
                         "Engineer",
                         "Designer",
                         "Translator",
                         "Freelancer",
                         "Business Owner",
                         "Office Worker",
                         "Unemployed",
                         "Other",
                     ].map((job) => (
                         <SelectItem key={job}>
                             {job}
                         </SelectItem>
                     ))}
                 </Select>
                 {errors.occupation && (
                     <p className="text-red-500 text-xs mt-1 ml-1">{errors.occupation.message}</p>
                 )}
                
               </div>

                <div>
                    <Select
                        label="Japanese Level"
                        {...register("japaneseLevel")}
                        // defaultSelectedKeys={["N5"]}
                        placeholder="Select level"
                    >
                        {["N5", "N4", "N3"].map((level) => (
                            <SelectItem key={level}>
                                {level}
                            </SelectItem>
                        ))}
                    </Select>
                    {errors.japaneseLevel && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.japaneseLevel.message}</p>
                    )}
                </div>

                <Input
                    type="date"
                    label="Date of Birth"
                    {...register("dob")}
                    isInvalid={!!errors.dob}
                    errorMessage={errors.dob?.message}
                />

                <Button type="submit" color="primary" isLoading={loading}>
                    Submit
                </Button>
            </form>
        </div>
    );
}
