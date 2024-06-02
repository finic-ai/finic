import supabase from "./lib/supabaseClient";

export const completeOnboarding = async (
  apiKey: string,
  loanAmount: number,
  firstName: string,
  lastName: string,
  companyName: string,
  companyWebsite: string,
  state: string
): Promise<any> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/complete-onboarding",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          loan_amount: loanAmount,
          company_name: companyName,
          company_website: companyWebsite,
          company_state: state,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error completing onboarding: ${error.message}`);
    return error;
  }
};

export const getLenders = async (apiKey: string): Promise<any> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/get-lenders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error submitting listing for approval: ${error.message}`);
    return error;
  }
};

export const getApplications = async (apiKey: string): Promise<any> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/get-applications",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error getting applications: ${error.message}`);
    return error;
  }
};

export const applyForLoan = async (
  apiKey: string,
  userId: string,
  lenderId: string,
  businessId: string,
  underLoi?: boolean,
  linkedinUrl?: string,
  files?: Array<File>
): Promise<any> => {
  try {
    console.log("lenderId", lenderId);
    const formData = new FormData();
    formData.append("lender_id", lenderId);
    if (underLoi !== undefined) {
      formData.append("under_loi", underLoi.toString());
    }
    if (linkedinUrl) {
      formData.append("linkedin_url", linkedinUrl);
    }

    if (files) {
      // Upload files to supabase bucket

      const newFileNames = [
        "buyer_resume",
        "buyer_credit_score",
        "buyer_2021_tax_return",
        "buyer_2022_tax_return",
        "buyer_2023_tax_return",
        "buyer_form_413",
        "cim",
        "business_2021_tax_return",
        "business_2022_tax_return",
        "business_2023_tax_return",
        "business_2024_pnl",
        "business_2024_balance_sheet",
        "loi",
      ];

      await Promise.all(
        files.map(async (file, index) => {
          const extension = file.name.split(".").pop();
          const newFileName = `${newFileNames[index]}.${extension}`;
          const { data, error } = await supabase.storage
            .from("loan_docs")
            .upload(`${userId}/${businessId}/${newFileName}`, file);
          if (error) {
            console.error(`Error uploading file: ${error.message}`);
          }
        })
      );
    }

    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/apply-for-loan",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.log(data);
      if (response.status == 401) {
        return { error: "Incomplete onboarding" };
      } else {
        return { error: data.detail };
      }
    }
    return data.application;
  } catch (error: any) {
    console.error(`Error applying for loan: ${error.message}`);
    return error;
  }
};

export const getDiligenceDocs = async (
  apiKey: string,
  vectorize: boolean
): Promise<any> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/get-diligence-docs",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vectorize: vectorize ? true : false }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error getting diligence docs: ${error.message}`);
    return error;
  }
};

export async function downloadFile(url: string) {
  const { data, error } = await supabase.storage
    .from("loan_docs")
    .download(url);
  if (error) {
    console.error(`Error downloading file: ${error.message}`);
    return null;
  }
  const fileUrl = window.URL.createObjectURL(data);
  return fileUrl;
}

export async function uploadDiligenceDocument(
  apiKey: string,
  userId: string,
  businessId: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from("diligence_docs")
    .upload(`${userId}/${businessId}/cim.pdf`, file);

  if (error) {
    console.error(`Error uploading file: ${error.message}`);
    return null;
  }
  return data;
}

export const chat = async (apiKey: string, messages: any): Promise<any> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/chat",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messages }),
      }
    );
    const data = await response.json();
    console.log(data);
    return data.message;
  } catch (error: any) {
    console.error(`Error chatting: ${error.message}`);
    return error;
  }
};
