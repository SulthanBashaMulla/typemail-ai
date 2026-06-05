# ✦ TypeMail AI
### Relationship-Aware AI Email Writer

> Built for the **Microsoft Agents League Hackathon** using GitHub Copilot

![TypeMail AI](https://img.shields.io/badge/TypeMail-AI-gold?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)
![GitHub Copilot](https://img.shields.io/badge/Built%20with-GitHub%20Copilot-blue?style=for-the-badge&logo=github)
![Groq](https://img.shields.io/badge/Powered%20by-Groq%20AI-orange?style=for-the-badge)

---

## 🌐 Live Demo

**[typemail-ai.vercel.app](https://typemail-ai.vercel.app)**

---

## 📌 What is TypeMail AI?

TypeMail AI is an intelligent email writing assistant that understands **human relationships and communication styles**. Unlike generic email generators, TypeMail AI adapts its language, tone, and structure based on who you're writing to — making every email feel personal, professional, and purposeful.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 👤 Recipient Awareness | Adapts email style for Professor, Recruiter, Client, Manager, Friend, or Investor |
| 🎭 Tone Selection | Choose from Formal, Friendly, Assertive, Apologetic, or Grateful |
| 📏 Paragraph Length | Select exactly how many paragraphs you want — 1 (Quick) to 4 (Thorough) |
| 📊 Response Likelihood | AI predicts the probability of getting a reply |
| 📌 Subject Line Generator | 3 smart subject line options with one-tap copy |
| 🔄 Follow-up Suggestion | Tells you when and how to follow up if no reply |
| 📬 Universal Mail Integration | Opens any mail app with email pre-composed via mailto |
| 🔒 Secure API Handling | API key stored in Vercel environment variables — never exposed |

---

## 🛠️ Tech Stack

```
Frontend        → HTML5, CSS3, Vanilla JavaScript
Backend         → Vercel Serverless Functions (Node.js)
AI Model        → Groq API (Llama 3.3 70B)
Deployment      → Vercel
Version Control → GitHub
Built With      → GitHub Copilot (vscode.dev)
```

---

## 🏗️ Architecture

```
User (Mobile/Desktop)
        ↓
TypeMail AI Frontend (HTML/CSS/JS)
        ↓
Vercel Serverless Function (api/generate.js)
        ↓                    ↑
Groq AI API          Vercel Env Variables
(Llama 3.3 70B)      (GROQ_API_KEY 🔒)
        ↑
Built with GitHub Copilot
```

---

## 📁 Project Structure

```
typemail-ai/
├── index.html          # Main UI
├── style.css           # Premium dark gold styling
├── script.js           # Frontend logic & API calls
├── vercel.json         # Vercel configuration
└── api/
    └── generate.js     # Serverless function (Groq API)
```

---

## 🚀 Getting Started

### Prerequisites
- GitHub account
- Vercel account (free)
- Groq API key (free at console.groq.com)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/SulthanBasha/typemail-ai.git
cd typemail-ai
```

2. **Set environment variable**
```bash
export GROQ_API_KEY=your_groq_api_key_here
```

3. **Install Vercel CLI and run locally**
```bash
npm install -g vercel
vercel dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Deploy to Vercel

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variable: `GROQ_API_KEY`
4. Deploy — your app is live! 🎉

---

## 💡 How It Works

1. User selects **recipient type** and **tone**
2. User chooses **paragraph length** (unique feature)
3. User describes **what they want to say**
4. Frontend sends request to **Vercel serverless function**
5. Function calls **Groq AI API** securely using env variable
6. AI generates **subject lines, email body, response likelihood, follow-up**
7. User selects subject, reads email, and taps **Open in Mail App**
8. Mail app opens with **everything pre-composed** ✅

---

## 🔒 Security

- API key stored in **Vercel environment variables**
- Never exposed in frontend code
- Serverless function acts as secure proxy
- CORS headers properly configured

---

## 🎯 Hackathon Track

**Creative Apps** — Microsoft Agents League Hackathon 2026

Built with:
- ✅ GitHub Copilot (primary development tool)
- ✅ Microsoft AI tooling
- ✅ Deployed on Vercel (serverless)

---

## 📱 Built Entirely on Mobile

This entire project — from idea to deployment — was built on a **mobile phone** using:
- **vscode.dev** (browser-based VS Code)
- **GitHub Copilot** (AI code assistance)
- **GitHub** (version control via mobile)
- **Vercel** (deployment via mobile browser)

No laptop. No paid tools. Zero cost. 💪

---

## 👨‍💻 Author

**Sulthan Basha Mulla**
- GitHub: [@SulthanBasha](https://github.com/SulthanBasha)
- Email: mullasulthanbasha@gmail.com

---

## 📄 License

MIT License — feel free to use, modify, and share.

---

<div align="center">
  <strong>✦ Built with GitHub Copilot & Microsoft AI ✦</strong>
</div>
# typemail-ai
