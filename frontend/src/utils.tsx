export const completeOnboarding = async (
  apiKey: string,
  loanAmount: number,
  firstName: string,
  lastName: string,
  applicantType: string,
  buyerResume: File,
  buyer2021TaxReturn: File,
  buyer2022TaxReturn: File,
  buyer2023TaxReturn: File,
  buyerForm413: File,
  companyName: string,
  companyWebsite: string,
  cim: File,
  business2021TaxReturn: File,
  business2022TaxReturn: File,
  business2023TaxReturn: File,
  business2024PnL: File,
  business2024BalanceSheet: File,
  loi: File,
  buyerCreditScore: File,
  buyerFirstName?: string,
  buyerLastName?: string,
  buyerEmail?: string,

  buyerLinkedin?: string,
  ownerFirstName?: string,
  ownerLastName?: string,
  ownerEmail?: string
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
          applicant_type: applicantType,
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

export const submitListingForApproval = async (
  apiKey: string,
  listingId: string
): Promise<any> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/submit-listing-for-approval",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listing_id: listingId }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error submitting listing for approval: ${error.message}`);
    return error;
  }
};
