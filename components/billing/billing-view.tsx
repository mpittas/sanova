"use client";

import { useMemo, useState } from "react";
import { LuArrowDownToLine, LuArrowUpRight, LuCalendarDays, LuFileText, LuPlus, LuReceipt, LuWallet } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addDays, daysBetween, formatDate } from "@/components/appointments/dates";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "@/components/ui/modal";
import { Notice } from "@/components/ui/notice";
import { Person } from "@/components/ui/person";
import { ResultsFooter } from "@/components/ui/results-footer";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Table, Th } from "@/components/ui/table";
import { usePagination } from "@/lib/use-pagination";
import { InvoiceForm } from "./invoice-form";
import { BillingChart } from "./billing-chart";
import { BillingSummary } from "./billing-summary";
import { OverdueFollowUp } from "./overdue-follow-up";
import { money, seedInvoices, statusOf, type Invoice, type InvoiceStatus } from "./data";
import styles from "./billing.module.css";

const periods = ["Last 30 days", "Last 90 days", "All time"] as const;
type Period = (typeof periods)[number];
const statusOptions = ["All statuses", "Paid", "Unpaid", "Overdue", "Draft"] as const;
const payerOptions = ["All payers", "Patient", "Insurance"] as const;
const shortDate = (date: string) => formatDate(date, { month: "short", day: "numeric" });
const tones = { Paid: "success", Unpaid: "info", Overdue: "danger", Draft: "neutral" } as const;
const sum = (items: readonly Invoice[]) => items.reduce((total, invoice) => total + invoice.amount, 0);

function Status({ status }: { status: InvoiceStatus }) { return <Chip size="sm" variant="tag" tone={tones[status]}><span className={styles.statusDot} />{status}</Chip>; }

function exportInvoices(invoices: readonly Invoice[], filename = "sanova-invoices") {
  const rows = [["Invoice", "Patient", "Service", "Payer", "Issued", "Due", "Status", "Amount (USD)"], ...invoices.map((invoice) => [invoice.id, invoice.patient, invoice.service, invoice.payer, invoice.issued, invoice.due, statusOf(invoice), (invoice.amount / 100).toFixed(2)])];
  const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a"); link.href = url; link.download = `${filename}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function BillingView() {
  const [invoices, setInvoices] = useState(seedInvoices);
  const [period, setPeriod] = useState<Period>("Last 30 days");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All statuses");
  const [payer, setPayer] = useState<(typeof payerOptions)[number]>("All payers");
  const [newOpen, setNewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [notice, setNotice] = useState<string | null>(null);
  const start = period === "All time" ? invoices.reduce((date, invoice) => invoice.issued < date ? invoice.issued : date, TODAY) : addDays(TODAY, period === "Last 30 days" ? -29 : -89);
  const inPeriod = useMemo(() => invoices.filter((invoice) => invoice.issued >= start && invoice.issued <= TODAY), [invoices, start]);
  const billed = inPeriod.filter((invoice) => invoice.state !== "Draft");
  const paid = billed.filter((invoice) => invoice.state === "Paid");
  const unpaid = billed.filter((invoice) => invoice.state === "Unpaid");
  const overdue = unpaid.filter((invoice) => statusOf(invoice) === "Overdue").toSorted((a, b) => a.due.localeCompare(b.due));
  const totalBilled = sum(billed), totalPaid = sum(paid), totalUnpaid = sum(unpaid), totalOverdue = sum(overdue);
  // The same number of days just before this period, for the change on the billed total. All time has nothing before it.
  const previous = period === "All time" ? undefined : { cents: sum(invoices.filter((invoice) => invoice.state !== "Draft" && invoice.issued >= addDays(start, -(daysBetween(start, TODAY) + 1)) && invoice.issued < start)), label: `previous ${period === "Last 30 days" ? 30 : 90} days` };
  const filtered = useMemo(() => inPeriod.filter((invoice) => (status === "All statuses" || statusOf(invoice) === status) && (payer === "All payers" || invoice.payer === payer) && `${invoice.id} ${invoice.patient} ${invoice.service}`.toLowerCase().includes(query.trim().toLowerCase())).toSorted((a, b) => b.issued.localeCompare(a.issued)), [inPeriod, status, payer, query]);
  const pagination = usePagination(filtered, 6);
  const selected = invoices.find((invoice) => invoice.id === selectedId);
  const days = daysBetween(start, TODAY) + 1;
  const pointCount = Math.min(days, 15);
  const chartPoints = Array.from({ length: pointCount }, (_, index) => {
    const date = addDays(start, Math.floor(index * days / pointCount));
    const group = billed.filter((invoice) => Math.min(Math.floor(daysBetween(start, invoice.issued) * pointCount / days), pointCount - 1) === index);
    return { date, paid: sum(group.filter((invoice) => invoice.state === "Paid")), open: sum(group.filter((invoice) => invoice.state === "Unpaid")) };
  });
  const clearFilters = () => { setQuery(""); setStatus("All statuses"); setPayer("All payers"); pagination.reset(); };
  const createInvoice = (invoice: Omit<Invoice, "id">) => {
    const nextId = Math.max(1048, ...invoices.map((item) => Number(item.id.split("-")[1]))) + 1;
    const id = `INV-${nextId}`;
    setInvoices((current) => [{ ...invoice, id }, ...current]); clearFilters(); setSelectedId(id); setNotice(`${id} created for ${invoice.patient}.`);
  };
  return <div className={styles.page}>
    <PageHeader title="Billing" description="A clear picture of your clinic’s finances, down to the last invoice." actions={<><Button variant="secondary" iconLeft={<LuArrowDownToLine />} onClick={() => exportInvoices(filtered)}>Export CSV</Button><Button iconLeft={<LuPlus />} onClick={() => setNewOpen(true)}>Create invoice</Button></>} />
    <Notice message={notice} onDismiss={() => setNotice(null)} />
    <div className={styles.overviewHeading}><div><span className={styles.overviewIcon}><LuWallet /></span><h2>Financial overview</h2><span className={styles.currency}>USD</span></div><Select size="sm" aria-label="Billing period" options={periods} value={period} onChange={(value) => { setPeriod(value); pagination.reset(); }} /></div>
    <BillingSummary key={period} billed={{ cents: totalBilled, count: billed.length }} collected={{ cents: totalPaid, count: paid.length }} outstanding={{ cents: totalUnpaid, count: unpaid.length }} overdue={{ cents: totalOverdue, count: overdue.length, oldestDays: overdue[0] && daysBetween(overdue[0].due, TODAY) }} insurance={sum(billed.filter((invoice) => invoice.payer === "Insurance"))} previous={previous} />
    <div className={styles.insights}>
      <Card rounded className={styles.activity} title="Billing trend" description="Invoice value by issue date, split by whether it has been paid." action={<span className={styles.dateRange}><LuCalendarDays />{shortDate(start)} – {shortDate(TODAY)}</span>}>
        <div className={styles.legend}><span><i />Collected</span><span><i />Outstanding</span></div>
        <div className={styles.trendChart} role="group" aria-label={`Invoices by issue date: ${money(totalPaid)} collected and ${money(totalUnpaid)} outstanding.`}><BillingChart points={chartPoints} /></div>
      </Card>
      <OverdueFollowUp invoices={overdue} onOpen={setSelectedId} onReviewAll={() => { setStatus("Overdue"); setQuery(""); setPayer("All payers"); pagination.reset(); document.getElementById("billing-invoices")?.scrollIntoView({ block: "start" }); }} />
    </div>
    <Card rounded className={styles.invoiceCard} id="billing-invoices" title={<>Invoices <span className={styles.invoiceCount}>{inPeriod.length}</span></>} description="Every patient, payment, and piece of paperwork." action={<span className={styles.sampleBadge}>Sample data</span>}>
      <div className={styles.filters}><SearchInput label="Search invoices" placeholder="Search patient, invoice or service…" value={query} onChange={(event) => { setQuery(event.target.value); pagination.reset(); }} /><Select size="md" aria-label="Invoice status" value={status} options={statusOptions} onChange={(value) => { setStatus(value); pagination.reset(); }} /><Select size="md" aria-label="Invoice payer" value={payer} options={payerOptions} onChange={(value) => { setPayer(value); pagination.reset(); }} />{(query || status !== "All statuses" || payer !== "All payers") && <Button size="sm" variant="ghost" onClick={clearFilters}>Clear</Button>}</div>
      <Table variant="simple" className={styles.invoices} minWidth={760}><thead><tr><Th>Invoice</Th><Th>Patient</Th><Th>Service</Th><Th>Due date</Th><Th>Status</Th><Th>Amount</Th><Th className={styles.colMore}><span className="sr-only">Details</span></Th></tr></thead><tbody>{pagination.visible.map((invoice) => <tr key={invoice.id}><td><button className={styles.invoiceId} onClick={() => setSelectedId(invoice.id)}>{invoice.id}</button><span className="text-small text-muted">{shortDate(invoice.issued)}</span></td><td><Person name={invoice.patient} subtitle={invoice.payer} size={48} /></td><td><span className="text-label">{invoice.service}</span></td><td className="num">{shortDate(invoice.due)}</td><td><Status status={statusOf(invoice)} /></td><td className={`num ${styles.amount}`}>{money(invoice.amount)}</td><td className={styles.colMore}><button type="button" className={styles.openInvoice} aria-label={`View ${invoice.id}`} onClick={() => setSelectedId(invoice.id)}><LuArrowUpRight /></button></td></tr>)}</tbody></Table>
      {!filtered.length && <div className={styles.empty}><EmptyState icon={LuFileText} title="No matching invoices" description="Try another search or adjust the filters." action={<Button variant="secondary" size="sm" onClick={clearFilters}>Clear filters</Button>} /></div>}
      <div className={styles.tableFooter}><ResultsFooter firstIndex={pagination.firstIndex} shown={pagination.visible.length} total={pagination.total} noun={["invoice", "invoices"]} page={pagination.page} totalPages={pagination.totalPages} onPageChange={pagination.setPage} /></div>
    </Card>
    <InvoiceForm open={newOpen} onClose={() => setNewOpen(false)} onCreate={createInvoice} />
    <Modal open={Boolean(selected)} onClose={() => setSelectedId(undefined)} labelledBy="invoice-detail-title" width={520}>{selected && <ModalPanel><ModalHeader title={selected.id} titleId="invoice-detail-title" description="Patient invoice" onClose={() => setSelectedId(undefined)} /><ModalBody><div className={styles.invoicePreview}><div className={styles.receiptTop}><span><LuReceipt />Sanova Clinic</span><Status status={statusOf(selected)} /></div><div className={styles.billedTo}><Avatar name={selected.patient} size={44} /><div><small>Billed for</small><h3>{selected.patient}</h3></div></div><dl className={styles.receiptFacts}><div><dt>Issued</dt><dd>{shortDate(selected.issued)}</dd></div><div><dt>Due date</dt><dd>{shortDate(selected.due)}</dd></div><div><dt>Payer</dt><dd>{selected.payer}</dd></div></dl><div className={styles.receiptLine}><span>{selected.service}</span><strong>{money(selected.amount)}</strong></div><div className={styles.receiptTotal}><span>Total (USD)</span><strong>{money(selected.amount)}</strong></div><p className={styles.localNote}>Sample invoice. No payment is processed or sent.</p></div></ModalBody><ModalFooter><Button variant="secondary" iconLeft={<LuArrowDownToLine />} onClick={() => exportInvoices([selected], selected.id)}>Download CSV</Button>{selected.state === "Unpaid" && <Button onClick={() => { setInvoices((current) => current.map((invoice) => invoice.id === selected.id ? { ...invoice, state: "Paid" } : invoice)); setNotice(`Payment recorded for ${selected.id} in this sample workspace.`); }}>Mark as paid</Button>}{selected.state === "Draft" && <Button onClick={() => { setInvoices((current) => current.map((invoice) => invoice.id === selected.id ? { ...invoice, state: "Unpaid" } : invoice)); setNotice(`${selected.id} finalized in this sample workspace.`); }}>Finalize invoice</Button>}</ModalFooter></ModalPanel>}</Modal>
  </div>;
}
