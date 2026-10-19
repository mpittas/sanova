"use client";

import { LuSlidersHorizontal, LuUser } from "react-icons/lu";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { Select } from "@/components/ui/select";
import { SettingRow, SettingsGroup } from "@/components/ui/settings-group";
import { TextInput } from "@/components/ui/text-input";
import { doctor } from "@/components/dashboard/data";
import { languages, timeFormats, timezones, type TimeFormat } from "./data";

const initial = {
  name: doctor.name,
  email: "james.carter@sanova.health",
  phone: "+1 (415) 555-0142",
};
type Profile = typeof initial;

/** Personal details (saved with a button) and display preferences (applied as you change them). */
export function ProfilePanel({ onSaved }: { onSaved: (message: string) => void }) {
  const [profile, setProfile] = useState<Profile>(initial);
  const [saved, setSaved] = useState<Profile>(initial);
  const [language, setLanguage] = useState<(typeof languages)[number]>(languages[0]);
  const [timezone, setTimezone] = useState<(typeof timezones)[number]>(timezones[0]);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12-hour");

  const dirty = (Object.keys(initial) as (keyof Profile)[]).some((key) => profile[key] !== saved[key]);
  const edit = (key: keyof Profile) => (event: ChangeEvent<HTMLInputElement>) => setProfile((current) => ({ ...current, [key]: event.target.value }));

  const save = (event: FormEvent) => {
    event.preventDefault();
    setSaved(profile);
    onSaved("Your profile was updated.");
  };

  return (
    <>
      <form onSubmit={save}>
        <SettingsGroup
          icon={<LuUser />}
          title="Profile"
          description="How you appear to patients and colleagues."
          footer={
            <>
              <Button variant="ghost" size="sm" disabled={!dirty} onClick={() => setProfile(saved)}>
                Discard
              </Button>
              <Button type="submit" size="sm" disabled={!dirty}>
                Save changes
              </Button>
            </>
          }
        >
          <SettingRow title="Photo" description="A clear portrait helps patients recognise you.">
            <Avatar name={doctor.name} size={44} />
            <Button variant="secondary" size="sm">
              Change
            </Button>
          </SettingRow>
          <SettingRow title="Full name" control="field">
            {(control) => <TextInput {...control} value={profile.name} onChange={edit("name")} autoComplete="name" />}
          </SettingRow>
          <SettingRow title="Email" description="Used to sign in and for notifications." control="field">
            {(control) => <TextInput {...control} type="email" value={profile.email} onChange={edit("email")} autoComplete="email" />}
          </SettingRow>
          <SettingRow title="Phone" control="field">
            {(control) => <TextInput {...control} type="tel" value={profile.phone} onChange={edit("phone")} autoComplete="tel" />}
          </SettingRow>
          <SettingRow title="Role" description="Set by your clinic administrator.">
            <span className="text-body text-muted">{doctor.role}</span>
          </SettingRow>
        </SettingsGroup>
      </form>

      <SettingsGroup icon={<LuSlidersHorizontal />} tone="violet" title="Preferences" note="Changes apply straight away." description="Language, time zone and format.">
        <SettingRow title="Language" control="field">
          {(control) => <Select {...control} size="md" placeholder="Select a language" value={language} options={languages} onChange={setLanguage} />}
        </SettingRow>
        <SettingRow title="Time zone" control="field">
          {(control) => <Select {...control} size="md" placeholder="Select a time zone" value={timezone} options={timezones} onChange={setTimezone} />}
        </SettingRow>
        <SettingRow title="Time format" description="Shown in the schedule and on appointments.">
          <Segmented aria-label="Time format" value={timeFormat} options={timeFormats} onChange={setTimeFormat} />
        </SettingRow>
      </SettingsGroup>
    </>
  );
}
