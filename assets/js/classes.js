document.addEventListener('DOMContentLoaded', function () {
  var currentFilter = 'all';
  var today = new Date('2026-04-28');

  /* ── KPI cards ────────────────────────────────────── */
  function renderKpis() {
    var totalStudents   = STUDENTS.length;
    var enrollDebt      = STUDENTS.filter(function (s) { return !s.enrollmentPaid; })
                                  .reduce(function (sum, s) { return sum + s.annualEnrollment; }, 0);
    var monthlyDebt     = STUDENTS.filter(function (s) { return !s.monthlyPaid; })
                                  .reduce(function (sum, s) { return sum + s.monthlyFee; }, 0);
    var totalPotential  = STUDENTS.reduce(function (sum, s) { return sum + s.monthlyFee; }, 0);
    var collected       = STUDENTS.filter(function (s) { return s.monthlyPaid; })
                                  .reduce(function (sum, s) { return sum + s.monthlyFee; }, 0);
    var pct             = totalPotential > 0 ? Math.round(collected / totalPotential * 100) : 0;

    document.getElementById('kpi-students').textContent   = totalStudents + ' alumnos';
    document.getElementById('kpi-enroll-debt').textContent = fmtCurrency(enrollDebt);
    document.getElementById('kpi-monthly-debt').textContent = fmtCurrency(monthlyDebt);
    document.getElementById('kpi-collection').textContent  = pct + '%';
  }

  /* ── Main table ───────────────────────────────────── */
  function renderTable() {
    var filtered = STUDENTS.filter(function (s) {
      if (currentFilter === 'enrollment') return !s.enrollmentPaid;
      if (currentFilter === 'monthly')    return !s.monthlyPaid;
      if (currentFilter === 'uptodate')   return s.enrollmentPaid && s.monthlyPaid;
      return true;
    });

    var tbody = document.getElementById('classes-tbody');
    tbody.innerHTML = '';

    filtered.forEach(function (s) {
      var statusBadge = '';
      if (!s.enrollmentPaid) statusBadge += '<span class="badge badge-enrollment" style="margin-right:4px">Matrícula</span>';
      if (!s.monthlyPaid)    statusBadge += '<span class="badge badge-monthly">Mensualidad</span>';
      if (s.enrollmentPaid && s.monthlyPaid) statusBadge = '<span class="badge badge-uptodate">Al día</span>';

      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><strong>' + s.name + '</strong></td>' +
        '<td><span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;background:#F1F5F9;font-weight:500">' + s.group + '</span></td>' +
        '<td>' + fmtCurrency(s.monthlyFee) + '/mes</td>' +
        '<td>' + fmtCurrency(s.annualEnrollment) + '/año</td>' +
        '<td>' + fmtDate(s.lastPayment) + '</td>' +
        '<td>' + (s.pendingAmount > 0 ? '<strong style="color:#991B1B">' + fmtCurrency(s.pendingAmount) + '</strong>' : '<span style="color:#065F46;font-weight:600">$0</span>') + '</td>' +
        '<td>' + statusBadge + '</td>' +
        '<td>' +
          '<button class="btn btn-outline btn-sm" title="Ver detalle"><i class="fa-solid fa-eye"></i></button> ' +
          '<button class="btn btn-primary btn-sm" title="Registrar pago"><i class="fa-solid fa-dollar-sign"></i></button>' +
        '</td>';
      tbody.appendChild(tr);
    });

    document.getElementById('classes-count').textContent = filtered.length + ' alumno' + (filtered.length !== 1 ? 's' : '');
  }

  /* ── Enrollment calendar ──────────────────────────── */
  function renderCalendar() {
    var items = STUDENTS.map(function (s) {
      var last   = new Date(s.lastPayment);
      var renewal = new Date(last.getFullYear() + 1, last.getMonth(), last.getDate());
      return { name: s.name, group: s.group, renewal: renewal };
    })
    .filter(function (x) { return x.renewal >= today; })
    .sort(function (a, b) { return a.renewal - b.renewal; })
    .slice(0, 8);

    var cal = document.getElementById('cal-list');
    cal.innerHTML = '';
    items.forEach(function (x) {
      var dateStr = x.renewal.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
      var daysAway = Math.round((x.renewal - today) / 86400000);
      var urgency = daysAway <= 30 ? 'color:#D97706;font-weight:600' : 'color:#64748B';

      var div = document.createElement('div');
      div.className = 'cal-item';
      div.innerHTML =
        '<div>' +
          '<strong style="font-size:13px">' + x.name + '</strong>' +
          '<div style="font-size:11px;color:#64748B;margin-top:2px">' + x.group + '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<div class="cal-date">' + dateStr + '</div>' +
          '<div style="font-size:11px;' + urgency + '">en ' + daysAway + ' días</div>' +
        '</div>';
      cal.appendChild(div);
    });
  }

  /* ── Group summary ────────────────────────────────── */
  function renderGroupSummary() {
    var groups = {};
    STUDENTS.forEach(function (s) {
      if (!groups[s.group]) groups[s.group] = { students: 0, enrollDebt: 0, monthlyDebt: 0 };
      groups[s.group].students++;
      if (!s.enrollmentPaid) groups[s.group].enrollDebt  += s.annualEnrollment;
      if (!s.monthlyPaid)    groups[s.group].monthlyDebt += s.monthlyFee;
    });

    var tbody = document.getElementById('group-tbody');
    tbody.innerHTML = '';
    Object.keys(groups).sort().forEach(function (g) {
      var d = groups[g];
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><strong>' + g + '</strong></td>' +
        '<td style="text-align:center">' + d.students + '</td>' +
        '<td style="color:' + (d.enrollDebt > 0 ? '#991B1B' : '#065F46') + ';font-weight:600">' + fmtCurrency(d.enrollDebt) + '</td>' +
        '<td style="color:' + (d.monthlyDebt > 0 ? '#D97706' : '#065F46') + ';font-weight:600">' + fmtCurrency(d.monthlyDebt) + '</td>' +
        '<td><strong style="color:#991B1B">' + fmtCurrency(d.enrollDebt + d.monthlyDebt) + '</strong></td>';
      tbody.appendChild(tr);
    });
  }

  /* ── Total debt summary ───────────────────────────── */
  function renderDebtSummary() {
    var totalDebt = STUDENTS.reduce(function (sum, s) { return sum + s.pendingAmount; }, 0);
    var enrollDebt = STUDENTS.filter(function (s) { return !s.enrollmentPaid; })
                             .reduce(function (sum, s) { return sum + s.annualEnrollment; }, 0);
    var monthlyDebt = STUDENTS.filter(function (s) { return !s.monthlyPaid; })
                              .reduce(function (sum, s) { return sum + s.monthlyFee; }, 0);
    document.getElementById('debt-total').textContent   = fmtCurrency(totalDebt);
    document.getElementById('debt-enroll').textContent  = fmtCurrency(enrollDebt);
    document.getElementById('debt-monthly').textContent = fmtCurrency(monthlyDebt);
  }

  /* ── Filters ──────────────────────────────────────── */
  document.querySelectorAll('.classes-pill').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.classes-pill').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTable();
    });
  });

  renderKpis();
  renderTable();
  renderCalendar();
  renderGroupSummary();
  renderDebtSummary();
});
