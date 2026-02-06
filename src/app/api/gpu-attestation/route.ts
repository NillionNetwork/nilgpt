import { type NextRequest, NextResponse } from "next/server";
import { LLM } from "@/config/llm";

interface GpuAttestationData {
  gpu_attestation: string;
}

export async function GET(_request: NextRequest) {
  try {
    // Get nilAI instances from the LLM config
    const instances = [LLM.gemma.nilAIInstance, LLM.gpt.nilAIInstance].filter(
      Boolean,
    );

    if (instances.length === 0) {
      return NextResponse.json(
        { error: "No nilAI instances configured" },
        { status: 500 },
      );
    }

    let lastError: Error | null = null;

    // Try each instance until one succeeds
    for (const instance of instances) {
      try {
        const response = await fetch(`${instance}/v1/attestation/report`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NILAI_API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: GpuAttestationData = await response.json();

        if (data.gpu_attestation) {
          return NextResponse.json({
            success: true,
            gpu_attestation: data.gpu_attestation,
          });
        } else {
          throw new Error("No GPU attestation found in response");
        }
      } catch (err) {
        lastError = err as Error;
        console.warn(`Failed to fetch from ${instance}:`, err);
        // Continue to next instance
      }
    }

    // If we get here, all instances failed
    const errorMessage = lastError?.message || "All nilAI instances failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } catch (error) {
    console.error("GPU attestation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GPU attestation" },
      { status: 500 },
    );
  }
}
