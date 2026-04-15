import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.order.findUnique({
      where: { id },
      include: {
        patient: true,
      },
    });

    if (!order) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, modality, priority, referringDoc, notes } = body;

    const order = await db.order.update({
      where: { id },
      data: {
        status,
        modality,
        priority,
        referringDoc,
        notes,
      },
      include: {
        patient: {
          select: { name: true, patientId: true },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.order.delete({
      where: { id },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
