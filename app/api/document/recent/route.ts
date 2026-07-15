import { getRecentDocumentsController } from "@/controller/Documentcontroller";

export async function GET(request: Request) {
  return getRecentDocumentsController(request);
}