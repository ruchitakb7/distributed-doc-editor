export const createDocument = async () => {
  const response = await fetch("/api/document", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create document.");
  }

  return data;
};

export const fetchDocumentsByOwner = async () => {
  const response = await fetch("/api/document", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch documents.");
  }

  return data;
};


export const getMyDocuments = async () => {
  try {
    const response = await fetch("/api/document", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};


export const getDocumentById = async (documentId: string) => {
  try {
    const response = await fetch(`/api/document/${documentId}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch document.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};