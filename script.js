let selectedRecipient = 'professor';
let selectedTone = 'formal';

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
  btn.textContent = '⏳ Writing...';

  document.getElementById('outputCard').classList.add('hidden');
  document.getElementById('loading').classList.remove('hidden');

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: selectedRecipient,
        tone: selectedTone,
        purpose,
        senderName
      })
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error);

    // Response likelihood bar
    const likelihood = data.responseLikelihood || 75;
    document.getElementById('likelihoodBar').style.width = likelihood + '%';
    document.getElementById('likelihoodPercent').textContent = likelihood + '%';

    // Subject lines
    const subjectContainer = document.getElementById('subjectLines');
    subjectContainer.innerHTML = '';
    (data.subjectLines || []).forEach(subject => {
      const div = document.createElement('div');
      div.className = 'subject-item';
      div.textContent = subject;
      div.onclick = () => navigator.clipboard.writeText(subject);
      subjectContainer.appendChild(div);
    });

    // Email body
    document.getElementById('emailOutput').textContent = data.email || '';

    // Follow up
    document.getElementById('followUp').textContent = data.followUp || '';

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('outputCard').classList.remove('hidden');

  } catch (error) {
    document.getElementById('loading').classList.add('hidden');
    alert('Error: ' + error.message);
    console.error(error);
  }

  btn.disabled = false;
  btn.textContent = '✨ Generate Email';
}

function copyEmail() {
  const text = document.getElementById('emailOutput').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy', 2000);
  });
}
