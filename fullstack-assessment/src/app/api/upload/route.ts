import { NextRequest, NextResponse } from "next/server";

// Simple in-memory storage (dummy database)
const uploadedImages: string[] = [];

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  uploadedImages.push(base64);

  return NextResponse.json({ message: "File uploaded successfully!", total: uploadedImages.length });
};

// GET handler to fetch uploaded images
export const GET = async () => {
  return NextResponse.json({ images: uploadedImages });
};
