// App.js - Interactivity & Logic for Trackify AI

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Loader ---
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }, 400); // Quick load animation
  }

  // --- 2. Theme Toggling ---
  const themeToggleBtn = document.getElementById('themeToggle');
  const iconSun = '<i data-lucide="sun" width="18"></i>';
  const iconMoon = '<i data-lucide="moon" width="18"></i>';
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.body.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = iconSun;
        updateChartTheme('dark');
      } else {
        document.body.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = iconMoon;
        updateChartTheme('light');
      }
      lucide.createIcons();
    });
  }

  // --- 3. Sticky Navbar ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- 4. Scroll Animations (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.fade-up');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // --- 5. Count-up Animation ---
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        let current = 0;
        const increment = target / 50; // speed
        
        const updateCount = () => {
          if (current < target) {
            current += increment;
            entry.target.innerText = Math.ceil(current).toLocaleString();
            requestAnimationFrame(updateCount);
          } else {
            // formatting for specific symbols if needed
            let finalStr = target.toLocaleString();
            if (entry.target.hasAttribute('data-prefix')) {
              finalStr = entry.target.getAttribute('data-prefix') + finalStr;
            }
            if (entry.target.hasAttribute('data-suffix')) {
              finalStr += entry.target.getAttribute('data-suffix');
            }
            entry.target.innerText = finalStr;
          }
        };
        updateCount();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => statObserver.observe(el));

  // --- 6. Chart.js Initialization ---
  let priceChartInstance = null;
  const chartCanvas = document.getElementById('priceChart');
  
  function initChart(theme) {
    if (!chartCanvas) return;
    if (priceChartInstance) priceChartInstance.destroy();

    const ctx = chartCanvas.getContext('2d');
    const isLight = theme === 'light';
    
    const primaryColor = isLight ? '#0066ff' : '#5e6ad2';
    const gridColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.05)';
    const textColor = isLight ? '#666666' : '#8a8f98';
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (isLight) {
      gradient.addColorStop(0, 'rgba(0, 102, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 102, 255, 0.0)');
    } else {
      gradient.addColorStop(0, 'rgba(94, 106, 210, 0.4)');
      gradient.addColorStop(1, 'rgba(94, 106, 210, 0.0)');
    }

    priceChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
        datasets: [{
          label: 'Price ($)',
          data: [398, 398, 380, 360, 350, 345, 338],
          borderColor: primaryColor,
          backgroundColor: gradient,
          borderWidth: 2,
          pointBackgroundColor: primaryColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isLight ? '#ffffff' : '#141416',
            titleColor: isLight ? '#111' : '#fff',
            bodyColor: isLight ? '#666' : '#8a8f98',
            borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function(context) { return '$' + context.parsed.y; }
            }
          }
        },
        scales: {
          y: {
            grid: { color: gridColor, drawBorder: false },
            ticks: { color: textColor, callback: function(v) { return '$' + v; } }
          },
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { color: textColor }
          }
        },
        interaction: { intersect: false, mode: 'index' },
      }
    });
  }
  
  function updateChartTheme(theme) {
    initChart(theme);
  }
  
  // Init chart on load
  initChart(document.body.getAttribute('data-theme') || 'dark');

  // --- 7. Toast Notification Demo ---
  window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icon = type === 'success' 
      ? '<i data-lucide="check-circle" style="color: var(--accent-success);"></i>'
      : '<i data-lucide="bell" style="color: var(--accent-primary);"></i>';

    toast.innerHTML = `
      ${icon}
      <div>
        <h4 style="font-size: 0.9rem; margin-bottom: 0.1rem;">Notification</h4>
        <p style="font-size: 0.8rem; color: var(--text-secondary);">${message}</p>
      </div>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Remove after 4s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  // Active Link States
  const currentPath = window.location.pathname.split('/').pop();
  if (currentPath) {
    document.querySelectorAll('.sidebar-link, .nav-links a').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  // --- 8. Auth Logic ---
  window.handleLogin = function(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('email')?.value || 'user@example.com';
    localStorage.setItem('currentUser', JSON.stringify({ email }));
    window.location.href = 'dashboard.html';
  };

  window.handleRegister = function(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('email')?.value || 'user@example.com';
    const name = document.getElementById('name')?.value || 'User';
    localStorage.setItem('currentUser', JSON.stringify({ email, name }));
    window.location.href = 'dashboard.html';
  };

  window.handleLogout = function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  };

  // Auth Guard & UI Updates
  const currentUser = localStorage.getItem('currentUser');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  
  if (path === 'index.html' || path === '') {
    if (currentUser) {
      const authContainer = document.getElementById('auth-container');
      if (authContainer && authContainer.children.length >= 3) {
        authContainer.children[1].href = 'dashboard.html';
        authContainer.children[1].innerText = 'Dashboard';
        
        authContainer.children[2].href = '#';
        authContainer.children[2].onclick = (e) => { e.preventDefault(); handleLogout(); };
        authContainer.children[2].innerText = 'Logout';
        authContainer.children[2].className = 'btn btn-secondary';
      }
    }
  } else if (['dashboard.html', 'tracking.html', 'analytics.html'].includes(path)) {
    if (!currentUser) {
      window.location.href = 'login.html';
    }
  }

  // --- 9. Dashboard Skeletons ---
  setTimeout(() => {
    document.querySelectorAll('.skeleton').forEach(el => {
      el.classList.remove('skeleton');
    });
  }, 1500);

  // --- 10. Export CSV Demo ---
  window.exportCSV = function() {
    const csvContent = "data:text/csv;charset=utf-8,Product,Current Price,Target Price,Buy Score\nSony WH-1000XM5,299,300,98\nMacBook Air M2,999,850,65\nFujifilm X100VI,1599,1400,32";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "trackify_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported Successfully!', 'success');
  };

  // --- 11. HTML5 Drag & Drop ---
  const dragContainer = document.getElementById('drag-container');
  if (dragContainer) {
    let draggedItem = null;

    dragContainer.addEventListener('dragstart', function(e) {
      if(e.target.classList.contains('product-row')) {
        draggedItem = e.target;
        setTimeout(() => e.target.classList.add('dragging'), 0);
      }
    });

    dragContainer.addEventListener('dragend', function(e) {
      if(e.target.classList.contains('product-row')) {
        e.target.classList.remove('dragging');
        draggedItem = null;
        document.querySelectorAll('.product-row').forEach(row => row.classList.remove('drag-over'));
      }
    });

    dragContainer.addEventListener('dragover', function(e) {
      e.preventDefault();
      const afterElement = getDragAfterElement(dragContainer, e.clientY);
      const currentElement = document.elementFromPoint(e.clientX, e.clientY)?.closest('.product-row');
      
      document.querySelectorAll('.product-row').forEach(row => row.classList.remove('drag-over'));
      if(currentElement && currentElement !== draggedItem) {
        currentElement.classList.add('drag-over');
      }

      if (afterElement == null) {
        dragContainer.appendChild(draggedItem);
      } else {
        dragContainer.insertBefore(draggedItem, afterElement);
      }
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.product-row:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  }

  // --- 12. Track AI Button Simulation ---
  window.handleTrackAI = function() {
    const input = document.getElementById('track-url-input');
    if (!input) return;
    
    if (!input.value.trim()) {
      showToast('Please enter a valid product URL', 'error');
      return;
    }
    
    // Simulate AI loading process
    showToast('AI is analyzing the product page...', 'brain');
    
    const btn = document.querySelector('button[onclick="handleTrackAI()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;"></div> Analyzing';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      const newProductUrl = input.value;
      input.value = '';
      showToast('Product successfully added to tracking list!', 'success');
      
      // Update badge if exists
      const badge = document.querySelector('.badge-success');
      if (badge && badge.innerText.includes('Items Active')) {
        const num = parseInt(badge.innerText);
        if (!isNaN(num)) badge.innerText = `${num + 1} Items Active`;
      }

      // Add to tracking list if on tracking.html
      const trackList = document.querySelector('.track-list');
      if (trackList) {
        const newItem = document.createElement('div');
        newItem.className = 'track-list-item fade-up visible';
        newItem.innerHTML = `
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.02); border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color);">
              <i data-lucide="link" width="24" style="color: var(--text-secondary);"></i>
            </div>
            <div>
              <h4 style="margin-bottom: 0.25rem; font-size: 1.1rem;">New AI Tracked Item</h4>
              <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; gap: 1rem;">
                <span>Current: Analyzing...</span>
                <span style="color: var(--accent-success); font-weight: 600;">Target: Pend.</span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 2rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="bell" width="16" style="color: var(--accent-primary);"></i>
              <span style="font-size: 0.9rem; color: var(--text-secondary);">Active</span>
              <label class="toggle-switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
            <button class="btn btn-secondary" style="padding: 0.5rem; border-radius: 8px; border-color: rgba(248,81,73,0.2); color: var(--accent-danger);" onclick="this.closest('.track-list-item').remove();">
              <i data-lucide="trash-2" width="16"></i>
            </button>
          </div>
        `;
        trackList.insertBefore(newItem, trackList.firstChild);
        lucide.createIcons();
      }

      // Add to dashboard drag list if on dashboard.html
      const dragList = document.getElementById('drag-container');
      if (dragList) {
        const newRow = document.createElement('div');
        newRow.className = 'product-row fade-up visible';
        newRow.draggable = true;
        newRow.innerHTML = `
          <div style="display: flex; align-items: center; gap: 1rem;">
            <i data-lucide="grip-vertical" width="16" style="color: var(--text-muted); cursor: grab;"></i>
            <div class="product-image-sm"><i data-lucide="link" width="20" style="opacity: 0.5;"></i></div>
            <div style="font-weight: 500; font-size: 0.95rem;">New AI Tracked Item</div>
          </div>
          <div style="font-weight: 600;">--</div>
          <div style="color: var(--text-secondary);">--</div>
          <div style="color: var(--accent-success); font-weight: 700; display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="brain" width="14"></i> 90</div>
          <div><span class="badge badge-success">New</span></div>
          <div style="text-align: right; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="btn btn-secondary" style="padding: 0.3rem;"><i data-lucide="edit-2" width="14"></i></button>
            <button class="btn btn-secondary" style="padding: 0.3rem; color: var(--accent-danger); border-color: rgba(248,81,73,0.2);" onclick="this.closest('.product-row').remove();"><i data-lucide="trash-2" width="14"></i></button>
          </div>
        `;
        dragList.insertBefore(newRow, dragList.firstChild);
        lucide.createIcons();
      }

    }, 2500);
  };

  // --- 13. Landing Page Interactive Demo ---
  const demoSlider = document.getElementById('demo-slider');
  const demoTargetVal = document.getElementById('demo-target-val');
  if (demoSlider && demoTargetVal) {
    demoSlider.addEventListener('input', (e) => {
      demoTargetVal.innerText = '₹' + parseInt(e.target.value).toLocaleString('en-IN');
    });
  }

  window.runInteractiveDemo = function() {
    const btn = document.getElementById('demo-btn');
    if (!btn || btn.disabled) return;
    
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;border-top-color:#fff;"></div> Analyzing...';
    
    const placeholder = document.getElementById('demo-placeholder');
    const skeleton = document.getElementById('demo-skeleton');
    const productCard = document.getElementById('demo-product-card');
    
    if (placeholder) placeholder.style.display = 'none';
    if (productCard) productCard.style.display = 'none';
    if (skeleton) skeleton.style.display = 'flex';
    
    // Step 1: Simulated Fetch (1.5s)
    setTimeout(() => {
      if (skeleton) skeleton.style.display = 'none';
      if (productCard) productCard.style.display = 'flex';
      btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;border-top-color:#fff;"></div> Polling...';
      lucide.createIcons();
      
      // Step 2: Price Drop Simulation
      setTimeout(() => {
        const currentPrice = document.getElementById('demo-current-price');
        const badge = document.getElementById('demo-status-badge');
        const flash = document.getElementById('demo-flash');
        
        if (flash) flash.style.opacity = '1';
        
        if (currentPrice) {
          currentPrice.innerText = '₹71,900';
          currentPrice.style.color = 'var(--accent-success)';
        }
        
        if (badge) {
          badge.className = 'badge badge-success';
          badge.innerHTML = '<i data-lucide="check-circle" width="12"></i> Target Hit';
        }
        
        setTimeout(() => { if (flash) flash.style.opacity = '0'; }, 800);
        
        lucide.createIcons();
        
        btn.innerHTML = '<i data-lucide="check" width="18"></i> Active';
        btn.classList.remove('btn-primary', 'btn-glow');
        btn.classList.add('btn-secondary');
        btn.style.color = 'var(--accent-success)';
        
        showToast('Target Hit! iPhone 15 Pro dropped to ₹71,900.', 'success');
        
      }, 2500);
      
    }, 1500);
  };

  // --- 14. Mobile Hamburger Menu ---
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  
  if (mobileToggleBtn && navLinksContainer) {
    mobileToggleBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });
    
    // Close menu when clicking a link
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
      });
    });
  }

  // --- 15. Safe Form Submission for Auth Pages ---
  document.querySelectorAll('form').forEach(form => {
    // If the form doesn't already have an inline onsubmit handler
    if (!form.getAttribute('onsubmit')) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
          localStorage.setItem('currentUser', JSON.stringify({ email: emailInput.value }));
          window.location.href = 'dashboard.html';
        }
      });
    }
  });

});
