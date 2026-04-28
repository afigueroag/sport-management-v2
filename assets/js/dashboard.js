document.addEventListener('DOMContentLoaded', function () {
  var today = new Date('2026-04-28');
  var currentMonth = '2026-04';

  /* ── KPI computations ─────────────────────────────── */
  var activeStudents = STUDENTS.length;

  var oldAR = STUDENTS.filter(function (s) {
    if (s.pendingAmount <= 0) return false;
    var last = new Date(s.lastPayment);
    return (today - last) / 86400000 > 60;
  }).reduce(function (sum, s) { return sum + s.pendingAmount; }, 0);

  var monthlyAR = TRANSACTIONS
    .filter(function (t) { return t.date.startsWith(currentMonth) && t.status === 'Pendiente'; })
    .reduce(function (sum, t) { return sum + t.amount; }, 0);

  var monthlySales = TRANSACTIONS
    .filter(function (t) { return t.date.startsWith(currentMonth) && t.status === 'Recibido'; })
    .reduce(function (sum, t) { return sum + t.amount; }, 0);

  var pendingCount = STUDENTS.filter(function (s) { return s.pendingAmount > 0; }).length;

  var billedHours = STAFF.reduce(function (sum, s) { return sum + s.reportedHours; }, 0);

  /* ── Render KPI cards ─────────────────────────────── */
  var kpis = [
    { label: 'Estudiantes Activos',         value: activeStudents,         display: activeStudents + ' alumnos', icon: 'fa-user-graduate',        color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'C×C Antiguas (>60 días)',     value: oldAR,                  display: fmtCurrency(oldAR),           icon: 'fa-clock-rotate-left',     color: '#EF4444', bg: '#FEF2F2' },
    { label: 'C×C del Mes',                value: monthlyAR,              display: fmtCurrency(monthlyAR),       icon: 'fa-calendar-xmark',        color: '#F97316', bg: '#FFF7ED' },
    { label: 'Ventas del Mes',             value: monthlySales,           display: fmtCurrency(monthlySales),    icon: 'fa-circle-dollar-to-slot', color: '#10B981', bg: '#F0FDF4' },
    { label: 'Alumnos con Pago Pendiente', value: pendingCount,           display: pendingCount + ' alumnos',   icon: 'fa-user-clock',            color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Horas Facturadas Staff',     value: billedHours,            display: billedHours + ' hrs',        icon: 'fa-stopwatch',             color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  var kpiGrid = document.getElementById('kpi-grid');
  kpis.forEach(function (k) {
    var card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML =
      '<div class="card-icon" style="background:' + k.bg + ';color:' + k.color + '">' +
        '<i class="fa-solid ' + k.icon + '"></i>' +
      '</div>' +
      '<div class="card-label">' + k.label + '</div>' +
      '<div class="card-value">' + k.display + '</div>';
    kpiGrid.appendChild(card);
  });

  /* ── Sales bar chart ──────────────────────────────── */
  var labels   = Object.keys(MONTHLY_REVENUE);
  var values   = Object.values(MONTHLY_REVENUE);
  var barColors = values.map(function (v) { return v > 0 ? 'rgba(245,158,11,0.85)' : 'rgba(226,232,240,0.6)'; });

  buildBarChart('sales-chart', labels, [{
    label: 'Ventas',
    data: values,
    backgroundColor: barColors,
    borderRadius: 5,
    borderSkipped: false,
  }]);

  /* ── Pending students table ───────────────────────── */
  var pending = STUDENTS.filter(function (s) { return s.pendingAmount > 0; });
  var tbody = document.getElementById('pending-tbody');

  pending.forEach(function (s) {
    var last  = new Date(s.lastPayment);
    var days  = Math.round((today - last) / 86400000);
    var overdue = days > 30;
    var badgeCls = overdue ? 'badge-overdue' : 'badge-pending';
    var badgeTxt = overdue ? 'Vencido' : 'Pendiente';

    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><strong>' + s.name + '</strong></td>' +
      '<td>' + s.group + '</td>' +
      '<td>' + fmtDate(s.lastPayment) + '</td>' +
      '<td>' + days + ' días</td>' +
      '<td><strong style="color:#991B1B">' + fmtCurrency(s.pendingAmount) + '</strong></td>' +
      '<td><span class="badge ' + badgeCls + '">' + badgeTxt + '</span></td>';
    tbody.appendChild(tr);
  });

  document.getElementById('pending-count').textContent = pending.length + ' alumno' + (pending.length !== 1 ? 's' : '');
});
