import { sendOtpController } from "@/controller/Usercontroller";

export async function POST(request: Request) {
  return sendOtpController(request as any);
}