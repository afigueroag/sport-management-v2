document.addEventListener('DOMContentLoaded', function () {
  var nextId = TRANSACTIONS.length + 1;

  /* ── KPI cards ────────────────────────────────────── */
  function renderKpis() {
    var total    = TRANSACTIONS.reduce(function (s, t) { return s + t.amount; }, 0);
    var received = TRANSACTIONS.filter(function (t) { return t.status === 'Recibido'; })
                               .reduce(function (s, t) { return s + t.amount; }, 0);
    var pending  = total - received;

    document.getElementById('kpi-total-rev').textContent  = fmtCurrency(total);
    document.getElementById('kpi-txn-count').textContent  = TRANSACTIONS.length + ' transacciones';
    document.getElementById('kpi-received').textContent   = fmtCurrency(received);
    document.getElementById('kpi-pending-rev').textContent = fmtCurrency(pending);
  }

  /* ── Table ────────────────────────────────────────── */
  function renderTable() {
    var tbody = document.getElementById('sales-tbody');
    tbody.innerHTML = '';
    TRANSACTIONS.slice().reverse().forEach(function (t) {
      var badgeCls = t.status === 'Recibido' ? 'badge-recibido' : 'badge-pendiente';
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td style="white-space:nowrap">' + fmtDate(t.date) + '</td>' +
        '<td><strong>' + t.student + '</strong></td>' +
        '<td>' + t.group + '</td>' +
        '<td><span style="font-size:12px;background:#F1F5F9;padding:2px 8px;border-radius:4px;font-weight:500">' + t.type + '</span></td>' +
        '<td style="color:#64748B;font-size:12px;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + t.description + '</td>' +
        '<td>' + t.method + '</td>' +
        '<td><strong>' + fmtCurrency(t.amount) + '</strong></td>' +
        '<td><span class="badge ' + badgeCls + '">' + t.status + '</span></td>' +
        '<td>' +
          '<button class="btn btn-outline btn-sm" title="Ver detalle"><i class="fa-solid fa-eye"></i></button>' +
        '</td>';
      tbody.appendChild(tr);
    });

    document.getElementById('sales-count').textContent = TRANSACTIONS.length + ' transacciones';
  }

  /* ── New transaction form ─────────────────────────── */
  document.getElementById('txn-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var student = document.getElementById('f-student').value.trim();
    var group   = document.getElementById('f-group').value;
    var type    = document.getElementById('f-type').value;
    var method  = document.getElementById('f-method').value;
    var amount  = parseFloat(document.getElementById('f-amount').value);
    var desc    = document.getElementById('f-desc').value.trim();
    var status  = document.getElementById('f-status').value;

    if (!student || !amount || amount <= 0) {
      alert('Por favor completa los campos requeridos.');
      return;
    }

    var today = new Date();
    var dateStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

    TRANSACTIONS.unshift({
      id: nextId++,
      date: dateStr,
      student: student,
      group: group,
      type: type,
      description: desc || type,
      method: method,
      amount: amount,
      status: status,
    });

    document.getElementById('txn-form').reset();
    renderKpis();
    renderTable();
  });

  renderKpis();
  renderTable();
});
