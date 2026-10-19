"use client";

import { LuKeyRound, LuMonitorSmartphone } from "react-icons/lu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Select } from "@/components/ui/select";
import { SettingRow, SettingsGroup } from "@/components/ui/settings-group";
import { Switch } from "@/components/ui/switch";
import { devices, sessionTimeouts } from "./data";

export function SecurityPanel({ onSaved }: { onSaved: (message: string) => void }) {
  const [twoStep, setTwoStep] = useState(true);
  const [idle, setIdle] = useState<(typeof sessionTimeouts)[number]>("30 minutes");
  const [signedIn, setSignedIn] = useState<string[]>(devices.map((device) => device.id));

  const signOut = (id: string, name: string) => {
    setSignedIn((current) => current.filter((item) => item !== id));
    onSaved(`Signed out of ${name}.`);
  };

  return (
    <>
      <SettingsGroup icon={<LuKeyRound />} title="Sign in" description="Keep patient records safe.">
        <SettingRow title="Password" description="Last changed 3 months ago.">
          <Button variant="secondary" size="sm">
            Change password
          </Button>
        </SettingRow>
        <SettingRow title="Two-step verification" description="Ask for a code from your phone when you sign in.">
          {(control) => <Switch {...control} checked={twoStep} onChange={(event) => setTwoStep(event.target.checked)} />}
        </SettingRow>
        <SettingRow title="Sign out when idle" description="Locks the dashboard after a period of no activity." control="field">
          {(control) => <Select {...control} size="md" placeholder="Select a time" value={idle} options={sessionTimeouts} onChange={setIdle} />}
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup icon={<LuMonitorSmartphone />} tone="teal" title="Devices" description="Where you are signed in right now.">
        {devices
          .filter((device) => signedIn.includes(device.id))
          .map((device) => (
            <SettingRow
              key={device.id}
              title={
                <>
                  {device.name}
                  {device.current && (
                    <Chip tone="success" size="sm" className="setting-chip">
                      This device
                    </Chip>
                  )}
                </>
              }
              description={`${device.place} · ${device.seen}`}
            >
              {!device.current && (
                <Button variant="ghost" size="sm" onClick={() => signOut(device.id, device.name)}>
                  Sign out
                </Button>
              )}
            </SettingRow>
          ))}
      </SettingsGroup>
    </>
  );
}
