"use server";
import { headers } from "next/headers";
import { submitContact, type ContactResult } from "@/lib/contact-service";
export async function sendMessage(_: ContactResult, formData: FormData) {
  return submitContact(Object.fromEntries(formData), await headers());
}
