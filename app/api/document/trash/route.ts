
import { getTrashedDocumentsController } from "@/controller/Documentcontroller";


export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 6;
  const search = String(searchParams.get("search")) || "";

  return getTrashedDocumentsController(request,page,limit,search);
}