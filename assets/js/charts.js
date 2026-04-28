var CHART_COLORS = ['#F59E0B','#3B82F6','#10B981','#8B5CF6','#F97316','#EF4444','#06B6D4','#EC4899'];

function buildBarChart(canvasId, labels, datasets, options) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  return new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: { labels: labels, datasets: datasets },
    options: Object.assign({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: datasets.length > 1, labels: { font: { family: 'Inter', size: 12 } } }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#F1F5F9' },
          ticks: { font: { family: 'Inter', size: 11 }, callback: function(v) { return '$' + v.toLocaleString('es-MX'); } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11 } }
        }
      }
    }, options || {})
  });
}

function buildHBarChart(canvasId, labels, datasets, options) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  return new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: { labels: labels, datasets: datasets },
    options: Object.assign({
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: '#F1F5F9' },
          ticks: { font: { family: 'Inter', size: 11 }, callback: function(v) { return '$' + v.toLocaleString('es-MX'); } }
        },
        y: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 12 } }
        }
      }
    }, options || {})
  });
}

function fmtCurrency(n) {
  return '$' + Number(n).toLocaleString('es-MX');
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  var parts = dateStr.split('-');
  var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return parts[2] + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
}
