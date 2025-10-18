// Centralized mock data for the entire Zennara admin panel
// All components will use this single source of truth

// Zennara Doctors (Real doctors from zennara.in)
export const doctors = [
  {
    id: 'DOC001',
    name: 'Dr. Rickson Pereira',
    specialization: 'Dermatology, Aesthetic Medicine',
    image: 'https://i.pravatar.cc/150?img=33',
    experience: '15+ years',
    qualification: 'MBBS, MD (Dermatology)',
    registration: 'MCI-12345678',
    phone: '+91 9876543210',
    email: 'dr.rickson@zennara.in',
    status: 'Active',
    locations: [
      { name: 'Jubilee Hills', type: 'Primary' },
      { name: 'Kondapur', type: 'Alternate' }
    ],
    workingHours: {
      weekdays: '10:00 AM - 7:00 PM',
      sunday: '11:00 AM - 3:00 PM'
    },
    services: ['Botox & Fillers', 'HIFU Treatments', 'Chemical Peels', 'Laser Treatments', 'Anti-Aging'],
    totalServices: 45,
    consultationFee: 1200,
    followUpFee: 500,
    stats: {
      patients: 156,
      rating: 4.9,
      revenue: 452000,
      completed: 148
    }
  },
  {
    id: 'DOC002',
    name: 'Dr. Shilpa Gill',
    specialization: 'Cosmetic Dermatology',
    image: 'https://i.pravatar.cc/150?img=47',
    experience: '12+ years',
    qualification: 'MBBS, MD (Dermatology), Fellowship in Aesthetics',
    registration: 'MCI-87654321',
    phone: '+91 9876543211',
    email: 'dr.shilpa@zennara.in',
    status: 'Active',
    locations: [
      { name: 'Kondapur', type: 'Primary' },
      { name: 'Financial District', type: 'Alternate' }
    ],
    workingHours: {
      weekdays: '9:00 AM - 6:00 PM',
      sunday: 'Closed'
    },
    services: ['PRP Therapy', 'Microneedling', 'HydraFacial', 'Skin Lightening', 'Acne Treatment'],
    totalServices: 38,
    consultationFee: 1000,
    followUpFee: 400,
    stats: {
      patients: 134,
      rating: 4.8,
      revenue: 398000,
      completed: 128
    }
  },
  {
    id: 'DOC003',
    name: 'Dr. Janaki K Yalamanchili',
    specialization: 'Skin & Laser',
    image: 'https://i.pravatar.cc/150?img=45',
    experience: '10+ years',
    qualification: 'MBBS, MD (Dermatology)',
    registration: 'MCI-11223344',
    phone: '+91 9876543212',
    email: 'dr.janaki@zennara.in',
    status: 'Active',
    locations: [
      { name: 'Financial District', type: 'Primary' }
    ],
    workingHours: {
      weekdays: '10:00 AM - 6:00 PM',
      sunday: '10:00 AM - 2:00 PM'
    },
    services: ['Laser Hair Removal', 'Laser Toning', 'Pigmentation Treatment', 'Scar Revision'],
    totalServices: 32,
    consultationFee: 1100,
    followUpFee: 450,
    stats: {
      patients: 112,
      rating: 4.7,
      revenue: 325000,
      completed: 105
    }
  },
  {
    id: 'DOC004',
    name: 'Dr. Spoorthy Nagineni',
    specialization: 'Aesthetic Medicine',
    image: 'https://i.pravatar.cc/150?img=44',
    experience: '8+ years',
    qualification: 'MBBS, DNB (Dermatology)',
    registration: 'MCI-55667788',
    phone: '+91 9876543213',
    email: 'dr.spoorthy@zennara.in',
    status: 'Active',
    locations: [
      { name: 'Jubilee Hills', type: 'Primary' }
    ],
    workingHours: {
      weekdays: '11:00 AM - 7:00 PM',
      sunday: 'Closed'
    },
    services: ['Dermal Fillers', 'Thread Lift', 'Fat Dissolving', 'Body Contouring'],
    totalServices: 28,
    consultationFee: 900,
    followUpFee: 400,
    stats: {
      patients: 98,
      rating: 4.8,
      revenue: 287000,
      completed: 92
    }
  },
  {
    id: 'DOC005',
    name: 'Dr. Madhurya',
    specialization: 'Dermatology',
    image: 'https://i.pravatar.cc/150?img=48',
    experience: '6+ years',
    qualification: 'MBBS, MD (Dermatology)',
    registration: 'MCI-99887766',
    phone: '+91 9876543214',
    email: 'dr.madhurya@zennara.in',
    status: 'Active',
    locations: [
      { name: 'Kondapur', type: 'Primary' }
    ],
    workingHours: {
      weekdays: '9:00 AM - 5:00 PM',
      sunday: '9:00 AM - 1:00 PM'
    },
    services: ['Medical Dermatology', 'Hair Treatment', 'Vitiligo Treatment', 'Psoriasis Care'],
    totalServices: 25,
    consultationFee: 800,
    followUpFee: 350,
    stats: {
      patients: 87,
      rating: 4.9,
      revenue: 245000,
      completed: 82
    }
  },
  {
    id: 'DOC006',
    name: 'Dr. Meghana',
    specialization: 'Cosmetic Procedures',
    image: 'https://i.pravatar.cc/150?img=49',
    experience: '7+ years',
    qualification: 'MBBS, MD (Dermatology), Aesthetics Certification',
    registration: 'MCI-44332211',
    phone: '+91 9876543215',
    email: 'dr.meghana@zennara.in',
    status: 'Active',
    locations: [
      { name: 'Financial District', type: 'Primary' },
      { name: 'Jubilee Hills', type: 'Alternate' }
    ],
    workingHours: {
      weekdays: '10:00 AM - 6:00 PM',
      sunday: 'Closed'
    },
    services: ['Botox', 'Chemical Peels', 'Microdermabrasion', 'Anti-Aging Treatments'],
    totalServices: 30,
    consultationFee: 950,
    followUpFee: 400,
    stats: {
      patients: 102,
      rating: 4.7,
      revenue: 298000,
      completed: 96
    }
  }
];

// Treatments offered
export const treatments = [
  { id: 'TRT001', name: 'HydraFacial', category: 'Facials', price: 8850, duration: 60 },
  { id: 'TRT002', name: 'Botox Treatment', category: 'Injectables', price: 39000, duration: 30 },
  { id: 'TRT003', name: 'PRP Hair Therapy', category: 'Hair', price: 17000, duration: 45 },
  { id: 'TRT004', name: 'Laser Toning', category: 'Laser', price: 12500, duration: 40 },
  { id: 'TRT005', name: 'Chemical Peel', category: 'Facials', price: 6500, duration: 45 },
  { id: 'TRT006', name: 'Dermal Fillers', category: 'Injectables', price: 45000, duration: 30 },
  { id: 'TRT007', name: 'Microneedling', category: 'Skin', price: 8000, duration: 60 },
  { id: 'TRT008', name: 'Anti-Aging Treatment', category: 'Anti-Aging', price: 15000, duration: 90 },
  { id: 'TRT009', name: 'Acne Treatment', category: 'Medical', price: 5500, duration: 30 },
  { id: 'TRT010', name: 'Hair Transplant', category: 'Hair', price: 85000, duration: 240 }
];

// Locations
export const locations = ['Jubilee Hills', 'Kondapur', 'Financial District'];

// Generate 100 consistent patients
export const generatePatients = () => {
  const indianNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Anjali Singh', 'Rahul Gupta',
    'Sneha Reddy', 'Vikram Malhotra', 'Kavita Desai', 'Arjun Mehta', 'Neha Iyer',
    'Sanjay Verma', 'Divya Kapoor', 'Rohan Shah', 'Meera Krishnan', 'Kiran Joshi',
    'Pooja Singh', 'Aditya Sharma', 'Riya Patel', 'Kunal Mehta', 'Ananya Reddy',
    'Khushnoor', 'Suresh Nair', 'Lakshmi Rao', 'Deepak Jain', 'Swati Agarwal'
  ];

  const memberTypes = ['Premium Zen Member', 'VIP Member', 'Regular Member', 'Basic Member'];
  
  const patients = [];
  for (let i = 1; i <= 100; i++) {
    const nameIndex = (i - 1) % indianNames.length;
    const name = indianNames[nameIndex];
    const age = 20 + (i % 40);
    const gender = i % 2 === 0 ? 'Female' : 'Male';
    const imageId = (i % 70) + 1;
    
    patients.push({
      id: `PAT${String(i).padStart(6, '0')}`,
      name: name,
      age: age,
      gender: gender,
      phone: `+91 ${9000 + i} ${100 + (i % 900)} ${1000 + (i * 7 % 9000)}`,
      email: `${name.toLowerCase().replace(' ', '.')}${i}@email.com`,
      memberType: memberTypes[i % memberTypes.length],
      image: `https://i.pravatar.cc/150?img=${imageId}`,
      joinDate: `Jan ${(i % 28) + 1}, 2024`,
      totalVisits: 1 + (i % 50),
      lastVisit: `Oct ${(i % 15) + 1}, 2025`,
      totalSpent: (50 + (i * 13 % 200)) * 1000,
      location: locations[i % locations.length],
      // Medical info
      allergies: i % 5 === 0 ? ['Penicillin'] : i % 7 === 0 ? ['Sulfa Drugs'] : [],
      conditions: i % 3 === 0 ? ['Diabetes Type 2'] : i % 4 === 0 ? ['Hypothyroidism'] : []
    });
  }
  return patients;
};

export const patients = generatePatients();

// Generate 100 appointments linked to patients
export const generateAppointments = () => {
  const statuses = ['Confirmed', 'Pending', 'Rescheduled', 'Cancelled'];
  const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'];
  const dates = ['Oct 15', 'Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 'Oct 20', 'Oct 21'];
  
  const appointments = [];
  for (let i = 1; i <= 100; i++) {
    const patient = patients[i - 1];
    const treatment = treatments[i % treatments.length];
    const doctor = doctors[i % doctors.length];
    const location = locations[i % locations.length];
    const status = statuses[i % statuses.length];
    const time = times[i % times.length];
    const date = dates[i % dates.length];
    
    appointments.push({
      id: `ZEN2025${String(i).padStart(6, '0')}`,
      patient: {
        id: patient.id,
        name: patient.name,
        phone: patient.phone.slice(0, 15) + 'xxx',
        image: patient.image,
        email: patient.email
      },
      treatment: {
        id: treatment.id,
        name: treatment.name,
        price: `₹${treatment.price.toLocaleString('en-IN')}`,
        duration: treatment.duration,
        category: treatment.category
      },
      dateTime: {
        date: date,
        time: time,
        location: location,
        doctor: doctor.name,
        doctorId: doctor.id
      },
      status: status,
      hasForm: i % 3 !== 0,
      bookedOn: `Oct ${(i % 15) + 1}, 2025 ${((i % 12) + 1)}:${((i % 60))}${i % 2 === 0 ? 'AM' : 'PM'}`
    });
  }
  return appointments;
};

export const appointments = generateAppointments();

// Generate treatment history for each patient
export const generateTreatmentHistory = (patientId) => {
  const patientIndex = parseInt(patientId.replace('PAT', '')) - 1;
  const patient = patients[patientIndex];
  
  if (!patient) return [];
  
  const history = [];
  const numTreatments = Math.min(patient.totalVisits, 10);
  
  for (let i = 0; i < numTreatments; i++) {
    const treatment = treatments[(patientIndex + i) % treatments.length];
    const doctor = doctors[(patientIndex + i) % doctors.length];
    const location = locations[(patientIndex + i) % locations.length];
    
    history.push({
      id: i + 1,
      date: `${['Sep', 'Aug', 'Jul', 'Oct'][i % 4]} ${((i * 5) % 28) + 1}, 2025`,
      treatment: treatment.name,
      doctor: doctor.name,
      location: location,
      cost: `₹${treatment.price.toLocaleString('en-IN')}`,
      status: 'Completed',
      notes: ['Excellent results', 'Good progress', 'Patient satisfied', 'Continue treatment'][i % 4]
    });
  }
  
  return history.reverse();
};

// Helper function to get patient by ID
export const getPatientById = (id) => {
  return patients.find(p => p.id === id);
};

// Helper function to get appointment by ID
export const getAppointmentById = (id) => {
  return appointments.find(a => a.id === id);
};

// Helper function to get doctor by ID
export const getDoctorById = (id) => {
  return doctors.find(d => d.id === id);
};

// Export statistics
export const statistics = {
  totalPatients: patients.length,
  totalAppointments: appointments.length,
  totalDoctors: doctors.length,
  confirmedAppointments: appointments.filter(a => a.status === 'Confirmed').length,
  pendingAppointments: appointments.filter(a => a.status === 'Pending').length,
  premiumMembers: patients.filter(p => p.memberType.includes('Premium') || p.memberType.includes('VIP')).length,
  totalRevenue: patients.reduce((sum, p) => sum + p.totalSpent, 0)
};
