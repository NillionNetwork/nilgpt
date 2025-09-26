import { CheckCircle, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import useDeployedMeasurementHash from "@/hooks/useDeployedMeasurementHash";
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
    <DialogContent className="rounded-lg max-w-3xl max-h-[90svh] overflow-y-auto max-md:max-w-[calc(100svw-16px)] max-sm:p-4 bg-[var(--card)] text-[var(--card-foreground)]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center mb-6 max-sm:text-xl max-sm:mb-4">
          Attestation & Verification
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-8 [&_a]:break-all">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)] max-sm:text-base">
            A. Retrieve the attestation report from nilCC (TEE)
          </h3>

          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="instructions-a" className="border-0">
              <AccordionTrigger className="p-0 hover:no-underline justify-start gap-2">
                <span className="text-sm text-[var(--muted-foreground)]">
                  DIY Instructions
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-0 mt-1">
                <p className="text-xs text-[var(--muted-foreground)]">
                  You can do this yourself by fetching the report.measurement
                  from{" "}
                  <a
                    href={API_ENDPOINTS.NILCC_GENERATE_REPORT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {API_ENDPOINTS.NILCC_GENERATE_REPORT}
                  </a>{" "}
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-[var(--muted)] rounded-lg p-4 border border-[var(--border)]">
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">
                      GET
                    </span>
                    <code className="text-sm font-mono text-[var(--muted-foreground)] bg-[var(--muted)] px-1 py-0.5 rounded break-all">
                      {API_ENDPOINTS.NILCC_GENERATE_REPORT}
                    </code>
                  </div>
                  <Button
                    onClick={() => getMeasurementHash()}
                    disabled={isLoading}
                    size="sm"
                    className="flex items-center gap-2 ml-auto bg-black text-white hover:bg-gray-800"
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
                  <label className="text-sm font-medium text-[var(--muted-foreground)]">
                    Measurement Hash:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={
                        measurementHash || (isLoading ? "Fetching..." : "")
                      }
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md font-mono"
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
          <h3 className="text-lg font-semibold text-[var(--foreground)] max-sm:text-base">
            B. Check against the pre-computed measurement hash
          </h3>

          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="instructions-b" className="border-0">
              <AccordionTrigger className="p-0 hover:no-underline justify-start gap-2">
                <span className="text-sm text-[var(--muted-foreground)]">
                  DIY Instructions
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-0 mt-1">
                <p className="text-xs text-[var(--muted-foreground)]">
                  To check this yourself, simply reference{" "}
                  <a
                    href={LINKS.MEASUREMENT_HASH_INDEX}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {LINKS.MEASUREMENT_HASH_INDEX}
                  </a>{" "}
                  against the current nilGPT version from{" "}
                  <a
                    href="https://nilgpt.xyz/api/version"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    https://nilgpt.xyz/api/version
                  </a>
                  .
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Alternatively, you can generate the measurement hash yourself
                  by running this script{" "}
                  <a
                    href={LINKS.MEASUREMENT_HASH_GENERATION_SCRIPT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {LINKS.MEASUREMENT_HASH_GENERATION_SCRIPT}
                  </a>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-[var(--muted)] rounded-lg p-4 border border-[var(--border)]">
            <div className="space-y-3">
              <p className="text-sm text-[var(--muted-foreground)]">
                Pre-computed hash for version:{" "}
                <code className="bg-[var(--muted)] px-1 py-0.5 rounded text-xs font-mono break-all">
                  {version}
                </code>
              </p>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deployedMeasurementHash || ""}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md font-mono"
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
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-500/30 dark:text-green-400"
                : "bg-red-900/20 border-red-500/30 text-red-400"
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
                  <div className="w-6 h-6 rounded-full border-2 border-red-400 flex items-center justify-center">
                    <span className="text-red-400 text-sm font-bold">×</span>
                  </div>
                  <span className="font-semibold">
                    Error: hashes do not match
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default AttestationModal;
