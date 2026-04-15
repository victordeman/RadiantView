import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const modalities = ["CT", "MR", "US", "CR", "XR", "NM", "PT", "MG"];
const genders = ["Male", "Female"];
const statuses = ["AVAILABLE", "IN_PROGRESS", "COMPLETED", "ARCHIVED"];
const orderStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const priorities = ["ROUTINE", "HIGH", "STAT"];
const appointmentStatuses = ["SCHEDULED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "NO_SHOW"];

const firstNames = [
  "James", "Sarah", "Michael", "Emily", "Robert", "Jessica", "David", "Ashley",
  "William", "Amanda", "Richard", "Stephanie", "Joseph", "Jennifer", "Thomas",
  "Elizabeth", "Christopher", "Lauren", "Daniel", "Megan",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin",
];

const studyDescriptions = [
  "CT Chest with contrast",
  "MRI Brain without contrast",
  "Chest X-Ray PA and Lateral",
  "CT Abdomen and Pelvis",
  "MRI Lumbar Spine",
  "Ultrasound Abdomen Complete",
  "CT Head without contrast",
  "MRI Knee Right",
  "Nuclear Medicine Bone Scan",
  "PET/CT Whole Body",
  "Mammography Bilateral",
  "CT Angiography Head and Neck",
  "MRI Shoulder Left",
  "Ultrasound Thyroid",
  "CT Spine Cervical",
];

const referringDoctors = [
  "Dr. Sarah Chen", "Dr. James Wilson", "Dr. Maria Rodriguez", "Dr. Robert Kim",
  "Dr. Emily Patel", "Dr. Michael Thompson", "Dr. Lisa Park", "Dr. David Anderson",
  "Dr. Jennifer Lee", "Dr. Christopher Brown",
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("🌱 Seeding RadiantView database...\n");

  // Clean existing data
  await prisma.order.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.study.deleteMany();
  await prisma.patient.deleteMany();
  console.log("  Cleared existing data.");

  // Create 20 patients
  const patients = [];
  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const patient = await prisma.patient.create({
      data: {
        patientId: `PAT-${String(1000 + i).padStart(4, "0")}`,
        name: `${firstName} ${lastName}`,
        dob: randomDate(new Date("1945-01-01"), new Date("2000-12-31")),
        gender: randomItem(genders),
      },
    });
    patients.push(patient);
  }
  console.log(`  Created ${patients.length} patients.`);

  // Create 50 studies
  const studies = [];
  for (let i = 0; i < 50; i++) {
    const patient = randomItem(patients);
    const modality = randomItem(modalities);
    const study = await prisma.study.create({
      data: {
        studyInstanceUid: `1.2.840.113619.2.${Date.now()}.${i}.${Math.floor(Math.random() * 100000)}`,
        accessionNumber: `ACC-${String(2000 + i).padStart(6, "0")}`,
        modality,
        studyDate: randomDate(new Date("2024-01-01"), new Date("2026-04-15")),
        studyDescription: randomItem(studyDescriptions),
        status: randomItem(statuses),
        patientId: patient.id,
      },
    });
    studies.push(study);
  }
  console.log(`  Created ${studies.length} studies.`);

  // Create 30 appointments (spread across this week and next)
  const appointments = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const patient = randomItem(patients);
    const dayOffset = Math.floor(Math.random() * 14) - 3; // -3 to +10 days
    const hour = 8 + Math.floor(Math.random() * 9); // 8 AM to 5 PM
    const minute = randomItem([0, 15, 30, 45]);
    const start = new Date(now);
    start.setDate(start.getDate() + dayOffset);
    start.setHours(hour, minute, 0, 0);

    const durationMinutes = randomItem([15, 30, 45, 60]);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const appointment = await prisma.appointment.create({
      data: {
        startTime: start,
        endTime: end,
        status: dayOffset < 0 ? randomItem(["COMPLETED", "NO_SHOW"]) : randomItem(appointmentStatuses),
        modality: randomItem(modalities),
        notes: Math.random() > 0.5 ? `Follow-up ${randomItem(["scan", "imaging", "consultation", "review"])}` : null,
        patientId: patient.id,
      },
    });
    appointments.push(appointment);
  }
  console.log(`  Created ${appointments.length} appointments.`);

  // Create 25 orders
  const orders = [];
  for (let i = 0; i < 25; i++) {
    const patient = randomItem(patients);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${dateStr}-${String(1000 + i).padStart(4, "0")}`,
        status: randomItem(orderStatuses),
        modality: randomItem(modalities),
        priority: randomItem(priorities),
        notes: Math.random() > 0.4 ? `Clinical indication: ${randomItem(["chest pain", "headache", "follow-up", "screening", "trauma", "shortness of breath", "abdominal pain", "joint pain"])}` : null,
        referringDoc: randomItem(referringDoctors),
        patientId: patient.id,
        studyId: Math.random() > 0.6 && studies.length > 0 ? randomItem(studies).id : null,
      },
    });
    orders.push(order);
  }
  console.log(`  Created ${orders.length} orders.`);

  console.log("\n✅ Seed complete!");
  console.log(`   ${patients.length} patients, ${studies.length} studies, ${appointments.length} appointments, ${orders.length} orders`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
