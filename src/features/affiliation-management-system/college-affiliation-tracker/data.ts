import type {
  ApplicationProgressStep,
  CollegeAffiliationTrackerRecord,
} from './types';

export const defaultApplicationSteps: ApplicationProgressStep[] = [
  {
    label: 'Application Submitted',
    description:
      'College affiliation form and mandatory fee submitted on 05 Aug 2026.',
    icon: 'pi pi-send',
    authority: 'College Administration / Applicant',
    decision: 'Submitted & Verified',
    actionDate: '05/08/2026',
    discussion:
      'महाविद्यालय प्रशासन द्वारा निर्धारित पोर्टल पर मान्यता नवीनीकरण प्रपत्र, सोसाइटी रजिस्ट्रेशन, ऑडिट रिपोर्ट एवं निर्धारित चालान शुल्क संलग्न कर प्रस्तुत किया गया।',
    remark:
      'ऑनलाइन आवेदन पत्र क्रमांक 632609 सफलतापूर्वक प्राप्त हुआ। सभी प्राथमिक अनुलग्नक सिस्टम द्वारा सत्यापित किए गए।',
  },
  {
    label: 'Affiliation Admin Approval',
    description:
      'Application scrutiny and document verification completed on 08 Aug 2026.',
    icon: 'pi pi-verified',
    authority: 'Affiliation Scrutiny Cell (Admin)',
    decision: 'Approved & Forwarded',
    actionDate: '08/08/2026',
    discussion:
      'स्क्रूटनी सेल द्वारा कॉलेज के भूमि स्वामित्व, यूजीसी/विश्वविद्यालय नियम 28(17) अनुसार संकाय सूची एवं बैंक गारंटी संबंधी दस्तावेजों की समीक्षा की गई।',
    remark:
      'संस्था द्वारा प्रस्तुत प्रपत्रों का परीक्षण किया गया। समस्त वांछित दस्तावेज नियमानुसार पाए जाने पर भौतिक निरीक्षण हेतु अग्रेषित किया जाता है।',
  },
  {
    label: 'Inspection Team Assigned',
    description:
      'Inspection committee assigned; physical visit scheduled for 18 Aug 2026.',
    icon: 'pi pi-calendar',
    authority: 'DEO (District Education Officer)',
    decision: 'Recommended',
    actionDate: '12/08/2026',
    discussion:
      'जिला शिक्षा अधिकारी एवं विश्वविद्यालय प्रशासन द्वारा तीन सदस्यीय विशेषज्ञ निरीक्षण दल का गठन किया गया एवं निरीक्षण तिथि नियत की गई।',
    remark:
      'प्रकरण का परीक्षण किया गया। संस्था के निरीक्षण हेतु अधिकृत निरीक्षण दल का गठन किया गया तथा स्थल निरीक्षण 18 अगस्त 2026 को निर्धारित किया गया।',
  },
  {
    label: 'Physical Inspection',
    description:
      'On-site physical inspection conducted by the authorized inspection committee.',
    icon: 'pi pi-search',
    authority: 'Physical Inspection Committee',
    decision: 'Recommended',
    actionDate: '18/08/2026',
    discussion:
      'निरीक्षण दल द्वारा कॉलेज परिसर, प्रयोगशाला, पुस्तकालय, अग्निशमन सुरक्षा, खेल मैदान तथा प्राध्यापकों की उपस्थिति का प्रत्यक्ष भौतिक सत्यापन किया गया।',
    remark:
      'प्रकरण का परीक्षण किया गया। संस्था के निरीक्षण हेतु अधिकृत निरीक्षण दल द्वारा मान्यता नवीनीकरण हेतु निर्धारित मापदण्डों की पूर्ति होना प्रतिवेदित किया गया है तथा संस्था की मान्यता नवीनीकरण हेतु अनुशंसा की गई है।',
  },
  {
    label: 'Inspection Report Upload',
    description:
      'Inspection outcome and geo-tagged evaluation report uploaded on 25 Aug 2026.',
    icon: 'pi pi-file',
    authority: 'JD (Joint Director) Office',
    decision: 'Approved',
    actionDate: '25/08/2026',
    discussion:
      'निरीक्षण दल के संयुक्त प्रतिवेदन एवं फोटोग्राफ्स का परीक्षण किया गया। छात्र-शिक्षक अनुपात एवं आवश्यक अधोसंरचना संतोषजनक पाई गई।',
    remark:
      'प्रकरण का परीक्षण किया गया। संस्था के निरीक्षण हेतु अधिकृत निरीक्षण दल एवं संबंधित जिला शिक्षा अधिकारी द्वारा मान्यता नवीनीकरण हेतु निर्धारित मापदण्डों की पूर्ति होना प्रतिवेदित किया गया है तथा संस्था की मान्यता नवीनीकरण हेतु अनुशंसा की गई है। उक्त परिप्रेक्ष्य में संस्था के मान्यता नवीनीकरण सम्बन्धी आवेदन को मान्य किया जाता है।',
  },
  {
    label: 'Standing Committee Decision',
    description:
      'Standing Affiliation Committee formal review and recommendation.',
    icon: 'pi pi-users',
    authority: 'Standing Affiliation Committee',
    decision: 'Approved / Recommended',
    actionDate: '02/09/2026',
    discussion:
      'स्थाई संबद्धता समिति की उच्च स्तरीय बैठक में निरीक्षण प्रतिवेदन एवं डीईओ/जेडी की अनुशंसा पर विचार-विमर्श उपरांत सर्वसम्मति से संबद्धता नवीनीकरण का निर्णय लिया गया।',
    remark:
      'समिति द्वारा प्रकरण का सम्यक परीक्षण कर विश्वविद्यालय के परिनियम अनुसार सत्र 2026-27 हेतु संबद्धता जारी करने की सर्वसम्मति से अनुशंसा की जाती है।',
  },
  {
    label: 'Final Approval',
    description:
      'Final affiliation decision approved by the Registrar & Vice-Chancellor.',
    icon: 'pi pi-check-circle',
    authority: 'Registrar & Vice Chancellor',
    decision: 'Approved',
    actionDate: '08/09/2026',
    discussion:
      'कार्य परिषद (Executive Council) की अनुशंसा एवं सक्षम प्राधिकारी के अनुमोदन अनुसार संबद्धता आदेश को स्वीकृति प्रदान की गई।',
    remark:
      'सक्षम प्राधिकारी के अनुमोदन उपरांत संस्था को सत्र 2026-27 हेतु विधिमान्य संबद्धता प्रदान की जाती है।',
  },
  {
    label: 'Affiliation Certificate Generated',
    description:
      'Affiliation certificate digitally signed and issued to the college.',
    icon: 'pi pi-file-check',
    authority: 'Academic Affiliation Branch',
    decision: 'Certificate Issued',
    actionDate: '10/09/2026',
    discussion:
      'डिजिटल हस्ताक्षर युक्त संबद्धता प्रमाण-पत्र तैयार कर कॉलेज पोर्टल लॉगिन पर डाउनलोड हेतु उपलब्ध कराया गया।',
    remark:
      'संबद्धता प्रमाण पत्र क्रमांक UMS/AFF/2026/632609 सफलतापूर्वक जारी किया गया। कॉलेज पोर्टल से इसे डाउनलोड कर सकता है।',
  },
];

export const mockTrackerRecords: CollegeAffiliationTrackerRecord[] = [
  {
    applicationNo: '632609',
    applicationType: 'Renewal Recognition',
    affiliationType: 'University Affiliation',
    session: '2026-27',
    paymentDate: '15/12/2025',

    // College Details from 1st image
    collegeName: 'Global Institute of Technology',
    collegeType: 'Private',
    collegeEmail: 'admin@globalinstitute.edu',
    principalName: 'Dr. Rajesh Sharma',
    principalMobileNo: '9876543210',
    principalEmail: 'rajesh.sharma@globalinstitute.edu',
    state: 'Madhya Pradesh',
    district: 'Indore',
    blockTehsil: 'Indore',
    pinCode: '452001',
    collegeAddress: '123 Education Lane, Knowledge Park, Phase 1',

    // Optional legacy fields
    udiseCode: '23320202403',
    schoolName: 'Global Institute of Technology',
    block: 'Indore',
    address: '123 Education Lane, Knowledge Park, Phase 1',

    currentStatusBanner: 'Current Application Status - Approved by JD',
    currentStatusCode: 'approved',
    activeStepIndex: 3,
    progressSteps: defaultApplicationSteps,
    committeeVerificationSteps: [
      {
        stepTitle: 'Committee Status',
        stepSubtitle: 'Application Verification',
        badgeStatus: 'Verified',
        badgeVariant: 'success',
        actions: [
          {
            authority: 'DEO Decision',
            decision: 'Recommended',
            remark:
              'प्रकरण का परीक्षण किया गया। संस्था के निरीक्षण हेतु अधिकृत निरीक्षण दल द्वारा मान्यता नवीनीकरण हेतु निर्धारित मापदण्डों की पूर्ति होना प्रतिवेदित किया गया है तथा संस्था की मान्यता नवीनीकरण हेतु अनुशंसा की गई है। उक्त परिप्रेक्ष्य में संस्था के मान्यता नवीनीकरण सम्बन्धी आवेदन को मान्य हेतु अनुशंसा की जाती है।',
            actionDate: '23/01/2026',
            isApproved: true,
          },
          {
            authority: 'JD Decision',
            decision: 'Approved',
            remark:
              'प्रकरण का परीक्षण किया गया। संस्था के निरीक्षण हेतु अधिकृत निरीक्षण दल एवं संबंधित जिला शिक्षा अधिकारी द्वारा मान्यता नवीनीकरण हेतु निर्धारित मापदण्डों की पूर्ति होना प्रतिवेदित किया गया है तथा संस्था की मान्यता नवीनीकरण हेतु अनुशंसा की गई है। उक्त परिप्रेक्ष्य में संस्था के मान्यता नवीनीकरण सम्बन्धी आवेदन को मान्य किया जाता है।',
            actionDate: '25/01/2026',
            isApproved: true,
          },
        ],
      },
    ],
  },
  {
    applicationNo: 'APP-92837',
    applicationType: 'New Affiliation',
    affiliationType: 'University Affiliation',
    session: '2026-27',
    paymentDate: '12/01/2026',

    // College Details from 1st image
    collegeName: 'Global Institute of Technology',
    collegeType: 'Private',
    collegeEmail: 'admin@globalinstitute.edu',
    principalName: 'Dr. Rajesh Sharma',
    principalMobileNo: '9876543210',
    principalEmail: 'rajesh.sharma@globalinstitute.edu',
    state: 'Madhya Pradesh',
    district: 'Indore',
    blockTehsil: 'Indore',
    pinCode: '452001',
    collegeAddress: '123 Education Lane, Knowledge Park, Phase 1',

    udiseCode: '23320202404',
    schoolName: 'Global Institute of Technology',
    block: 'Indore',
    address: '123 Education Lane, Knowledge Park, Phase 1',

    currentStatusBanner:
      'Current Application Status - Rejected by Inspection Committee',
    currentStatusCode: 'rejected',
    activeStepIndex: 3,
    progressSteps: [
      defaultApplicationSteps[0],
      defaultApplicationSteps[1],
      defaultApplicationSteps[2],
      {
        label: 'Physical Inspection',
        description:
          'Physical inspection completed; statutory deficiencies detected in laboratory and faculty norms.',
        icon: 'pi pi-times-circle',
        authority: 'Physical Inspection Committee',
        decision: 'Rejected',
        actionDate: '18/01/2026',
        discussion:
          'निरीक्षण दल द्वारा कॉलेज परिसर, प्रयोगशालाओं एवं फैकल्टी का भौतिक सत्यापन किया गया। यूजीसी/विश्वविद्यालय परिनियम अनुसार आवश्यक उपकरण एवं निर्धारित शिक्षक अनुपस्थित पाए गए।',
        remark:
          'महाविद्यालय द्वारा यूजीसी एवं विश्वविद्यालय परिनियम अनुसार न्यूनतम शैक्षणिक मापदंड एवं प्रयोगशाला उपकरण पूर्ण नहीं पाए जाने के कारण इस स्तर पर आवेदन अस्वीकृत (Reject) किया जाता है।',
      },
      defaultApplicationSteps[4],
      defaultApplicationSteps[5],
      defaultApplicationSteps[6],
      defaultApplicationSteps[7],
    ],
    committeeVerificationSteps: [
      {
        stepTitle: 'Committee Status',
        stepSubtitle: 'Application Verification',
        badgeStatus: 'In Progress',
        badgeVariant: 'info',
        actions: [
          {
            authority: 'DEO Decision',
            decision: 'Recommended',
            remark:
              'संस्था के भौतिक संसाधनों एवं शैक्षणिक अर्हताओं का परीक्षण पूर्ण किया गया। अग्रिम निरीक्षण हेतु अग्रेषित।',
            actionDate: '15/01/2026',
            isApproved: true,
          },
        ],
      },
    ],
  },
  {
    applicationNo: 'AFF-2026-00124',
    applicationType: 'New Affiliation',
    affiliationType: 'University Affiliation',
    session: '2026-27',
    paymentDate: '18/12/2025',

    // College Details from 1st image
    collegeName: 'Global Institute of Technology & Science',
    collegeType: 'Private',
    collegeEmail: 'contact@gits.edu.in',
    principalName: 'Dr. Rajesh Sharma',
    principalMobileNo: '9876543210',
    principalEmail: 'rajesh.sharma@globalinstitute.edu',
    state: 'Madhya Pradesh',
    district: 'Indore',
    blockTehsil: 'Indore',
    pinCode: '452001',
    collegeAddress: '123 Education Lane, Knowledge Park, Phase 1',

    udiseCode: '23320205812',
    schoolName: 'Global Institute of Technology & Science',
    block: 'Indore',
    address: '123 Education Lane, Knowledge Park, Phase 1',

    currentStatusBanner:
      'Current Application Status - Recommended by Inspection Committee',
    currentStatusCode: 'current',
    activeStepIndex: 4,
    progressSteps: defaultApplicationSteps,
    committeeVerificationSteps: [
      {
        stepTitle: 'Inspection Committee Status',
        stepSubtitle: 'Physical Campus Scrutiny',
        badgeStatus: 'Recommended',
        badgeVariant: 'success',
        actions: [
          {
            authority: 'Inspection Committee Decision',
            decision: 'Recommended',
            remark:
              'महाविद्यालय परिसर का भौतिक निरीक्षण किया गया। पुस्तकालय, प्रयोगशाला एवं स्टाफ संबंधी सभी न्यूनतम मापदंड पूर्ण पाए गए हैं। नवीन सम्बद्धता हेतु अनुशंसा की जाती है।',
            actionDate: '20/01/2026',
            isApproved: true,
          },
          {
            authority: 'Standing Committee Decision',
            decision: 'Under Review',
            remark:
              'प्रकरण स्थायी समिति के समक्ष आगामी बैठक में विचारार्थ प्रस्तुत किया जाएगा।',
            actionDate: '28/01/2026',
            isApproved: false,
          },
        ],
      },
    ],
  },
  {
    applicationNo: '632610',
    applicationType: 'Renewal Recognition',
    affiliationType: 'University Affiliation',
    session: '2026-27',
    paymentDate: '20/12/2025',

    collegeName: 'National Institute of Technical Studies',
    collegeType: 'Private',
    collegeEmail: 'info@nits.edu',
    principalName: 'Dr. Alok Verma',
    principalMobileNo: '9826011223',
    principalEmail: 'alok.verma@nits.edu',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    blockTehsil: 'Huzur',
    pinCode: '462003',
    collegeAddress: '45 IT Park Road, Near Bypass, Bhopal',

    currentStatusBanner:
      'Current Application Status - Rejected by Standing Committee',
    currentStatusCode: 'rejected',
    activeStepIndex: 3,
    progressSteps: [
      defaultApplicationSteps[0],
      defaultApplicationSteps[1],
      defaultApplicationSteps[2],
      {
        label: 'Physical Inspection',
        description:
          'Physical inspection completed; statutory deficiencies detected.',
        icon: 'pi pi-times-circle',
        authority: 'Physical Inspection Committee',
        decision: 'Rejected / Disapproved',
        actionDate: '22/01/2026',
        discussion:
          'निरीक्षण दल द्वारा कॉलेज परिसर एवं प्रयोगशालाओं का भौतिक सत्यापन किया गया। यूजीसी/विश्वविद्यालय नियम 28(17) अनुसार निर्धारित प्रयोगशाला उपकरण, कंप्यूटर लैब एवं पर्याप्त योग्य प्राध्यापक उपस्थित नहीं पाए गए।',
        remark:
          'संस्था द्वारा यूजीसी एवं विश्वविद्यालय परिनियम अनुसार न्यूनतम शैक्षणिक मापदंड एवं आवश्यक अग्नि सुरक्षा के वैधानिक दस्तावेज प्रस्तुत नहीं किए जाने के कारण आवेदन निरस्त (Reject) किया जाता है।',
      },
      defaultApplicationSteps[4],
      defaultApplicationSteps[5],
      defaultApplicationSteps[6],
      defaultApplicationSteps[7],
    ],
    committeeVerificationSteps: [],
  },
];
