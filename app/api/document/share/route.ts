import { shareDocumentController, getSharedDocumentsController } from "@/controller/Documentcontroller";
import connectDB from "@/lib/mongodb";

export async function POST(request: Request) {
  await connectDB();
  return shareDocumentController(request);
}

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 6;
  const search = String(searchParams.get("search")) || "";
  await connectDB();
  return getSharedDocumentsController(request,page,limit,search);
}