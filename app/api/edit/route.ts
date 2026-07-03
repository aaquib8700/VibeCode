import { NextRequest } from "next/server";
import { editController } from "@/controllers/edit.controller";

export async function POST(request: NextRequest) {
  return editController(request);
}