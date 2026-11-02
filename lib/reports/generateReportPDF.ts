import PDFDocument from "pdfkit";
import path from "path";

type Ranked = { name: string; visitors: number };

export interface ReportData {
  generatedAt: string;
  range: { start: string; end: string; type?: string };
  options: { includeRawLogs?: boolean };
  projects: {
    projectId: string; projectName: string; url: string | null; totalChecks: number; upCount: number; downCount: number;
    uptimePct: number | null; avgResponse: number | null; lastIncident?: string | Date | null;
    failureReasons?: { reason: string; httpStatus: number | null; count: number; lastSeen: string | Date }[];
    incidents: { checkedAt: string | Date; errorMessage?: string | null; httpStatus?: number | null }[];
    logs: { checkedAt: string | Date; status: boolean; responseTime?: number | null; httpStatus?: number | null; errorMessage?: string | null }[];
  }[];
  totals: { projects: number; totalChecks: number; overallUptime: number | null };
  analytics?: {
    visitors: number | null;
    pageviews?: number | null;
    newVisitors?: number | null;
    returningVisitors?: number | null;
    topPages: { path: string; visitors: number }[];
    topReferrers: { source: string; visitors: number }[];
    countries?: Ranked[];
    devices?: Ranked[];
    browsers?: Ranked[];
    systems?: Ranked[];
    peakDay?: { day: string; visitors: number } | null;
  };
}

const COLORS = {
  ink: "#18181B", muted: "#71717A", panel: "#F4F4F5", line: "#E4E4E7", stripe: "#FAFAFA",
  violet: "#6D28D9", cyan: "#0891B2", green: "#059669", amber: "#D97706", red: "#DC2626",
};

const MARGIN = 36;
const PAGE_BOTTOM = 800;
const ROW = 15;

export async function generateReportPDF(reportData: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const fontPath = path.join(process.cwd(), "public", "assets", "fonts", "CentraNo2-Medium.ttf");
      const logoPath = path.join(process.cwd(), "public", "assets", "images", "logo-v4.png");
      // bottom margin 0 so the footer can sit below the content area without pdfkit adding a page
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: MARGIN, left: MARGIN, right: MARGIN, bottom: 0 },
        font: fontPath,
        info: { Title: "Portfolio monthly report", Author: "Mubassim Ahmed Khan" },
      });
      const chunks: Buffer[] = [];
      doc.registerFont("Portfolio", fontPath); doc.font("Portfolio");
      doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      doc.on("end", () => resolve(Buffer.concat(chunks))); doc.on("error", reject);

      const pageWidth = doc.page.width;
      const width = pageWidth - MARGIN * 2;
      let pageNumber = 1;

      const date = (value: string | Date) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const number = (value: number | null | undefined) => (value == null ? "—" : value.toLocaleString());
      const percent = (part: number, whole: number) => (whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "—");
      const range = `${date(reportData.range.start)} – ${date(reportData.range.end)}`;
      const a = reportData.analytics;

      const footer = () => {
        doc.fontSize(7).fillColor(COLORS.muted).text("Portfolio analytics • confidential", MARGIN, 812, { lineBreak: false });
        doc.text(`Page ${pageNumber}`, pageWidth - MARGIN - 60, 812, { width: 60, align: "right", lineBreak: false });
      };
      const newPage = (title?: string) => {
        footer(); doc.addPage(); pageNumber += 1;
        if (title) { doc.fillColor(COLORS.ink).fontSize(14).text(title, MARGIN, MARGIN, { lineBreak: false }); return MARGIN + 26; }
        return MARGIN;
      };

      const heading = (label: string, x: number, y: number) => {
        doc.fillColor(COLORS.ink).fontSize(10).text(label, x, y, { lineBreak: false });
        return y + 15;
      };

      type Col = { label: string; w: number; align?: "left" | "right" };
      // Draws a table at absolute coordinates and returns the y below it.
      const table = (
        x: number, y: number, tableWidth: number, cols: Col[], rows: string[][],
        opts: { color?: (row: string[], col: number) => string | undefined; pageTitle?: string } = {},
      ) => {
        const total = cols.reduce((sum, c) => sum + c.w, 0);
        const widths = cols.map((c) => (c.w / total) * tableWidth);
        const head = (top: number) => {
          doc.fillColor(COLORS.ink).rect(x, top, tableWidth, ROW + 2).fill();
          let cx = x;
          cols.forEach((c, i) => {
            doc.fillColor("#FFFFFF").fontSize(7).text(c.label.toUpperCase(), cx + 5, top + 6, { width: widths[i] - 10, align: c.align ?? "left", lineBreak: false });
            cx += widths[i];
          });
          return top + ROW + 2;
        };
        let cy = head(y);
        const body = rows.length ? rows : [cols.map((_, i) => (i === 0 ? "No data for this period" : ""))];
        body.forEach((row, index) => {
          if (cy + ROW > PAGE_BOTTOM) { cy = head(newPage(opts.pageTitle)); }
          if (index % 2 === 0) doc.fillColor(COLORS.stripe).rect(x, cy, tableWidth, ROW).fill();
          let cx = x;
          row.forEach((cell, i) => {
            doc.fillColor(opts.color?.(row, i) ?? COLORS.ink).fontSize(7.5).text(cell, cx + 5, cy + 4.5, { width: widths[i] - 10, align: cols[i].align ?? "left", ellipsis: true, lineBreak: false });
            cx += widths[i];
          });
          cy += ROW;
        });
        doc.strokeColor(COLORS.line).lineWidth(0.5).moveTo(x, cy).lineTo(x + tableWidth, cy).stroke();
        return cy;
      };

      // ── Header ────────────────────────────────────────────────────────────
      try { doc.image(logoPath, MARGIN, 30, { fit: [70, 34] }); } catch { /* optional logo */ }
      doc.fillColor(COLORS.ink).fontSize(18).text("Monthly Portfolio Report", MARGIN + 84, 32, { lineBreak: false });
      doc.fillColor(COLORS.muted).fontSize(8.5).text(`${range}  •  Generated ${date(reportData.generatedAt)}`, MARGIN + 84, 54, { lineBreak: false });
      doc.strokeColor(COLORS.line).lineWidth(0.5).moveTo(MARGIN, 76).lineTo(pageWidth - MARGIN, 76).stroke();

      // ── KPI strip ─────────────────────────────────────────────────────────
      const visitors = a?.visitors ?? null;
      const pageviews = a?.pageviews ?? null;
      const viewsPerVisitor = visitors && pageviews ? (pageviews / visitors).toFixed(2) : null;
      const downChecks = reportData.projects.reduce((sum, p) => sum + p.downCount, 0);

      const splitTotal = (a?.newVisitors ?? 0) + (a?.returningVisitors ?? 0);
      const splitValue = (value: number | null | undefined) => (value == null || !splitTotal ? "—" : value.toLocaleString());
      const splitShare = (value: number | null | undefined) => (value == null || !splitTotal ? "" : ` · ${Math.round((value / splitTotal) * 100)}%`);

      const kpis: [string, string, string][] = [
        ["Visitors", number(visitors), COLORS.violet],
        [`New visitors${splitShare(a?.newVisitors)}`, splitValue(a?.newVisitors), COLORS.cyan],
        [`Returning${splitShare(a?.returningVisitors)}`, splitValue(a?.returningVisitors), COLORS.violet],
        ["Views / visitor", viewsPerVisitor ?? "—", COLORS.cyan],
        ["Avg. uptime", `${(reportData.totals.overallUptime ?? 0).toFixed(1)}%`, COLORS.green],
        ["Down checks", number(downChecks), downChecks ? COLORS.red : COLORS.green],
      ];
      const gap = 7, cardW = (width - gap * (kpis.length - 1)) / kpis.length, cardY = 88;
      kpis.forEach(([label, value, accent], i) => {
        const x = MARGIN + i * (cardW + gap);
        doc.roundedRect(x, cardY, cardW, 46, 6).fill(COLORS.panel);
        doc.fillColor(accent).rect(x, cardY + 8, 2.5, 30).fill();
        doc.fillColor(COLORS.muted).fontSize(6.5).text(label.toUpperCase(), x + 11, cardY + 9, { width: cardW - 14, lineBreak: false });
        doc.fillColor(COLORS.ink).fontSize(15).text(value, x + 11, cardY + 22, { width: cardW - 14, lineBreak: false });
      });

      // ── Key insights ──────────────────────────────────────────────────────
      const countries = a?.countries ?? [];
      const devices = a?.devices ?? [];
      const base = visitors ?? countries.reduce((sum, c) => sum + c.visitors, 0);
      const insights: string[] = [];
      if (countries[0]) insights.push(`Top region: ${countries[0].name} with ${number(countries[0].visitors)} visitors (${percent(countries[0].visitors, base)}).`);
      const deviceTotal = devices.reduce((sum, d) => sum + d.visitors, 0);
      const phones = devices.find((d) => d.name === "Phones");
      if (phones && deviceTotal) insights.push(`Mobile traffic: ${percent(phones.visitors, deviceTotal)} of visits came from phones.`);
      if (splitTotal) insights.push(`Audience: ${percent(a?.newVisitors ?? 0, splitTotal)} new vs ${percent(a?.returningVisitors ?? 0, splitTotal)} returning visitors.`);
      if (a?.peakDay && a.peakDay.visitors > 0) insights.push(`Busiest day: ${date(a.peakDay.day)} with ${number(a.peakDay.visitors)} visits.`);
      const measured = reportData.projects.filter((p) => p.uptimePct !== null);
      const weakest = [...measured].sort((x, y) => (x.uptimePct ?? 100) - (y.uptimePct ?? 100))[0];
      if (weakest) {
        insights.push((weakest.uptimePct ?? 100) >= 100
          ? "All monitored sites stayed fully available this period."
          : `Lowest availability: ${weakest.projectName} at ${weakest.uptimePct?.toFixed(1)}% (${weakest.downCount} down checks).`);
      }
      let y = cardY + 46 + 14;
      if (insights.length) {
        const boxH = 20 + insights.length * 12;
        doc.roundedRect(MARGIN, y, width, boxH, 6).lineWidth(0.5).strokeColor(COLORS.line).stroke();
        doc.fillColor(COLORS.muted).fontSize(6.5).text("KEY INSIGHTS", MARGIN + 10, y + 7, { lineBreak: false });
        insights.forEach((line, i) => {
          doc.fillColor(COLORS.ink).fontSize(8).text(`•  ${line}`, MARGIN + 10, y + 20 + i * 12, { width: width - 20, lineBreak: false, ellipsis: true });
        });
        y += boxH + 14;
      }

      // ── Site availability ────────────────────────────────────────────────
      y = heading("Site availability", MARGIN, y);
      const uptimeColor = (pct: string) => {
        const n = parseFloat(pct);
        if (Number.isNaN(n)) return COLORS.muted;
        return n >= 99.5 ? COLORS.green : n >= 95 ? COLORS.amber : COLORS.red;
      };
      y = table(MARGIN, y, width, [
        { label: "Site", w: 150 },
        { label: "Checks", w: 55, align: "right" },
        { label: "Up", w: 50, align: "right" },
        { label: "Down", w: 50, align: "right" },
        { label: "Uptime", w: 60, align: "right" },
        { label: "Avg. response", w: 75, align: "right" },
        { label: "Last incident", w: 85, align: "right" },
      ], reportData.projects.map((p) => [
        p.projectName, number(p.totalChecks), number(p.upCount), number(p.downCount),
        p.uptimePct == null ? "—" : `${p.uptimePct.toFixed(2)}%`,
        p.avgResponse == null ? "—" : `${p.avgResponse} ms`,
        p.lastIncident ? date(p.lastIncident) : "None",
      ]), {
        pageTitle: "Site availability",
        color: (row, col) => (col === 4 ? uptimeColor(row[4]) : col === 3 && row[3] !== "0" ? COLORS.red : undefined),
      }) + 16;

      // ── Downtime reasons ─────────────────────────────────────────────────
      const reasonRows = reportData.projects.flatMap((p) => (p.failureReasons ?? []).map((r) => [p.projectName, r.reason, number(r.count), date(r.lastSeen)]));
      if (reasonRows.length) {
        if (y + 15 + ROW * 3 > PAGE_BOTTOM) y = newPage("Downtime reasons");
        y = heading("Downtime reasons", MARGIN, y);
        y = table(MARGIN, y, width, [
          { label: "Site", w: 130 }, { label: "Reason", w: 220 }, { label: "Times", w: 50, align: "right" }, { label: "Last seen", w: 90, align: "right" },
        ], reasonRows, { pageTitle: "Downtime reasons", color: (_row, col) => (col === 1 ? COLORS.red : undefined) }) + 16;
      }

      // ── Audience: side-by-side compact tables ────────────────────────────
      const colGap = 12, half = (width - colGap) / 2, rightX = MARGIN + half + colGap;
      const listRows = (items: Ranked[], total: number, limit = 5) => items.slice(0, limit).map((i) => [i.name, number(i.visitors), percent(i.visitors, total)]);
      const sum = (items: Ranked[]) => items.reduce((s, i) => s + i.visitors, 0);
      const cols = (label: string, valueLabel = "Visitors"): Col[] => [{ label, w: 110 }, { label: valueLabel, w: 45, align: "right" }, { label: "Share", w: 40, align: "right" }];

      const pairs: [{ title: string; cols: Col[]; rows: string[][] }, { title: string; cols: Col[]; rows: string[][] }][] = [
        [
          { title: "Visitors by country", cols: cols("Country"), rows: listRows(countries, base || sum(countries), 6) },
          { title: "Most visited pages", cols: cols("Path", "Views"), rows: (a?.topPages ?? []).slice(0, 6).map((p) => [p.path, number(p.visitors), percent(p.visitors, pageviews ?? sum((a?.topPages ?? []).map((t) => ({ name: t.path, visitors: t.visitors })))) ]) },
        ],
        [
          { title: "Top referrers", cols: cols("Source"), rows: (a?.topReferrers ?? []).slice(0, 5).map((r) => [r.source, number(r.visitors), percent(r.visitors, visitors ?? sum((a?.topReferrers ?? []).map((t) => ({ name: t.source, visitors: t.visitors }))))]) },
          { title: "Devices", cols: cols("Device"), rows: listRows(devices, deviceTotal) },
        ],
        [
          { title: "Browsers", cols: cols("Browser"), rows: listRows(a?.browsers ?? [], sum(a?.browsers ?? [])) },
          { title: "Operating systems", cols: cols("System"), rows: listRows(a?.systems ?? [], sum(a?.systems ?? [])) },
        ],
      ];

      pairs.forEach(([left, right]) => {
        const rowsNeeded = Math.max(left.rows.length, right.rows.length, 1);
        const needed = 15 + ROW + 2 + rowsNeeded * ROW + 14;
        if (y + needed > PAGE_BOTTOM) y = newPage("Audience insights");
        heading(left.title, MARGIN, y); heading(right.title, rightX, y);
        const endLeft = table(MARGIN, y + 15, half, left.cols, left.rows);
        const endRight = table(rightX, y + 15, half, right.cols, right.rows);
        y = Math.max(endLeft, endRight) + 14;
      });

      // ── Optional raw log appendix ────────────────────────────────────────
      if (reportData.options.includeRawLogs) {
        const top = newPage("Monitoring log appendix");
        const logs = reportData.projects.flatMap((p) => p.logs.map((l) => [p.projectName, date(l.checkedAt), l.status ? "UP" : "DOWN", l.responseTime == null ? "—" : `${l.responseTime} ms`, l.httpStatus?.toString() ?? "—"]));
        table(MARGIN, top, width, [
          { label: "Site", w: 150 }, { label: "When", w: 110 }, { label: "Status", w: 60 },
          { label: "Response", w: 80, align: "right" }, { label: "HTTP", w: 60, align: "right" },
        ], logs, { pageTitle: "Monitoring log appendix", color: (row, col) => (col === 2 && row[2] === "DOWN" ? COLORS.red : undefined) });
      }

      footer(); doc.end();
    } catch (error) { reject(error); }
  });
}
