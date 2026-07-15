
import { getTrashedDocumentsController } from "@/controller/Documentcontroller";


export async function GET() {
  return getTrashedDocumentsController();
}