import { create, getByOwner,updateDocumentController,getDocumentByIdController } from "@/controller/Documentcontroller";
import connectDB from "@/lib/mongodb";



export async function POST(request: Request) {
  await connectDB();
  return create(request);
}

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

const page = Number(searchParams.get("page")) || 1;
const limit = Number(searchParams.get("limit")) || 6;
const search = String(searchParams.get("search")) || "";
  await connectDB();
  return getByOwner(request,page,limit,search);
}



// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ documentId: string }> }
// ) {
//   const { documentId } = await params;

//   return updateDocumentController(request, documentId);
// }



