document.addEventListener('DOMContentLoaded', function () {

  /* ── Aggregates ───────────────────────────────────── */
  var totalRevenue = Object.values(REVENUE_BY_CATEGORY).reduce(function (s, v) { return s + v; }, 0);
  var totalExpenses = EXPENSES.reduce(function (s, e) { return s + e.amount; }, 0);

  var staffCost = STAFF.reduce(function (s, r) { return s + r.reportedHours * r.rate; }, 0);
  var cogs      = Math.round(totalRevenue * 0.08);
  var grossProfit = totalRevenue - cogs;
  var opex      = totalExpenses - staffCost > 0 ? totalExpenses - staffCost : Math.round(totalExpenses * 0.4);
  var netProfit  = totalRevenue - cogs - opex - staffCost;
  var margin    = totalRevenue > 0 ? Math.round(netProfit / totalRevenue * 100) : 0;

  /* ── KPI cards ────────────────────────────────────── */
  document.getElementById('kpi-revenue').textContent  = fmtCurrency(totalRevenue);
  document.getElementById('kpi-expenses').textContent = fmtCurrency(totalExpenses);
  document.getElementById('kpi-net').textContent      = fmtCurrency(netProfit);
  document.getElementById('kpi-margin').textContent   = margin + '%';

  /* ── Revenue by category chart ────────────────────── */
  var catLabels = Object.keys(REVENUE_BY_CATEGORY);
  var catValues = Object.values(REVENUE_BY_CATEGORY);
  var catColors = ['#F59E0B','#3B82F6','#10B981','#8B5CF6','#F97316','#64748B'];

  buildHBarChart('cat-chart', catLabels, [{
    data: catValues,
    backgroundColor: catColors,
    borderRadius: 4,
    borderSkipped: false,
  }]);

  /* ── Recent expenses ──────────────────────────────── */
  var recent = EXPENSES.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  }).slice(0, 5);

  var expTbody = document.getElementById('exp-tbody');
  recent.forEach(function (e) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td style="white-space:nowrap">' + fmtDate(e.date) + '</td>' +
      '<td><span style="font-size:12px;background:#F1F5F9;padding:2px 8px;border-radius:4px;font-weight:500">' + e.category + '</span></td>' +
      '<td style="color:#64748B">' + e.description + '</td>' +
      '<td style="text-align:right"><strong style="color:#991B1B">' + fmtCurrency(e.amount) + '</strong></td>';
    expTbody.appendChild(tr);
  });

  /* ── P&L ──────────────────────────────────────────── */
  var plRows = [
    { label: 'Ingresos Totales',     value: totalRevenue, cls: 'pl-subtotal positive', indent: false },
    { label: 'Mensualidades',        value: REVENUE_BY_CATEGORY['Mensualidades'],  cls: '', indent: true },
    { label: 'Matrículas',           value: REVENUE_BY_CATEGORY['Matrículas'],     cls: '', indent: true },
    { label: 'Venta de Equipo',      value: REVENUE_BY_CATEGORY['Venta de Equipo'], cls: '', indent: true },
    { label: 'Venta Uniformes',      value: REVENUE_BY_CATEGORY['Venta Uniformes'], cls: '', indent: true },
    { label: 'Exámenes de Rango',    value: REVENUE_BY_CATEGORY['Exámenes Rango'], cls: '', indent: true },
    { label: 'Otros',                value: REVENUE_BY_CATEGORY['Otros'],          cls: '', indent: true },
    { label: 'Costo de Ventas (COGS)', value: -cogs, cls: 'pl-indent negative', indent: false },
    { label: 'Ganancia Bruta',       value: grossProfit, cls: 'pl-subtotal', indent: false },
    { label: 'Gastos Operativos',    value: -opex,   cls: 'negative', indent: true },
    { label: 'Nómina',               value: -staffCost, cls: 'negative', indent: true },
    { label: 'Utilidad Neta',        value: netProfit, cls: 'pl-total ' + (netProfit >= 0 ? 'positive' : 'negative'), indent: false },
  ];

  var plTbody = document.getElementById('pl-tbody');
  plRows.forEach(function (row) {
    var tr = document.createElement('tr');
    if (row.cls) tr.className = row.cls;

    var sign = '';
    if (row.value < 0) sign = '<span style="color:#991B1B">-</span>';
    var display = fmtCurrency(Math.abs(row.value));

    var labelCls = row.indent ? 'pl-indent' : '';

    tr.innerHTML =
      '<td class="' + labelCls + '">' + row.label + '</td>' +
      '<td>' + sign + display + '</td>';
    plTbody.appendChild(tr);
  });
});
