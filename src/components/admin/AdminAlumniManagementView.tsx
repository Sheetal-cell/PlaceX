

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  Search,
  Users,
  XCircle
} from 'lucide-react';

import type { Alumni } from '../../api/alumniApi';

interface AdminAlumniManagementViewProps {
  alumni: Alumni[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const AdminAlumniManagementView: React.FC<
  AdminAlumniManagementViewProps
> = ({
  alumni,
  onApprove,
  onReject
}) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return alumni;

    return alumni.filter((item) =>
      [
        item.name,
        item.email,
        item.currentCompany,
        item.currentRole,
        item.department
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [alumni, search]);

  const pending = filtered.filter(
    (item) => item.alumniStatus === 'PENDING'
  );

  const approved = filtered.filter(
    (item) => item.alumniStatus === 'APPROVED'
  );

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Alumni Management
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Review alumni registrations and manage approved alumni.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alumni..."
            className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-semibold">
                Total Alumni
              </p>

              <p className="text-2xl font-extrabold">
                {alumni.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock3 size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-semibold">
                Pending Approval
              </p>

              <p className="text-2xl font-extrabold">
                {alumni.filter(
                  (item) =>
                    item.alumniStatus === 'PENDING'
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-semibold">
                Approved Alumni
              </p>

              <p className="text-2xl font-extrabold">
                {alumni.filter(
                  (item) =>
                    item.alumniStatus === 'APPROVED'
                ).length}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Pending */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-amber-600" />

            <h3 className="font-extrabold text-slate-900">
              Pending Alumni Approval
            </h3>

            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">
              {pending.length}
            </span>
          </div>
        </div>

        {pending.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <CheckCircle2
              size={35}
              className="mx-auto mb-3"
            />

            <p className="font-semibold">
              No pending alumni registrations.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pending.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5"
              >
                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold shrink-0">
                    {item.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900">
                      {item.name}
                    </h4>

                    <p className="text-sm text-slate-500">
                      {item.email}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                      <span>
                        Graduation: {item.graduationYear}
                      </span>

                      <span>
                        Department: {item.department}
                      </span>

                      <span>
                        Company: {item.currentCompany}
                      </span>

                      <span>
                        Role: {item.currentRole}
                      </span>
                    </div>

                    {item.linkedIn && (
                      <a
                        href={item.linkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold mt-2"
                      >
                        LinkedIn
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">

                  <button
                    onClick={() => onApprove(item.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Reject ${item.name}'s alumni registration?`
                        )
                      ) {
                        onReject(item.id);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-extrabold"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Approved */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={18}
              className="text-emerald-600"
            />

            <h3 className="font-extrabold text-slate-900">
              Approved Alumni
            </h3>

            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
              {approved.length}
            </span>
          </div>
        </div>

        {approved.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No approved alumni yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500">
                  <th className="px-5 py-3 font-bold">
                    Alumni
                  </th>

                  <th className="px-5 py-3 font-bold">
                    Company
                  </th>

                  <th className="px-5 py-3 font-bold">
                    Role
                  </th>

                  <th className="px-5 py-3 font-bold">
                    Graduation
                  </th>

                  <th className="px-5 py-3 font-bold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {approved.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      <div className="font-bold text-sm">
                        {item.name}
                      </div>

                      <div className="text-xs text-slate-500">
                        {item.email}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {item.currentCompany}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {item.currentRole}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {item.graduationYear}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1 text-xs font-bold">
                        <CheckCircle2 size={12} />
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};