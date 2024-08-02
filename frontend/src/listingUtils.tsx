export const getListingDetails = (listing: any): any => {
  var details = [
    { label: "Type", value: listing.type },
    { label: "Location", value: listing.location },
    { label: "EBITDA", value: getEbitdaFromListing(listing) },
    { label: "Revenue", value: getRevenueFromListing(listing) },
    { label: "Funding Raised", value: getFundingRaisedFromListing(listing) },
    {
      label: "Represented by broker",
      value: listing.brokered ? "Yes" : "No",
    },
  ];

  if (listing.founder_ownership_percent !== null) {
    details.push({
      label: "Founder Ownership",
      value: listing.founder_ownership_percent + "%",
    });
  }
  if (listing.annual_growth_percent !== null) {
    details.push({
      label: "Annual Growth Rate",
      value: listing.annual_growth_percent + "%",
    });
  }
  if (listing.num_employees !== null) {
    details.push({
      label: "Employee Count",
      value: String(listing.num_employees),
    });
  }
  if (listing.gross_margin !== null) {
    details.push({
      label: "Gross Margin",
      value: listing.gross_margin + "%",
    });
  }
  return {
    ebitda: getEbitdaFromListing(listing),
    revenue: getRevenueFromListing(listing),
    fundingRaised: getFundingRaisedFromListing(listing),
    displayList: details,
  };
};

function getRevenueFromListing(listing: any) {
  var revenue = "-";
  if (listing.revenue) {
    revenue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(listing.revenue);
  }

  return revenue;
}

function getFundingRaisedFromListing(listing: any) {
  var fundingRaised = "-";
  if (listing.funding_raised || listing.funding_raised === 0) {
    fundingRaised = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(listing.funding_raised);
  }

  return fundingRaised;
}

function getEbitdaFromListing(listing: any) {
  var ebitda = "Contact for ebitda";
  if (listing.ebitda && listing.ebitda > 0) {
    ebitda = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(listing.ebitda);
  } else if (!listing.profitability) {
    ebitda = "Not profitable";
  }
  return ebitda;
}
