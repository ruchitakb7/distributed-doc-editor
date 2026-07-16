import connectDB from "@/lib/mongodb";
import { verifyOtpController } from "@/controller/Usercontroller";

export async function POST(request: Request) {
  await connectDB();

  return verifyOtpController(request);
}