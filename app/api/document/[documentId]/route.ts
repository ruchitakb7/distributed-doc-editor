import { getDocumentByIdController, updateDocumentController } from "@/controller/Documentcontroller";

import connectDB from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  await connectDB();

  const { documentId } = await params;

  return getDocumentByIdController(request, documentId);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  await connectDB();

  const { documentId } = await params;

  return updateDocumentController(request, documentId);
}