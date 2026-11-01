(() => {
  const { createElement: h, useEffect, useMemo, useRef, useState } = React;
  const STORAGE_KEY = "freelanceflow-demo-v1";

  const initialData = {
    clients: [
      { id: 1, name: "Northstar Studio", email: "hello@northstar.studio", initials: "NS", color: "lavender", rate: 95, projects: 2, status: "Active" },
      { id: 2, name: "Olive & Oak", email: "team@oliveandoak.co", initials: "O", color: "mint", rate: 85, projects: 1, status: "Active" },
      { id: 3, name: "Monocle Creative", email: "chsuguna@gmail.com", initials: "MC", color: "peach", rate: 110, projects: 2, status: "Active" },
      { id: 4, name: "Sunday Supply", email: "work@sundaysupply.com", initials: "SS", color: "blue", rate: 90, projects: 1, status: "Active" },
      { id: 5, name: "Fieldwork Co.", email: "studio@fieldwork.co", initials: "F", color: "yellow", rate: 100, projects: 1, status: "Active" },
    ],
    projects: [
      { id: 1, name: "Brand refresh & strategy", client: "Northstar Studio", category: "Branding", status: "In progress", progress: 72, due: "Oct 24, 2026", budget: 6400, spent: 4480, color: "purple", initials: "N" },
      { id: 2, name: "E-commerce website", client: "Olive & Oak", category: "Development", status: "In progress", progress: 48, due: "Oct 29, 2026", budget: 8200, spent: 3940, color: "green", initials: "O" },
      { id: 3, name: "Autumn campaign assets", client: "Monocle Creative", category: "Design", status: "In progress", progress: 86, due: "Oct 18, 2026", budget: 3900, spent: 3150, color: "orange", initials: "M" },
      { id: 4, name: "Product photography", client: "Sunday Supply", category: "Photography", status: "In progress", progress: 34, due: "Nov 02, 2026", budget: 2800, spent: 1050, color: "blue", initials: "S" },
      { id: 5, name: "Spring lookbook", client: "Northstar Studio", category: "Design", status: "Review", progress: 92, due: "Oct 20, 2026", budget: 5200, spent: 4620, color: "purple", initials: "N" },
      { id: 6, name: "Website copywriting", client: "Fieldwork Co.", category: "Writing", status: "Completed", progress: 100, due: "Oct 08, 2026", budget: 2400, spent: 2300, color: "yellow", initials: "F" },
    ],
    invoices: [
      { id: "INV-2026-014", client: "Northstar Studio", date: "Oct 10, 2026", due: "Oct 24, 2026", amount: 2850, status: "Paid" },
      { id: "INV-2026-013", client: "Monocle Creative", date: "Oct 08, 2026", due: "Oct 22, 2026", amount: 1920, status: "Pending" },
      { id: "INV-2026-012", client: "Olive & Oak", date: "Oct 02, 2026", due: "Oct 16, 2026", amount: 3640, status: "Overdue" },
      { id: "INV-2026-011", client: "Sunday Supply", date: "Sep 28, 2026", due: "Oct 12, 2026", amount: 1580, status: "Paid" },
    ],
    logs: [
      { id: 1, project: "Brand refresh & strategy", client: "Northstar Studio", date: "Today, 10:24 AM", dateISO: "2026-10-12", hours: 2.5, note: "Logo exploration & concepts", billable: true },
      { id: 2, project: "E-commerce website", client: "Olive & Oak", date: "Today, 9:15 AM", dateISO: "2026-10-12", hours: 1.75, note: "Product page wireframes", billable: true },
      { id: 3, project: "Autumn campaign assets", client: "Monocle Creative", date: "Yesterday", dateISO: "2026-10-11", hours: 3, note: "Social media asset exports", billable: true },
      { id: 4, project: "Brand refresh & strategy", client: "Northstar Studio", date: "Yesterday", dateISO: "2026-10-11", hours: 2, note: "Client feedback revisions", billable: true },
      { id: 5, project: "Product photography", client: "Sunday Supply", date: "Oct 9, 2026", dateISO: "2026-10-09", hours: 4, note: "Studio shoot — setup & selects", billable: true },
    ],
  };

  const menu = [
    { label: "Overview", icon: "grid" },
    { label: "Projects", icon: "layers", count: "8" },
    { label: "Clients", icon: "users" },
    { label: "Time tracking", icon: "clock" },
    { label: "Invoices", icon: "receipt", count: "3" },
  ];

  const iconPaths = {
    grid: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
    layers: ["m12 3 9 5-9 5-9-5 9-5Z", "m3 12 9 5 9-5", "m3 16 9 5 9-5"],
    users: ["M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M20 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
    clock: ["M12 8v4l3 2", "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"],
    receipt: ["M4 2v20l2-1.5L8 22l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5V2l-2 1.5L16 2l-2 1.5L12 2l-2 1.5L8 2 6 3.5 4 2Z", "M8 9h8", "M8 13h6"],
    search: ["m21 21-4.34-4.34", "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"],
    plus: ["M12 5v14", "M5 12h14"],
    arrow: ["M5 12h14", "m12 5 7 7-7 7"],
    down: ["m7 10 5 5 5-5"],
    bell: ["M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9", "M10 21h4"],
    more: ["M12 5h.01", "M12 12h.01", "M12 19h.01"],
    check: ["m5 12 4 4L19 6"],
    calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"],
    play: ["m8 5 12 7-12 7V5Z"],
    pause: ["M8 5h3v14H8z", "M15 5h3v14h-3z"],
    download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "m7 10 5 5 5-5", "M12 15V3"],
    close: ["M18 6 6 18", "m6 6 12 12"],
    sparkles: ["m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z", "m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z"],
    trend: ["m3 17 6-6 4 4 8-8", "M15 7h6v6"],
  };

  function Icon({ name, size = 18, className = "" }) {
    return h("svg", { className: `icon ${className}`, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true },
      (iconPaths[name] || []).map((d, i) => h("path", { d, key: i })));
  }

  function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  }

  function preciseMoney(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  function readLegacyData() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !saved.clients || !saved.projects) return null;
      return {
        ...saved,
        clients: saved.clients.map((client) =>
          client.name === "Monocle Creative" && client.email === "sam@monoclecreative.com"
            ? { ...client, email: "chsuguna@gmail.com" }
            : client),
        logs: (saved.logs || []).map((log) => ({
          ...log,
          dateISO: log.dateISO || "2026-10-12",
          billed: Boolean(log.billed || log.invoiceId),
        })),
        invoices: saved.invoices || [],
      };
    } catch (error) {
      console.warn("FreelanceFlow browser data could not be migrated to the backend.", error);
      return null;
    }
  }

  function TimerButton({ runningSince, onClick }) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
      if (!runningSince) return undefined;
      const interval = window.setInterval(() => setNow(Date.now()), 1000);
      return () => window.clearInterval(interval);
    }, [runningSince]);

    const seconds = runningSince ? Math.max(0, Math.floor((now - runningSince) / 1000)) : 0;
    const label = `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    return h("button", { className: `timer-button ${runningSince ? "timer-running" : ""}`, onClick },
      h("span", { className: "timer-status-dot" }),
      runningSince ? label : "Start timer",
      h(Icon, { name: runningSince ? "pause" : "play", size: 15 }));
  }

  function App() {
    const invitationEmail = new URLSearchParams(window.location.search).get("client") || "";
    const [data, setData] = useState(initialData);
    const [dataReady, setDataReady] = useState(false);
    const [apiError, setApiError] = useState("");
    const saveQueue = useRef(Promise.resolve());
    const [page, setPage] = useState("Overview");
    const [query, setQuery] = useState("");
    const [modal, setModal] = useState("");
    const [toast, setToast] = useState("");
    const [isSignedIn, setIsSignedIn] = useState(() => {
      if (invitationEmail) return false;
      try {
        return localStorage.getItem(`${STORAGE_KEY}-auth`) === "true";
      } catch (error) {
        return false;
      }
    });
    const [signInEmail, setSignInEmail] = useState(invitationEmail || "alex@freelanceflow.io");
    const [signInPassword, setSignInPassword] = useState("password123");
    const [accountType, setAccountType] = useState(invitationEmail ? "client" : "freelancer");
    const [signedInClientEmail, setSignedInClientEmail] = useState(() => {
      if (invitationEmail) return "";
      try {
        return localStorage.getItem(`${STORAGE_KEY}-client`) || "";
      } catch (error) {
        return "";
      }
    });
    const [runningSince, setRunningSince] = useState(() => Number(localStorage.getItem(`${STORAGE_KEY}-timer`)) || 0);
    const [chartRange, setChartRange] = useState("This year");
    const [projectFilter, setProjectFilter] = useState("All projects");
    const [formName, setFormName] = useState("");
    const [formClient, setFormClient] = useState("");
    const [formBudget, setFormBudget] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formRate, setFormRate] = useState("");
    const [formNote, setFormNote] = useState("");
    const [invoiceStart, setInvoiceStart] = useState("2026-10-01");
    const [invoiceEnd, setInvoiceEnd] = useState("2026-10-12");

    useEffect(() => {
      let active = true;
      fetch("/api/workspace")
        .then(async (response) => {
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Could not load workspace data.");
          return result;
        })
        .then((result) => {
          if (!active) return;
          if (result.data) {
            const loaded = {
              ...result.data,
              clients: (result.data.clients || []).map((client) =>
                client.name === "Monocle Creative" && client.email === "sam@monoclecreative.com"
                  ? { ...client, email: "chsuguna@gmail.com" }
                  : client),
              logs: (result.data.logs || []).map((log) => ({
                ...log,
                dateISO: log.dateISO || "2026-10-12",
                billed: Boolean(log.billed || log.invoiceId),
              })),
            };
            setData(loaded);
          } else {
            setData(readLegacyData() || initialData);
          }
          setDataReady(true);
          setApiError("");
        })
        .catch((error) => {
          console.error("FreelanceFlow could not load workspace data from the backend.", error);
          if (active) setApiError("Backend unavailable. Workspace changes are not being saved.");
        });
      return () => { active = false; };
    }, []);

    useEffect(() => {
      if (!dataReady) return;
      saveQueue.current = saveQueue.current
        .then(async () => {
          const response = await fetch("/api/workspace", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Could not save workspace data.");
          setApiError("");
        })
        .catch((error) => {
          console.error("FreelanceFlow could not save workspace data to the backend.", error);
          setApiError("Backend unavailable. Workspace changes are not being saved.");
        });
    }, [data, dataReady]);

    useEffect(() => {
      try {
        localStorage.setItem(`${STORAGE_KEY}-auth`, String(isSignedIn));
      } catch (error) {
        console.warn("FreelanceFlow sign-in state could not be saved.", error);
      }
    }, [isSignedIn]);

    useEffect(() => {
      try {
        if (signedInClientEmail) {
          localStorage.setItem(`${STORAGE_KEY}-client`, signedInClientEmail);
        } else {
          localStorage.removeItem(`${STORAGE_KEY}-client`);
        }
      } catch (error) {
        console.warn("FreelanceFlow client sign-in state could not be saved.", error);
      }
    }, [signedInClientEmail]);

    useEffect(() => {
      if (!toast) return undefined;
      const timeout = window.setTimeout(() => setToast(""), 2800);
      return () => window.clearTimeout(timeout);
    }, [toast]);

    const activeProjects = data.projects.filter((item) => item.status !== "Completed");
    const outstandingInvoices = data.invoices.filter((invoice) => invoice.status !== "Paid");
    const outstandingTotal = outstandingInvoices.reduce((total, invoice) => total + invoice.amount, 0);
    const invoiceClient = data.clients.find((client) => client.name === formClient);
    const billableInvoiceLogs = modal === "invoice" ? data.logs.filter((log) =>
      log.client === formClient &&
      log.billable &&
      !log.billed &&
      !log.invoiceId &&
      log.dateISO >= invoiceStart &&
      log.dateISO <= invoiceEnd) : [];
    const invoiceTotal = billableInvoiceLogs.reduce((total, log) => total + log.hours * (invoiceClient?.rate || 0), 0);
    const filteredProjects = useMemo(() => data.projects.filter((item) => {
      const matchesQuery = `${item.name} ${item.client} ${item.category}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = projectFilter === "All projects" || item.status === projectFilter;
      return matchesQuery && matchesFilter;
    }), [data.projects, query, projectFilter]);

    function notify(message) {
      setToast(message);
    }

    function handleSignIn(event) {
      event.preventDefault();
      if (accountType === "client") {
        const client = data.clients.find((item) => item.email.toLowerCase() === signInEmail.trim().toLowerCase());
        if (!client) {
          notify("We couldn't find a client account with that email");
          return;
        }
        setSignedInClientEmail(client.email);
        setIsSignedIn(true);
        const portalUrl = new URL(window.location.href);
        portalUrl.searchParams.delete("client");
        window.history.replaceState({}, "", portalUrl.toString());
        notify(`Welcome to your project portal, ${client.name}`);
        return;
      }
      if (!signInEmail.trim() || !signInPassword.trim()) {
        notify("Enter your email and password to continue");
        return;
      }
      setSignedInClientEmail("");
      setIsSignedIn(true);
      notify("Welcome back — welcome to your workspace");
    }

    function signOut() {
      setIsSignedIn(false);
      setSignedInClientEmail("");
      notify("Signed out successfully");
    }

    function changeTimer() {
      if (runningSince) {
        const hours = Math.max(0.1, Math.round(((Date.now() - runningSince) / 3600000) * 10) / 10);
        setData((previous) => ({
          ...previous,
          logs: [{ id: Date.now(), project: "Brand refresh & strategy", client: "Northstar Studio", date: "Just now", dateISO: new Date().toISOString().slice(0, 10), hours, note: "Tracked with the timer", billable: true, billed: false }, ...previous.logs],
        }));
        setRunningSince(0);
        localStorage.removeItem(`${STORAGE_KEY}-timer`);
        notify(`${hours.toFixed(1)} hours added to your time log`);
      } else {
        const start = Date.now();
        setRunningSince(start);
        localStorage.setItem(`${STORAGE_KEY}-timer`, String(start));
        notify("Timer started — it will keep running as you navigate");
      }
    }

    function openModal(type) {
      setFormName("");
      setFormClient(data.clients[0]?.name || "");
      setFormBudget("");
      setFormEmail("");
      setFormRate("");
      setFormNote("");
      const today = new Date();
      const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      setInvoiceStart(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`);
      setInvoiceEnd(todayISO);
      setModal(type);
    }

    function submitModal(event) {
      event.preventDefault();
      if (modal === "project") {
        if (data.clients.length === 0) {
          notify("Add a client before creating a project");
          setModal("");
          return;
        }
        const clientName = formClient || data.clients[0].name;
        setData((previous) => ({
          ...previous,
          projects: [{ id: Date.now(), name: formName.trim(), client: clientName, category: "New project", status: "In progress", progress: 0, due: "No due date", budget: Number(formBudget) || 0, spent: 0, color: "purple", initials: initials(clientName) }, ...previous.projects],
        }));
        setPage("Projects");
        notify("Your project has been created");
      } else if (modal === "client") {
        setData((previous) => ({
          ...previous,
          clients: [{ id: Date.now(), name: formName.trim(), email: formEmail.trim(), initials: initials(formName), color: "lavender", rate: Number(formRate) || 0, projects: 0, status: "Active" }, ...previous.clients],
        }));
        setPage("Clients");
        notify("Client added to your workspace");
      } else if (modal === "invoice") {
        const selectedClient = data.clients.find((client) => client.name === formClient);
        const selectedLogs = data.logs.filter((log) =>
          log.client === formClient &&
          log.billable &&
          !log.billed &&
          !log.invoiceId &&
          log.dateISO >= invoiceStart &&
          log.dateISO <= invoiceEnd);
        if (!selectedClient || selectedClient.rate <= 0) {
          notify("Add an hourly rate to this client before creating an invoice");
          return;
        }
        if (selectedLogs.length === 0) {
          notify("There are no unbilled hours for this client in the selected date range");
          return;
        }
        if (!Number.isFinite(invoiceTotal) || invoiceTotal <= 0) {
          notify("The invoice total must be greater than zero");
          return;
        }
        const sequence = data.invoices.reduce((highest, invoice) => {
          const match = invoice.id.match(/(\d+)$/);
          return match ? Math.max(highest, Number(match[1])) : highest;
        }, 0) + 1;
        const id = `INV-${new Date(`${invoiceEnd}T12:00:00`).getFullYear()}-${String(sequence).padStart(3, "0")}`;
        const issued = new Date();
        const dueDate = new Date(issued);
        dueDate.setDate(dueDate.getDate() + 14);
        const formatDate = (date) => date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        const invoice = {
          id,
          client: selectedClient.name,
          date: formatDate(issued),
          due: formatDate(dueDate),
          amount: invoiceTotal,
          status: "Pending",
          rangeStart: invoiceStart,
          rangeEnd: invoiceEnd,
          hours: selectedLogs.reduce((total, log) => total + log.hours, 0),
          hourlyRate: selectedClient.rate,
          lineItems: selectedLogs.map((log) => ({
            project: log.project,
            description: log.note,
            date: log.dateISO,
            hours: log.hours,
            rate: selectedClient.rate,
            amount: log.hours * selectedClient.rate,
          })),
          billedLogIds: selectedLogs.map((log) => log.id),
        };
        setData((previous) => ({
          ...previous,
          logs: previous.logs.map((log) => invoice.billedLogIds.includes(log.id) ? { ...log, billed: true, invoiceId: id } : log),
          invoices: [invoice, ...previous.invoices],
        }));
        setPage("Invoices");
        notify(`${id} created for ${money(invoiceTotal)} — billed hours are locked to this invoice`);
      } else if (modal === "time") {
        const project = data.projects.find((item) => item.name === formClient) || data.projects[0];
        if (project) {
          setData((previous) => ({
            ...previous,
            logs: [{ id: Date.now(), project: project.name, client: project.client, date: "Just now", dateISO: new Date().toISOString().slice(0, 10), hours: Number(formBudget) || 0, note: formNote.trim() || "Manual time entry", billable: true, billed: false }, ...previous.logs],
          }));
          notify("Time entry added");
        }
      }
      setModal("");
    }

    function loadSampleData() {
      setData(initialData);
      setRunningSince(0);
      localStorage.removeItem(`${STORAGE_KEY}-timer`);
      setQuery("");
      setPage("Overview");
      notify("Sample workspace data restored");
    }

    function downloadInvoice(invoice) {
      const escapePdfText = (text) => text
        .replace(/[^\x20-\x7E]/g, "?")
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");
      const lines = [
        { text: "FREELANCEFLOW", size: 22, gap: 34 },
        { text: "INVOICE", size: 14, gap: 29 },
        { text: `Invoice: ${invoice.id}`, size: 11, gap: 21 },
        { text: `Client: ${invoice.client}`, size: 11, gap: 21 },
        { text: `Date issued: ${invoice.date}`, size: 11, gap: 21 },
        { text: `Due date: ${invoice.due}`, size: 11, gap: 25 },
      ];
      if (invoice.rangeStart && invoice.rangeEnd) {
        lines.push({ text: `Service period: ${invoice.rangeStart} to ${invoice.rangeEnd}`, size: 10, gap: 23 });
      }
      if (invoice.lineItems?.length) {
        lines.push({ text: "WORK COMPLETED", size: 12, gap: 24 });
        invoice.lineItems.slice(0, 32).forEach((item) => {
          lines.push({
            text: `${item.project}: ${item.description} | ${item.hours.toFixed(2)} hrs x ${preciseMoney(item.rate)} = ${preciseMoney(item.amount)}`,
            size: 9,
            gap: 16,
          });
        });
      }
      lines.push(
        { text: `Amount due: ${preciseMoney(invoice.amount)}`, size: 15, gap: 30 },
        { text: "Thank you for working together.", size: 10, gap: 20 },
      );
      let y = 740;
      const content = lines.map((line) => {
        const lineContent = `BT /F1 ${line.size} Tf 50 ${y} Td (${escapePdfText(line.text)}) Tj ET`;
        y -= line.gap;
        return lineContent;
      }).join("\n");
      const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
      ];
      let pdf = "%PDF-1.4\n";
      const offsets = [0];
      objects.forEach((object, index) => {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
      });
      const xrefOffset = pdf.length;
      pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
      offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
      });
      pdf += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
      link.download = `${invoice.id}.pdf`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      notify("PDF invoice downloaded");
    }

    function Sidebar() {
      return h("aside", { className: "sidebar" },
        h("a", { className: "brand", href: "#overview", onClick: (event) => { event.preventDefault(); setPage("Overview"); } },
          h("span", { className: "brand-mark" }, h("span"), h("span"), h("span"), h("span")),
          h("span", { className: "brand-name" }, "freelance", h("strong", null, "flow"), h("span", { className: "brand-period" }, "."))),
        h("div", { className: "workspace-switch" },
          h("div", { className: "workspace-avatar" }, "S"),
          h("div", { className: "workspace-copy" }, h("strong", null, "Studio workspace"), h("span", null, "Free plan")),
          h(Icon, { name: "down", size: 15, className: "muted-icon" })),
        h("div", { className: "nav-label" }, "WORKSPACE"),
        h("nav", { className: "nav-list", "aria-label": "Main navigation" },
          menu.map((item) => h("button", { key: item.label, className: `nav-item ${page === item.label ? "selected" : ""}`, onClick: () => setPage(item.label) },
            h(Icon, { name: item.icon, size: 18 }),
            h("span", null, item.label),
            item.label === "Projects" ? h("span", { className: "nav-count" }, data.projects.length) : item.label === "Invoices" ? h("span", { className: "nav-count" }, data.invoices.filter((invoice) => invoice.status !== "Paid").length) : null))),
        h("div", { className: "sidebar-spacer" }),
        h("div", { className: "upgrade-card" },
          h("div", { className: "upgrade-icon" }, h(Icon, { name: "sparkles", size: 17 })),
          h("strong", null, "Make room for more"),
          h("p", null, "Upgrade to Pro for unlimited clients and invoicing."),
          h("button", { className: "upgrade-button", onClick: () => notify("Pro plan preview — billing will be available soon") }, "Explore Pro", h(Icon, { name: "arrow", size: 15 }))),
        h("button", { className: "profile-row", onClick: signOut },
          h("div", { className: "profile-avatar" }, "A"),
          h("div", { className: "profile-copy" }, h("strong", null, "Alex Morgan"), h("span", null, "Freelance designer")),
          h(Icon, { name: "more", size: 18, className: "muted-icon" })));
    }

    function SignInPage() {
      return h("div", { className: "auth-shell" },
        h("div", { className: "auth-glow auth-glow-one" }),
        h("div", { className: "auth-glow auth-glow-two" }),
        h("div", { className: "auth-card" },
          h("div", { className: "auth-brand" },
            h("span", { className: "brand-mark" }, h("span"), h("span"), h("span"), h("span")),
            h("span", { className: "auth-brand-name" }, "freelance", h("strong", null, "flow"), ".")),
          h("div", { className: "auth-copy" },
            h("p", { className: "eyebrow auth-eyebrow" }, accountType === "client" ? "CLIENT PORTAL" : "WELCOME BACK"),
            h("h1", null, accountType === "client" ? "View your projects" : "Sign in to your studio"),
            h("p", null, accountType === "client" ? "Check project progress and invoices shared with you." : "Keep projects, clients, and invoicing moving without losing momentum.")),
          h("div", { className: "auth-tabs", role: "tablist", "aria-label": "Sign in as" },
            h("button", { type: "button", role: "tab", "aria-selected": accountType === "freelancer", className: accountType === "freelancer" ? "active-auth-tab" : "", onClick: () => setAccountType("freelancer") }, "Freelancer"),
            h("button", { type: "button", role: "tab", "aria-selected": accountType === "client", className: accountType === "client" ? "active-auth-tab" : "", onClick: () => setAccountType("client") }, "Client")),
          h("form", { className: "auth-form", onSubmit: handleSignIn },
            h("label", { className: "auth-field" },
              h("span", null, "Email"),
              h("input", { type: "email", required: true, value: signInEmail, onChange: (event) => setSignInEmail(event.target.value), placeholder: accountType === "client" ? "hello@northstar.studio" : "you@example.com", autoComplete: "email" })),
            accountType === "freelancer" ? h(React.Fragment, null,
              h("label", { className: "auth-field" },
                h("span", null, "Password"),
                h("input", { type: "password", required: true, value: signInPassword, onChange: (event) => setSignInPassword(event.target.value), placeholder: "••••••••", autoComplete: "current-password" })),
              h("div", { className: "auth-row" },
                h("label", { className: "auth-remember" }, h("input", { type: "checkbox", defaultChecked: true }), "Remember me"),
                h("button", { type: "button", className: "text-button", onClick: () => notify("Password reset is coming soon") }, "Forgot password?")))
              : h("p", { className: "auth-client-hint" }, "Demo portal access: use a client email, such as hello@northstar.studio."),
            h("button", { type: "submit", className: "button button-primary auth-submit" }, accountType === "client" ? "Continue to portal" : "Sign in"),
            accountType === "freelancer" ? h("button", { type: "button", className: "button button-light auth-demo", onClick: () => { setSignInEmail("alex@freelanceflow.io"); setSignInPassword("password123"); setSignedInClientEmail(""); setIsSignedIn(true); notify("Demo account loaded"); } }, "Use demo account") : null),
          h("p", { className: "auth-meta" }, "Need a new workspace? ", h("button", { type: "button", className: "text-button", onClick: () => notify("Workspace setup is coming soon") }, "Book a demo"))));
    }

    function ClientPortal({ client }) {
      const clientProjects = data.projects.filter((project) => project.client === client.name);
      const clientInvoices = data.invoices.filter((invoice) => invoice.client === client.name);
      const activeClientProjects = clientProjects.filter((project) => project.status !== "Completed");
      const unpaidClientInvoices = clientInvoices.filter((invoice) => invoice.status !== "Paid");
      const clientInvoiceBalance = unpaidClientInvoices.reduce((total, invoice) => total + invoice.amount, 0);

      function projectCards(projects) {
        return projects.length
          ? h("div", { className: "entity-project-grid" }, projects.map((project) => h("article", { className: "project-card portal-project-card", key: project.id },
            h("div", { className: "project-card-top" }, h("div", null, h("h3", null, project.name), h("span", { className: "client-name" }, project.category))),
            h("div", { className: "project-meta" }, h("span", { className: "category-pill" }, project.category), h("span", { className: `status-pill ${project.status === "Completed" ? "status-complete" : project.status === "Review" ? "status-review" : "status-active"}` }, h("i"), project.status)),
            h("div", { className: "progress-heading" }, h("span", null, "Project progress"), h("strong", null, `${project.progress}%`)),
            h("div", { className: "progress-track" }, h("span", { style: { width: `${project.progress}%` } })),
            h("span", { className: "due-date" }, h(Icon, { name: "calendar", size: 14 }), project.due))))
          : h("div", { className: "panel empty-panel" }, "No projects have been shared with you yet.");
      }

      function invoiceTable(invoices) {
        return invoices.length
          ? h("div", { className: "panel table-panel" }, h("div", { className: "table-scroll" }, h("table", null,
            h("thead", null, h("tr", null, ["Invoice", "Date issued", "Due date", "Amount", "Status"].map((label) => h("th", { key: label }, label)))),
            h("tbody", null, invoices.map((invoice) => h("tr", { key: invoice.id },
              h("td", { className: "invoice-id" }, invoice.id), h("td", null, invoice.date), h("td", null, invoice.due), h("td", { className: "amount-cell" }, money(invoice.amount)),
              h("td", null, h("span", { className: `status-pill invoice-status ${invoice.status.toLowerCase()}` }, h("i"), invoice.status))))))))
          : h("div", { className: "panel empty-panel" }, "No invoices have been shared with you yet.");
      }

      function clientOverview() {
        return h(React.Fragment, null,
          h("section", { className: "welcome-row" },
            h("div", null, h("div", { className: "eyebrow" }, "YOUR CLIENT WORKSPACE"), h("h1", null, `Welcome, ${client.name}`), h("p", null, "A clear view of your projects and invoices."))),
          h("section", { className: "stats-grid", "aria-label": "Your project overview" },
            StatCard({ label: "Your projects", value: String(clientProjects.length).padStart(2, "0"), change: `${activeClientProjects.length} active`, icon: "layers", tone: "tone-purple", footer: "Projects shared with you" }),
            StatCard({ label: "In progress", value: String(activeClientProjects.length).padStart(2, "0"), change: `${clientProjects.filter((project) => project.status === "Review").length} in review`, icon: "clock", tone: "tone-blue", footer: "Active and in review" }),
            StatCard({ label: "Your invoices", value: String(clientInvoices.length).padStart(2, "0"), change: `${unpaidClientInvoices.length} unpaid`, icon: "receipt", tone: "tone-orange", footer: "Invoices shared with you" }),
            StatCard({ label: "Amount due", value: money(clientInvoiceBalance), change: unpaidClientInvoices.length ? "Awaiting payment" : "All settled", icon: "check", tone: "tone-green", footer: "Your outstanding balance" })),
          h("section", { className: "dashboard-grid client-dashboard-grid" },
            h("article", { className: "panel revenue-panel client-progress-panel" },
              h("div", { className: "panel-heading" }, h("div", null, h("h2", null, "Project overview"), h("p", null, "Progress on the work we're doing together.")),
                h("button", { className: "text-button", onClick: () => setPage("Projects") }, "All projects", h(Icon, { name: "arrow", size: 14 }))),
              clientProjects.length ? h("div", { className: "client-dashboard-projects" }, clientProjects.slice(0, 3).map((project) =>
                h("div", { className: "client-dashboard-project", key: project.id },
                  h("div", { className: "progress-heading" }, h("span", null, project.name), h("strong", null, `${project.progress}%`)),
                  h("div", { className: "progress-track" }, h("span", { style: { width: `${project.progress}%` } })),
                  h("div", { className: "client-project-meta" }, h("span", null, project.category), h("span", null, project.status))))
                ) : h("div", { className: "empty-state" }, "No projects have been shared with you yet.")),
            h("article", { className: "panel focus-panel" },
              h("div", { className: "panel-heading" }, h("div", null, h("h2", null, "Your work"), h("p", null, "A quick look at upcoming work."))),
              h("div", { className: "week-hours" }, h("strong", null, `${activeClientProjects.length}`), h("span", null, activeClientProjects.length === 1 ? " active project" : " active projects")),
              h("div", { className: "week-progress" }, h("span", { style: { width: `${clientProjects.length ? Math.round(clientProjects.reduce((total, project) => total + project.progress, 0) / clientProjects.length) : 0}%` } })),
              h("div", { className: "week-caption" }, h("span", null, "Average project progress"), h("strong", null, `${clientProjects.length ? Math.round(clientProjects.reduce((total, project) => total + project.progress, 0) / clientProjects.length) : 0}%`)),
              h("div", { className: "focus-divider" }),
              h("div", { className: "upcoming-heading" }, h("div", null, h("span", { className: "upcoming-icon" }, h(Icon, { name: "calendar", size: 16 })), h("strong", null, "Coming up")), h("button", { className: "text-button", onClick: () => setPage("Projects") }, "View all")),
              activeClientProjects.slice(0, 2).map((project) => h("div", { className: "deadline-row", key: project.id },
                h("span", { className: "deadline-date" }, h(Icon, { name: "calendar", size: 15 })),
                h("div", { className: "deadline-copy" }, h("strong", null, project.name), h("span", null, project.due)),
                h("span", { className: "deadline-indicator" })))),
            h("article", { className: "panel projects-panel" },
              h("div", { className: "panel-heading project-panel-heading" }, h("div", null, h("h2", null, "Your projects"), h("p", null, "The latest on your shared projects.")), h("button", { className: "text-button", onClick: () => setPage("Projects") }, "All projects", h(Icon, { name: "arrow", size: 14 }))),
              projectCards(clientProjects.slice(0, 3))),
            h("article", { className: "panel activity-panel" },
              h("div", { className: "panel-heading" }, h("div", null, h("h2", null, "Recent invoices"), h("p", null, "Your latest billing updates."))),
              clientInvoices.length ? h("div", { className: "activity-list" }, clientInvoices.slice(0, 4).map((invoice) =>
                h("div", { className: "activity-row", key: invoice.id },
                  h("span", { className: "activity-icon activity-1" }, h(Icon, { name: "receipt", size: 15 })),
                  h("div", { className: "activity-copy" }, h("strong", null, invoice.id), h("span", null, `${invoice.date} · ${invoice.status}`)),
                  h("span", { className: "activity-hours" }, money(invoice.amount)))))
                : h("div", { className: "empty-state" }, "No invoices have been shared with you yet."),
              h("button", { className: "activity-footer", onClick: () => setPage("Invoices") }, "See all invoices", h(Icon, { name: "arrow", size: 14 })))));
      }

      function clientSection() {
        if (page === "Projects") {
          return h(React.Fragment, null,
            PageHeading({ eyebrow: "YOUR WORK, ALL IN ONE PLACE", title: "Your projects", text: "Track progress on the work shared with you." }),
            projectCards(clientProjects));
        }
        if (page === "Invoices") {
          return h(React.Fragment, null,
            PageHeading({ eyebrow: "YOUR BILLING", title: "Your invoices", text: "Review invoices shared with you." }),
            h("div", { className: "stats-grid client-invoice-stats" },
              StatCard({ label: "Outstanding balance", value: money(clientInvoiceBalance), change: `${unpaidClientInvoices.length} unpaid`, icon: "receipt", tone: "tone-orange", footer: "Your unpaid invoices" }),
              StatCard({ label: "Invoices", value: String(clientInvoices.length), change: `${clientInvoices.filter((invoice) => invoice.status === "Paid").length} paid`, icon: "check", tone: "tone-green", footer: "Shared with you" })),
            invoiceTable(clientInvoices));
        }
        return clientOverview();
      }

      return h("div", { className: "app-shell client-portal-shell" },
        h("aside", { className: "sidebar" },
          h("a", { className: "brand", href: "#overview", onClick: (event) => { event.preventDefault(); setPage("Overview"); } },
            h("span", { className: "brand-mark" }, h("span"), h("span"), h("span"), h("span")),
            h("span", { className: "brand-name" }, "freelance", h("strong", null, "flow"), h("span", { className: "brand-period" }, "."))),
          h("div", { className: "workspace-switch" },
            h("div", { className: "workspace-avatar" }, client.initials),
            h("div", { className: "workspace-copy" }, h("strong", null, client.name), h("span", null, "Client portal"))),
          h("div", { className: "nav-label" }, "YOUR WORK"),
          h("nav", { className: "nav-list", "aria-label": "Client navigation" },
            [{ label: "Overview", icon: "grid" }, { label: "Projects", icon: "layers" }, { label: "Invoices", icon: "receipt" }].map((item) =>
              h("button", { key: item.label, className: `nav-item ${page === item.label ? "selected" : ""}`, onClick: () => setPage(item.label) },
                h(Icon, { name: item.icon, size: 18 }), h("span", null, item.label),
                item.label === "Invoices" && unpaidClientInvoices.length ? h("span", { className: "nav-count" }, unpaidClientInvoices.length) : null))),
          h("div", { className: "sidebar-spacer" }),
          h("button", { className: "profile-row", onClick: signOut },
            h("div", { className: "profile-avatar" }, client.initials),
            h("div", { className: "profile-copy" }, h("strong", null, client.name), h("span", null, "Client")),
            h(Icon, { name: "more", size: 18, className: "muted-icon" }))),
        h("main", { className: "main-area" },
          h("header", { className: "topbar client-topbar" },
            h("div", { className: "breadcrumb" }, h("span", null, "Client portal"), h("span", { className: "breadcrumb-slash" }, "/"), h("strong", null, page)),
            h("div", { className: "topbar-actions" },
              h("div", { className: "topbar-avatar client-topbar-avatar", title: client.name }, client.initials))),
          h("div", { className: "page-content" },
            clientSection(),
            h("footer", { className: "page-footer" }, h("span", null, "Made for the work you love.")))));
    }

    function Topbar() {
      return h("header", { className: "topbar" },
        h("div", { className: "breadcrumb" }, h("span", null, "Workspace"), h("span", { className: "breadcrumb-slash" }, "/"), h("strong", null, page)),
        h("div", { className: "topbar-actions" },
          h("label", { className: "search-box" },
            h(Icon, { name: "search", size: 17 }),
            h("input", { type: "search", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search anything...", "aria-label": "Search projects and clients" }),
            h("kbd", null, "⌘ K")),
          h("button", { className: "icon-button notification-button", "aria-label": "Notifications", onClick: () => notify("You're all caught up") },
            h(Icon, { name: "bell", size: 19 }), h("span", { className: "notification-dot" })),
          h("div", { className: "topbar-avatar", title: "Alex Morgan" }, "A")));
    }

    function StatCard({ label, value, change, icon, tone, footer }) {
      return h("article", { className: "stat-card" },
        h("div", { className: "stat-top" },
          h("span", { className: `stat-icon ${tone}` }, h(Icon, { name: icon, size: 18 })),
          h("span", { className: "stat-change" }, h(Icon, { name: "trend", size: 14 }), change)),
        h("div", { className: "stat-label" }, label),
        h("div", { className: "stat-value" }, value),
        h("div", { className: "stat-footer" }, footer));
    }

    function ProjectCard({ item, reactKey }) {
      return h("article", { className: "project-card", key: reactKey },
        h("div", { className: "project-card-top" },
          h("div", { className: "project-client" },
            h("span", { className: `project-avatar ${item.color}` }, item.initials),
            h("div", null, h("h3", null, item.name), h("span", { className: "client-name" }, item.client))),
          h("button", { className: "dots-button", "aria-label": `Options for ${item.name}`, onClick: () => notify(`${item.name} options`) }, h(Icon, { name: "more", size: 18 }))),
        h("div", { className: "project-meta" },
          h("span", { className: "category-pill" }, item.category),
          h("span", { className: `status-pill ${item.status === "Completed" ? "status-complete" : item.status === "Review" ? "status-review" : "status-active"}` }, h("i"), item.status)),
        h("div", { className: "progress-heading" }, h("span", null, "Project progress"), h("strong", null, `${item.progress}%`)),
        h("div", { className: "progress-track" }, h("span", { style: { width: `${item.progress}%` } })),
        h("div", { className: "project-card-bottom" },
          h("div", { className: "budget-meta" }, h("span", null, "Budget"), h("strong", null, item.budget ? `${money(item.spent)} / ${money(item.budget)}` : "Not set")),
          h("span", { className: "due-date" }, h(Icon, { name: "calendar", size: 14 }), item.due)));
    }

    function RevenueChart() {
      const monthly = chartRange === "This year"
        ? [{ m: "Jan", v: 34 }, { m: "Feb", v: 47 }, { m: "Mar", v: 39 }, { m: "Apr", v: 63 }, { m: "May", v: 53 }, { m: "Jun", v: 74 }, { m: "Jul", v: 60 }, { m: "Aug", v: 84 }, { m: "Sep", v: 68 }, { m: "Oct", v: 91 }, { m: "Nov", v: 73 }, { m: "Dec", v: 88 }]
        : [{ m: "W1", v: 35 }, { m: "W2", v: 56 }, { m: "W3", v: 44 }, { m: "W4", v: 81 }];
      const coords = monthly.map((point, index) => `${36 + index * (688 / Math.max(monthly.length - 1, 1))},${174 - point.v * 1.4}`);
      const line = coords.join(" ");
      const area = `36,180 ${line} 724,180`;
      const activeX = coords[monthly.length - 2].split(",")[0];
      const activeY = coords[monthly.length - 2].split(",")[1];
      return h("div", { className: "chart-wrap" },
        h("div", { className: "chart-y-labels" }, ["$8k", "$6k", "$4k", "$2k", "$0"].map((label) => h("span", { key: label }, label))),
        h("div", { className: "chart-content" },
          h("svg", { viewBox: "0 0 760 210", className: "revenue-svg", role: "img", "aria-label": "Monthly revenue trend chart" },
            [30, 65, 100, 135, 170].map((y) => h("line", { key: y, x1: 35, x2: 725, y1: y, y2: y, className: "chart-grid" })),
            h("polygon", { points: area, className: "chart-area" }),
            h("polyline", { points: line, className: "chart-line" }),
            h("line", { x1: activeX, x2: activeX, y1: 28, y2: 180, className: "chart-hover-line" }),
            h("circle", { cx: activeX, cy: activeY, r: 5, className: "chart-point" }),
            h("rect", { x: Number(activeX) - 36, y: Number(activeY) - 37, width: 72, height: 25, rx: 7, className: "chart-tooltip-bg" }),
            h("text", { x: activeX, y: Number(activeY) - 20, textAnchor: "middle", className: "chart-tooltip-text" }, "$6,840"),
            monthly.map((point, index) => h("text", { key: point.m, x: 36 + index * (688 / Math.max(monthly.length - 1, 1)), y: 202, textAnchor: "middle", className: "chart-x-label" }, point.m))),
          h("div", { className: "chart-legend" }, h("span", { className: "legend-dot" }), h("span", null, "Revenue"))));
    }

    function Overview() {
      const list = filteredProjects.filter((item) => item.status !== "Completed").slice(0, 3);
      return h(React.Fragment, null,
        h("section", { className: "welcome-row" },
          h("div", null, h("div", { className: "eyebrow" }, "MONDAY, OCTOBER 12, 2026"), h("h1", null, "Good morning, Alex ", h("span", { className: "wave" }, "✳")), h("p", null, "A fresh week, a clear mind. Here's what's happening with your work.")),
          h("div", { className: "welcome-actions" },
            h(TimerButton, { runningSince, onClick: changeTimer }),
            h("button", { className: "button button-primary", onClick: () => openModal("project") }, h(Icon, { name: "plus", size: 17 }), "New project"))),
        h("section", { className: "stats-grid", "aria-label": "Business overview" },
          StatCard({ label: "Total revenue", value: "$12,480", change: "12.8%", icon: "trend", tone: "tone-purple", footer: h(React.Fragment, null, "vs. ", h("strong", null, "$11,050"), " last month") }),
          StatCard({ label: "Outstanding", value: money(outstandingTotal), change: `${outstandingInvoices.length} invoices`, icon: "receipt", tone: "tone-orange", footer: "Awaiting payment" }),
          StatCard({ label: "Hours tracked", value: "86.5", change: "6.4%", icon: "clock", tone: "tone-blue", footer: h(React.Fragment, null, h("strong", null, "72.5 hrs"), " billable this month") }),
          StatCard({ label: "Active projects", value: String(activeProjects.length).padStart(2, "0"), change: "2 new", icon: "layers", tone: "tone-green", footer: h(React.Fragment, null, "Across ", h("strong", null, data.clients.length), " lovely clients") })),
        h("section", { className: "dashboard-grid" },
          h("article", { className: "panel revenue-panel" },
            h("div", { className: "panel-heading" },
              h("div", null, h("h2", null, "Revenue overview"), h("p", null, "Keep an eye on the big picture")),
              h("select", { className: "select-control chart-select", value: chartRange, onChange: (event) => setChartRange(event.target.value), "aria-label": "Revenue chart date range" },
                h("option", null, "This year"), h("option", null, "This month"))),
            h("div", { className: "chart-summary" }, h("strong", null, "$12,480"), h("span", { className: "summary-growth" }, h(Icon, { name: "trend", size: 13 }), "12.8%"), h("span", null, "vs. last period")),
            h(RevenueChart)),
          h("article", { className: "panel focus-panel" },
            h("div", { className: "panel-heading" }, h("div", null, h("h2", null, "This week"), h("p", null, "Your focus at a glance")), h("button", { className: "dots-button", onClick: () => notify("Weekly overview") }, h(Icon, { name: "more", size: 18 }))),
            h("div", { className: "week-hours" }, h("strong", null, "24.5"), h("span", null, " / 32 hrs")),
            h("div", { className: "week-progress" }, h("span")),
            h("div", { className: "week-caption" }, h("span", null, "You're doing great!"), h("strong", null, "76%")),
            h("div", { className: "focus-divider" }),
            h("div", { className: "upcoming-heading" }, h("div", null, h("span", { className: "upcoming-icon" }, h(Icon, { name: "calendar", size: 16 })), h("strong", null, "Coming up")), h("button", { className: "text-button", onClick: () => setPage("Projects") }, "View all")),
            h("div", { className: "deadline-row" }, h("span", { className: "deadline-date" }, h("strong", null, "18"), h("span", null, "OCT")), h("div", { className: "deadline-copy" }, h("strong", null, "Autumn campaign assets"), h("span", null, "Monocle Creative")), h("span", { className: "deadline-indicator" })),
            h("div", { className: "deadline-row" }, h("span", { className: "deadline-date" }, h("strong", null, "20"), h("span", null, "OCT")), h("div", { className: "deadline-copy" }, h("strong", null, "Spring lookbook"), h("span", null, "Northstar Studio")), h("span", { className: "deadline-indicator deadline-yellow" }))),
          h("article", { className: "panel projects-panel" },
            h("div", { className: "panel-heading project-panel-heading" }, h("div", null, h("h2", null, "Projects in motion"), h("p", null, "The good stuff you're working on")), h("button", { className: "text-button", onClick: () => setPage("Projects") }, "All projects", h(Icon, { name: "arrow", size: 15 }))),
            list.length ? h("div", { className: "project-cards" }, list.map((item) => ProjectCard({ item, reactKey: item.id }))) : h("div", { className: "empty-state" }, "No projects found. Try another search.")),
          h("article", { className: "panel activity-panel" },
            h("div", { className: "panel-heading" }, h("div", null, h("h2", null, "Recent activity"), h("p", null, "Little things adding up")), h("button", { className: "dots-button", onClick: () => setPage("Time tracking") }, h(Icon, { name: "more", size: 18 }))),
            h("div", { className: "activity-list" },
              data.logs.slice(0, 4).map((item, index) => h("div", { className: "activity-row", key: item.id },
                h("span", { className: `activity-icon activity-${index % 4}` }, h(Icon, { name: index === 0 ? "check" : "clock", size: 15 })),
                h("div", { className: "activity-copy" }, h("strong", null, item.note), h("span", null, `${item.project} · ${item.date}`)),
                h("span", { className: "activity-hours" }, `${item.hours.toFixed(1)}h`)))),
            h("button", { className: "activity-footer", onClick: () => setPage("Time tracking") }, "See all activity", h(Icon, { name: "arrow", size: 14 })))));
    }

    function ProjectPage() {
      return h(React.Fragment, null,
        PageHeading({ eyebrow: "YOUR WORK, ALL IN ONE PLACE", title: "Projects", text: "Make progress visible. Keep the good work moving.", action: () => openModal("project"), button: "New project" }),
        h("div", { className: "filter-row" },
          ["All projects", "In progress", "Review", "Completed"].map((filter) => h("button", { key: filter, className: `filter-chip ${projectFilter === filter ? "active-filter" : ""}`, onClick: () => setProjectFilter(filter) }, filter, filter === "All projects" ? h("span", null, data.projects.length) : null))),
        filteredProjects.length ? h("div", { className: "entity-project-grid" }, filteredProjects.map((item) => ProjectCard({ item, reactKey: item.id }))) : h("div", { className: "panel empty-panel" }, "No projects here yet. Create one to get started."));
    }

    function PageHeading({ eyebrow, title, text, action, button }) {
      return h("section", { className: "welcome-row page-welcome" },
        h("div", null, h("div", { className: "eyebrow" }, eyebrow), h("h1", null, title), h("p", null, text)),
        h("button", { className: "button button-primary", onClick: action }, h(Icon, { name: "plus", size: 17 }), button));
    }

    function ClientPage() {
      const clients = data.clients.filter((item) => `${item.name} ${item.email}`.toLowerCase().includes(query.toLowerCase()));
      function inviteLink(client) {
        const portalUrl = new URL(window.location.href);
        portalUrl.search = "";
        portalUrl.hash = "";
        portalUrl.searchParams.set("client", client.email);
        const subject = `Your ${client.name} client portal`;
        const body = `Hi ${client.name},\n\nYou can view the projects and invoices we share with you in your client portal:\n${portalUrl.toString()}\n\nBest`;
        return `mailto:${encodeURIComponent(client.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }

      return h(React.Fragment, null,
        PageHeading({ eyebrow: "GOOD PEOPLE, GOOD WORK", title: "Clients", text: "All your client relationships, neatly organized.", action: () => openModal("client"), button: "Add client" }),
        h("p", { className: "client-invite-note" }, "Invite a client to open their personal project and invoice portal. This demo creates an email draft; it does not send invitations."),
        h("div", { className: "client-grid" }, clients.map((client, index) => h("article", { className: "panel client-card", key: client.id },
          h("div", { className: "client-card-top" }, h("span", { className: `client-avatar avatar-${index % 5} client-avatar-large` }, client.initials), h("button", { className: "dots-button", onClick: () => notify(`${client.name} options`) }, h(Icon, { name: "more", size: 18 }))),
          h("h2", null, client.name), h("a", { href: `mailto:${client.email}`, className: "client-email" }, client.email),
          h("div", { className: "client-card-stats" }, h("div", null, h("span", null, "Projects"), h("strong", null, client.projects)), h("div", null, h("span", null, "Hourly rate"), h("strong", null, client.rate ? `${money(client.rate)}/hr` : "Not set"))),
          h("div", { className: "client-card-bottom" },
            h("span", { className: "client-status" }, h("i"), client.status),
            h("a", { className: "button button-light client-invite-button", href: inviteLink(client) }, "Invite to portal"),
            h("button", { className: "text-button", onClick: () => setPage("Projects") }, "View projects", h(Icon, { name: "arrow", size: 14 })))))),
        clients.length === 0 ? h("div", { className: "panel empty-panel" }, "No clients match your search.") : null);
    }

    function InvoicePage() {
      const invoiceRows = data.invoices.map((invoice) => h("tr", { key: invoice.id },
        h("td", { className: "invoice-id" }, invoice.id),
        h("td", null, invoice.client),
        h("td", null, invoice.date),
        h("td", null, invoice.due),
        h("td", { className: "amount-cell" }, money(invoice.amount)),
        h("td", null, h("span", { className: `status-pill invoice-status ${invoice.status.toLowerCase()}` }, h("i"), invoice.status)),
        h("td", null, h("button", {
          className: "download-button",
          onClick: () => downloadInvoice(invoice),
          "aria-label": `Download ${invoice.id}`,
        }, h(Icon, { name: "download", size: 17 })))));

      return h(React.Fragment, null,
        PageHeading({ eyebrow: "GET PAID FOR YOUR GREAT WORK", title: "Invoices", text: "Every invoice, every payment, all in one tidy place.", action: () => openModal("invoice"), button: "New invoice" }),
        h("div", { className: "stats-grid invoice-stats" },
          StatCard({ label: "Paid this month", value: "$4,430", change: "18.2%", icon: "check", tone: "tone-green", footer: "Across 2 paid invoices" }),
          StatCard({ label: "Awaiting payment", value: money(outstandingTotal), change: `${outstandingInvoices.length} invoices`, icon: "receipt", tone: "tone-orange", footer: "Unpaid invoices" })),
        h("article", { className: "panel table-panel" },
          h("div", { className: "panel-heading table-panel-heading" }, h("div", null, h("h2", null, "All invoices"), h("p", null, `${data.invoices.length} invoices in your workspace`)), h("button", { className: "button button-light", onClick: () => openModal("invoice") }, h(Icon, { name: "plus", size: 16 }), "Create invoice")),
          h("div", { className: "table-scroll" },
            h("table", null,
              h("thead", null, h("tr", null, ["Invoice", "Client", "Date issued", "Due date", "Amount", "Status", ""].map((label) => h("th", { key: label }, label)))),
              h("tbody", null, invoiceRows)))));
    }

    function TimePage() {
      const hours = data.logs.reduce((sum, item) => sum + item.hours, 0);
      const timeRows = data.logs
        .filter((item) => `${item.project} ${item.client} ${item.note}`.toLowerCase().includes(query.toLowerCase()))
        .map((item) => h("tr", { key: item.id },
          h("td", null, h("div", { className: "table-project" }, h("strong", null, item.project), h("span", null, item.client))),
          h("td", { className: "table-note" }, item.note),
          h("td", null, item.date),
          h("td", { className: "amount-cell" }, `${item.hours.toFixed(2)} hrs`),
          h("td", null, h("span", { className: `billable-label ${item.billed ? "already-billed" : ""}` }, h("i"), item.billed ? "Billed" : item.billable ? "Unbilled" : "Non-billable"))));
      return h(React.Fragment, null,
        h("section", { className: "welcome-row page-welcome" },
          h("div", null, h("div", { className: "eyebrow" }, "MAKE EVERY HOUR COUNT"), h("h1", null, "Time tracking"), h("p", null, "Your time is valuable. Keep a little record of where it goes.")),
          h("div", { className: "welcome-actions" },
            h(TimerButton, { runningSince, onClick: changeTimer }),
            h("button", { className: "button button-primary", onClick: () => openModal("time") }, h(Icon, { name: "plus", size: 17 }), "Log time"))),
        h("div", { className: "stats-grid invoice-stats" },
          StatCard({ label: "Hours this month", value: "86.5", change: "6.4%", icon: "clock", tone: "tone-blue", footer: "72.5 hours are billable" }),
          StatCard({ label: "Logged in this view", value: `${hours.toFixed(1)} hrs`, change: `${data.logs.length} entries`, icon: "check", tone: "tone-green", footer: "Across your active projects" })),
        h("article", { className: "panel table-panel" },
          h("div", { className: "panel-heading table-panel-heading" }, h("div", null, h("h2", null, "Recent time entries"), h("p", null, "The work behind the hours")),
            h("select", { className: "select-control", defaultValue: "This week", "aria-label": "Time entry date range" }, h("option", null, "This week"), h("option", null, "This month"))),
          h("div", { className: "table-scroll" },
            h("table", null,
              h("thead", null, h("tr", null, ["Project", "Note", "Date", "Duration", "Type"].map((label) => h("th", { key: label }, label)))),
              h("tbody", null, timeRows)))));
    }

    function Modal() {
      if (!modal) return null;
      const details = {
        project: { title: "Create a project", description: "Good work starts with a name and a client.", submit: "Create project" },
        client: { title: "Add a client", description: "Add someone new to your corner of the world.", submit: "Add client" },
        invoice: { title: "Create an invoice", description: "Choose a client and date range. Only unbilled time is included.", submit: "Create invoice" },
        time: { title: "Log your time", description: "Add a few hours from work you've already done.", submit: "Add time entry" },
      }[modal];
      return h("div", { className: "modal-backdrop", onMouseDown: (event) => { if (event.target === event.currentTarget) setModal(""); } },
        h("section", { className: `modal-card ${modal === "invoice" ? "invoice-modal" : ""}`, role: "dialog", "aria-modal": true, "aria-labelledby": "modal-title" },
          h("div", { className: "modal-heading" }, h("div", null, h("span", { className: "modal-icon" }, h(Icon, { name: modal === "invoice" ? "receipt" : modal === "time" ? "clock" : modal === "client" ? "users" : "layers", size: 19 })), h("h2", { id: "modal-title" }, details.title), h("p", null, details.description)), h("button", { className: "icon-button", onClick: () => setModal(""), "aria-label": "Close dialog" }, h(Icon, { name: "close", size: 19 }))),
          h("form", { onSubmit: submitModal },
            modal === "client" ? h(React.Fragment, null,
              h("label", { className: "field-label" }, "Client name", h("input", { autoFocus: true, required: true, value: formName, onChange: (event) => setFormName(event.target.value), placeholder: "e.g. Brightside Studio" })),
              h("label", { className: "field-label" }, "Email address", h("input", { required: true, type: "email", value: formEmail, onChange: (event) => setFormEmail(event.target.value), placeholder: "hello@client.com" })),
              h("label", { className: "field-label" }, "Hourly rate", h("span", { className: "input-prefix-wrap" }, h("span", null, "$"), h("input", { type: "number", min: "0", step: "1", value: formRate, onChange: (event) => setFormRate(event.target.value), placeholder: "95" }), h("span", { className: "input-suffix" }, "/ hour"))))
              : modal === "time" ? h(React.Fragment, null,
                h("label", { className: "field-label" }, "Project", h("select", { required: true, value: formClient, onChange: (event) => setFormClient(event.target.value) }, data.projects.map((item) => h("option", { key: item.id, value: item.name }, item.name)))),
                h("label", { className: "field-label" }, "Hours worked", h("input", { autoFocus: true, required: true, type: "number", min: "0.1", step: "0.1", value: formBudget, onChange: (event) => setFormBudget(event.target.value), placeholder: "2.5" })),
                h("label", { className: "field-label" }, "What did you work on?", h("input", { value: formNote, onChange: (event) => setFormNote(event.target.value), placeholder: "e.g. Homepage design revisions" })))
                : modal === "invoice" ? h(React.Fragment, null,
                  h("label", { className: "field-label" }, "Client", h("select", { required: true, value: formClient, onChange: (event) => setFormClient(event.target.value) }, data.clients.map((client) => h("option", { key: client.id, value: client.name }, client.name)))),
                  h("div", { className: "invoice-dates" },
                    h("label", { className: "field-label" }, "From", h("input", { required: true, type: "date", value: invoiceStart, max: invoiceEnd, onChange: (event) => setInvoiceStart(event.target.value) })),
                    h("label", { className: "field-label" }, "To", h("input", { required: true, type: "date", value: invoiceEnd, min: invoiceStart, onChange: (event) => setInvoiceEnd(event.target.value) }))),
                  invoiceClient?.rate > 0 ? h("p", { className: "invoice-rate-note" }, "Hourly rate", h("strong", null, `${preciseMoney(invoiceClient.rate)} / hr`)) : h("p", { className: "invoice-empty-note" }, "Add an hourly rate to this client before invoicing time."),
                  billableInvoiceLogs.length ? h("div", { className: "invoice-preview" },
                    h("div", { className: "invoice-preview-heading" }, h("strong", null, `${billableInvoiceLogs.length} unbilled ${billableInvoiceLogs.length === 1 ? "entry" : "entries"}`), h("span", null, "Line total")),
                    h("div", { className: "invoice-preview-list" }, billableInvoiceLogs.map((log) => h("div", { className: "invoice-preview-row", key: log.id },
                      h("div", null, h("strong", null, log.project), h("span", null, `${log.note} · ${log.hours.toFixed(2)} hrs × ${preciseMoney(invoiceClient.rate)}`)),
                      h("strong", null, preciseMoney(log.hours * invoiceClient.rate))))),
                    h("div", { className: "invoice-total-row" }, h("span", null, `${billableInvoiceLogs.reduce((sum, log) => sum + log.hours, 0).toFixed(2)} hours`), h("strong", null, preciseMoney(invoiceTotal))))
                    : h("div", { className: "invoice-empty-note" }, "No unbilled hours for this client in the selected date range."),
                  h("p", { className: "invoice-safety-note" }, "Creating this invoice marks the included time entries as billed so they can't be invoiced twice."))
                  : h(React.Fragment, null,
                    h("label", { className: "field-label" }, "Project name", h("input", { autoFocus: true, required: true, value: formName, onChange: (event) => setFormName(event.target.value), placeholder: "e.g. Website redesign" })),
                    h("label", { className: "field-label" }, "Client", h("select", { required: true, value: formClient, onChange: (event) => setFormClient(event.target.value) }, data.clients.map((client) => h("option", { key: client.id, value: client.name }, client.name)))),
                    h("label", { className: "field-label" }, "Project budget", h("span", { className: "input-prefix-wrap" }, h("span", null, "$"), h("input", { type: "number", min: "0", step: "100", value: formBudget, onChange: (event) => setFormBudget(event.target.value), placeholder: "5,000" })))),
            h("div", { className: "modal-actions" }, h("button", { type: "button", className: "button button-light", onClick: () => setModal("") }, "Cancel"), h("button", { type: "submit", className: "button button-primary", disabled: modal === "invoice" && (billableInvoiceLogs.length === 0 || !invoiceClient?.rate) }, h(Icon, { name: "plus", size: 16 }), details.submit)))));
    }

    if (!dataReady && !apiError) {
      return h("div", { className: "auth-page" }, h("p", { className: "backend-loading" }, "Connecting to your workspace..."));
    }

    if (!isSignedIn) {
      return h(React.Fragment, null,
        apiError ? h("div", { className: "backend-notice", role: "alert" }, apiError) : null,
        h("div", { className: "auth-page" }, SignInPage(), toast ? h("div", { className: "toast", role: "status" }, h("span", { className: "toast-check" }, h(Icon, { name: "check", size: 15 })), toast) : null));
    }

    const signedInClient = signedInClientEmail
      ? data.clients.find((client) => client.email.toLowerCase() === signedInClientEmail.toLowerCase())
      : null;
    if (signedInClientEmail && !signedInClient) {
      return h(React.Fragment, null,
        apiError ? h("div", { className: "backend-notice", role: "alert" }, apiError) : null,
        h("div", { className: "auth-page" }, SignInPage(), toast ? h("div", { className: "toast", role: "status" }, h("span", { className: "toast-check" }, h(Icon, { name: "check", size: 15 })), toast) : null));
    }
    if (signedInClient) {
      return h(React.Fragment, null,
        apiError ? h("div", { className: "backend-notice", role: "alert" }, apiError) : null,
        ClientPortal({ client: signedInClient }),
        toast ? h("div", { className: "toast", role: "status" }, h("span", { className: "toast-check" }, h(Icon, { name: "check", size: 15 })), toast) : null);
    }

    return h("div", { className: "app-shell" },
      apiError ? h("div", { className: "backend-notice", role: "alert" }, apiError) : null,
      Sidebar(),
      h("main", { className: "main-area" },
        Topbar(),
        h("div", { className: "page-content" },
          page === "Overview" ? Overview() : page === "Projects" ? ProjectPage() : page === "Clients" ? ClientPage() : page === "Invoices" ? InvoicePage() : TimePage(),
          h("footer", { className: "page-footer" }, h("span", null, "Made for the work you love."), h("button", { onClick: loadSampleData }, "Restore sample data")))),
      Modal(),
      toast ? h("div", { className: "toast", role: "status" }, h("span", { className: "toast-check" }, h(Icon, { name: "check", size: 15 })), toast) : null);
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();
