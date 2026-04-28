document.addEventListener('DOMContentLoaded', function () {
  var currentFilter = 'all';
  var localStaff = STAFF.map(function (s) { return Object.assign({}, s); });

  /* ── KPI cards ────────────────────────────────────── */
  function renderKpis() {
    var totalHours = localStaff.reduce(function (s, r) { return s + r.reportedHours; }, 0);
    var totalAmt   = localStaff.reduce(function (s, r) { return s + r.reportedHours * r.rate; }, 0);
    var paidAmt    = localStaff.filter(function (r) { return r.status === 'Paid'; })
                               .reduce(function (s, r) { return s + r.reportedHours * r.rate; }, 0);
    var pendAmt    = totalAmt - paidAmt;

    document.getElementById('kpi-hours').textContent  = totalHours + ' hrs';
    document.getElementById('kpi-total').textContent  = fmtCurrency(totalAmt);
    document.getElementById('kpi-paid').textContent   = fmtCurrency(paidAmt);
    document.getElementById('kpi-pend').textContent   = fmtCurrency(pendAmt);
  }

  /* ── Table render ─────────────────────────────────── */
  function renderTable() {
    var filtered = currentFilter === 'all'
      ? localStaff
      : localStaff.filter(function (s) { return s.status === (currentFilter === 'paid' ? 'Paid' : 'Pending'); });

    var tbody = document.getElementById('staff-tbody');
    tbody.innerHTML = '';

    filtered.forEach(function (s) {
      var total    = s.reportedHours * s.rate;
      var isPaid   = s.status === 'Paid';
      var badgeCls = isPaid ? 'badge-paid' : 'badge-pending';
      var badgeTxt = isPaid ? 'Pagado' : 'Pendiente';

      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><strong>' + s.name + '</strong></td>' +
        '<td>' +
          '<span style="display:inline-flex;align-items:center;gap:6px">' +
            '<i class="fa-solid ' + (s.role === 'Teacher' ? 'fa-chalkboard-user' : 'fa-person-chalkboard') + '" style="color:' + (s.role === 'Teacher' ? '#3B82F6' : '#8B5CF6') + '"></i>' +
            (s.role === 'Teacher' ? 'Profesor' : 'Asistente') +
          '</span>' +
        '</td>' +
        '<td>' + s.day + '</td>' +
        '<td style="text-align:center">' + s.reportedHours + '</td>' +
        '<td>' + fmtCurrency(s.rate) + '/hr</td>' +
        '<td><strong>' + fmtCurrency(total) + '</strong></td>' +
        '<td><span class="badge ' + badgeCls + '">' + badgeTxt + '</span></td>' +
        '<td>' +
          (!isPaid
            ? '<button class="btn btn-success btn-sm" onclick="markPaid(' + s.id + ')"><i class="fa-solid fa-check"></i> Marcar Pagado</button>'
            : '<span style="color:#94A3B8;font-size:12px"><i class="fa-solid fa-circle-check"></i> Liquidado</span>'
          ) +
        '</td>';
      tbody.appendChild(tr);
    });

    document.getElementById('staff-count').textContent = filtered.length + ' registro' + (filtered.length !== 1 ? 's' : '');
  }

  /* ── Mark paid (in-memory) ────────────────────────── */
  window.markPaid = function (id) {
    var rec = localStaff.find(function (s) { return s.id === id; });
    if (rec) { rec.status = 'Paid'; renderKpis(); renderTable(); }
  };

  /* ── Filter pills ─────────────────────────────────── */
  document.querySelectorAll('.staff-pill').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.staff-pill').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTable();
    });
  });

  renderKpis();
  renderTable();
});
