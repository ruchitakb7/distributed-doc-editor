import { create, getByOwner } from "@/controller/Documentcontroller";
import connectDB from "@/lib/mongodb";

export async function POST(request: Request) {
  await connectDB();
  return create(request);
}

export async function GET(request: Request) {
  await connectDB();
  return getByOwner(request);
}