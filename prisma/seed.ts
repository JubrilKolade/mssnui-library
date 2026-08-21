import "dotenv/config";
import { PrismaClient, UnitType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ==============================
  // CATEGORIES
  // ==============================
  const categories = [
    "Islamic Studies",
    "Quran & Tafsir",
    "Hadith",
    "Fiqh",
    "Seerah",
    "Arabic Language",
    "Science & Technology",
    "Medicine & Health",
    "Law",
    "Arts & Humanities",
    "Social Sciences",
    "Engineering",
    "Agriculture",
    "Education",
    "Business & Economics",
    "General",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Categories seeded");

  // ==============================
  // HELPERS
  // ==============================
  async function createUnit(
    name: string,
    type: UnitType,
    parentId?: string,
    description?: string
  ) {
    const baseData = {
      name,
      type,
      parentId: parentId ?? null,
      description,
    };

    const existing = await prisma.academicUnit.findFirst({
      where: {
        name,
        parentId: parentId ?? null,
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.academicUnit.create({ data: baseData });
  }

  async function createDept(
    name: string,
    academicUnitId: string,
    isDLC = false,
    isPostgraduate = false
  ) {
    return prisma.department.upsert({
      where: {
        name_academicUnitId: { name, academicUnitId },
      },
      update: {},
      create: { name, academicUnitId, isDLC, isPostgraduate },
    });
  }

  // ==============================
  // COLLEGE OF MEDICINE
  // ==============================
  const medicine = await createUnit(
    "College of Medicine",
    UnitType.college,
    undefined,
    "College of Medicine, University of Ibadan"
  );

  const basicMed = await createUnit(
    "Faculty of Basic Medical Sciences",
    UnitType.faculty,
    medicine.id
  );
  for (const d of ["Anatomy", "Biochemistry", "Physiology", "Pharmacology"]) {
    await createDept(d, basicMed.id);
  }

  const clinical = await createUnit(
    "Faculty of Clinical Sciences",
    UnitType.faculty,
    medicine.id
  );
  for (const d of [
    "Family Medicine",
    "Medicine",
    "Obstetrics and Gynaecology",
    "Ophthalmology",
    "Otorhinolaryngology",
    "Paediatrics",
    "Psychiatry",
    "Radiation Oncology",
    "Surgery",
  ]) {
    await createDept(d, clinical.id);
  }

  const dentistry = await createUnit(
    "Faculty of Dentistry",
    UnitType.faculty,
    medicine.id
  );
  for (const d of [
    "Child Dental Health",
    "Oral and Maxillofacial Surgery",
    "Oral Pathology and Medicine",
    "Oral Biology",
    "Restorative Dentistry",
  ]) {
    await createDept(d, dentistry.id);
  }

  const pubHealth = await createUnit(
    "Faculty of Public Health",
    UnitType.faculty,
    medicine.id
  );
  for (const d of [
    "Epidemiology and Medical Statistics",
    "Health Promotion and Education",
    "Environmental Health Sciences",
    "Health Policy and Management",
    "Community Medicine",
  ]) {
    await createDept(d, pubHealth.id);
  }

  const nursing = await createUnit(
    "Faculty of Nursing",
    UnitType.faculty,
    medicine.id
  );
  await createDept("Nursing Science", nursing.id);

  console.log("✅ College of Medicine seeded");

  // ==============================
  // DISTANCE LEARNING CENTRE
  // ==============================
  const dlc = await createUnit(
    "Distance Learning Centre",
    UnitType.college,
    undefined,
    "University of Ibadan Distance Learning Centre"
  );

  const dlcUnits = [
    {
      name: "Arts and Humanities (DLC)",
      depts: [
        "Arabic and Islamic Studies",
        "Christian Religious Studies",
        "History",
        "Linguistics",
        "Philosophy",
      ],
    },
    {
      name: "Social Sciences (DLC)",
      depts: ["Economics", "Political Science", "Psychology", "Sociology"],
    },
    {
      name: "Education (DLC)",
      depts: [
        "Adult Education",
        "Educational Management",
        "Guidance and Counselling",
        "Teacher Education",
      ],
    },
    {
      name: "Management Sciences (DLC)",
      depts: ["Accounting", "Business Administration", "Public Administration"],
    },
    {
      name: "Science (DLC)",
      depts: ["Computer Science", "Mathematics", "Statistics"],
    },
  ];

  for (const unit of dlcUnits) {
    const u = await createUnit(unit.name, UnitType.faculty, dlc.id);
    for (const d of unit.depts) {
      await createDept(d, u.id, true, false);
    }
  }
  console.log("✅ Distance Learning Centre seeded");

  // ==============================
  // POSTGRADUATE SCHOOL
  // ==============================
  const pg = await createUnit(
    "Postgraduate School",
    UnitType.school,
    undefined,
    "University of Ibadan Postgraduate School"
  );

  const pgUnits = [
    {
      name: "Postgraduate Arts",
      depts: [
        "Arabic and Islamic Studies (PG)",
        "History (PG)",
        "Philosophy (PG)",
        "Religious Studies (PG)",
        "Linguistics and African Languages (PG)",
        "Theatre Arts (PG)",
        "Communication and Language Arts (PG)",
      ],
    },
    {
      name: "Postgraduate Science",
      depts: [
        "Botany (PG)",
        "Chemistry (PG)",
        "Computer Science (PG)",
        "Mathematics (PG)",
        "Microbiology (PG)",
        "Physics (PG)",
        "Statistics (PG)",
        "Zoology (PG)",
        "Geology (PG)",
      ],
    },
    {
      name: "Postgraduate Social Sciences",
      depts: [
        "Economics (PG)",
        "Political Science (PG)",
        "Psychology (PG)",
        "Sociology (PG)",
        "Geography (PG)",
      ],
    },
    {
      name: "Postgraduate Education",
      depts: [
        "Adult Education (PG)",
        "Educational Management (PG)",
        "Guidance and Counselling (PG)",
        "Teacher Education (PG)",
        "Human Kinetics (PG)",
        "Special Education (PG)",
      ],
    },
    {
      name: "Postgraduate Law",
      depts: [
        "Business Law (PG)",
        "International Law (PG)",
        "Private Law (PG)",
        "Public Law (PG)",
      ],
    },
    {
      name: "Postgraduate Technology",
      depts: [
        "Civil Engineering (PG)",
        "Electrical and Electronics Engineering (PG)",
        "Mechanical Engineering (PG)",
        "Computer Engineering (PG)",
        "Food Technology (PG)",
        "Agricultural and Environmental Engineering (PG)",
      ],
    },
    {
      name: "Postgraduate Medicine",
      depts: [
        "Anatomy (PG)",
        "Biochemistry (PG)",
        "Community Medicine (PG)",
        "Medicine (PG)",
        "Paediatrics (PG)",
        "Physiology (PG)",
        "Surgery (PG)",
        "Pharmacology (PG)",
        "Nursing Science (PG)",
      ],
    },
    {
      name: "Postgraduate Agriculture",
      depts: [
        "Agricultural Economics (PG)",
        "Agronomy (PG)",
        "Animal Science (PG)",
        "Forest Resources Management (PG)",
        "Aquaculture and Fisheries Management (PG)",
        "Wildlife and Ecotourism Management (PG)",
      ],
    },
    {
      name: "Postgraduate Veterinary Medicine",
      depts: [
        "Veterinary Anatomy (PG)",
        "Veterinary Medicine (PG)",
        "Veterinary Microbiology and Parasitology (PG)",
        "Veterinary Pathology (PG)",
        "Veterinary Public Health (PG)",
        "Veterinary Surgery and Radiology (PG)",
      ],
    },
    {
      name: "Postgraduate Pharmacy",
      depts: [
        "Clinical Pharmacy and Pharmacy Administration (PG)",
        "Pharmaceutical Chemistry (PG)",
        "Pharmaceutics and Industrial Pharmacy (PG)",
        "Pharmacognosy (PG)",
      ],
    },
  ];

  for (const unit of pgUnits) {
    const u = await createUnit(unit.name, UnitType.faculty, pg.id);
    for (const d of unit.depts) {
      await createDept(d, u.id, false, true);
    }
  }
  console.log("✅ Postgraduate School seeded");

  // ==============================
  // INSTITUTES
  // ==============================
  const institutes = [
    {
      name: "Institute of African Studies",
      desc: "IAS - University of Ibadan",
      depts: [
        "African Languages and Literature",
        "African History and Politics",
        "African Culture and Society",
        "African Arts and Music",
      ],
    },
    {
      name: "Institute of Education",
      desc: "Institute of Education - University of Ibadan",
      depts: [
        "Curriculum Studies",
        "Educational Technology",
        "Measurement and Evaluation",
      ],
    },
    {
      name: "Institute of Child Health",
      desc: "Institute of Child Health - University of Ibadan",
      depts: ["Child Development", "Paediatric Nursing"],
    },
    {
      name: "Institute of Advanced Medical Research and Training",
      desc: "IAMRAT - University of Ibadan",
      depts: ["Biomedical Research", "Clinical Trials and Research"],
    },
    {
      name: "Institute for Peace and Strategic Studies",
      desc: "IPSS - University of Ibadan",
      depts: [
        "Peace and Conflict Studies",
        "Security and Strategic Studies",
        "International Relations and Diplomacy",
      ],
    },
  ];

  for (const inst of institutes) {
    const u = await createUnit(
      inst.name,
      UnitType.institute,
      undefined,
      inst.desc
    );
    for (const d of inst.depts) await createDept(d, u.id);
  }
  console.log("✅ Institutes seeded");

  // ==============================
  // CENTRES
  // ==============================
  const centres = [
    {
      name: "Centre for Peace and Conflict Studies",
      desc: "CPCS - University of Ibadan",
      depts: ["Conflict Resolution", "Peacebuilding"],
    },
    {
      name: "Centre for Petroleum, Energy Economics and Law",
      desc: "CPEEL - University of Ibadan",
      depts: ["Energy Economics", "Petroleum Law", "Energy Policy"],
    },
    {
      name: "Centre for Entrepreneurship and Innovation",
      desc: "CEI - University of Ibadan",
      depts: ["Entrepreneurship Development", "Innovation Management"],
    },
    {
      name: "Centre for Bioethics",
      desc: "Centre for Bioethics - University of Ibadan",
      depts: ["Bioethics and Medical Law"],
    },
    {
      name: "Centre for Excellence in Agricultural Development",
      desc: "CEAD - University of Ibadan",
      depts: ["Agricultural Development", "Rural Extension"],
    },
  ];

  for (const centre of centres) {
    const u = await createUnit(
      centre.name,
      UnitType.centre,
      undefined,
      centre.desc
    );
    for (const d of centre.depts) await createDept(d, u.id);
  }
  console.log("✅ Centres seeded");

  // ==============================
  // STANDALONE FACULTIES
  // (Complete via admin panel)
  // ==============================
  const faculties = [
    "Faculty of Arts",
    "Faculty of Science",
    "Faculty of Law",
    "Faculty of Education",
    "Faculty of the Social Sciences",
    "Faculty of Technology",
    "Faculty of Agriculture and Forestry",
    "Faculty of Veterinary Medicine",
    "Faculty of Pharmacy",
    "Faculty of Business Administration",
  ];

  for (const name of faculties) {
    await createUnit(
      name,
      UnitType.faculty,
      undefined,
      "Add departments via admin panel"
    );
  }
  console.log("✅ Standalone faculties seeded");

  // ==============================
  // SUPER ADMIN
  // ==============================
  const superAdminName = process.env.SUPER_ADMIN_NAME;
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!superAdminName || !superAdminEmail || !superAdminPassword) {
    throw new Error(
      "Super admin credentials missing. Set SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env"
    );
  }

  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(superAdminPassword)
  ) {
    throw new Error(
      "SUPER_ADMIN_PASSWORD must be at least 8 characters with uppercase, lowercase and a number"
    );
  }

  const hashedPassword = await bcrypt.hash(superAdminPassword, 12);

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      role: "super_admin",
      isActive: true,
    },
    create: {
      name: superAdminName,
      email: superAdminEmail,
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
    },
  });

  console.log("✅ Super admin seeded");
  console.log(`   Email: ${superAdminEmail}`);
  console.log("");
  console.log("🎉 Seeding complete!");
  console.log("");
  console.log("📌 Next steps:");
  console.log("   → Login as super admin");
  console.log("   → Go to /admin/structure");
  console.log("   → Add departments to standalone faculties");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });