(function () {
  var links = [
    { href: 'dashboard.html', icon: 'fa-gauge-high',    label: 'Dashboard'         },
    { href: 'staff.html',     icon: 'fa-users',          label: 'Staff / Instructores' },
    { href: 'classes.html',   icon: 'fa-graduation-cap', label: 'Clases / Alumnos'  },
    { href: 'sales.html',     icon: 'fa-receipt',        label: 'Ventas'            },
    { href: 'finances.html',  icon: 'fa-chart-pie',      label: 'Finanzas'          },
  ];

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  var navHtml = links.map(function (l) {
    var cls = currentPage === l.href ? 'active' : '';
    return '<a href="' + l.href + '" class="' + cls + '"><i class="fa-solid ' + l.icon + '"></i>' + l.label + '</a>';
  }).join('');

  var html = [
    '<div id="sidebar">',
    '  <div class="logo">',
    '    <h1><i class="fa-solid fa-dumbbell" style="margin-right:8px;color:#F59E0B"></i>Elite Sport</h1>',
    '    <p>Academy Management</p>',
    '  </div>',
    '  <nav>' + navHtml + '</nav>',
    '  <div class="sidebar-footer">',
    '    <div class="user-info">',
    '      <div class="avatar">AD</div>',
    '      <div>',
    '        <div class="user-name">Admin Demo</div>',
    '        <div class="user-role">Administrador</div>',
    '      </div>',
    '    </div>',
    '    <a href="index.html" class="signout"><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</a>',
    '  </div>',
    '</div>',
    '<div class="sidebar-overlay" id="sb-overlay"></div>',
    '<button class="hamburger" id="sb-hamburger"><i class="fa-solid fa-bars"></i></button>',
  ].join('');

  var root = document.getElementById('sidebar-root');
  if (root) root.innerHTML = html;

  function openSb()  { document.getElementById('sidebar').classList.add('open'); document.getElementById('sb-overlay').classList.add('open'); }
  function closeSb() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sb-overlay').classList.remove('open'); }

  document.getElementById('sb-hamburger').addEventListener('click', openSb);
  document.getElementById('sb-overlay').addEventListener('click', closeSb);
})();
