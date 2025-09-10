import dbConnect from '../../../lib/mongodb';
import Note from '../../../models/Note';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const notes = await Note.find({});
    return NextResponse.json({ success: true, data: notes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const note = await Note.create(body);
    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
