// Initialize theme and UI preferences
window.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const moonBtn = document.getElementById('moonBtn');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

  if (useDark) {
    document.body.classList.add('dark');
    themeToggle.checked = true;
    moonBtn.textContent = '☀';
  }

  // Add transition for theme change
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
});

// Theme toggle via checkbox
const themeToggle = document.getElementById('themeToggle');
const moonBtn = document.getElementById('moonBtn');

themeToggle.addEventListener('change', () => {
  const isDark = themeToggle.checked;
  document.body.classList.toggle('dark', isDark);
  moonBtn.textContent = isDark ? '☀' : '☽';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Theme toggle via moon/sun button
moonBtn.addEventListener('click', () => {
  themeToggle.checked = !themeToggle.checked;
  themeToggle.dispatchEvent(new Event('change'));
});

// Font selection
document.getElementById('fontSelector').addEventListener('change', function () {
  const selected = this.value;
  let font;
  switch (selected) {
    case 'serif':
      font = "'Merriweather', serif";
      break;
    case 'sans-serif':
      font = "'Open Sans', sans-serif";
      break;
    case 'monospace':
      font = "'Source Code Pro', monospace";
      break;
    case 'roboto':
      font = "'Roboto', sans-serif";
      break;
    case 'lato':
      font = "'Lato', sans-serif";
      break;
    default:
      font = 'inherit';
  }
  document.body.style.fontFamily = font;
});

// Theme color selection
document.getElementById('colorTheme').addEventListener('change', function () {
  const theme = this.value;
  document.body.classList.remove('theme-blue', 'theme-green', 'theme-pink');
  if (theme !== 'default') {
    document.body.classList.add(`theme-${theme}`);
  }

  // Apply color theme to more components
  const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color');
  document.querySelectorAll('input, select, button, h1, h2, h3').forEach(el => {
    el.style.borderColor = primaryColor;
    el.style.color = primaryColor;
  });
});

// Dictionary search with pronunciation and synonyms
function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}

async function searchWord() {
  const query = document.getElementById('searchInput').value.trim();
  const container = document.getElementById('definitionContainer');
  if (!query) {
    container.innerHTML = '<p>Please enter a word.</p>';
    return;
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
    const data = await response.json();

    if (data.title) {
      container.innerHTML = `<p>No definition found for <strong>${query}</strong>.</p>`;
    } else {
      const wordData = data[0];
      const phonetics = wordData.phonetics.find(p => p.audio) || {};
      const audioUrl = phonetics.audio || '';
      const meanings = wordData.meanings.map(meaning => {
        const defs = meaning.definitions.map(def => {
  const example = def.example ? `<div class="example"><em>Example:</em> ${def.example}</div>` : '';
  return `<li>${def.definition}${example}</li>`;
}).join('');

        const synonyms = meaning.synonyms?.length
          ? `<p><strong>Synonyms:</strong> ${meaning.synonyms.join(', ')}</p>` : '';
        return `<div class="card"><h3>${meaning.partOfSpeech}</h3><ul>${defs}</ul>${synonyms}</div>`;
      }).join('');

      container.innerHTML = `
        <div class="card">
          <div class="word-header">
  <h1>${wordData.word}</h1>
  ${audioUrl ? `<button onclick="playAudio('${audioUrl}')">🔊 Play Pronunciation</button>` : ''}
          </div>
          <p><em>${wordData.phonetic || ''}</em></p>
        </div>
        ${meanings}
        <p><a href="https://en.wiktionary.org/wiki/${wordData.word}" target="_blank">Source</a></p>
      `;
    }
  } catch (error) {
    container.innerHTML = '<p>Error fetching data. Try again later.</p>';
  }
}

