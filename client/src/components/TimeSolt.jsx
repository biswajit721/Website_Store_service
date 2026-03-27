import React, { useState } from "react";
import { X } from "lucide-react";
import MeetingScheduledModal from "./MettingScheduledModule";


const TimeSolt = ({
  meetingData,
  handleScheduleMeeting,
  selectedTime,
  setSelectedTime,
  selectedDate,
  setSelectedDate,
  onClose,
  activePlan,
  price,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

if (showSuccess) {
  return (
    <MeetingScheduledModal
      meetingData={meetingData}
      date={selectedDate}
      time={selectedTime}
      onClose={() => {
        setShowSuccess(false);
        setSelectedDate("");
        setSelectedTime("");

        onClose();
      }}
    />
  );
}

 console.log("Meeting Data ",meetingData)

const handleMeeting = async (e) => {
  e.preventDefault();

  const success = await handleScheduleMeeting();

  if (success) {
    setShowSuccess(true);
  }
};

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl p-6 relative">

        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        <h3 className="text-xl font-bold mb-1">
          Schedule Consultation
        </h3>

        <p className="text-sm text-zinc-500 mb-6">
          Book a free consultation for the {activePlan} package (₹ {price})
        </p>

        {/* Date */}
        <label className="text-sm font-medium">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border border-zinc-300 rounded-xl px-4 py-3 mt-2 mb-6 outline-none focus:border-black"
        />

        {/* Time */}
        <label className="text-sm font-medium">Select Time</label>

        <div className="grid grid-cols-4 gap-3 mt-3 mb-6">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              className={`py-2 rounded-full border text-sm
                ${
                  selectedTime === slot
                    ? "bg-black text-white border-black"
                    : "border-zinc-300 hover:bg-zinc-100"
                }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* Confirm */}
        <button
          
          disabled={!selectedDate || !selectedTime}
          onClick={handleMeeting}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-40"
        >
          Confirm Meeting
        </button>
      </div>
    </div>
  );
};

export default TimeSolt;
