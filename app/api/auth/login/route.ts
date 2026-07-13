
import { login } from "@/controller/Usercontroller";

export async function POST(request: Request) {
  return login(request);
}