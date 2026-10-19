"use client";

import { useState, type ReactNode } from "react";
import { LuCalendarCheck, LuFlaskConical, LuSend } from "react-icons/lu";
import type { Tone } from "@/components/ui/tone-tile";
import { SettingRow, SettingsGroup } from "@/components/ui/settings-group";
import { Switch } from "@/components/ui/switch";
import { appointmentAlerts, channels, clinicalAlerts, type ToggleSetting } from "./data";

/** A group of switches that remember their own state. */
function ToggleGroup({ title, description, icon, tone, settings }: { title: string; description: string; icon: ReactNode; tone: Tone; settings: ToggleSetting[] }) {
  const [state, setState] = useState(() => Object.fromEntries(settings.map((setting) => [setting.id, setting.on])));

  return (
    <SettingsGroup icon={icon} tone={tone} title={title} description={description}>
      {settings.map((setting) => (
        <SettingRow key={setting.id} title={setting.title} description={setting.description}>
          {(control) => <Switch {...control} checked={state[setting.id]} onChange={(event) => setState((current) => ({ ...current, [setting.id]: event.target.checked }))} />}
        </SettingRow>
      ))}
    </SettingsGroup>
  );
}

export function NotificationsPanel() {
  return (
    <>
      <ToggleGroup icon={<LuCalendarCheck />} tone="primary" title="Appointments" description="Stay on top of your schedule." settings={appointmentAlerts} />
      <ToggleGroup icon={<LuFlaskConical />} tone="coral" title="Clinical" description="Results and patient requests that need you." settings={clinicalAlerts} />
      <ToggleGroup icon={<LuSend />} tone="amber" title="Delivery" description="Where we send them." settings={channels} />
    </>
  );
}
