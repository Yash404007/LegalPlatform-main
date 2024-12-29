"use server"
import * as z from "zod"
import { auth } from "@/auth"
import { GetUserById } from "./Data/User/GET";
import prisma from "@/lib/db";
import { LawyerRegisterSchema } from "@/types/lawyer";
type schema_type = z.infer< typeof LawyerRegisterSchema >

export const RegisterLawyer = async (lawyerRegistrationData: schema_type) => {
    const session = await auth();
    if(!session || !session.user.id) {
        throw new Error("User not logged in");
    }

    const {
        success,
        data
    } = LawyerRegisterSchema.safeParse(lawyerRegistrationData)

    if(!success){
        throw new Error("Invalid Data!");
    }

    const existingUser = await GetUserById(session.user.id);
    if(!existingUser){
        throw new Error("Something Went Wrong");
    }

    const existingLawyer = await prisma.lawyer.findMany({
        where: {
            userId: existingUser.id
        }
    })
    if(!existingLawyer){
        throw new Error("User Already Registered as Lawyer");
    }

    try {
        await prisma.lawyer.create({
            data: {
                user: {
                    connect: { id: existingUser.id },

                },
                about: data.about_lawyer_registration,
                dateOfBirth: data.dob_lawyer_registration,
                email: data.email_lawyer_registration,
                firstName: data.fname_lawyer_registration,
                lastName: data.lname_lawyer_registration,
                gender: data.gender_lawyer_registration,
                institution: data.institution_lawyer_registration,
                locality: data.locality_lawyer_registration,
                locationCountry: data.location_lawyer_registration[0] || "City",
                locationState: data.location_lawyer_registration[1] || "Country",
                numCasesPerformed: data.num_cases_performed_lawyer_registration,
                phoneNumber: data.phnumber_lawyer_registration,
                publicEmail: data.pubemail_lawyer_registration,
                degrees: data.degree_lawyer_registration,
                publicWebsiteUrl: data.pubweburl_lawyer_registration,
                tags: data.tags_lawyer_registration,
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}