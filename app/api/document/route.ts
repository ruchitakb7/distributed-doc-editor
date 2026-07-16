import { create, getByOwner,updateDocumentController,getDocumentByIdController } from "@/controller/Documentcontroller";
import connectDB from "@/lib/mongodb";

export async function POST(request: Request) {
  await connectDB();
  return create(request);
}

export async function GET(request: Request) {
  await connectDB();
  return getByOwner(request);
}



// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ documentId: string }> }
// ) {
//   const { documentId } = await params;

//   return updateDocumentController(request, documentId);
// }



