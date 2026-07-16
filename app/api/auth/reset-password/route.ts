import connectDB from "@/lib/mongodb";
import { resetPasswordController } from "@/controller/Usercontroller";

export async function POST(request: Request) {
  await connectDB();

  return resetPasswordController(request);
}