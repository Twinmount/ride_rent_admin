import { PromotedCompanyCardType } from "@/types/api-types/API-types";

export const promotedCompanies: PromotedCompanyCardType[] = [
  {
    state: {
      stateId: "st-001",
      stateName: "Dubai",
    },
    category: {
      categoryId: "cat-001",
      categoryName: "Cars",
    },
    agents: [
      {
        companyId: "comp-101",
        agentId: "rd-1234",
        companyName: "Fast Wheels",
        companyLogo: "https://via.placeholder.com/100",
      },
      {
        companyId: "comp-102",
        agentId: "rd-5678",
        companyName: "Luxury Rides",
        companyLogo: "https://via.placeholder.com/100",
      },
      {
        companyId: "comp-103",
        agentId: "rd-9101",
        companyName: "Budget Cars",
        companyLogo: "https://via.placeholder.com/100",
      },
    ],
  },
  {
    state: {
      stateId: "st-002",
      stateName: "Dubai",
    },
    category: {
      categoryId: "cat-002",
      categoryName: "Bikes",
    },
    agents: [
      {
        companyId: "comp-201",
        agentId: "bk-4321",
        companyName: "Speedy Bikes",
        companyLogo: "https://via.placeholder.com/100",
      },
      {
        companyId: "comp-202",
        agentId: "bk-8765",
        companyName: "Eco Rides",
        companyLogo: "https://via.placeholder.com/100",
      },
    ],
  },
  {
    state: {
      stateId: "st-003",
      stateName: "Dubai",
    },
    category: {
      categoryId: "cat-003",
      categoryName: "Cycles",
    },
    agents: [
      {
        companyId: "comp-301",
        agentId: "cy-7890",
        companyName: "City Cycles",
        companyLogo: "https://via.placeholder.com/100",
      },
    ],
  },
];
