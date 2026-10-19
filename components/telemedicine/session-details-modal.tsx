"use client";

import { LuCalendar, LuClock, LuFileText, LuPhone, LuStickyNote, LuVideo } from "react-icons/lu";
import { addMinutes, formatDate, formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { DetailItem, DetailList } from "@/components/ui/detail-list";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "@/components/ui/modal";
import type { Session } from "./data";
import { SessionActions, statusChip, type SessionHandlers } from "./session-row";

export function SessionDetailsModal({ session, handlers, onClose }: { session: Session | undefined; handlers: SessionHandlers; onClose: () => void }) {
  const chip = session ? statusChip(session) : undefined;

  return (
    <Modal open={session !== undefined} onClose={onClose} labelledBy="session-details-title" width={520}>
      {session && chip && (
        <ModalPanel>
          <ModalHeader
            title={session.patient}
            titleId="session-details-title"
            description={`MRN: ${session.mrn}`}
            leading={<Avatar name={session.patient} size={56} />}
            trailing={<Chip tone={chip.tone}>{chip.label}</Chip>}
            onClose={onClose}
          />

          <ModalBody>
            <DetailList>
              <DetailItem icon={LuCalendar}>
                {session.status === "requested" && <span className="text-muted">Preferred time: </span>}
                {formatDate(session.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </DetailItem>
              <DetailItem icon={LuClock}>
                <span>
                  {formatTime(session.start)} – {formatTime(addMinutes(session.start, session.duration))} ({session.duration} minutes)
                </span>
              </DetailItem>
              <DetailItem icon={session.callType === "Audio Call" ? LuPhone : LuVideo}>{session.callType}</DetailItem>
              <DetailItem icon={LuFileText} title={session.title}>
                {session.summary}
              </DetailItem>
              <DetailItem icon={LuStickyNote} title="Notes">
                {session.notes}
              </DetailItem>
            </DetailList>
          </ModalBody>

          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <SessionActions
              session={session}
              handlers={{
                ...handlers,
                // Acting on a session from inside the dialog closes it.
                onStart: (id) => (handlers.onStart(id), onClose()),
                onEnd: (id) => (handlers.onEnd(id), onClose()),
                onAccept: (id) => (handlers.onAccept(id), onClose()),
                onDecline: (id) => (handlers.onDecline(id), onClose()),
              }}
            />
          </ModalFooter>
        </ModalPanel>
      )}
    </Modal>
  );
}
