import { register } from "@/controller/Usercontroller";

export async function POST(request: Request) {
  return register(request);
}