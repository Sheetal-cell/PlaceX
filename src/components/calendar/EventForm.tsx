import React, { useState } from "react";
import { X, Calendar as CalendarIcon, Save } from "lucide-react";

interface Props {
  onClose: () => void;
  onSave: (event: any) => void;
}

export default function EventForm({ onClose, onSave }: Props) {
  const [eventData, setEventData] = useState({
    company: "",
    role: "",
    type: "PPT",
    date: "",
    time: "",
    venue: "",
    coordinator: "",
    branches: "",
    description: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (!eventData.company || !eventData.role || !eventData.date) {
      alert("Please fill required fields (Company, Role, Date)");
      return;
    }
    onSave(eventData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-xl mx-auto shadow-2xl border border-slate-200 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CalendarIcon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display leading-tight">
                Add Placement Event
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Schedule a campus recruitment drive, test, or interview round.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close Form"
            aria-label="Close Form"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Company Name *</label>
            <input
              name="company"
              placeholder="e.g. Microsoft"
              className="input-field"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Job Role *</label>
            <input
              name="role"
              placeholder="e.g. Software Engineer"
              className="input-field"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Event Type</label>
            <select
              name="type"
              className="input-field"
              onChange={handleChange}
            >
              <option value="PPT">Pre-Placement Talk (PPT)</option>
              <option value="Online Assessment">Online Assessment</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Deadline">Application Deadline</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Scheduled Date *</label>
            <input
              name="date"
              type="date"
              className="input-field"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Start Time</label>
            <input
              name="time"
              type="time"
              className="input-field"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Venue / Location</label>
            <input
              name="venue"
              placeholder="Auditorium / Online"
              className="input-field"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">TPO Coordinator</label>
            <input
              name="coordinator"
              placeholder="Coordinator Name"
              className="input-field"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Eligible Branches</label>
            <input
              name="branches"
              placeholder="CSE, ECE, IT"
              className="input-field"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">Event Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Detailed instructions for candidates..."
            className="input-field font-sans resize-none"
            onChange={handleChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary h-11 px-5 rounded-xl text-sm font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary h-11 px-6 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <Save size={18} /> Save Event
          </button>
        </div>
      </div>
    </div>
  );
}