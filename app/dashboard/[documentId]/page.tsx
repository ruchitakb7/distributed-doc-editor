// export default async function DocumentPage({ params }: { params: { documentId: string } }) {
//   const { documentId } = await params;

//   return (
//     <div className="p-8">
//       <h1>Document Editor</h1>

//       <p>Document Id: {documentId}</p>
//     </div>
//   );
// }


import DocumentHeader from "@/component/document/documentheader";
import DocumentTitle from "@/component/document/documentTitle";
import DocumentToolbar from "@/component/document/documenttoolbar";
import DocumentEditor from "@/component/document/documneteditore";

export default function DocumentPage() {
  return (
    <>
      <DocumentHeader />
      <DocumentTitle />
      <DocumentToolbar />
      <DocumentEditor />
    </>
  );
}