import { shareDocumentController, getSharedDocumentsController } from "@/controller/Documentcontroller";
import connectDB from "@/lib/mongodb";

export async function POST(request: Request) {
  await connectDB();
  return shareDocumentController(request);
}

export async function GET(request: Request) {
  await connectDB();
  return getSharedDocumentsController();
}