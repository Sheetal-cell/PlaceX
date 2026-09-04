import React from 'react';
import { TrendingUp, Award, FileText, CheckCircle2 } from 'lucide-react';
import type { Student, PlacementDrive } from '../../mockData';

interface StudentVisualizerViewProps {
  currentStudent: Student;
  drives: PlacementDrive[];
  selectedApplicationId: string;
  setSelectedApplicationId: (id: string) => void;
}

export const StudentVisualizerView: React.FC<StudentVisualizerViewProps> = ({
  currentStudent,
  drives,
  selectedApplicationId,
  setSelectedApplicationId
}) => {
  const totalApplied = currentStudent.applications.length;
  const selectedApp = currentStudent.applications.find(
    (app) => app.jobPostingId === selectedApplicationId
  );
  const selectedDrive = drives.find((d) => d.id === selectedApplicationId);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Banner */}
      <div className="sp-page-header">
        <div>
          <h1 className="sp-page-title">
            <TrendingUp size={28} className="text-blue-600" />
            Recruitment Stage Visualizer
          </h1>
          <p className="sp-page-subtitle">
            Track round-by-round selection progress, active interview stages, and feedback logs.
          </p>
        </div>
      </div>

      {totalApplied === 0 ? (
        <div className="glass-card text-center py-16 rounded-2xl border border-slate-200 bg-white shadow-xs text-slate-400">
          <TrendingUp size={48} className="mx-auto opacity-20 mb-3" />
          <p className="text-sm font-bold text-slate-700 font-display">No active applications to track.</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Apply to placement drives first to activate pipeline stage visualizer.</p>
        </div>
      ) : (
        <div className="glass-card flex flex-col gap-6 p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-xs">
          {/* Select Application Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex flex-col gap-1.5 max-w-sm w-full">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Application to Track
              </label>
              <select
                value={selectedApplicationId}
                onChange={(e) => setSelectedApplicationId(e.target.value)}
                className="input-field font-bold text-slate-800"
              >
                {currentStudent.applications.map((app) => (
                  <option key={app.jobPostingId} value={app.jobPostingId}>
                    {app.companyName} — {app.role}
                  </option>
                ))}
              </select>
            </div>

            {selectedApp && (
              <span
                className={`sp-badge self-start sm:self-end ${
                  selectedApp.status === 'Selected'
                    ? 'sp-badge-success'
                    : selectedApp.status === 'Rejected'
                    ? 'sp-badge-danger'
                    : 'sp-badge-info'
                }`}
              >
                Current Status: {selectedApp.status}
              </span>
            )}
          </div>

          {selectedApp && selectedDrive && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Selected Drive Header Card */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  {selectedDrive.companyName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-900 font-display">{selectedDrive.companyName}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 font-mono font-bold text-xs">
                      {selectedDrive.package}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{selectedDrive.title}</p>
                </div>
              </div>

              {/* Progress Stage Cards Grid */}
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Selection Pipeline Rounds ({selectedDrive.rounds.length})</span>
                  <span className="text-xs font-bold text-blue-600 font-mono bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">Stage {selectedApp.currentRoundIndex + 1} of {selectedDrive.rounds.length}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                  {selectedDrive.rounds.map((round, index) => {
                    const isCompleted = index < selectedApp.currentRoundIndex || selectedApp.status === 'Selected';
                    const isActive = index === selectedApp.currentRoundIndex && selectedApp.status !== 'Selected' && selectedApp.status !== 'Rejected';
                    const isFinalSelected = selectedApp.status === 'Selected' && index === selectedDrive.rounds.length - 1;
                    const isFinalRejected = selectedApp.status === 'Rejected' && index === selectedApp.currentRoundIndex;

                    return (
                      <div
                        key={round}
                        className={`p-6 rounded-2xl border transition-all flex flex-col justify-between gap-5 ${
                          isFinalSelected || isCompleted
                            ? 'bg-emerald-50/60 border-emerald-200/90 shadow-2xs'
                            : isFinalRejected
                            ? 'bg-rose-50/60 border-rose-200/90 shadow-2xs'
                            : isActive
                            ? 'bg-blue-50/90 border-blue-300 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                            : 'bg-slate-50/60 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2.5">
                          <div
                            className={`w-10 h-10 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 ${
                              isFinalSelected || isCompleted
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : isFinalRejected
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 animate-pulse'
                                : 'bg-slate-200 text-slate-500 font-bold'
                            }`}
                          >
                            {isCompleted || isFinalSelected ? <CheckCircle2 size={18} /> : index + 1}
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              isFinalSelected
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isFinalRejected
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : isCompleted
                                ? 'bg-emerald-100/80 text-emerald-800'
                                : isActive
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-slate-200/60 text-slate-500'
                            }`}
                          >
                            {isFinalSelected
                              ? 'Selected'
                              : isFinalRejected
                              ? 'Disqualified'
                              : isCompleted
                              ? 'Passed'
                              : isActive
                              ? 'In Progress'
                              : 'Upcoming'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                            Round {index + 1}
                          </span>
                          <h4 className="font-bold text-slate-900 text-base font-display leading-snug">
                            {round}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback and TPO Review Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/50 border border-blue-200/80 text-xs sm:text-sm flex flex-col gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 font-bold text-blue-900 font-display">
                    <Award size={20} className="text-blue-600 shrink-0" />
                    <span>Stage Feedback & Updates</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {selectedApp.feedback
                      ? selectedApp.feedback
                      : `The recruitment board is processing candidates for "${selectedDrive.rounds[selectedApp.currentRoundIndex]}". Stage feedback will appear here as round evaluations conclude.`}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200/90 text-xs sm:text-sm flex flex-col gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-900 font-display">
                    <FileText size={20} className="text-blue-600 shrink-0" />
                    <span>Selection Round Policy</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Candidates must remain on campus or online 15 minutes before scheduled round starts. Rejection at any stage automatically updates pipeline status.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
