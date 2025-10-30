const form = document.getElementById('full-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const privacyCheckbox = document.getElementById('agree');
const privacyModal = document.getElementById('privacy-modal');
const modalConfirmBtn = document.getElementById('modalConfirm');
const modalCloseBtn = document.getElementById('modalClose');

let privacyConfirmed = false;

function validateAllInputs(formElement) {
  let firstInvalid = null;
  const controls = Array.from(formElement.querySelectorAll('input, select, textarea'));
  controls.forEach(control => {
    control.classList.remove('is-invalid');
    if (!control.checkValidity()) {
      control.classList.add('is-invalid');
      if (!firstInvalid) firstInvalid = control;
    }
  });
  return firstInvalid;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  const firstInvalid = validateAllInputs(form);
  if (firstInvalid) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    firstInvalid.focus();
    return;
  }

  if (!privacyCheckbox.checked) {
    alert('請先勾選「我已閱讀並同意隱私權條款」');
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    return;
  }

  if (!privacyConfirmed) {
    privacyModal.classList.remove('d-none');
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  alert('資料已送出，感謝您的聯絡！');

  form.reset();
  privacyConfirmed = false;
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  Array.from(form.elements).forEach(el => el.classList.remove('is-invalid'));
  privacyConfirmed = false;
});

form.addEventListener('input', (event) => {
  const target = event.target;
  if (target.classList.contains('is-invalid') && target.checkValidity()) {
    target.classList.remove('is-invalid');
  }
});

modalConfirmBtn.addEventListener('click', () => {
  privacyConfirmed = true;
  privacyModal.classList.add('d-none');
  alert('您已同意隱私權條款，請再次點擊送出表單');
});

modalCloseBtn.addEventListener('click', () => {
  privacyModal.classList.add('d-none');
});