import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, Database, Sliders, GitBranch } from 'lucide-react';

interface ReassessmentStepperModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

interface StepItem {
  id: number;
  name: string;
  subtext: string;
  icon: React.ReactNode;
  detail: string;
}

export const ReassessmentStepperModal: React.FC<ReassessmentStepperModalProps> = ({
  isOpen,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps: StepItem[] = [
    {
      id: 1,
      name: 'Data Ingestion & Integrity Gate',
      subtext: 'Validating maintenance telemetry & boundary contracts',
      icon: <Database className="w-4 h-4" />,
      detail: 'AC-03 hydraulic leak flagged. Quarantining defective feeds (AC-09 conflict, AC-10 missing payload, CR-11 stale rest).',
    },
    {
      id: 2,
      name: 'Hard Constraint & Boundary Verification',
      subtext: 'Verifying range, payload, base proximity & weather restrictions',
      icon: <Sliders className="w-4 h-4" />,
      detail: 'Evaluating P1 mission T-04 (5,200 kg cargo, Base Alpha departure). Verifying CW-01 Bravo Ridge wind window (12:00–15:00 UTC).',
    },
    {
      id: 3,
      name: 'Candidate Allocation & Stability Evaluation',
      subtext: 'Scoring candidate airframes under stability objective',
      icon: <ShieldCheck className="w-4 h-4" />,
      detail: 'AC-01 (Busy with T-03), AC-03 (Unserviceable), AC-06 (Stationed at Base Alpha, 8,000 kg capacity, Crew qualified) ➔ OPTIMAL CANDIDATE.',
    },
    {
      id: 4,
      name: 'Snapshot Sealing & Version 2 Generation',
      subtext: 'CP-SAT solve verified (0 violations), generating cryptographic snapshot',
      icon: <GitBranch className="w-4 h-4" />,
      detail: 'Retasking T-04 to AC-06. Preserving all 13 unaffected tasks (100% stability index). Immutable snapshot hash generated.',
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      return;
    }

    const timer1 = setTimeout(() => setCurrentStep(2), 400);
    const timer2 = setTimeout(() => setCurrentStep(3), 850);
    const timer3 = setTimeout(() => setCurrentStep(4), 1350);
    const timer4 = setTimeout(() => {
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5EAF1] rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5EAF1] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h3 className="font-mono text-sm font-bold text-[#172B4D]">
                Operational Reassessment Loop In Progress
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Deterministic CP-SAT solver executing lexicographic multi-objective retasking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-blue-50 text-[#2563EB] border border-blue-200 px-2 py-0.5 rounded font-bold">
              VAYU-YUKTI
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer text-xs"
              title="Cancel simulation"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stepper Stages */}
        <div className="space-y-3">
          {steps.map((s) => {
            const isFinished = currentStep > s.id;
            const isCurrent = currentStep === s.id;

            return (
              <div
                key={s.id}
                className={`p-3 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/50 border-[#2563EB] shadow-xs'
                    : isFinished
                    ? 'bg-[#F8FAFC] border-[#E5EAF1]'
                    : 'bg-white border-transparent opacity-40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                        isFinished
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-slate-100 text-[#64748B]'
                      }`}
                    >
                      {isFinished ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      ) : isCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        s.id
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#172B4D] block font-mono">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-[#64748B] block">
                        {s.subtext}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isFinished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isCurrent
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                        : 'text-slate-400'
                    }`}
                  >
                    {isFinished ? 'VERIFIED' : isCurrent ? 'EXECUTING' : 'PENDING'}
                  </span>
                </div>

                {/* Expanded step details when active or finished */}
                {(isCurrent || isFinished) && (
                  <p className="mt-2 text-[10.5px] text-[#475569] pl-8 leading-snug border-t border-slate-100 pt-1.5 font-sans">
                    {s.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Footer */}
        <div className="space-y-2 pt-2 border-t border-[#E5EAF1]">
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#2563EB] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
            <span>Deterministic mock optimization • Single-worker CP-SAT</span>
            <span>Stage {currentStep} of 4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
