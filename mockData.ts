import { Organization, Token, User, ServiceQueueState } from '../types';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-hospital',
    name: 'Government Hospitals',
    marathiName: 'शासकीय रुग्णालये',
    type: 'hospital',
    iconName: 'Hospital',
    badge: 'Public Healthcare',
    description: 'Book tokens for OPD registration, pathology lab collections, and medical certificates at district civil & general hospitals.',
    marathiDescription: 'जिल्हा सामान्य व नागरी रुग्णालयातील ओपीडी नोंदणी, प्रयोगशाळा चाचण्या आणि प्रमाणपत्रांसाठी टोकन बुक करा.',
    branches: [
      {
        id: 'br-hosp-1',
        organizationId: 'org-hospital',
        name: 'District Civil General Hospital (Main Campus)',
        marathiName: 'जिल्हा नागरी सामान्य रुग्णालय (मुख्य परिसर)',
        address: 'Station Road, Near Collector Office, District HQ',
        city: 'Pune',
        district: 'Pune',
        pincode: '411001',
        contactNumber: '020-26123456',
        operatingHours: '08:00 AM - 02:00 PM (OPD), Emergency 24x7',
        departments: [
          {
            id: 'dept-opd',
            branchId: 'br-hosp-1',
            name: 'OPD Registration & Case Paper',
            marathiName: 'ओपीडी नोंदणी व केस पेपर विभाग',
            services: [
              {
                id: 'srv-opd-gen',
                departmentId: 'dept-opd',
                name: 'General Medicine & OPD Registration',
                marathiName: 'सामान्य वैद्यकीय व ओपीडी नोंदणी',
                codePrefix: 'H-OPD',
                averageServiceTimeMinutes: 4,
                activeCounter: 'Counter No. 01 (General)',
                counterOfficer: 'Dr. S. Patil / Desk 1',
                description: 'Initial token for case paper issuance and general physician checkup.'
              },
              {
                id: 'srv-opd-ped',
                departmentId: 'dept-opd',
                name: 'Pediatrics & Child Care OPD',
                marathiName: 'बालरोग तपासणी विभाग',
                codePrefix: 'H-PED',
                averageServiceTimeMinutes: 6,
                activeCounter: 'Counter No. 02 (Pediatric)',
                counterOfficer: 'Dr. A. Kulkarni',
                description: 'Consultation for infants, children, and vaccination queries.'
              }
            ]
          },
          {
            id: 'dept-lab',
            branchId: 'br-hosp-1',
            name: 'Diagnostic Laboratory & Sample Collection',
            marathiName: 'तपासणी प्रयोगशाळा व नमुना संकलन',
            services: [
              {
                id: 'srv-lab-blood',
                departmentId: 'dept-lab',
                name: 'Blood & Pathology Sample Collection',
                marathiName: 'रक्त व पॅथॉलॉजी नमुना संकलन',
                codePrefix: 'H-LAB',
                averageServiceTimeMinutes: 5,
                activeCounter: 'Counter No. 03 (Lab 1)',
                counterOfficer: 'Lab Tech. R. Shinde',
                description: 'Token for morning fasting blood tests, routine CBC and biochemistry.'
              },
              {
                id: 'srv-lab-xray',
                departmentId: 'dept-lab',
                name: 'X-Ray & Radiology Token Desk',
                marathiName: 'क्ष-किरण (X-Ray) व रेडिओलॉजी कक्ष',
                codePrefix: 'H-RAD',
                averageServiceTimeMinutes: 8,
                activeCounter: 'Counter No. 04 (Radiology)',
                counterOfficer: 'Radiology Officer',
                description: 'Chest X-Ray, orthopedic scans, and ultrasound scheduling.'
              }
            ]
          },
          {
            id: 'dept-med-cert',
            branchId: 'br-hosp-1',
            name: 'Medical Certificates & Disability Board',
            marathiName: 'वैद्यकीय प्रमाणपत्र व दिव्यांग मंडळ',
            services: [
              {
                id: 'srv-cert-fit',
                departmentId: 'dept-med-cert',
                name: 'Government Fitness & Joining Certificate',
                marathiName: 'शासकीय सेवा योग्यता व फिटनेस प्रमाणपत्र',
                codePrefix: 'H-FIT',
                averageServiceTimeMinutes: 7,
                activeCounter: 'Counter No. 05 (Certificates)',
                counterOfficer: 'Civil Surgeon Office',
                description: 'Physical fitness verification for new public job joinings.'
              }
            ]
          }
        ]
      },
      {
        id: 'br-hosp-2',
        organizationId: 'org-hospital',
        name: 'Sub-District Hospital (Taluka Center)',
        marathiName: 'उपजिल्हा रुग्णालय (तालुका केंद्र)',
        address: 'Old Pune-Mumbai Highway, Taluka Sub-Division',
        city: 'Haveli',
        district: 'Pune',
        pincode: '412105',
        contactNumber: '020-27654321',
        operatingHours: '08:30 AM - 01:30 PM',
        departments: [
          {
            id: 'dept-opd-sub',
            branchId: 'br-hosp-2',
            name: 'General OPD & Pharmacy',
            marathiName: 'सामान्य ओपीडी व औषध वितरण',
            services: [
              {
                id: 'srv-sub-opd',
                departmentId: 'dept-opd-sub',
                name: 'Routine Consultation & Registration',
                marathiName: 'दैनिक तपासणी व नोंदणी',
                codePrefix: 'H-SUB',
                averageServiceTimeMinutes: 5,
                activeCounter: 'Counter No. 01',
                counterOfficer: 'Medical Officer',
                description: 'General doctor consultation queue.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'org-bank',
    name: 'Banks (Public Sector)',
    marathiName: 'राष्ट्रीयकृत व सार्वजनिक बँका',
    type: 'bank',
    iconName: 'Landmark',
    badge: 'Nationalized Banking',
    description: 'Manage your bank queue without standing in line for cash deposits/withdrawals, passbook printing, KYC, and loan counter inquiries.',
    marathiDescription: 'रोख जमा व काढणे, पासबुक प्रिंटिंग, केवायसी (KYC) आणि खाते सेवांसाठी बँकेतील रांग व्यवस्थापन करा.',
    branches: [
      {
        id: 'br-bank-1',
        organizationId: 'org-bank',
        name: 'State Bank of India (Treasury & Main Branch)',
        marathiName: 'भारतीय स्टेट बँक (मुख्य शाखा व कोषागार)',
        address: 'Baji Rao Road, Near Shaniwar Wada',
        city: 'Pune',
        district: 'Pune',
        pincode: '411002',
        contactNumber: '020-24456789',
        operatingHours: '10:00 AM - 04:00 PM (Monday to Saturday)',
        departments: [
          {
            id: 'dept-bank-cash',
            branchId: 'br-bank-1',
            name: 'Cash Management & Teller Counter',
            marathiName: 'रोख व्यवहार व टेलर काउंटर',
            services: [
              {
                id: 'srv-bank-cash-dep',
                departmentId: 'dept-bank-cash',
                name: 'Cash Deposit & Withdrawal Counter',
                marathiName: 'रोख रक्कम भरणे व काढणे',
                codePrefix: 'B-CSH',
                averageServiceTimeMinutes: 4,
                activeCounter: 'Counter No. 02 (Cash Desk)',
                counterOfficer: 'Head Teller M. Joshi',
                description: 'Physical cash deposits, challan submission, and high-value cash withdrawals.'
              },
              {
                id: 'srv-bank-dd-forex',
                departmentId: 'dept-bank-cash',
                name: 'Demand Draft (DD) & Cheque Clearance',
                marathiName: 'डिमांड ड्राफ्ट (DD) व चेक क्लिअरिंग',
                codePrefix: 'B-DD',
                averageServiceTimeMinutes: 6,
                activeCounter: 'Counter No. 03 (Clearing)',
                counterOfficer: 'Officer P. Deshmukh',
                description: 'Government challan DD creation and bulk clearing cheques.'
              }
            ]
          },
          {
            id: 'dept-bank-acct',
            branchId: 'br-bank-1',
            name: 'Account Services & KYC Desk',
            marathiName: 'खाते सेवा व केवायसी (KYC) विभाग',
            services: [
              {
                id: 'srv-bank-kyc',
                departmentId: 'dept-bank-acct',
                name: 'KYC Updation & Mobile/Aadhaar Linking',
                marathiName: 'केवायसी (KYC) अद्ययावतीकरण व आधार जोडणी',
                codePrefix: 'B-KYC',
                averageServiceTimeMinutes: 7,
                activeCounter: 'Counter No. 04 (Customer Desk)',
                counterOfficer: 'Asst. Manager S. Nair',
                description: 'Aadhaar seeding, re-KYC submission, and mobile update forms.'
              },
              {
                id: 'srv-bank-passbook',
                departmentId: 'dept-bank-acct',
                name: 'Passbook Issue & Statement Desk',
                marathiName: 'नवीन पासबुक व खाते विवरण',
                codePrefix: 'B-PBK',
                averageServiceTimeMinutes: 3,
                activeCounter: 'Counter No. 01 (Helpdesk)',
                counterOfficer: 'Desk Staff',
                description: 'Manual passbook generation, certificate of balance, and statement prints.'
              }
            ]
          },
          {
            id: 'dept-bank-loans',
            branchId: 'br-bank-1',
            name: 'Government Schemes & Agriculture Loans',
            marathiName: 'शासकीय योजना व कृषी कर्ज विभाग',
            services: [
              {
                id: 'srv-bank-gov-scheme',
                departmentId: 'dept-bank-loans',
                name: 'PMMY (Mudra) & Govt Subsidy Verification',
                marathiName: 'मुद्रा योजना व शासकीय अनुदान पडताळणी',
                codePrefix: 'B-MDR',
                averageServiceTimeMinutes: 10,
                activeCounter: 'Counter No. 05 (Credit Desk)',
                counterOfficer: 'Loan Officer V. Rao',
                description: 'Application intake for PM SVANidhi, Mudra, and Kisan Credit.'
              }
            ]
          }
        ]
      },
      {
        id: 'br-bank-2',
        organizationId: 'org-bank',
        name: 'Bank of Baroda (Camp Cantonment Branch)',
        marathiName: 'बँक ऑफ बडोदा (कॅम्प शाखा)',
        address: 'MG Road, Pune Cantonment Area',
        city: 'Pune',
        district: 'Pune',
        pincode: '411001',
        contactNumber: '020-26345678',
        operatingHours: '10:00 AM - 04:00 PM',
        departments: [
          {
            id: 'dept-bob-gen',
            branchId: 'br-bank-2',
            name: 'General Banking & Cash',
            marathiName: 'सामान्य बँकिंग व रोख व्यवहार',
            services: [
              {
                id: 'srv-bob-cash',
                departmentId: 'dept-bob-gen',
                name: 'Cash Deposit & Customer Services',
                marathiName: 'रोख व्यवहार व ग्राहक सेवा',
                codePrefix: 'B-BOB',
                averageServiceTimeMinutes: 5,
                activeCounter: 'Counter No. 01',
                counterOfficer: 'Teller Desk',
                description: 'General account management and cash counter.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'org-gov-office',
    name: 'Government Offices',
    marathiName: 'शासकीय कार्यालये',
    type: 'government_office',
    iconName: 'Building2',
    badge: 'Public Administration',
    description: 'Book digital tokens for Tehsildar office, Collectorate, and Municipal Corporation citizen facilitation counters.',
    marathiDescription: 'तहसीलदार कार्यालय, जिल्हाधिकारी कार्यालय आणि महानगरपालिका नागरिक सुविधा केंद्रांसाठी डिजिटल टोकन मिळवा.',
    branches: [
      {
        id: 'br-gov-1',
        organizationId: 'org-gov-office',
        name: 'Tehsildar & Taluka Magistrate Office',
        marathiName: 'तहसीलदार व तालुका दंडाधिकारी कार्यालय',
        address: 'Administrative Building, Taluka HQ Compound',
        city: 'Pune',
        district: 'Pune',
        pincode: '411001',
        contactNumber: '020-26122233',
        operatingHours: '10:00 AM - 05:30 PM (Citizen Counters: 10:30 AM - 03:30 PM)',
        departments: [
          {
            id: 'dept-gov-cert',
            branchId: 'br-gov-1',
            name: 'Revenue & Citizen Certificates (Setu Desk)',
            marathiName: 'महसूल व नागरिक दाखले (सेतू कक्ष)',
            services: [
              {
                id: 'srv-gov-income',
                departmentId: 'dept-gov-cert',
                name: 'Income & Domicile Certificate Verification',
                marathiName: 'उत्पन्नाचा दाखला व अधिवास (Domicile) प्रमाणपत्र',
                codePrefix: 'G-INC',
                averageServiceTimeMinutes: 5,
                activeCounter: 'Counter No. 01 (Setu)',
                counterOfficer: 'Revenue Inspector S. Jadhav',
                description: 'Physical document submission and verification for state income/domicile.'
              },
              {
                id: 'srv-gov-caste',
                departmentId: 'dept-gov-cert',
                name: 'Caste & Non-Creamy Layer Verification',
                marathiName: 'जात प्रमाणपत्र व नॉन-क्रिमीलेअर पडताळणी',
                codePrefix: 'G-CST',
                averageServiceTimeMinutes: 7,
                activeCounter: 'Counter No. 02 (Caste Desk)',
                counterOfficer: 'Naib Tehsildar (Magisterial)',
                description: 'Affidavit submission, lineage scrutiny, and validity token.'
              }
            ]
          },
          {
            id: 'dept-gov-ration',
            branchId: 'br-gov-1',
            name: 'Food & Civil Supplies (Ration Card)',
            marathiName: 'अन्न व नागरी पुरवठा (रेशन कार्ड विभाग)',
            services: [
              {
                id: 'srv-gov-ration-add',
                departmentId: 'dept-gov-ration',
                name: 'Ration Card Member Addition & RC Surrender',
                marathiName: 'रेशन कार्ड नाव नोंदणी व बदल अर्ज',
                codePrefix: 'G-RAT',
                averageServiceTimeMinutes: 6,
                activeCounter: 'Counter No. 03 (Food Supply)',
                counterOfficer: 'Supply Inspector M. More',
                description: 'New family member inclusion and surrender certificates.'
              }
            ]
          },
          {
            id: 'dept-gov-subreg',
            branchId: 'br-gov-1',
            name: 'Land Records & 7/12 Ferfar Enquiry',
            marathiName: 'भूमी अभिलेख व ७/१२ फेरफार चौकशी',
            services: [
              {
                id: 'srv-gov-ferfar',
                departmentId: 'dept-gov-subreg',
                name: 'Mutation Entry (Ferfar) & 7/12 Certified Copy',
                marathiName: 'फेरफार नोंद व प्रमाणित ७/१२ उतारा',
                codePrefix: 'G-LND',
                averageServiceTimeMinutes: 6,
                activeCounter: 'Counter No. 04 (Talathi Desk)',
                counterOfficer: 'Circle Officer Talathi',
                description: 'Inquiry regarding mutation status and digital land record stamps.'
              }
            ]
          }
        ]
      },
      {
        id: 'br-gov-2',
        organizationId: 'org-gov-office',
        name: 'Municipal Corporation Citizen Facilitation Center (CFC)',
        marathiName: 'महानगरपालिका नागरिक सुविधा केंद्र (CFC)',
        address: 'PMC Main Annex, Shivajinagar',
        city: 'Pune',
        district: 'Pune',
        pincode: '411005',
        contactNumber: '020-25501000',
        operatingHours: '09:30 AM - 04:30 PM',
        departments: [
          {
            id: 'dept-pmc-tax',
            branchId: 'br-gov-2',
            name: 'Property Tax & Birth/Death Records',
            marathiName: 'मालमत्ता कर व जन्म-मृत्यू नोंदणी',
            services: [
              {
                id: 'srv-pmc-birth',
                departmentId: 'dept-pmc-tax',
                name: 'Birth & Death Certificate Issuance',
                marathiName: 'जन्म व मृत्यू दाखला वितरण',
                codePrefix: 'G-PMC',
                averageServiceTimeMinutes: 4,
                activeCounter: 'Counter No. 01 (Civil Reg)',
                counterOfficer: 'Registrar Staff',
                description: 'Official seal copies and search of historical register.'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_QUEUE_STATES: Record<string, ServiceQueueState> = {
  'srv-opd-gen': {
    serviceId: 'srv-opd-gen',
    currentRunningTokenNumber: 'H-OPD-015',
    currentRunningSequence: 15,
    lastAssignedSequence: 23,
    activeCounter: 'Counter No. 01 (General)',
    isCounterOpen: true,
  },
  'srv-opd-ped': {
    serviceId: 'srv-opd-ped',
    currentRunningTokenNumber: 'H-PED-008',
    currentRunningSequence: 8,
    lastAssignedSequence: 12,
    activeCounter: 'Counter No. 02 (Pediatric)',
    isCounterOpen: true,
  },
  'srv-lab-blood': {
    serviceId: 'srv-lab-blood',
    currentRunningTokenNumber: 'H-LAB-019',
    currentRunningSequence: 19,
    lastAssignedSequence: 28,
    activeCounter: 'Counter No. 03 (Lab 1)',
    isCounterOpen: true,
  },
  'srv-lab-xray': {
    serviceId: 'srv-lab-xray',
    currentRunningTokenNumber: 'H-RAD-006',
    currentRunningSequence: 6,
    lastAssignedSequence: 10,
    activeCounter: 'Counter No. 04 (Radiology)',
    isCounterOpen: true,
  },
  'srv-cert-fit': {
    serviceId: 'srv-cert-fit',
    currentRunningTokenNumber: 'H-FIT-004',
    currentRunningSequence: 4,
    lastAssignedSequence: 9,
    activeCounter: 'Counter No. 05 (Certificates)',
    isCounterOpen: true,
  },
  'srv-bank-cash-dep': {
    serviceId: 'srv-bank-cash-dep',
    currentRunningTokenNumber: 'B-CSH-042',
    currentRunningSequence: 42,
    lastAssignedSequence: 49,
    activeCounter: 'Counter No. 02 (Cash Desk)',
    isCounterOpen: true,
  },
  'srv-bank-dd-forex': {
    serviceId: 'srv-bank-dd-forex',
    currentRunningTokenNumber: 'B-DD-011',
    currentRunningSequence: 11,
    lastAssignedSequence: 15,
    activeCounter: 'Counter No. 03 (Clearing)',
    isCounterOpen: true,
  },
  'srv-bank-kyc': {
    serviceId: 'srv-bank-kyc',
    currentRunningTokenNumber: 'B-KYC-018',
    currentRunningSequence: 18,
    lastAssignedSequence: 25,
    activeCounter: 'Counter No. 04 (Customer Desk)',
    isCounterOpen: true,
  },
  'srv-bank-passbook': {
    serviceId: 'srv-bank-passbook',
    currentRunningTokenNumber: 'B-PBK-031',
    currentRunningSequence: 31,
    lastAssignedSequence: 34,
    activeCounter: 'Counter No. 01 (Helpdesk)',
    isCounterOpen: true,
  },
  'srv-bank-gov-scheme': {
    serviceId: 'srv-bank-gov-scheme',
    currentRunningTokenNumber: 'B-MDR-005',
    currentRunningSequence: 5,
    lastAssignedSequence: 8,
    activeCounter: 'Counter No. 05 (Credit Desk)',
    isCounterOpen: true,
  },
  'srv-gov-income': {
    serviceId: 'srv-gov-income',
    currentRunningTokenNumber: 'G-INC-028',
    currentRunningSequence: 28,
    lastAssignedSequence: 37,
    activeCounter: 'Counter No. 01 (Setu)',
    isCounterOpen: true,
  },
  'srv-gov-caste': {
    serviceId: 'srv-gov-caste',
    currentRunningTokenNumber: 'G-CST-014',
    currentRunningSequence: 14,
    lastAssignedSequence: 20,
    activeCounter: 'Counter No. 02 (Caste Desk)',
    isCounterOpen: true,
  },
  'srv-gov-ration-add': {
    serviceId: 'srv-gov-ration-add',
    currentRunningTokenNumber: 'G-RAT-009',
    currentRunningSequence: 9,
    lastAssignedSequence: 14,
    activeCounter: 'Counter No. 03 (Food Supply)',
    isCounterOpen: true,
  },
  'srv-gov-ferfar': {
    serviceId: 'srv-gov-ferfar',
    currentRunningTokenNumber: 'G-LND-012',
    currentRunningSequence: 12,
    lastAssignedSequence: 16,
    activeCounter: 'Counter No. 04 (Talathi Desk)',
    isCounterOpen: true,
  },
  'srv-pmc-birth': {
    serviceId: 'srv-pmc-birth',
    currentRunningTokenNumber: 'G-PMC-022',
    currentRunningSequence: 22,
    lastAssignedSequence: 27,
    activeCounter: 'Counter No. 01 (Civil Reg)',
    isCounterOpen: true,
  }
};

export const INITIAL_DEMO_TOKENS: Token[] = [
  {
    id: 'tok-demo-1',
    tokenNumber: 'H-OPD-022',
    numericSequence: 22,
    userId: 'user-demo-citizen',
    citizenName: 'Siddhesh Agare',
    citizenMobile: '9876543210',
    citizenEmail: 'siddhesh.citizen@example.gov.in',
    isSeniorCitizenOrPriority: false,
    organizationId: 'org-hospital',
    organizationName: 'Government Hospitals',
    branchId: 'br-hosp-1',
    branchName: 'District Civil General Hospital (Main Campus)',
    departmentId: 'dept-opd',
    departmentName: 'OPD Registration & Case Paper',
    serviceId: 'srv-opd-gen',
    serviceName: 'General Medicine & OPD Registration',
    counterNumber: 'Counter No. 01 (General)',
    status: 'waiting',
    bookingTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    currentRunningTokenNumberAtBooking: 'H-OPD-015',
    peopleAheadAtBooking: 7,
    estimatedWaitMinutes: 28, // 7 * 4
    notes: 'Case paper renewal for routine checkup'
  },
  {
    id: 'tok-demo-2',
    tokenNumber: 'B-CSH-048',
    numericSequence: 48,
    userId: 'user-demo-citizen',
    citizenName: 'Siddhesh Agare',
    citizenMobile: '9876543210',
    citizenEmail: 'siddhesh.citizen@example.gov.in',
    isSeniorCitizenOrPriority: false,
    organizationId: 'org-bank',
    organizationName: 'Banks (Public Sector)',
    branchId: 'br-bank-1',
    branchName: 'State Bank of India (Treasury & Main Branch)',
    departmentId: 'dept-bank-cash',
    departmentName: 'Cash Management & Teller Counter',
    serviceId: 'srv-bank-cash-dep',
    serviceName: 'Cash Deposit & Withdrawal Counter',
    counterNumber: 'Counter No. 02 (Cash Desk)',
    status: 'waiting',
    bookingTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    currentRunningTokenNumberAtBooking: 'B-CSH-042',
    peopleAheadAtBooking: 6,
    estimatedWaitMinutes: 24, // 6 * 4
    notes: 'Government challan deposit'
  },
  {
    id: 'tok-demo-3',
    tokenNumber: 'G-INC-035',
    numericSequence: 35,
    userId: 'user-demo-citizen',
    citizenName: 'Siddhesh Agare',
    citizenMobile: '9876543210',
    citizenEmail: 'siddhesh.citizen@example.gov.in',
    isSeniorCitizenOrPriority: false,
    organizationId: 'org-gov-office',
    organizationName: 'Government Offices',
    branchId: 'br-gov-1',
    branchName: 'Tehsildar & Taluka Magistrate Office',
    departmentId: 'dept-gov-cert',
    departmentName: 'Revenue & Citizen Certificates (Setu Desk)',
    serviceId: 'srv-gov-income',
    serviceName: 'Income & Domicile Certificate Verification',
    counterNumber: 'Counter No. 01 (Setu)',
    status: 'waiting',
    bookingTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    currentRunningTokenNumberAtBooking: 'G-INC-028',
    peopleAheadAtBooking: 7,
    estimatedWaitMinutes: 35, // 7 * 5
    notes: 'Scholarship income affidavit verification'
  }
];

export const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'user-demo-citizen',
    name: 'Siddhesh Agare',
    email: 'citizen@queuewise.gov.in',
    mobile: '9876543210',
    role: 'citizen',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user-admin-head',
    name: 'Administrative Officer (Nodal Officer)',
    email: 'admin@queuewise.gov.in',
    mobile: '9822001122',
    role: 'admin',
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'user-operator-hosp',
    name: 'Counter Clerk (Civil Hospital Desk 1)',
    email: 'operator.hospital@queuewise.gov.in',
    mobile: '9822334455',
    role: 'counter_operator',
    assignedServiceId: 'srv-opd-gen',
    createdAt: '2026-01-05T08:00:00Z'
  },
  {
    id: 'user-operator-bank',
    name: 'Teller Clerk (SBI Cash Desk 2)',
    email: 'operator.bank@queuewise.gov.in',
    mobile: '9822556677',
    role: 'counter_operator',
    assignedServiceId: 'srv-bank-cash-dep',
    createdAt: '2026-01-05T08:00:00Z'
  },
  {
    id: 'user-operator-gov',
    name: 'Setu Officer (Tehsildar Desk 1)',
    email: 'operator.gov@queuewise.gov.in',
    mobile: '9822778899',
    role: 'counter_operator',
    assignedServiceId: 'srv-gov-income',
    createdAt: '2026-01-05T08:00:00Z'
  }
];
