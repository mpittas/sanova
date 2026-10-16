import { LuCalendar, LuCalendarCheck, LuClock, LuFileText, LuHeart, LuInbox, LuPlus, LuStethoscope, LuUserPlus, LuUsers, LuVideo } from "react-icons/lu";
import { PageHeader } from "@/components/layout/page-header";
import { SplitLayout } from "@/components/layout/split-layout";
import { portraits } from "@/lib/portraits";
import { ActionGrid, ActionTile } from "@/components/ui/action-tile";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Counter } from "@/components/ui/counter";
import { Delta } from "@/components/ui/delta";
import { DetailItem, DetailList } from "@/components/ui/detail-list";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoGrid, InfoTile } from "@/components/ui/info-tile";
import { Legend, LegendItem } from "@/components/ui/legend";
import { ArchLineup, PageBanner } from "@/components/ui/page-banner";
import { Person } from "@/components/ui/person";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SearchInput } from "@/components/ui/search-input";
import { StatGrid, StatTile } from "@/components/ui/stat-tile";
import { Table, Th } from "@/components/ui/table";
import { ToneTile } from "@/components/ui/tone-tile";
import { CodeBlock, DocSection, Panel, Specimen, Specimens } from "./docs-helpers";
import {
  CheckboxDemo,
  ChoiceChipsDemo,
  FilterChipsDemo,
  FormDemo,
  ImageUploadDemo,
  ListToolbarDemo,
  ModalDemo,
  NoticeDemo,
  PaginationDemo,
  SegmentedDemo,
  SelectDemo,
  StepperDemo,
  SortableTableDemo,
  TabsDemo,
  ToggleButtonDemo,
} from "./demos";
import styles from "./docs.module.css";

const chipTones: ChipTone[] = ["success", "info", "neutral", "warning", "danger", "violet"];

/** Navigation entries for the components below, in page order. */
export const componentNav = [
  { id: "chips", label: "Chips" },
  { id: "counters", label: "Counters" },
  { id: "deltas", label: "Deltas" },
  { id: "avatars", label: "Avatars" },
  { id: "cards", label: "Cards" },
  { id: "stat-tiles", label: "Stat tiles" },
  { id: "inputs", label: "Inputs" },
  { id: "switchers", label: "Segmented & tabs" },
  { id: "filter-chips", label: "Filter chips" },
  { id: "form-fields", label: "Form fields" },
  { id: "modal", label: "Modal" },
  { id: "stepper", label: "Stepper" },
  { id: "image-upload", label: "Image upload" },
  { id: "progress", label: "Progress bars" },
  { id: "legends", label: "Legends" },
  { id: "tables", label: "Tables" },
  { id: "pagination", label: "Pagination" },
  { id: "empty-states", label: "Empty states" },
  { id: "page-layout", label: "Page layout" },
  { id: "page-banner", label: "Page banner" },
  { id: "split-layout", label: "Split layout" },
  { id: "notice", label: "Notice" },
  { id: "list-toolbar", label: "List toolbar" },
  { id: "info-tiles", label: "Info & action tiles" },
  { id: "detail-list", label: "Detail list" },
];

export function ComponentDocs() {
  return (
    <>
      <div className={styles.divider}>
        <h2 className="text-h1">Components</h2>
        <p className="text-body-lg text-muted">
          Reusable building blocks. Every page is composed from these, so a change here updates the whole app.
        </p>
      </div>

      {/* ---------- Chips ---------- */}
      <DocSection
        id="chips"
        title="Chips"
        description="Small coloured labels for statuses, tags and roles."
        source="@/components/ui/chip"
      >
        <Panel title="Status (default)" note="A leading dot and fully round corners. Use for states that change: Active, Rescheduled, At Risk.">
          <Specimens>
            {chipTones.map((tone) => (
              <Specimen key={tone} label={`tone="${tone}"`}>
                <Chip tone={tone}>Status</Chip>
              </Specimen>
            ))}
          </Specimens>
        </Panel>
        <Panel
          title="Tag and sizes"
          note={
            <>
              <code className="mono">tag</code> has no dot and squarer corners, for static labels like visit type.{" "}
              <code className="mono">size=&quot;sm&quot;</code> is for tight spaces.
            </>
          }
        >
          <Specimens>
            <Specimen label='variant="tag"'>
              <Chip variant="tag" tone="info">
                In Person
              </Chip>
              <Chip variant="tag" tone="violet">
                Telehealth
              </Chip>
              <Chip variant="tag" tone="success">
                Active Patient
              </Chip>
            </Specimen>
            <Specimen label='size="sm"'>
              <Chip size="sm" tone="success">
                Active
              </Chip>
              <Chip size="sm" variant="tag" tone="violet">
                Care Team
              </Chip>
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<Chip tone="success">Active</Chip>\n<Chip variant="tag" tone="info" size="sm">In Person</Chip>`}</CodeBlock>
      </DocSection>

      {/* ---------- Counters ---------- */}
      <DocSection
        id="counters"
        title="Counters"
        description="Tiny round number badges for unread messages, applied filters and menu counts."
        source="@/components/ui/counter"
      >
        <Panel>
          <Specimens>
            <Specimen label='tone="primary"' hint="Default. Unread, applied filters">
              <Counter>3</Counter>
              <Counter>28</Counter>
            </Specimen>
            <Specimen label='tone="soft"' hint="Quiet, menu counts">
              <Counter tone="soft">28</Counter>
            </Specimen>
            <Specimen label='tone="danger"' hint="Needs attention">
              <Counter tone="danger">7</Counter>
            </Specimen>
            <Specimen label='tone="neutral"'>
              <Counter tone="neutral">12</Counter>
            </Specimen>
            <Specimen label='size="sm"'>
              <Counter size="sm">2</Counter>
              <Counter size="sm" tone="danger">
                9
              </Counter>
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<Counter>3</Counter>\n<Counter tone="soft" size="sm">28</Counter>`}</CodeBlock>
      </DocSection>

      {/* ---------- Deltas ---------- */}
      <DocSection
        id="deltas"
        title="Deltas"
        description="Change indicators with an arrow. Colour is independent of direction: a rising 'at risk' count is bad."
        source="@/components/ui/delta"
      >
        <Panel>
          <Specimens>
            <Specimen label='variant="text"' hint="Default, inline with a number">
              <Delta value="12%" />
              <Delta value="3%" direction="down" tone="success" />
              <Delta value="2" tone="danger" />
              <Delta value="8%" direction="down" tone="danger" />
            </Specimen>
            <Specimen label='variant="chip"' hint="Tinted background">
              <Delta value="12%" variant="chip" />
              <Delta value="3%" direction="down" variant="chip" />
              <Delta value="2" tone="danger" variant="chip" />
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<Delta value="12%" />\n<Delta value="2" tone="danger" variant="chip" />`}</CodeBlock>
      </DocSection>

      {/* ---------- Avatars ---------- */}
      <DocSection
        id="avatars"
        title="Avatars"
        description="Round portraits with an initials fallback while loading, when the photo fails, or when there is none."
        source="@/components/ui/avatar, person"
      >
        <Panel>
          <Specimens>
            <Specimen label="size" hint="Any pixel size">
              {[24, 32, 40, 48, 64].map((size) => (
                <Avatar key={size} name="Emily Carter" size={size} />
              ))}
            </Specimen>
            <Specimen label="initials" hint="No portrait registered">
              <Avatar name="Alex Morgan" size={48} />
              <Avatar name="Priya Shah" size={48} />
              <Avatar name="Dr. Tom Reyes" size={48} />
              <Avatar name="Sam Okafor" size={48} />
            </Specimen>
            <Specimen label="online" hint="Presence dot">
              <Avatar name="Emily Carter" size={48} online />
              <Avatar name="Alex Morgan" size={48} online />
            </Specimen>
            <Specimen label="src" hint="Explicit image; falls back if it fails">
              <Avatar name="Broken Image" size={48} src="https://invalid.example/missing.jpg" />
            </Specimen>
            <Specimen label='shape="rounded"' hint="Softly rounded square, for profile cards">
              <Avatar name="Emily Carter" size={64} shape="rounded" />
              <Avatar name="Alex Morgan" size={64} shape="rounded" />
              <Avatar name="Emily Carter" size={64} shape="rounded" radius={24} />
            </Specimen>
            <Specimen label="Person" hint="Avatar, name and a line of detail">
              <Person name="Emily Carter" subtitle="MRN: CC-1001" />
              <Person name="Alex Morgan" subtitle="Follow-up Visit" />
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<Avatar name="Emily Carter" size={48} online />\n<Avatar name="Alex Morgan" src={url} shape="rounded" />`}</CodeBlock>
      </DocSection>

      {/* ---------- Cards ---------- */}
      <DocSection
        id="cards"
        title="Cards"
        description="The surface everything sits on. An optional header holds a title, description and action."
        source="@/components/ui/card"
      >
        <div className={styles.cardGrid}>
          <Card title="Default card" description="With a description" action={<Button size="sm" variant="secondary">Action</Button>}>
            <p className="text-small text-muted">Standard 20px padding, hairline border, no heavy shadow.</p>
          </Card>
          <Card padding="lg" title="padding=&quot;lg&quot;">
            <p className="text-small text-muted">24px padding for roomier content.</p>
          </Card>
          <Card padding="none">
            <p className={`text-small text-muted ${styles.cardPad}`}>
              padding=&quot;none&quot;: content runs edge to edge. Use for tables, lists and chat panels.
            </p>
          </Card>
          <Card rounded title="rounded">
            <p className="text-small text-muted">24px corners (--radius-2xl) for feature surfaces such as heroes and profile cards.</p>
          </Card>
        </div>
        <CodeBlock>{`<Card title="Upcoming" description="Today's schedule" action={<Select … />}>…</Card>\n<Card padding="none">…table…</Card>`}</CodeBlock>
      </DocSection>

      {/* ---------- Stat tiles ---------- */}
      <DocSection
        id="stat-tiles"
        title="Stat tiles"
        description="KPI tiles: a tinted icon, a label, a big number and a change indicator. StatGrid lays them out responsively."
        source="@/components/ui/stat-tile"
      >
        <StatGrid>
          <StatTile label="Total Patients" value="248" change="12%" period="from last month" icon={LuUsers} tone="primary" />
          <StatTile label="Completed" value="36" change="20%" period="from last month" icon={LuCalendarCheck} tone="success" />
          <StatTile label="New Patients" value="18" change="50%" period="from last month" icon={LuUserPlus} tone="amber" />
          <StatTile label="At Risk" value="7" change="2" period="from last month" icon={LuUsers} tone="coral" deltaTone="danger" />
        </StatGrid>
        <Panel title="Icon tiles" note="ToneTile is the tinted rounded square used inside tiles, lists and quick actions.">
          <Specimens>
            <Specimen label="tone">
              {(["primary", "blue", "success", "violet", "coral", "amber", "teal"] as const).map((tone) => (
                <ToneTile key={tone} tone={tone} size={44}>
                  <LuPlus />
                </ToneTile>
              ))}
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<StatGrid>\n  <StatTile label="At Risk" value={7} change="2" period="from last month"\n    icon={LuHeart} tone="coral" deltaTone="danger" />\n</StatGrid>`}</CodeBlock>
      </DocSection>

      {/* ---------- Inputs ---------- */}
      <DocSection
        id="inputs"
        title="Inputs"
        description="Search fields, selects and checkboxes. Controls that sit next to each other share a height so they line up."
        source="@/components/ui/search-input, select, checkbox"
      >
        <Panel title="Search input" note="44px, the same height as default buttons. Use tone=&quot;white&quot; on a tinted background.">
          <div className={styles.fieldStack}>
            <SearchInput label="Search" placeholder="Search patients, appointments..." />
            <SearchInput label="Search (white)" tone="white" placeholder="White field" />
            <SearchInput
              label="Search with action"
              placeholder="With a trailing button"
              trailing={
                <Button variant="ghost" size="sm" iconOnly aria-label="Clear">
                  <LuPlus />
                </Button>
              }
            />
          </div>
        </Panel>
        <Panel
          title="Select"
          note={
            <>
              <code className="mono">sm</code> (32px) fits card headers; <code className="mono">md</code> (44px) sits beside
              default buttons and search fields; <code className="mono">lg</code> (50px) is for forms in dialogs.
            </>
          }
        >
          <Specimens>
            <Specimen label='size="sm" / "md"'>
              <SelectDemo />
            </Specimen>
          </Specimens>
        </Panel>
        <Panel title="Checkbox" note="Supports checked, indeterminate (some selected) and disabled.">
          <Specimens>
            <Specimen label="states">
              <Checkbox aria-label="Unchecked" />
              <Checkbox aria-label="Checked" defaultChecked />
              <Checkbox aria-label="Indeterminate" indeterminate />
              <Checkbox aria-label="Disabled" disabled />
              <Checkbox aria-label="Disabled checked" disabled defaultChecked />
            </Specimen>
            <Specimen label="select all" hint="Interactive">
              <CheckboxDemo />
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<SearchInput label="Search patients" value={q} onChange={…} />\n<Select size="md" aria-label="Status" value={v} options={opts} onChange={setV} />\n<Checkbox checked={all} indeterminate={some && !all} onChange={toggle} />`}</CodeBlock>
      </DocSection>

      {/* ---------- Segmented + tabs ---------- */}
      <DocSection
        id="switchers"
        title="Segmented control & tabs"
        description="Segmented control switches how the same data is shown (Day / Week / Month). Tabs switch between sections of content."
        source="@/components/ui/segmented, tabs"
      >
        <Panel>
          <Specimens>
            <Specimen label="Segmented" hint="32px, matches small buttons">
              <SegmentedDemo />
            </Specimen>
            <Specimen label="Tabs" hint="Underline, controls a panel">
              <TabsDemo />
            </Specimen>
            <Specimen label="Button pressed" hint="A toggle button">
              <ToggleButtonDemo />
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<Segmented aria-label="View" value={view} options={["Day","Week","Month"]} onChange={setView} />\n<Tabs aria-label="Type" panelId="list" value={tab} options={tabs} onChange={setTab} />`}</CodeBlock>
      </DocSection>

      {/* ---------- Filter chips ---------- */}
      <DocSection
        id="filter-chips"
        title="Filter chips"
        description="Quiet single-select filter with item counts, for narrowing a list by category. A text row up to five options, a dropdown beyond that."
        source="@/components/ui/filter-chips"
      >
        <Panel note="Switches to a dropdown on its own when there are more than five options (maxInline).">
          <Specimens>
            <Specimen label="Text row" hint="Five options or fewer">
              <FilterChipsDemo />
            </Specimen>
            <Specimen label="Dropdown" hint="More than five options">
              <FilterChipsDemo many />
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<FilterChips aria-label="Specialty" value={v} onChange={setV}\n  options={[{ value: "All Doctors", count: 14 }, { value: "Cardiology", count: 2 }]} />`}</CodeBlock>
      </DocSection>

      {/* ---------- Form fields ---------- */}
      <DocSection
        id="form-fields"
        title="Form fields"
        description="A label, a control and a hint or error, wired together for screen readers. Inputs are 44px tall with 12px corners; the large size used in dialogs is 50px with 14px corners."
        source="@/components/ui/field, text-input, select, filter-chips"
      >
        <Panel
          title="Field with controls"
          note={
            <>
              Field passes the control its <code className="mono">id</code>, <code className="mono">aria-describedby</code> and{" "}
              <code className="mono">aria-invalid</code>. Error text says what is wrong and how to fix it.
            </>
          }
        >
          <FormDemo />
        </Panel>
        <Panel title="Choice chips" note="Like filter chips, but any number can be on at once: working days, focus areas, languages.">
          <ChoiceChipsDemo />
        </Panel>
        <CodeBlock>{`<Field label="Full name" required error={errors.name}>\n  {(control) => <TextInput {...control} size="lg" icon={<LuUser />} value={name} onChange={…} />}\n</Field>\n<Field label="Department">\n  {(control) => <Select {...control} size="lg" placeholder="Select department" value={v} options={opts} onChange={setV} />}\n</Field>`}</CodeBlock>
      </DocSection>

      {/* ---------- Modal ---------- */}
      <DocSection
        id="modal"
        title="Modal"
        description="A dialog built on the native dialog element, so focus is trapped, Escape closes it and the page behind is inert. Content is only mounted while it is open, so forms reset each time."
        source="@/components/ui/modal"
      >
        <Panel
          note={
            <>
              Set <code className="mono">width</code> in pixels. Turn off <code className="mono">dismissOnBackdrop</code> for long
              forms. On phones the dialog fills the screen. Build the contents from <code className="mono">ModalPanel</code> (or{" "}
              <code className="mono">ModalForm</code>), <code className="mono">ModalHeader</code>, <code className="mono">ModalBody</code>{" "}
              and <code className="mono">ModalFooter</code>; put two fields side by side with <code className="mono">FieldRow</code>.
            </>
          }
        >
          <Specimens>
            <Specimen label="Modal" hint="Confirmation dialog">
              <ModalDemo />
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<Modal open={open} onClose={close} labelledBy="title-id" width={480}>\n  <ModalForm onSubmit={save}>\n    <ModalHeader title="New Prescription" titleId="title-id" description="…" onClose={close} />\n    <ModalBody>…<FieldRow>…</FieldRow></ModalBody>\n    <ModalFooter>…</ModalFooter>\n  </ModalForm>\n</Modal>`}</CodeBlock>
      </DocSection>

      {/* ---------- Stepper ---------- */}
      <DocSection
        id="stepper"
        title="Stepper"
        description="A vertical list of steps for multi-step flows. Finished steps show a check and can be clicked to go back; later steps cannot be skipped to."
        source="@/components/ui/stepper"
      >
        <Panel>
          <StepperDemo />
        </Panel>
        <CodeBlock>{`<Stepper aria-label="Add doctor steps" steps={steps} current={step} onSelect={setStep} />`}</CodeBlock>
      </DocSection>

      {/* ---------- Image upload ---------- */}
      <DocSection
        id="image-upload"
        title="Image upload"
        description="Portrait upload. The frame has the same proportions as portraits on doctor cards, so what you pick is what you get. Drag a file onto it or click to browse; a chosen photo can be replaced or removed, and a preview shows how it looks in lists."
        source="@/components/ui/image-upload"
      >
        <Panel note="Accepts JPG and PNG up to 5 MB. Wrong files show an error that says what to do. Try it with a photo from your computer.">
          <ImageUploadDemo />
        </Panel>
        <CodeBlock>{`<ImageUpload label="Profile photo" previewName={name} value={photo} onChange={setPhoto} />`}</CodeBlock>
      </DocSection>

      {/* ---------- Progress ---------- */}
      <DocSection
        id="progress"
        title="Progress bars"
        description="A share or completion value, in any tone."
        source="@/components/ui/progress-bar"
      >
        <Panel>
          <Specimens>
            {(["primary", "success", "violet", "coral", "amber"] as const).map((tone, index) => (
              <Specimen key={tone} label={`tone="${tone}"`}>
                <div className={styles.progressDemo}>
                  <ProgressBar value={80 - index * 14} tone={tone} aria-label={`${tone} example`} />
                </div>
              </Specimen>
            ))}
            <Specimen label='size="sm"'>
              <div className={styles.progressDemo}>
                <ProgressBar value={45} size="sm" aria-label="Small example" />
              </div>
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<ProgressBar value={40} tone="success" aria-label="General Practice share" />`}</CodeBlock>
      </DocSection>

      {/* ---------- Legends ---------- */}
      <DocSection
        id="legends"
        title="Legends"
        description="Colour keys for charts. Column legends can show a count and a share; row legends are a compact inline key."
        source="@/components/ui/legend"
      >
        <Panel>
          <Specimens>
            <Specimen label='direction="column"' hint="With detail and value">
              <div className={styles.legendDemo}>
                <Legend>
                  <LegendItem color="var(--color-primary-400)" label="Female" detail="649" value="52%" />
                  <LegendItem color="var(--color-violet-400)" label="Male" detail="562" value="45%" />
                  <LegendItem color="var(--color-amber-400)" label="Other" detail="37" value="3%" />
                </Legend>
              </div>
            </Specimen>
            <Specimen label='direction="row"' hint="Compact key">
              <Legend direction="row">
                <LegendItem color="var(--color-primary-500)" label="In-person" />
                <LegendItem color="var(--color-primary-200)" label="Telemedicine" />
              </Legend>
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<Legend direction="row">\n  <LegendItem color="var(--color-primary-500)" label="In-person" />\n</Legend>`}</CodeBlock>
      </DocSection>

      {/* ---------- Tables ---------- */}
      <DocSection
        id="tables"
        title="Tables"
        description="Two variants. Simple sits inside a padded card; banded runs edge to edge with a tinted header and row hover. Headers can be sortable."
        source="@/components/ui/table"
      >
        <Panel title="Simple" note="Use inside a padded card, e.g. today's appointments.">
          <Table variant="simple">
            <thead>
              <tr>
                <Th>Time</Th>
                <Th>Patient</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="num">09:00 AM</td>
                <td className="text-label">Olivia Bennett</td>
                <td>
                  <Chip tone="success">Checked In</Chip>
                </td>
              </tr>
              <tr>
                <td className="num">09:30 AM</td>
                <td className="text-label">Liam Carter</td>
                <td>
                  <Chip tone="info">Upcoming</Chip>
                </td>
              </tr>
            </tbody>
          </Table>
        </Panel>
        <div className={styles.demoLabel}>
          <h3 className="text-h4">Banded + sortable</h3>
          <p className="text-caption text-muted">Click a header to sort (ascending, descending, off). Put it in a card with no padding.</p>
        </div>
        <SortableTableDemo />
        <CodeBlock>{`<Card padding="none">\n  <Table variant="banded" minWidth={900}>\n    <thead><tr><Th sort={{ direction, onSort }}>Patient</Th></tr></thead>\n    <tbody>…</tbody>\n  </Table>\n</Card>`}</CodeBlock>
      </DocSection>

      {/* ---------- Pagination ---------- */}
      <DocSection
        id="pagination"
        title="Pagination"
        description="Page buttons with first/last always visible and ellipses for the gaps."
        source="@/components/ui/pagination"
      >
        <Panel note="Try it: the window of pages follows the current page.">
          <Specimens>
            <Specimen label="12 pages" hint="Interactive">
              <PaginationDemo totalPages={12} />
            </Specimen>
            <Specimen label="5 pages">
              <PaginationDemo totalPages={5} />
            </Specimen>
          </Specimens>
        </Panel>
        <CodeBlock>{`<Pagination page={page} totalPages={42} onChange={setPage} />`}</CodeBlock>
      </DocSection>

      {/* ---------- Empty states ---------- */}
      <DocSection
        id="empty-states"
        title="Empty states"
        description="Shown when a list, table or chat has nothing to display. Say what is empty and offer a next step."
        source="@/components/ui/empty-state"
      >
        <div className={styles.cardGrid}>
          <Card>
            <EmptyState icon={LuInbox} title="No conversations" description="You're all caught up." />
          </Card>
          <Card>
            <EmptyState
              icon={LuInbox}
              size="compact"
              title="No patients found"
              description="Try a different search or adjust your filters."
              action={
                <Button variant="secondary" size="sm">
                  Clear filters
                </Button>
              }
            />
          </Card>
        </div>
        <CodeBlock>{`<EmptyState icon={LuSearchX} title="No patients found" description="…" action={<Button …/>} />`}</CodeBlock>
      </DocSection>

      {/* ---------- Page layout ---------- */}
      <DocSection
        id="page-layout"
        title="Page layout"
        description="Every page is AppShell (sidebar) > AppHeader (top bar) > PageContent (padded main) > PageHeader (title + actions) > content."
        source="@/components/layout/*"
      >
        <Panel title="PageHeader" note="Title, optional description and eyebrow, and actions that wrap below the title on narrow screens.">
          <div className={styles.pageHeaderDemo}>
            <PageHeader
              eyebrow={<span className="text-small text-muted">Tuesday, October 13</span>}
              title="Patients"
              description="Manage your patients, view records, and keep track of their care."
              actions={
                <>
                  <Button variant="secondary">Export</Button>
                  <Button iconLeft={<LuPlus />}>Add Patient</Button>
                </>
              }
            />
          </div>
        </Panel>
        <CodeBlock>{`<AppShell>\n  <AppHeader />\n  <PageContent>\n    <PageHeader title="Patients" description="…" actions={<Button>Add Patient</Button>} />\n    …\n  </PageContent>\n</AppShell>`}</CodeBlock>
      </DocSection>

      {/* ---------- Page banner ---------- */}
      <DocSection
        id="page-banner"
        title="Page banner"
        description="The soft green welcome banner under a page title: a short pitch on the left, portraits in arched frames on the right. The title and the main action stay in PageHeader; the banner is decoration and copy only."
        source="@/components/ui/page-banner"
      >
        <div className={styles.bannerDemo}>
          <PageBanner
            title="Exceptional care starts with great people."
            description="Manage your doctors, view their specialties and schedules, and keep the whole team in one place."
            visual={<ArchLineup photos={[portraits["Olivia Torres"], portraits["Dr. James Carter"], portraits["Noah Wilson"]]} />}
          />
        </div>
        <CodeBlock>{`<PageHeader title="Doctors" description="…" actions={<Button>Add Doctor</Button>} />\n<PageBanner title="…" description="…" visual={<ArchLineup photos={[…]} />} />`}</CodeBlock>
      </DocSection>

      {/* ---------- Split layout ---------- */}
      <DocSection
        id="split-layout"
        title="Split layout"
        description="A main column and a side column. Under 1100px of content width the side column drops below, and its cards flow into a grid. Pick the side width with side, or pass columns for a fixed ratio."
        source="@/components/layout/split-layout"
      >
        <Panel title="sm · md · lg" note="sm is 380px (calendars, summaries), md is 440px (record panels), lg is 460–540px (a detail view).">
          <SplitLayout aside={<div className={styles.splitBox}>Side</div>}>
            <div className={styles.splitBox}>Main</div>
          </SplitLayout>
        </Panel>
        <CodeBlock>{`<SplitLayout side="md" sideLabel="Patient summary" aside={<><HealthInfo /><Documents /></>}>\n  <ActivityTimeline … />\n</SplitLayout>`}</CodeBlock>
      </DocSection>

      {/* ---------- Notice ---------- */}
      <DocSection
        id="notice"
        title="Notice"
        description="Green confirmation for the result of an action. It dismisses itself after six seconds, or when closed. Keep the message in state and clear it in onDismiss."
        source="@/components/ui/notice"
      >
        <NoticeDemo />
        <CodeBlock>{`<Notice message={notice} onDismiss={() => setNotice(null)} />`}</CodeBlock>
      </DocSection>

      {/* ---------- List toolbar ---------- */}
      <DocSection
        id="list-toolbar"
        title="List toolbar"
        description="What sits around every searchable list: FilterBar (chips, search, filters), FilterPanel (the extra filters), ResultsFooter (count and pages) and NoResults (when nothing matches). Pass inset to FilterBar, FilterPanel and ResultsFooter when they sit inside a card."
        source="@/components/ui/filter-bar, results-footer, no-results"
      >
        <ListToolbarDemo />
        <CodeBlock>{`<FilterBar chips={<FilterChips … />}>\n  <SearchInput … />\n  <Button>Filters</Button>\n</FilterBar>\n<ResultsFooter firstIndex={0} shown={6} total={24} noun={["doctor", "doctors"]} page={1} totalPages={4} onPageChange={…} />`}</CodeBlock>
      </DocSection>

      {/* ---------- Info & action tiles ---------- */}
      <DocSection
        id="info-tiles"
        title="Info & action tiles"
        description="InfoTile is a compact figure or fact inside a card: use variant=metric for counts and variant=fact for a value under its label. ActionTile is a shortcut to a task, a link when it has an href. For a page-level KPI use StatTile."
        source="@/components/ui/info-tile, action-tile"
      >
        <Panel title="InfoTile">
          <InfoGrid>
            <InfoTile label="Total Doctors" value="14" icon={LuStethoscope} tone="primary" />
            <InfoTile label="Specialties" value="7" icon={LuHeart} tone="coral" />
            <InfoTile variant="fact" label="Blood Type" value="A+" icon={LuHeart} tone="coral" />
          </InfoGrid>
        </Panel>
        <Panel title="ActionTile" note="With a badge, the count replaces the arrow.">
          <ActionGrid>
            <ActionTile label="Instant Consult" icon={<LuVideo />} tone="success" badge={2} />
            <ActionTile label="Medical Records" icon={<LuFileText />} tone="amber" href="/medical-records" />
          </ActionGrid>
        </Panel>
        <CodeBlock>{`<InfoGrid columns={2}>\n  <InfoTile variant="fact" label="Blood Type" value="A+" icon={LuHeart} tone="coral" />\n</InfoGrid>\n<ActionGrid>\n  <ActionTile label="Messages" icon={<LuMessageSquare />} tone="blue" href="/messages" />\n</ActionGrid>`}</CodeBlock>
      </DocSection>

      {/* ---------- Detail list ---------- */}
      <DocSection
        id="detail-list"
        title="Detail list"
        description="Icon-led facts about one thing: when, how long, where, notes. An item with a title aligns to the top."
        source="@/components/ui/detail-list"
      >
        <Card>
          <DetailList>
            <DetailItem icon={LuCalendar}>Thursday, May 9, 2024</DetailItem>
            <DetailItem icon={LuClock}>1:30 PM – 2:30 PM (60 minutes)</DetailItem>
            <DetailItem icon={LuFileText} title="New Patient Consultation">
              Initial assessment and medical history review.
            </DetailItem>
          </DetailList>
        </Card>
        <CodeBlock>{`<DetailList>\n  <DetailItem icon={LuCalendar}>Thursday, May 9, 2024</DetailItem>\n  <DetailItem icon={LuFileText} title="Notes">…</DetailItem>\n</DetailList>`}</CodeBlock>
      </DocSection>
    </>
  );
}
