"use client";

import { useState } from "react";
import { LuBell, LuBuilding2, LuLock, LuUserRound } from "react-icons/lu";
import type { IconType } from "react-icons";
import { PageHeader } from "@/components/layout/page-header";
import { Notice } from "@/components/ui/notice";
import { ClinicPanel } from "./clinic-panel";
import { NotificationsPanel } from "./notifications-panel";
import { ProfilePanel } from "./profile-panel";
import { SecurityPanel } from "./security-panel";
import styles from "./settings.module.css";

const sections = ["Profile", "Clinic", "Notifications", "Security"] as const;
type Section = (typeof sections)[number];
const icons: Record<Section, IconType> = { Profile: LuUserRound, Clinic: LuBuilding2, Notifications: LuBell, Security: LuLock };

/** Settings: a section list on the left, the panel for the chosen section on the right. Panels report what they saved. */
export function SettingsView() {
  const [section, setSection] = useState<Section>("Profile");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className={styles.page}>
      <PageHeader title="Settings" description="Manage your profile, your clinic and how Sanova keeps you in the loop." />
      <Notice message={notice} onDismiss={() => setNotice(null)} />

      <div className={styles.layout}>
        <nav className={styles.nav} aria-label="Settings sections">
          {sections.map((name) => {
            const Icon = icons[name];
            return (
              <button key={name} type="button" className={styles.navItem} aria-current={name === section ? "page" : undefined} onClick={() => setSection(name)}>
                <Icon aria-hidden />
                {name}
              </button>
            );
          })}
        </nav>

        <div className={styles.content}>
          {section === "Profile" && <ProfilePanel onSaved={setNotice} />}
          {section === "Clinic" && <ClinicPanel onSaved={setNotice} />}
          {section === "Notifications" && <NotificationsPanel />}
          {section === "Security" && <SecurityPanel onSaved={setNotice} />}
        </div>
      </div>
    </div>
  );
}
