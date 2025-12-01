import { CheckCircle, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import useDeployedMeasurementHash from "@/hooks/useDeployedMeasurementHash";
import { useGpuAttestation } from "@/hooks/useGpuAttestation";
import useNilCCMeasurementHash from "@/hooks/useNilCCMeasurementHash";
import API_ENDPOINTS from "@/services/API/constants";
import { LINKS } from "../constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const AttestationModal = () => {
  const { measurementHash, isLoading, getMeasurementHash } =
    useNilCCMeasurementHash();
  const { deployedMeasurementHash, version } = useDeployedMeasurementHash();
  const {
    gpuAttestation,
    isLoading: isGpuLoading,
    error: gpuError,
    fetchGpuAttestation,
  } = useGpuAttestation();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = async (hash: string, type: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(type);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error("Failed to copy hash:", err);
    }
  };

  const hashesMatch =
    measurementHash &&
    deployedMeasurementHash &&
    measurementHash.toLowerCase() === deployedMeasurementHash.toLowerCase();

  return (
    <DialogContent className="rounded-lg max-w-3xl max-h-[90svh] overflow-y-auto max-md:max-w-[calc(100svw-16px)] max-sm:p-4 bg-[#f7f6f2] dark:bg-[#2A2A2A]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center mb-6 max-sm:text-xl max-sm:mb-4 dark:text-white">
          Attestation & Verification
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-8 [&_a]:break-all">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white max-sm:text-base">
            A. Retrieve the attestation report from nilCC (TEE)
          </h3>

          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="instructions-a" className="border-0">
              <AccordionTrigger className="p-0 hover:no-underline justify-start gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  DIY Instructions
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-0 mt-1">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  You can do this yourself by fetching the report.measurement
                  from{" "}
                  <a
                    href={API_ENDPOINTS.NILCC_GENERATE_REPORT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                  >
                    {API_ENDPOINTS.NILCC_GENERATE_REPORT}
                  </a>{" "}
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      GET
                    </span>
                    <code className="text-sm font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#4A4A4A] px-1 py-0.5 rounded break-all">
                      {API_ENDPOINTS.NILCC_GENERATE_REPORT}
                    </code>
                  </div>
                  <Button
                    onClick={() => getMeasurementHash()}
                    disabled={isLoading}
                    size="sm"
                    className="flex items-center gap-2 ml-auto"
                    data-umami-event="Fetch Attestation Clicked"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                    Fetch
                  </Button>
                </div>
              </div>

              {measurementHash && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Measurement Hash:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={
                        measurementHash || (isLoading ? "Fetching..." : "")
                      }
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-white dark:bg-[#4A4A4A] border border-gray-300 dark:border-transparent rounded-md font-mono dark:text-white"
                    />
                    <Button
                      onClick={() =>
                        handleCopyHash(measurementHash, "attestation")
                      }
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedHash === "attestation" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white max-sm:text-base">
            B. Check against the pre-computed measurement hash
          </h3>

          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="instructions-b" className="border-0">
              <AccordionTrigger className="p-0 hover:no-underline justify-start gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  DIY Instructions
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-0 mt-1">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  To check this yourself, simply reference{" "}
                  <a
                    href={LINKS.MEASUREMENT_HASH_INDEX}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                  >
                    {LINKS.MEASUREMENT_HASH_INDEX}
                  </a>{" "}
                  against the current nilGPT version from{" "}
                  <a
                    href="https://nilgpt.xyz/api/version"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                  >
                    https://nilgpt.xyz/api/version
                  </a>
                  .
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Alternatively, you can generate the measurement hash yourself
                  by running this script{" "}
                  <a
                    href={LINKS.MEASUREMENT_HASH_GENERATION_SCRIPT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                  >
                    {LINKS.MEASUREMENT_HASH_GENERATION_SCRIPT}
                  </a>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Pre-computed hash for version:{" "}
                <code className="bg-gray-100 dark:bg-[#4A4A4A] px-1 py-0.5 rounded text-xs font-mono break-all dark:text-white">
                  {version}
                </code>
              </p>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deployedMeasurementHash || ""}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-white dark:bg-[#4A4A4A] border border-gray-300 dark:border-transparent rounded-md font-mono dark:text-white"
                  />
                  {deployedMeasurementHash && (
                    <Button
                      onClick={() =>
                        handleCopyHash(deployedMeasurementHash, "deployed")
                      }
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedHash === "deployed" ? "Copied!" : "Copy"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {measurementHash && deployedMeasurementHash && !isLoading && (
          <div
            className={`mt-8 p-4 rounded-lg border-2 ${
              hashesMatch
                ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {hashesMatch ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <span className="font-semibold">Success: hashes match</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full border-2 border-red-600 dark:border-red-400 flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-sm font-bold">
                      ×
                    </span>
                  </div>
                  <span className="font-semibold">
                    Error: hashes do not match
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Advanced Section Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#f7f6f2] dark:bg-[#2A2A2A] px-4 py-1 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Advanced
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white max-sm:text-base">
            C. nilAI GPU Attestation
          </h3>

          <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This is the GPU attestation token produced by{" "}
                <strong>nilAI</strong> (JWT containing verified GPU claims). The
                token is cryptographically signed by NVIDIA's Remote Attestation
                Service (NRAS). You can independently verify its authenticity
                using NVIDIA's attestation tools and documentation:{" "}
                <a
                  href="https://docs.nvidia.com/attestation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                >
                  https://docs.nvidia.com/attestation/
                </a>
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  onClick={() => fetchGpuAttestation()}
                  disabled={isGpuLoading}
                  size="sm"
                  className="flex items-center gap-2"
                  data-umami-event="Fetch GPU Attestation Clicked"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isGpuLoading ? "animate-spin" : ""}`}
                  />
                  Fetch
                </Button>
              </div>

              {gpuError && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-800">
                  Error: {gpuError}
                </div>
              )}

              {gpuAttestation && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    GPU Attestation Token:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={gpuAttestation}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-white dark:bg-[#4A4A4A] border border-gray-300 dark:border-transparent rounded-md font-mono text-xs dark:text-white"
                      placeholder="GPU attestation token will appear here..."
                    />
                    <Button
                      onClick={() =>
                        handleCopyHash(gpuAttestation, "gpu-attestation")
                      }
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedHash === "gpu-attestation" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default AttestationModal;
