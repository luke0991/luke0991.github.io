/**
 * UXScope - Interactive Experience Script
 * Handles Theme Toggling, Before/After Switchers, UX Simulations, Star Rating & Feedback Form.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initBeforeAfterTabs();
  initUXSimulator();
  initVoteButtons();
  initStarRating();
  initFeedbackForm();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or prefer system setting
  const savedTheme = localStorage.getItem('uxscope-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('uxscope-theme', newTheme);

      showToast(
        newTheme === 'dark' ? '🌙 Đã chuyển sang giao diện Tối' : '☀️ Đã chuyển sang giao diện Sáng',
        'info'
      );
    });
  }
}

/* ==========================================================================
   2. Before / After Visual Comparison Tabs (Feedback 1)
   ========================================================================== */
function initBeforeAfterTabs() {
  const switchBtns = document.querySelectorAll('.switch-btn');
  const screens = document.querySelectorAll('.comparison-screen');

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Update button active states
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update screens active states
      screens.forEach(screen => {
        if (screen.id === targetId) {
          screen.classList.add('is-active');
        } else {
          screen.classList.remove('is-active');
        }
      });
    });
  });
}

/* ==========================================================================
   3. UX Live Simulator (Feedback 2)
   ========================================================================== */
function initUXSimulator() {
  const btnBad = document.getElementById('btn-simulate-bad');
  const consoleBad = document.getElementById('console-bad');

  const btnGood = document.getElementById('btn-simulate-good');
  const consoleGood = document.getElementById('console-good');

  let badClicks = 0;

  // Bad UX Demo: No feedback on click
  if (btnBad && consoleBad) {
    btnBad.addEventListener('click', () => {
      badClicks++;
      consoleBad.textContent = `⚠️ Đã click ${badClicks} lần nhưng hệ thống không có bất kỳ phản hồi nào! (Gây hoang mang cho người dùng)`;
      consoleBad.style.color = '#f87171';
    });
  }

  // Good UX Demo: Instant loading spinner -> Success checkmark + Toast
  if (btnGood && consoleGood) {
    btnGood.addEventListener('click', () => {
      if (btnGood.classList.contains('is-loading') || btnGood.classList.contains('is-success')) {
        return;
      }

      // Step 1: Loading feedback
      btnGood.classList.add('is-loading');
      consoleGood.textContent = '⏳ [0ms] Bắt đầu xử lý: Hiển thị spinner phản hồi ngay lập tức...';
      consoleGood.style.color = '#38bdf8';

      // Step 2: Simulated network request completion
      setTimeout(() => {
        btnGood.classList.remove('is-loading');
        btnGood.classList.add('is-success');
        consoleGood.textContent = '✅ [600ms] Xử lý hoàn tất: Xác nhận thành công và cập nhật giỏ!';
        consoleGood.style.color = '#34d399';

        showToast('✓ Đã thêm sản phẩm vào danh sách thành công!', 'success');

        // Reset button after 2.5s
        setTimeout(() => {
          btnGood.classList.remove('is-success');
          consoleGood.textContent = 'Trạng thái: Sẵn sàng thử nghiệm lại';
          consoleGood.style.color = 'var(--accent-emerald)';
        }, 2500);
      }, 700);
    });
  }
}

/* ==========================================================================
   4. Vote / Agree Interactive Counter
   ========================================================================== */
function initVoteButtons() {
  const voteBtns = document.querySelectorAll('.btn-vote');

  voteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isVoted = btn.getAttribute('data-voted') === 'true';
      let count = parseInt(btn.getAttribute('data-count'), 10) || 0;
      const countEl = btn.querySelector('.vote-count');

      if (!isVoted) {
        count++;
        btn.setAttribute('data-voted', 'true');
        btn.setAttribute('data-count', count);
        btn.classList.add('has-voted');
        if (countEl) countEl.textContent = count;
        showToast('Cảm ơn bạn đã đồng thuận với ý kiến đánh giá này!', 'info');
      } else {
        count--;
        btn.setAttribute('data-voted', 'false');
        btn.setAttribute('data-count', count);
        btn.classList.remove('has-voted');
        if (countEl) countEl.textContent = count;
      }
    });
  });
}

/* ==========================================================================
   5. Interactive Star Rating Widget
   ========================================================================== */
let currentRatingValue = 4;

function initStarRating() {
  const starBtns = document.querySelectorAll('.star-btn');
  const ratingText = document.getElementById('rating-score-text');

  const ratingDescriptions = {
    1: '1 / 5 Sao (Rất cần cải thiện)',
    2: '2 / 5 Sao (Chưa tốt)',
    3: '3 / 5 Sao (Tạm ổn)',
    4: '4 / 5 Sao (Khá tốt)',
    5: '5 / 5 Sao (Tuyệt vời)'
  };

  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-value'), 10);
      currentRatingValue = val;

      starBtns.forEach(b => {
        const bVal = parseInt(b.getAttribute('data-value'), 10);
        if (bVal <= val) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      if (ratingText) {
        ratingText.textContent = ratingDescriptions[val] || `${val} / 5 Sao`;
      }
    });
  });
}

/* ==========================================================================
   6. Feedback Submission Form
   ========================================================================== */
function initFeedbackForm() {
  const form = document.getElementById('new-feedback-form');
  const streamContainer = document.getElementById('feedbacks-stream');
  const totalCountBadge = document.getElementById('total-contributions-count');

  if (!form) return;

  const nameInput = document.getElementById('user-name');
  const titleInput = document.getElementById('feedback-title');
  const contentInput = document.getElementById('feedback-content');
  const categorySelect = document.getElementById('feedback-category');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, true);
      isValid = false;
    } else {
      showError(nameInput, false);
    }

    // Validate Title
    if (!titleInput.value.trim()) {
      showError(titleInput, true);
      isValid = false;
    } else {
      showError(titleInput, false);
    }

    // Validate Content (>= 10 chars)
    if (!contentInput.value.trim() || contentInput.value.trim().length < 10) {
      showError(contentInput, true);
      isValid = false;
    } else {
      showError(contentInput, false);
    }

    if (!isValid) return;

    // Build new feedback object
    const authorName = nameInput.value.trim();
    const feedbackTitle = titleInput.value.trim();
    const feedbackText = contentInput.value.trim();
    const category = categorySelect.value.toUpperCase();
    const initials = getInitials(authorName);

    // Create stream DOM item
    const newItem = document.createElement('div');
    newItem.className = 'stream-item';
    
    const tagClass = category === 'UI' ? 'tag-ui-sm' : 'tag-ux-sm';

    newItem.innerHTML = `
      <div class="stream-avatar">${escapeHtml(initials)}</div>
      <div class="stream-content">
        <div class="stream-top">
          <span class="stream-author">${escapeHtml(authorName)}</span>
          <span class="stream-tag ${tagClass}">${escapeHtml(category)}</span>
          <span class="stream-time">Vừa xong</span>
        </div>
        <div class="stream-title-text">${escapeHtml(feedbackTitle)}</div>
        <p class="stream-desc">${escapeHtml(feedbackText)}</p>
      </div>
    `;

    // Prepend to list
    if (streamContainer) {
      streamContainer.prepend(newItem);
    }

    // Update count badge
    if (totalCountBadge) {
      const currentCount = streamContainer.querySelectorAll('.stream-item').length;
      totalCountBadge.textContent = `${currentCount} đóng góp`;
    }

    // Reset Form
    form.reset();
    showToast('🎉 Đóng góp ý kiến của bạn đã được ghi nhận thành công!', 'success');
  });

  // Clear errors on typing
  [nameInput, titleInput, contentInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => showError(input, false));
    }
  });
}

function showError(inputElement, hasError) {
  const formGroup = inputElement.closest('.form-group');
  if (formGroup) {
    if (hasError) {
      formGroup.classList.add('has-error');
    } else {
      formGroup.classList.remove('has-error');
    }
  }
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

/* ==========================================================================
   7. Toast Notification Engine
   ========================================================================== */
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}
