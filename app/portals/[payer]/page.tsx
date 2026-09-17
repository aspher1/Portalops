import { notFound } from "next/navigation";
import { Building2, CheckCircle2, ClipboardList, Search, UserRound } from "lucide-react";

const payers = {
  atlas: { name: "Atlas Health Plan", color: "#155fa0", member: "AT-884102", status: "Approved", effective: "08/01/2026" },
  meridian: { name: "Meridian Choice", color: "#6941a5", member: "MC-271993", status: "In review", effective: "Pending" },
};

export default async function SyntheticPortal({ params }: { params: Promise<{ payer: string }> }) {
  const { payer } = await params;
  const data = payers[payer as keyof typeof payers];
  if (!data) notFound();
  return <main style={{ minHeight: "100vh", background: "#eef1f5", color: "#22313a" }}>
    <div style={{ background: "#fff1cc", borderBottom: "1px solid #e1ca8c", padding: "8px 20px", textAlign: "center", fontSize: 12, fontWeight: 700 }}>SYNTHETIC TRAINING PORTAL — no real patient or provider data</div>
    <header style={{ height: 70, background: data.color, color: "white", display: "flex", alignItems: "center", padding: "0 7%", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 19, fontWeight: 700 }}><Building2 />{data.name}</div>
      <div style={{ display: "flex", gap: 24, fontSize: 13 }}><span>Provider Services</span><span>Resources</span><span>Sign out</span></div>
    </header>
    <div style={{ maxWidth: 1060, margin: "30px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}><div><div style={{ fontSize: 24, fontWeight: 700 }}>Provider enrollment</div><div style={{ color: "#687780", marginTop: 6 }}>Search and manage your organization&apos;s enrollment records.</div></div><button className="button"><ClipboardList size={15} /> View tasks</button></div>
      <section className="card" style={{ padding: 20, marginBottom: 18 }}><label style={{ fontWeight: 700, fontSize: 12 }}>Search by enrollment reference</label><div style={{ display: "flex", gap: 8, marginTop: 9 }}><div style={{ border: "1px solid #cdd5da", borderRadius: 5, padding: "10px 12px", background: "white", flex: 1, color: "#53636d" }}>{data.member}</div><button className="button primary"><Search size={14} /> Search</button></div></section>
      <section className="card">
        <div style={{ padding: 20, borderBottom: "1px solid #e2e7ea", display: "flex", justifyContent: "space-between" }}><div style={{ display: "flex", gap: 12 }}><div className="feature-icon" style={{ margin: 0 }}><UserRound size={17} /></div><div><div style={{ fontWeight: 700 }}>Northstar Medical Group</div><div className="meta">NPI 1234567893 · Tax ID ••-•••4821</div></div></div><span className={`pill ${data.status === "Approved" ? "approved" : "pending"}`}><CheckCircle2 size={11} />{data.status}</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", padding: 22, gap: 20 }}><div><div className="eyebrow">Reference</div><div style={{ marginTop: 6, fontWeight: 700 }}>{data.member}</div></div><div><div className="eyebrow">Effective date</div><div style={{ marginTop: 6, fontWeight: 700 }}>{data.effective}</div></div><div><div className="eyebrow">Last updated</div><div style={{ marginTop: 6, fontWeight: 700 }}>09/17/2026</div></div><div><div className="eyebrow">Practice address</div><div style={{ marginTop: 6 }}>245 West Arbor St, Suite 200<br/>Cedar Falls, IA 50613</div></div><div><div className="eyebrow">Network</div><div style={{ marginTop: 6 }}>Commercial PPO</div></div></div>
      </section>
    </div>
  </main>;
}
