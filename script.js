let selectedRecipient = 'professor';
let selectedTone = 'formal';
let selectedSubject = '';
let generatedEmail = '';

// Chip selection
document.querySelectorAll('#recipientGroup .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#recipientGroup .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedRecipient = chip.dataset.value;
  });
});

document.querySelectorAll('#toneGroup .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#toneGroup .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedTone = chip.dataset.value;
  });
});

async function generateEmail() {
  const purpose = document.getElementById('purpose').value.trim();
  const senderName = document.getElementById('senderName').value.trim();

  if (!purpose) { alert('Please describe what you want to say!'); return; }
  if (!senderName) { alert('Please enter your name!'); return; }

  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Composing...';

  document.getElementById('outputCard').classList.add('hidden');
  document.getElementById('loading').classList.remove('hidden');

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient: selectedRecipient, tone: selectedTone, purpose, senderName })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    // Likelihood
    const likelihood = data.responseLikelihood || 75;
    document.getElementById('likelihoodBar').style.width = likelihood + '%';
    document.getElementById('likelihoodPercent').textContent = likelihood + '%';

    // Subject lines
    selectedSubject = '';
    const subjectContainer = document.getElementById('subjectLines');
    subjectContainer.innerHTML = '';
    (data.subjectLines || []).forEach((subject, i) => {
      const div = document.createElement('div');
      div.className = 'subject-item';
      div.innerHTML = `<span>${subject}</span><span class="check">✦</span>`;
      div.onclick = () => {
        document.querySelectorAll('.subject-item').forEach(s => s.classList.remove('selected'));
        div.classList.add('selected');
        selectedSubject = subject;
      };
      if (i === 0) {
        div.classList.add('selected');
        selectedSubject = subject;
      }
      subjectContainer.appendChild(div);
    });

    // Email
    generatedEmail = data.email || '';
    document.getElementById('emailOutput').textContent = generatedEmail;

    // Follow up
    document.getElementById('followUp').textContent = data.followUp || '';

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('outputCard').classList.remove('hidden');

  } catch (error) {
    document.getElementById('loading').classList.add('hidden');
    alert('Error: ' + error.message);
  }

  btn.disabled = false;
  btn.querySelector('.btn-text').textContent = 'Compose with AI';
}

function copyEmail() {
  navigator.clipboard.writeText(generatedEmail).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✓ Copied';
    setTimeout(() => btn.textContent = '📋 Copy', 2000);
  });
}

function sendViaGmail() {
  if (!generatedEmail) { alert('Generate an email first!'); return; }

  const subject = encodeURIComponent(selectedSubject || 'Hello');
  const body = encodeURIComponent(generatedEmail);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;

  window.open(gmailUrl, '_blank');
}
