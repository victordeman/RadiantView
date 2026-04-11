#!/bin/bash

echo "Verifying API endpoints structure..."

# Check if files exist
files=(
  "app/api/patients/route.ts"
  "app/api/patients/[id]/route.ts"
  "app/api/appointments/route.ts"
  "app/api/appointments/[id]/route.ts"
  "app/api/studies/route.ts"
  "app/api/studies/[id]/route.ts"
  "app/api/orthanc/studies/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

echo "Checking Prisma schema for new models..."
grep -E "model (Patient|Appointment|Order|Study)" prisma/schema.prisma
