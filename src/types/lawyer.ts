import * as z from "zod"

export const LawyerRegisterSchema = z.object({
    fname_lawyer_registration: z.string(),
    lname_lawyer_registration: z.string(),
    dob_lawyer_registration: z.coerce.date(),
    gender_lawyer_registration: z.string(),
    phnumber_lawyer_registration: z.string(),
    email_lawyer_registration: z.string(),
    locality_lawyer_registration: z.string(),
    degree_lawyer_registration: z.array(z.string()).nonempty("Please at least one item"),
    institution_lawyer_registration: z.string(),
    about_lawyer_registration: z.string(),
    pubweburl_lawyer_registration: z.string(),
    pubemail_lawyer_registration: z.string(),
    num_cases_performed_lawyer_registration: z.string(),
    location_lawyer_registration: z.tuple([z.string(), z.string().optional()]),
    tags_lawyer_registration: z.array(z.string()).nonempty("Please at least one item")
});

export const genders = [{
  label: "Male",
  value: "male"
},
{
  label: "Female",
  value: "fe"
},
{
  label: "Others",
  value: "oth"
},
] as const;

export const localities = [
  {
      label: "Dahisar",
      value: "dahisar"
  },
  {
      label: "Borivali",
      value: "borivali"
  },
  {
      label: "Kandivali",
      value: "kandivali"
  },
  {
      label: "Malad",
      value: "malad"
  },
  {
      label: "Goregaon",
      value: "goregaon"
  },
  {
      label: "Jogeshwari",
      value: "jogeshwari"
  },
  {
      label: "Andheri",
      value: "andheri"
  },
  {
      label: "Vile Parle",
      value: "vile_parle"
  },
  {
      label: "Santacruz",
      value: "santacruz"
  },
  {
      label: "Khar Road",
      value: "khar_road"
  },
  {
      label: "Bandra",
      value: "bandra"
  }
];

export const lawFields = [
  {
      label: "Bachelor of Laws (LL.B)",
      value: "bachelor_of_laws_llb"
  },
  {
      label: "Bachelor of Arts & Laws (BA LL.B)",
      value: "bachelor_of_arts_and_laws_ba_llb"
  },
  {
      label: "Bachelor of Business Administration and Laws (BBA LL.B)",
      value: "bachelor_of_business_administration_and_laws_bba_llb"
  },
  {
      label: "Bachelor of Science & Laws (B.Sc LL.B)",
      value: "bachelor_of_science_and_laws_bsc_llb"
  },
  {
      label: "Bachelor of Computer Application & Laws (BCA LL.B)",
      value: "bachelor_of_computer_application_and_laws_bca_llb"
  },
  {
      label: "Bachelor of Commerce & Laws (B.Com LL.B)",
      value: "bachelor_of_commerce_and_laws_bcom_llb"
  },
  {
      label: "Five-year Integrated Program in Laws (BL/LL.B)",
      value: "five_year_integrated_program_in_laws_bl_llb"
  },
  {
      label: "Post Graduate Diploma in Laws (PGDL)",
      value: "post_graduate_diploma_in_laws_pgdl"
  },
  {
      label: "Master of Laws (LL.M.)",
      value: "master_of_laws_llm"
  },
  {
      label: "Masters in Business Laws (MBL)",
      value: "masters_in_business_laws_mbl"
  },
  {
      label: "Masters in Constitutional Law (MCL)",
      value: "masters_in_constitutional_law_mcl"
  },
  {
      label: "Masters in Corporate Laws (MCL)",
      value: "masters_in_corporate_laws_mcl"
  },
  {
      label: "Masters in International Law (MIL)",
      value: "masters_in_international_law_mil"
  },
  {
      label: "Masters in Human Rights Law (MHR)",
      value: "masters_in_human_rights_law_mhr"
  },
  {
      label: "Masters in Taxation Law (MTL)",
      value: "masters_in_taxation_law_mtl"
  },
  {
      label: "Master of Intellectual Property Rights (MIPR)",
      value: "master_of_intellectual_property_rights_mipr"
  },
  {
      label: "Master of Comparative Law (MCL)",
      value: "master_of_comparative_law_mcl"
  },
  {
      label: "Master of Cyber Laws (MCL)",
      value: "master_of_cyber_laws_mcl"
  }
];

export const institutions = [
    {
        label: "Supreme Court of India",
        value: "supreme_court_of_india"
    },
    {
        label: "High Court",
        value: "high_court"
    },
    {
        label: "District Court",
        value: "district_court"
    },
    {
        label: "Subordinate Court",
        value: "subordinate_court"
    },
    {
        label: "Family Court",
        value: "family_court"
    },
    {
        label: "Consumer Court",
        value: "consumer_court"
    },
    {
        label: "Labour Court",
        value: "labour_court"
    },
    {
        label: "Tribunal",
        value: "tribunal"
    }
];
