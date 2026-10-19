"use client";

import { LuBuilding2, LuCalendarClock } from "react-icons/lu";
import { useRef, useState } from "react";
import { ChoiceChips } from "@/components/ui/filter-chips";
import { Select } from "@/components/ui/select";
import { SettingRow, SettingsGroup } from "@/components/ui/settings-group";
import { Switch } from "@/components/ui/switch";
import { TextInput } from "@/components/ui/text-input";
import { days, slotLengths, type Day } from "./data";

/** Clinic details and how appointments are scheduled. */
export function ClinicPanel({ onSaved }: { onSaved: (message: string) => void }) {
  const [name, setName] = useState("Sanova Family Clinic");
  const [address, setAddress] = useState("214 Market Street, San Francisco");
  const [open, setOpen] = useState<Day[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [slot, setSlot] = useState<(typeof slotLengths)[number]>("30 min");
  const [online, setOnline] = useState(true);
  const [telemedicine, setTelemedicine] = useState(true);

  const toggleDay = (day: Day) => setOpen((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day]));
  // Text fields save when you leave them, and only say so if something actually changed.
  const committed = useRef({ name, address });
  const commit = (key: "name" | "address", value: string) => {
    if (committed.current[key] === value) return;
    committed.current[key] = value;
    onSaved("Clinic details saved.");
  };

  return (
    <>
      <SettingsGroup icon={<LuBuilding2 />} title="Clinic" description="Shown on invoices, prescriptions and patient messages.">
        <SettingRow title="Clinic name" control="field">
          {(control) => <TextInput {...control} value={name} onChange={(event) => setName(event.target.value)} onBlur={() => commit("name", name)} />}
        </SettingRow>
        <SettingRow title="Address" control="field">
          {(control) => <TextInput {...control} value={address} onChange={(event) => setAddress(event.target.value)} onBlur={() => commit("address", address)} />}
        </SettingRow>
        <SettingRow title="Open on" description="Days patients can book a visit.">
          <ChoiceChips aria-label="Open days" value={open} options={days} onToggle={toggleDay} />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup icon={<LuCalendarClock />} tone="violet" title="Scheduling" description="Defaults for new appointments.">
        <SettingRow title="Appointment length" description="The default slot in the schedule." control="field">
          {(control) => <Select {...control} size="md" placeholder="Select a length" value={slot} options={slotLengths} onChange={setSlot} />}
        </SettingRow>
        <SettingRow title="Online booking" description="Let patients pick a time from the patient portal.">
          {(control) => <Switch {...control} checked={online} onChange={(event) => setOnline(event.target.checked)} />}
        </SettingRow>
        <SettingRow title="Telemedicine visits" description="Offer video and audio consultations when booking.">
          {(control) => <Switch {...control} checked={telemedicine} onChange={(event) => setTelemedicine(event.target.checked)} />}
        </SettingRow>
      </SettingsGroup>
    </>
  );
}
