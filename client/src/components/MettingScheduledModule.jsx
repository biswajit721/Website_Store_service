import React from "react";
import { X, Calendar, Clock, Copy, Video } from "lucide-react";

const MeetingScheduledModal = ({ date, time, onClose,meetingData }) => {
  const meetingLink = "https://meet.example.com/consultation-kwmnah";

 

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">

  <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-8">

    {/* Close */}
    <button
      onClick={onClose}
      className="absolute right-4 top-4 p-2 rounded-full hover:bg-zinc-100 transition"
    >
      <X size={18} />
    </button>

    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
        <Video className="w-5 h-5 text-green-600" />
      </div>

      <h2 className="text-2xl font-semibold text-zinc-900">
        Meeting Scheduled!
      </h2>
    </div>

    {/* Description */}
    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
      Meeting has been sent to your registered email
      <br />
      <span className="font-medium text-zinc-700">
        ({meetingData.userId?.email})
      </span>
    </p>

    {/* Success Icon */}
    <div className="flex justify-center mb-7">
      <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shadow-inner">
        <span className="text-3xl text-green-600 font-bold">✓</span>
      </div>
    </div>

    {/* Date + Time */}
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 mb-6 space-y-3">

      <div className="flex items-center gap-3 text-sm text-zinc-700">
        <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center">
          <Calendar size={16} />
        </div>
        {date}
      </div>

      <div className="flex items-center gap-3 text-sm text-zinc-700">
        <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center">
          <Clock size={16} />
        </div>
        {time}
      </div>

    </div>

    {/* Button */}
    <button
      onClick={onClose}
      className="w-full py-3 rounded-xl font-semibold border border-black text-black hover:bg-black hover:text-white transition-all duration-200"
    >
      Close
    </button>

  </div>
</div>
  );
};

export default MeetingScheduledModal;
