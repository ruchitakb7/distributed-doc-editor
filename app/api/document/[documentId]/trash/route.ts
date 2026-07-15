import { toggleDocumentTrashController, getTrashedDocumentsController, permanentlyDeleteDocumentController } from "@/controller/Documentcontroller";
import connectDB from "@/lib/mongodb";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  await connectDB();

  const { documentId } = await params;

  return toggleDocumentTrashController(request, documentId);
}


export async function DELETE(
  request: Request,
  context: { params: Promise<{ documentId: string }> }
) {
  return permanentlyDeleteDocumentController(context);
}


