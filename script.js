let selectedRecipient = 'professor';
let selectedTone = 'formal';
let selectedLength = '2';
let selectedSubject = '';
let generatedEmail = '';

// Recipient chips
document.querySelectorAll('#recipientGroup .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#recipientGroup .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedRecipient = chip.dataset.value;
  });
});

// Tone chips
document.querySelectorAll('#toneGroup .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#toneGroup .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedTone = chip.dataset.value;
  });
});

// Length chips
document.querySelectorAll('#lengthGroup .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#lengthGroup .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedLength = chip.dataset.value;
  });
});

async function generateEmail() {
  const purpose = document.getElementById('purpose').value.trim();
  const senderName = document.getElementById('senderName').value.trim();

  if (!purpose) { alert('Please describe what you want to say!'); return; }
  if (!senderName) { alert('Please enter your name!'); return; }

  const btn = document.getElementById('generateBtn');
  const btnText = document.getElementById('btnText');
  btn.disabled = true;
  btnText.textContent = 'Composing...';

  document.getElementById('outputCard').classList.add('hidden');
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('loading').scrollIntoView({ behavior: 'smooth' });

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: selectedRecipient,
        tone: selectedTone,
        purpose,
        senderName,
        paragraphs: selectedLength
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    // Likelihood
    const likelihood = data.responseLikelihood || 75;
    document.getElementById('likelihoodPercent').textContent = likelihood + '%';
    setTimeout(() => {
      document.getElementById('likelihoodBar').style.width = likelihood + '%';
    }, 100);

    // Subject lines with copy button
    selectedSubject = '';
    const subjectContainer = document.getElementById('subjectLines');
    subjectContainer.innerHTML = '';

    (data.subjectLines || []).forEach((subject, i) => {
      const div = document.createElement('div');
      div.className = 'subject-item' + (i === 0 ? ' selected' : '');

      div.innerHTML = `
        <div class="subject-item-row">
          <span class="subject-text">${subject}</span>
          <span class="subject-check">✦</span>
          <button class="subject-copy-btn" onclick="copySubject(event, '${subject.replace(/'/g, "\\'")}')">Copy</button>
        </div>
      `;

      div.addEventListener('click', (e) => {
        if (e.target.classList.contains('subject-copy-btn')) return;
        document.querySelectorAll('.subject-item').forEach(s => s.classList.remove('selected'));
        div.classList.add('selected');
        selectedSubject = subject;
      });

      subjectContainer.appendChild(div);
      if (i === 0) selectedSubject = subject;
    });

    // Email body
    generatedEmail = data.email || '';
    document.getElementById('emailOutput').textContent = generatedEmail;

    // Follow up
    document.getElementById('followUp').textContent = data.followUp || '';

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('outputCard').classList.remove('hidden');
    document.getElementById('outputCard').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    document.getElementById('loading').classList.add('hidden');
    alert('Error: ' + error.message);
  }

  btn.disabled = false;
  btnText.textContent = 'Compose with AI';
}

function copySubject(event, subject) {
  event.stopPropagation();
  navigator.clipboard.writeText(subject).then(() => {
    const btn = event.target;
    btn.textContent = '✓';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}

function copyEmail() {
  if (!generatedEmail) return;
  navigator.clipboard.writeText(generatedEmail).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy', 2000);
  });
}

function sendViaGmail() {
  if (!generatedEmail) { alert('Generate an email first!'); return; }
  if (!selectedSubject) { alert('Please select a subject line first!'); return; }

  const subject = encodeURIComponent(selectedSubject);
  const body = encodeURIComponent(generatedEmail);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
  window.open(gmailUrl, '_blank');
}
