export default function AhteshamImpexDemo() {
  // ------------------------------
  // Basic site data (edit freely)
  // ------------------------------
  const site = {
    name: "Ahtesham Impex",
    tagline: "Your Trust is Our Responsibility",
    email: "sales@ahteshamimpex.com",
    phone: "+91-00000-00000",
    whatsapp: "+919999999999", // use full international format without + for wa.me link if needed
    address: "Mumbai, India",
    logoUrl:
      "https://placehold.co/200x60?text=Ahtesham+Impex+Logo" /* TODO: replace with your real logo URL (e.g., /assets/logo.png) */,
  };

  // ---------------------------------
  // Product catalog (sample content)
  // ---------------------------------
  const products = [
    {
      id: "red-split",
      name: "Red Split Lentils (Masoor Dal)",
      image:
        "https://images.unsplash.com/photo-1586201375754-1421e0aa2fda?auto=format&fit=crop&w=800&q=60", // TODO: replace with /assets/1-Lentils-Split-Red.jpg
      description:
        "Premium grade, machine-cleaned red split lentils. Moisture < 12%, max impurities < 0.5%.",
      origin: "India",
      packaging: "25/50 kg PP bags or as required",
      hsCode: "0713.40",
      moq: "1 x 20' FCL",
    },
    {
      id: "yellow-lentils",
      name: "Yellow Lentils",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=60",
      description:
        "Uniform size, double-polished, export quality yellow lentils.",
      origin: "India",
      packaging: "25/50 kg PP bags",
      hsCode: "0713.40",
      moq: "1 x 20' FCL",
    },
    {
      id: "brown-lentils",
      name: "Brown Whole Lentils",
      image:
        "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=60",
      description:
        "Whole brown lentils – machine cleaned, low admixture.",
      origin: "India",
      packaging: "25/50 kg PP bags",
      hsCode: "0713.40",
      moq: "1 x 20' FCL",
    },
    {
      id: "chickpeas",
      name: "Chickpeas (Kabuli / Desi)",
      image:
        "https://images.unsplash.com/photo-1615485737651-6e52611159af?auto=format&fit=crop&w=800&q=60",
      description:
        "High protein chickpeas suitable for hummus and snacks. Multiple calibers available.",
      origin: "India",
      packaging: "25/50 kg PP bags",
      hsCode: "0713.20",
      moq: "1 x 20' FCL",
    },
    {
      id: "green-split-peas",
      name: "Green Split Peas",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=60",
      description:
        "Vibrant green split peas, uniform sizing, perfect for soups and processing.",
      origin: "India",
      packaging: "25/50 kg PP bags",
      hsCode: "0713.10",
      moq: "1 x 20' FCL",
    },
  ];

  // ------------------------------
  // UI state
  // ------------------------------
  const [tab, setTab] = React.useState("home");
  const [lead, setLead] = React.useState({
    name: "",
    email: "",
    whatsapp: "",
    country: "",
    product: "",
    quantity: "",
    message: "",
  });

  // ------------------------------
  // Export Pricing Calculator state
  // ------------------------------
  const [calc, setCalc] = React.useState({
    basePricePerMT: "", // EXW/Base product cost
    localLogistics: "", // transport to port, handling
    exportFees: "", // docs, compliance, CHA, etc.
    oceanFreight: "",
    insurancePct: "0.5", // % of CIF typically
    marginPct: "5", // your profit %
    otherCosts: "", // fumigation, inspection etc.
  });

  const num = (v) => (v === "" || isNaN(Number(v)) ? 0 : Number(v));

  const fob =
    num(calc.basePricePerMT) +
    num(calc.localLogistics) +
    num(calc.exportFees) +
    num(calc.otherCosts);
  const cif = fob + num(calc.oceanFreight) + (num(calc.insurancePct) / 100) * (fob + num(calc.oceanFreight));
  const sell = cif * (1 + num(calc.marginPct) / 100);

  // ------------------------------
  // Global Pricing (manual FX input)
  // ------------------------------
  const [global, setGlobal] = React.useState({
    baseINR: "",
    inrToUSD: "83.00",
    usdToTarget: "1.00",
    targetCode: "USD",
  });
  const priceUSD = num(global.baseINR) / Math.max(num(global.inrToUSD), 0.0001);
  const priceTarget = priceUSD * Math.max(num(global.usdToTarget), 0.0001);

  // ------------------------------
  // HS Code Finder (very simple demo rules)
  // ------------------------------
  const [hsQuery, setHsQuery] = React.useState("");
  const hsLookup = (q) => {
    const s = q.toLowerCase();
    if (!s) return [];
    const out = [];
    if (/(lentil|masoor)/.test(s)) out.push({ name: "Lentils (dry)", code: "0713.40" });
    if (/(chickpea|kabuli|chana)/.test(s)) out.push({ name: "Chickpeas (dry)", code: "0713.20" });
    if (/(pea|split pea)/.test(s)) out.push({ name: "Peas (dry)", code: "0713.10" });
    if (/(kidney bean|rajma|bean)/.test(s)) out.push({ name: "Beans (kidney/others, dry)", code: "0713.33/39" });
    return out.length ? out : [{ name: "No direct match – check Chapter 07 'Leguminous vegetables'", code: "0713.x" }];
  };

  // ------------------------------
  // Invoice/Packing List (client-side)
  // ------------------------------
  const [inv, setInv] = React.useState({
    buyer: "",
    consignee: "",
    invoiceNo: "AIMX-2025-001",
    date: new Date().toISOString().slice(0, 10),
    portLoading: "",
    portDischarge: "",
    currency: "USD",
    items: [
      { description: "Red Split Lentils", hsCode: "0713.40", qty: 24, unit: "MT", unitPrice: 650, total: 15600 },
    ],
  });

  const invTotal = inv.items.reduce((s, it) => s + Number(it.total || 0), 0);

  function addItem() {
    setInv({ ...inv, items: [...inv.items, { description: "", hsCode: "", qty: 0, unit: "MT", unitPrice: 0, total: 0 }] });
  }

  function updateItem(i, key, val) {
    const arr = inv.items.map((it, idx) =>
      idx === i
        ? { ...it, [key]: val, total: key === "unitPrice" || key === "qty" ? Number(val || 0) * Number((idx === i ? (key === "qty" ? val : it.qty) : it.qty)) : it.total }
        : it
    );
    setInv({ ...inv, items: arr });
  }

  function generateInvoicePDF() {
    // light client-side PDF using jsPDF (CDN loaded below)
    if (!window.jspdf) {
      alert("PDF library not loaded yet. Wait a second and try again.");
      return;
    }
    const doc = new window.jspdf.jsPDF();
    const line = (y) => doc.line(10, y, 200, y);

    doc.setFontSize(14);
    doc.text(site.name + " – Commercial Invoice", 10, 15);
    doc.setFontSize(10);
    doc.text(`Invoice No: ${inv.invoiceNo}    Date: ${inv.date}`, 10, 22);
    doc.text(`Buyer: ${inv.buyer}`, 10, 28);
    doc.text(`Consignee: ${inv.consignee}`, 10, 34);
    doc.text(`Port of Loading: ${inv.portLoading}`, 10, 40);
    doc.text(`Port of Discharge: ${inv.portDischarge}`, 10, 46);
    line(50);

    let y = 56;
    doc.text("Description", 10, y);
    doc.text("HS Code", 90, y);
    doc.text("Qty", 130, y);
    doc.text("Unit", 145, y);
    doc.text("Unit Price", 160, y);
    doc.text("Total", 190, y, { align: "right" });
    line(58);
    y = 64;

    inv.items.forEach((it) => {
      doc.text(String(it.description || "-"), 10, y);
      doc.text(String(it.hsCode || "-"), 90, y);
      doc.text(String(it.qty || 0), 130, y);
      doc.text(String(it.unit || ""), 145, y);
      doc.text(String(it.unitPrice || 0), 160, y);
      doc.text(String(it.total || 0), 190, y, { align: "right" });
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    line(y + 2);
    doc.setFontSize(12);
    doc.text(`TOTAL (${inv.currency}): ${invTotal.toFixed(2)}`, 190, y + 10, { align: "right" });
    doc.save(inv.invoiceNo + ".pdf");
  }

  // ------------------------------
  // Lead submission (front-end only demo)
  // ------------------------------
  function mailtoLink() {
    const subject = encodeURIComponent("New Product Inquiry – " + (lead.product || "Agri Product"));
    const body = encodeURIComponent(
      `Name: ${lead.name}\nEmail: ${lead.email}\nWhatsApp: ${lead.whatsapp}\nCountry: ${lead.country}\nProduct: ${lead.product}\nQuantity: ${lead.quantity}\nMessage: ${lead.message}`
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  function whatsappLink() {
    const to = (site.whatsapp || "").replace(/\+/g, "");
    const text = encodeURIComponent(
      `New Inquiry%0AName: ${lead.name}%0AEmail: ${lead.email}%0AWhatsApp: ${lead.whatsapp}%0ACountry: ${lead.country}%0AProduct: ${lead.product}%0AQuantity: ${lead.quantity}%0AMessage: ${lead.message}`
    );
    return `https://wa.me/${to}?text=${text}`;
  }

  // ------------------------------
  // Components
  // ------------------------------
  const Nav = () => (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <img src={site.logoUrl} alt="logo" className="h-10 w-auto" />
        <div className="font-semibold text-lg">{site.name}</div>
        <div className="ml-auto flex gap-2 text-sm">
          {[
            ["home", "Home"],
            ["about", "About"],
            ["products", "Products"],
            ["tools", "Tools"],
            ["inquiry", "Inquiry"],
            ["contact", "Contact"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-2 rounded-full ${
                tab === key ? "bg-black text-white" : "hover:bg-neutral-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Section = ({ title, subtitle, children }) => (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle && <p className="text-neutral-600 mt-1">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );

  return (
    <div className="font-sans text-neutral-900">
      {/* jsPDF CDN for PDF generation */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <Nav />

      {tab === "home" && (
        <>
          <div className="relative">
            <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl font-extrabold leading-tight">
                  {site.tagline}
                </h1>
                <p className="mt-4 text-lg text-neutral-600">
                  Exporters of high‑quality pulses & grains. Reliable sourcing, strict QC, compliant documentation and on‑time shipments from India to the world.
                </p>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setTab("inquiry")} className="px-5 py-3 rounded-xl bg-black text-white">
                    Get a Quote
                  </button>
                  <button onClick={() => setTab("tools")} className="px-5 py-3 rounded-xl border">
                    Try Free Export Tools
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="rounded-2xl overflow-hidden shadow">
                    <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                    <div className="p-3 text-sm font-medium">{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Section title="Why Ahtesham Impex?">
            <div className="grid md:grid-cols-4 gap-4">
              {["Quality Assured", "Export Documentation", "Private Labelling", "On‑time Delivery"].map((t) => (
                <div key={t} className="p-5 rounded-2xl border">
                  <div className="font-semibold">{t}</div>
                  <div className="mt-1 text-sm text-neutral-600">Trusted partner for long‑term supply programs.</div>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {tab === "about" && (
        <Section title="About Us" subtitle="Building trustful global food supply chains">
          <div className="prose max-w-none">
            <p>
              {site.name} is an Indian exporter focused on pulses and staple foods. We work directly with processors and farmers, maintain rigorous quality controls, and deliver compliant export documentation.
            </p>
            <ul>
              <li>APEDA aligned processes</li>
              <li>Flexible packaging: 25/50 kg, custom private label</li>
              <li>Destination markets: Middle East, Africa, Asia</li>
            </ul>
          </div>
        </Section>
      )}

      {tab === "products" && (
        <Section title="Products" subtitle="Curated selection for bulk importers">
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="rounded-2xl overflow-hidden border hover:shadow-lg transition">
                <img src={p.image} alt={p.name} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-neutral-600 mt-1">{p.description}</div>
                  <div className="mt-2 text-sm">HS Code: <span className="font-mono">{p.hsCode}</span></div>
                  <div className="mt-1 text-sm">Packaging: {p.packaging}</div>
                  <div className="mt-1 text-sm">MOQ: {p.moq}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setTab("inquiry")} className="px-3 py-2 rounded-lg bg-black text-white text-sm">Request Quote</button>
                    <button onClick={() => setTab("tools")} className="px-3 py-2 rounded-lg border text-sm">Price Calculator</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {tab === "tools" && (
        <>
          <Section title="Export Pricing Calculator" subtitle="Compute FOB, CIF and your selling price (demo)">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl border">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["basePricePerMT", "Base Price (EXW) / MT"],
                    ["localLogistics", "Local Logistics / MT"],
                    ["exportFees", "Export Fees / MT"],
                    ["otherCosts", "Other Costs / MT"],
                    ["oceanFreight", "Ocean Freight / MT"],
                    ["insurancePct", "Insurance % of CIF"],
                    ["marginPct", "Your Margin %"],
                  ].map(([key, label]) => (
                    <label key={key} className="flex flex-col">
                      <span className="text-neutral-600">{label}</span>
                      <input
                        type="number"
                        step="0.01"
                        value={calc[key]}
                        onChange={(e) => setCalc({ ...calc, [key]: e.target.value })}
                        className="mt-1 px-3 py-2 rounded-lg border"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-2xl border bg-neutral-50">
                <div className="text-sm">FOB / MT</div>
                <div className="text-2xl font-bold">${fob.toFixed(2)}</div>
                <div className="mt-4 text-sm">CIF / MT</div>
                <div className="text-2xl font-bold">${cif.toFixed(2)}</div>
                <div className="mt-4 text-sm">Suggested Sell (CIF + Margin) / MT</div>
                <div className="text-2xl font-bold">${sell.toFixed(2)}</div>
                <div className="mt-4 text-xs text-neutral-600">* Demo only. Confirm with updated freight/insurance quotes.</div>
              </div>
            </div>
          </Section>

          <Section title="Global Pricing Calculator" subtitle="Convert INR cost to target currency (manual FX)">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl border grid grid-cols-2 gap-3 text-sm">
                <label className="flex flex-col">
                  <span className="text-neutral-600">Base Price (INR)</span>
                  <input type="number" value={global.baseINR} onChange={(e) => setGlobal({ ...global, baseINR: e.target.value })} className="mt-1 px-3 py-2 rounded-lg border" />
                </label>
                <label className="flex flex-col">
                  <span className="text-neutral-600">INR → USD rate</span>
                  <input type="number" step="0.0001" value={global.inrToUSD} onChange={(e) => setGlobal({ ...global, inrToUSD: e.target.value })} className="mt-1 px-3 py-2 rounded-lg border" />
                </label>
                <label className="flex flex-col">
                  <span className="text-neutral-600">USD → Target rate</span>
                  <input type="number" step="0.0001" value={global.usdToTarget} onChange={(e) => setGlobal({ ...global, usdToTarget: e.target.value })} className="mt-1 px-3 py-2 rounded-lg border" />
                </label>
                <label className="flex flex-col">
                  <span className="text-neutral-600">Target Currency Code</span>
                  <input type="text" value={global.targetCode} onChange={(e) => setGlobal({ ...global, targetCode: e.target.value.toUpperCase() })} className="mt-1 px-3 py-2 rounded-lg border" />
                </label>
              </div>
              <div className="p-4 rounded-2xl border bg-neutral-50">
                <div className="text-sm">Price in USD</div>
                <div className="text-2xl font-bold">${priceUSD.toFixed(2)}</div>
                <div className="mt-4 text-sm">Price in {global.targetCode}</div>
                <div className="text-2xl font-bold">{priceTarget.toFixed(2)} {global.targetCode}</div>
                <div className="mt-4 text-xs text-neutral-600">* Enter live FX from XE/Oanda for accuracy. API can be added later.</div>
              </div>
            </div>
          </Section>

          <Section title="HS Code Finder (Demo)" subtitle="Type your product name to get indicative HS codes">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                value={hsQuery}
                onChange={(e) => setHsQuery(e.target.value)}
                placeholder="e.g., Red split lentils, Kabuli chickpeas"
                className="px-4 py-3 rounded-xl border"
              />
              <div className="p-4 rounded-2xl border bg-neutral-50">
                {hsLookup(hsQuery).map((r, i) => (
                  <div key={i} className="py-2 flex items-center justify-between border-b last:border-b-0">
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-sm text-neutral-600">Indicative HS: <span className="font-mono">{r.code}</span></div>
                    </div>
                    <a
                      className="text-sm underline"
                      href="https://www.trade.gov/harmonized-system-hs-codes"
                      target="_blank"
                    >Verify</a>
                  </div>
                ))}
                <div className="mt-2 text-xs text-neutral-600">* Always verify with the importer/forwarder or customs broker.</div>
              </div>
            </div>
          </Section>

          <Section title="Commercial Invoice & Packing List (Demo)" subtitle="Fill details and export a simple invoice PDF">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl border space-y-3 text-sm">
                <label className="flex flex-col">
                  <span>Buyer</span>
                  <input className="mt-1 px-3 py-2 rounded-lg border" value={inv.buyer} onChange={(e) => setInv({ ...inv, buyer: e.target.value })} />
                </label>
                <label className="flex flex-col">
                  <span>Consignee</span>
                  <input className="mt-1 px-3 py-2 rounded-lg border" value={inv.consignee} onChange={(e) => setInv({ ...inv, consignee: e.target.value })} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col">
                    <span>Invoice No</span>
                    <input className="mt-1 px-3 py-2 rounded-lg border" value={inv.invoiceNo} onChange={(e) => setInv({ ...inv, invoiceNo: e.target.value })} />
                  </label>
                  <label className="flex flex-col">
                    <span>Date</span>
                    <input type="date" className="mt-1 px-3 py-2 rounded-lg border" value={inv.date} onChange={(e) => setInv({ ...inv, date: e.target.value })} />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col">
                    <span>Port of Loading</span>
                    <input className="mt-1 px-3 py-2 rounded-lg border" value={inv.portLoading} onChange={(e) => setInv({ ...inv, portLoading: e.target.value })} />
                  </label>
                  <label className="flex flex-col">
                    <span>Port of Discharge</span>
                    <input className="mt-1 px-3 py-2 rounded-lg border" value={inv.portDischarge} onChange={(e) => setInv({ ...inv, portDischarge: e.target.value })} />
                  </label>
                </div>
                <label className="flex flex-col">
                  <span>Currency</span>
                  <input className="mt-1 px-3 py-2 rounded-lg border" value={inv.currency} onChange={(e) => setInv({ ...inv, currency: e.target.value })} />
                </label>
                <div>
                  <div className="font-medium mb-2">Items</div>
                  <div className="space-y-2">
                    {inv.items.map((it, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        <input className="col-span-4 px-2 py-2 rounded border" placeholder="Description" value={it.description} onChange={(e) => updateItem(i, "description", e.target.value)} />
                        <input className="col-span-2 px-2 py-2 rounded border" placeholder="HS Code" value={it.hsCode} onChange={(e) => updateItem(i, "hsCode", e.target.value)} />
                        <input className="col-span-1 px-2 py-2 rounded border" type="number" placeholder="Qty" value={it.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} />
                        <input className="col-span-1 px-2 py-2 rounded border" placeholder="Unit" value={it.unit} onChange={(e) => updateItem(i, "unit", e.target.value)} />
                        <input className="col-span-2 px-2 py-2 rounded border" type="number" placeholder="Unit Price" value={it.unitPrice} onChange={(e) => updateItem(i, "unitPrice", e.target.value)} />
                        <div className="col-span-2 text-right font-medium">{it.total}</div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 text-sm px-3 py-1 rounded-full border" onClick={addItem}>+ Add Item</button>
                </div>
              </div>
              <div className="p-4 rounded-2xl border bg-neutral-50">
                <div className="text-sm">Grand Total ({inv.currency})</div>
                <div className="text-2xl font-bold">{invTotal.toFixed(2)}</div>
                <button onClick={generateInvoicePDF} className="mt-4 px-4 py-2 rounded-lg bg-black text-white">Download Invoice PDF</button>
                <div className="mt-3 text-xs text-neutral-600">* Demo PDF layout is simple. Your developer can style it as per your branding.</div>
              </div>
            </div>
          </Section>

          <Section title="Best Shipping Route (Demo)" subtitle="Open maps between two ports/cities">
            <ShippingDemo />
          </Section>
        </>
      )}

      {tab === "inquiry" && (
        <Section title="Product Inquiry" subtitle="Enter details – front‑end demo will open your email/WhatsApp with pre‑filled message">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl border grid grid-cols-2 gap-3 text-sm">
              {Object.entries({
                name: "Full Name",
                email: "Email",
                whatsapp: "WhatsApp Number",
                country: "Country",
                product: "Product Interested",
                quantity: "Quantity (MT)",
              }).map(([key, label]) => (
                <label key={key} className={`flex flex-col ${key === "message" ? "col-span-2" : ""}`}>
                  <span className="text-neutral-600">{label}</span>
                  <input
                    className="mt-1 px-3 py-2 rounded-lg border"
                    value={lead[key]}
                    onChange={(e) => setLead({ ...lead, [key]: e.target.value })}
                  />
                </label>
              ))}
              <label className="flex flex-col col-span-2">
                <span className="text-neutral-600">Message (optional)</span>
                <textarea className="mt-1 px-3 py-2 rounded-lg border" rows={4} value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} />
              </label>
            </div>
            <div className="p-4 rounded-2xl border bg-neutral-50 space-y-3">
              <a href={mailtoLink()} className="block text-center px-4 py-3 rounded-xl bg-black text-white">
                Send to Company Email
              </a>
              <a href={whatsappLink()} target="_blank" className="block text-center px-4 py-3 rounded-xl border">
                Send to WhatsApp
              </a>
              <div className="text-xs text-neutral-600">* For production, connect this form to a backend (email SMTP / Google Sheets / CRM). This demo uses mailto & WhatsApp links.</div>
            </div>
          </div>
        </Section>
      )}

      {tab === "contact" && (
        <Section title="Contact Us">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border">
              <div className="font-semibold">{site.name}</div>
              <div className="text-sm mt-1">{site.address}</div>
              <div className="text-sm mt-1">Email: {site.email}</div>
              <div className="text-sm mt-1">Phone: {site.phone}</div>
              <div className="mt-4">
                <button onClick={() => setTab("inquiry")} className="px-4 py-2 rounded-lg bg-black text-white">Request a Quote</button>
              </div>
            </div>
            <iframe
              title="map"
              className="w-full h-72 rounded-2xl border"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609921753!2d72.741099!3d19.082197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c630b2a5a199%3A0x8064b3cc8b1b1!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
              loading="lazy"
            ></iframe>
          </div>
        </Section>
      )}

      <footer className="border-t mt-10">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm flex flex-wrap gap-3 items-center">
          <div>© {new Date().getFullYear()} {site.name}</div>
          <div className="ml-auto">Made for demo – replace placeholders with your real content & assets.</div>
        </div>
      </footer>
    </div>
  );
}

function ShippingDemo() {
  const [o, setO] = React.useState("Nhava Sheva Port, India");
  const [d, setD] = React.useState("Jebel Ali Port, UAE");
  const maps = `https://www.google.com/maps?q=${encodeURIComponent(o)}+to+${encodeURIComponent(d)}&output=embed`;
  const gLink = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-4 rounded-2xl border grid grid-cols-2 gap-3 text-sm">
        <label className="flex flex-col">
          <span className="text-neutral-600">Origin Port/City</span>
          <input className="mt-1 px-3 py-2 rounded-lg border" value={o} onChange={(e) => setO(e.target.value)} />
        </label>
        <label className="flex flex-col">
          <span className="text-neutral-600">Destination Port/City</span>
          <input className="mt-1 px-3 py-2 rounded-lg border" value={d} onChange={(e) => setD(e.target.value)} />
        </label>
        <a href={gLink} target="_blank" className="col-span-2 mt-2 px-4 py-2 rounded-xl bg-black text-white text-center">Open in Google Maps</a>
        <div className="col-span-2 text-xs text-neutral-600">* For ocean freight ETA & schedules, integrate carrier/forwarder APIs later.</div>
      </div>
      <iframe title="route" className="w-full h-80 rounded-2xl border" src={maps}></iframe>
    </div>
  );
}
