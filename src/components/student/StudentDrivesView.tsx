import React from 'react';
import { Briefcase, AlertCircle, Lock, Award } from 'lucide-react';
import type { Student, PlacementDrive } from '../../mockData';

interface StudentDrivesViewProps {
  currentStudent: Student;
  drives: PlacementDrive[];
  onApply: (driveId: string) => void;
}

export const StudentDrivesView: React.FC<StudentDrivesViewProps> = ({
  currentStudent,
  drives,
  onApply
}) => {
  const isPlaced = currentStudent.placementStatus === 'Placed';

  // Core Smart Compatibility Math (EXACT UNTOUCHED ALGORITHM)
  const getCompatibility = (student: Student, drive: PlacementDrive) => {
    const isGpaEligible = student.cgpa >= drive.cgpaCutoff;
    const isBacklogEligible = student.backlogs <= drive.maxBacklogs;
    const isBranchEligible = drive.allowedBranches.includes(student.department);
    const eligible = isGpaEligible && isBacklogEligible && isBranchEligible;

    if (!eligible) {
      return {
        eligible: false,
        score: 0,
        reasons: [
          !isGpaEligible && `GPA cut-off is ${drive.cgpaCutoff} (yours: ${student.cgpa})`,
          !isBacklogEligible && `Max backlogs allowed is ${drive.maxBacklogs} (yours: ${student.backlogs})`,
          !isBranchEligible && `Eligible branches: ${drive.allowedBranches.join(', ')} (your branch: ${student.department})`
        ].filter(Boolean) as string[]
      };
    }

    const requiredSkills = drive.skillsRequired;
    const studentSkills = student.skills;
    const matchingSkills = requiredSkills.filter((s) =>
      studentSkills.some((ss) => ss.toLowerCase() === s.toLowerCase())
    );

    const skillScore = requiredSkills.length > 0 ? (matchingSkills.length / requiredSkills.length) * 70 : 70;
    const gpaBonus = Math.min(((student.cgpa - drive.cgpaCutoff) / (10 - drive.cgpaCutoff)) * 30, 30);
    const overallScore = Math.min(Math.round(skillScore + Math.max(0, gpaBonus)), 100);

    return { eligible: true, score: overallScore, matchingSkills };
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Drives Top Header Banner */}
      <div className="sp-page-header">
        <div>
          <h1 className="sp-page-title">
            <Briefcase size={28} className="text-blue-600" />
            Active Campus Placement Drives ({drives.length})
          </h1>
          <p className="sp-page-subtitle">
            Real-time candidate compatibility match score calculated against corporate criteria.
          </p>
        </div>

        {isPlaced && (
          <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <Award size={18} className="text-amber-600 shrink-0" />
            <span>Placement process concluded (Placed)</span>
          </div>
        )}
      </div>

      {/* Drives Grid */}
      <div className="flex flex-col gap-6">
        {drives.map((drive) => {
          const matchResult = getCompatibility(currentStudent, drive);
          const hasApplied = currentStudent.applications.some((a) => a.driveId === drive.id);
          const application = currentStudent.applications.find((a) => a.driveId === drive.id);

          return (
            <div
              key={drive.id}
              className={`glass-card p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-stretch gap-6 ${
                matchResult.eligible ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-rose-500'
              }`}
            >
              {/* Left Drive Info */}
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                      {drive.companyName.charAt(0)}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900 font-display tracking-tight">
                          {drive.companyName}
                        </h3>
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 font-mono font-bold text-xs">
                          {drive.package}
                        </span>
                        {hasApplied && (
                          <span
                            className={`sp-badge ${
                              application?.status === 'Selected'
                                ? 'sp-badge-success'
                                : application?.status === 'Rejected'
                                ? 'sp-badge-danger'
                                : 'sp-badge-info'
                            }`}
                          >
                            Status: {application?.status}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-blue-600">{drive.title}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {drive.description}
                  </p>
                </div>

                {/* Cutoff specifications grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Min CGPA
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{drive.cgpaCutoff} CGPA</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Max Backlogs
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{drive.maxBacklogs}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Branches
                    </span>
                    <span
                      className="font-bold text-slate-900 text-xs truncate block"
                      title={
                        Array.isArray(drive.allowedBranches)
                          ? drive.allowedBranches.join(', ')
                          : drive.allowedBranches || 'All'
                      }
                    >
                      {Array.isArray(drive.allowedBranches)
                        ? drive.allowedBranches.join(', ')
                        : drive.allowedBranches || 'All'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Grad Batch
                    </span>
                    <span className="font-bold text-indigo-600 text-xs">
                      {drive.eligibleBatch || '2026 Batch'}
                    </span>
                  </div>
                </div>

                {/* Skills Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {drive.skillsRequired.map((skill) => {
                    const hasSkill = currentStudent.skills.some(
                      (ss) => ss.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                          hasSkill
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {hasSkill && <span className="text-emerald-600 font-bold">✓</span>}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Right Compatibility Panel & Apply Action */}
              <div className="flex flex-col items-center justify-between p-5 rounded-2xl bg-slate-50/90 min-w-[210px] w-full md:w-auto border border-slate-200/80 text-center shrink-0 gap-4">
                {matchResult.eligible ? (
                  <>
                    <div className="flex flex-col items-center py-2">
                      <div className="text-4xl font-black text-emerald-600 font-display">
                        {matchResult.score}%
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest mt-1">
                        Compatibility Score
                      </span>
                    </div>

                    <button
                      disabled={hasApplied || isPlaced}
                      onClick={() => onApply(drive.id)}
                      className={`btn h-11 w-full rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 ${
                        hasApplied
                          ? 'btn-secondary bg-emerald-100 text-emerald-800 border-emerald-300 cursor-default'
                          : isPlaced
                          ? 'btn-secondary bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'btn-primary shadow-blue-600/20'
                      }`}
                    >
                      {hasApplied ? '✓ Applied' : isPlaced ? 'Placed' : 'Apply Now'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-full flex flex-col gap-2">
                      <div className="px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5">
                        <AlertCircle size={15} />
                        Ineligible
                      </div>

                      <div className="flex flex-col gap-1.5 mt-2 text-[11px] text-slate-500 text-left w-full leading-tight font-medium">
                        {matchResult.reasons?.map((reason, i) => (
                          <p key={i}>• {reason}</p>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled
                      className="btn btn-secondary h-11 w-full rounded-xl text-xs font-bold opacity-60 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 flex items-center justify-center gap-1.5"
                    >
                      <Lock size={15} />
                      Locked
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
