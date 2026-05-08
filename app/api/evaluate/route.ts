import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Concept, getSystemPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  const openai = new OpenAI();
  try {
    const body = await request.json();
    const { image, concept, isKoko } = body as {
      image: string;
      concept: Concept;
      isKoko: boolean;
    };

    if (!image || !concept) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate data URL format
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPrompt(concept, isKoko);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: image },
            },
            {
              type: "text",
              text: "Please evaluate this photo.",
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate image" },
      { status: 500 }
    );
  }
}
