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
  lenderId: string,
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

    console.log("files", files);
    if (files) {
      files.forEach((file) => {
        formData.append("files", file);
      });
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
      if (response.status == 400) {
        return { error: "Subscription required" };
      } else if (response.status == 401) {
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
