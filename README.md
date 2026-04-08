## 📘 Bir Ön README (Özet)

Bu sekmenin altında asıl profesyonel README bulunmaktadır. Bu bir case dolayısıyla yazılmış ön bilgi gibidir.
Aşağıda README içinde bulunması yararlı olacak kısa başlıklar ve içeriklerin özeti yer almaktadır:

- **Projenin kısa açıklaması**
   - OpenRouter ile entegre tam yığın bir sohbet uygulamasıdır. Backend Node.js/Express (TypeScript), frontend React/Vite (Ant Design) ile yazılmıştır. Uygulama metin ve görsel girdileri işleyebilir ve OpenTelemetry ile izlenebilir.

- **Yaptığım teknik seçimler ve nedenleri**
   - `Node.js` + `Express` (TypeScript): Express.js daha lightweight ve boilerplate'i Spring ya da Django'ya kıyasla daha minimal olduğu için mantıklı geldi. N-layered bir structure izledim ve de basit API'leri aslında OpenRouter API'lerine bağlamak gerektiği için sadece ve komplex serivice işlemleri olmadığı için bu proje adına HTTP library'leri daha kuvvetli olan Express.js'in doğru bir tercih olduğunu düşündüm. FastApi'nin de böyle basit bir Baclend için gereksiz fazla setupının olacağını düşündüm, bir mikroservis backendim olmayacaktı. Django'nun da kesin bir overkill olduğuna karar verdim. Typescript'in de türleri belirlemek açısından daha uygun olacağını düşündüm, ağır bir backend olmasa da bence backend'de Typescript kullanılmalı. :)
   - `React` + `Vite` + `Ant Design`: Ant Design daha basit ofis tarzı tasarımlara sahip olduğu için, React daha öncesinde tecrübem olduğu için tercih ettim. Vite'ı hemen test edip istediğim gibi olmuş mu görebilmek için tercih ettim. Bir taslak oluşturup onu düzelterek ilerlemek bence Vite ile daha kolay oluyor. React'ı da muadillerine göre daha önde olduğunu düşündüğüm için ve de daha elim yatkın olduğu için tercih ettim. Neden JS değil de JSX, tabiki HTML type return'ler için. Neden TSX değil de JSX, burada aslında arada kaldım, öncelikle daha kısa ömürlü bir proje yani bir case olduğu için tercih ettim. Üstüne de biraz düşününce sadece Prompt'lara gelen cevapları veri tipi olarak kullanacağım için ya objeler tutacaktım ya da direkt stringleri kullanacaktım FrontEnd'de, bir type check ihtiyacım olmadığını düşündüm. JSX daha okunabilir geliyor bana ve de TSX'in o baştaki karmaşık yapısı olmazsa az sürede daha hızlı ilerleyebileceğimi düşündüm. Taslak üzerinden değişiklikler yapmak daha kolay oldu. Daha uzun vadeli veya daha komplex bir proje olsaydı kesinlikle TSX tercih ederdim.
   - Controller/service ayrımı: Kodun test edilebilirliği ve bakım kolaylığı için daha mantıklı geldi, bir istek bir yerden girip aslında servisten başka bir API'ye (OpenRouter'a) gidecekti ve daha kompleks tasarımlar yerine N-layered bir tasarımın bunu çözeceğini düşündüm.

- **Projeyi yerel makinede çalıştırmak için gerekli adımlar (kısa)**
   1. Depoyu klonlayın: `git clone <repo>` ve `cd madlen-case-study`.
   2. Hızlı kurulum için önerilen: `bash setup.sh` (macOS/Linux/Git Bash/WSL). Bu betik bağımlılıkları kurar, `backend/.env` için şablon bırakır ve (Docker çalışıyorsa) Jaeger'ı başlatır.
   3. Manuel kurulum isterseniz: `cd backend && npm install && cd ../frontend && npm install`.
   4. `backend/.env` içine `OPENROUTER_API_KEY` yerleştirin (README içinde örnekler mevcut).
   5. Geliştirme modunda çalıştırmak için: `cd backend && npm run dev` ve ayrı bir terminalde `cd frontend && npm run dev`.

- **Jaeger arayüzüne erişim ve trace'lerin görüntülenmesi**
   - Jaeger'ı çalıştırmak için repository kökünde: `docker-compose up -d` (veya `bash setup.sh` docker yüklü ve çalışıyorsa otomatik başlatır).
   - Tarayıcıda `http://localhost:16686` adresine gidin.
   - Servis listesinde `madlen-backend` seçin ve `Find Traces` ile izleri görüntüleyin.
   - Bir isteği tekrar üretip (ör. chat mesajı gönder) trace listesinde yeni kayıtların oluştuğunu kontrol edebilirsiniz.


# Case Study - AI Chat Application

A full-stack AI chat application with OpenRouter integration and distributed tracing using OpenTelemetry and Jaeger.

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express.js** (TypeScript)
- **OpenRouter API** for AI model access
- **OpenTelemetry** for distributed tracing
- In-memory conversation storage

### Frontend
- **React** + **Vite** (JavaScript/JSX)
- **Ant Design** UI components
- Custom streaming text animation
- Dark theme (Gemini-inspired)

### Observability
- **OpenTelemetry** instrumentation
- **Jaeger** for trace visualization

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker Desktop (for Jaeger)
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

Use the provided bash script for quick setup:

```bash
# Clone the repository
git clone <repository-url>
cd madlen-case-study

# Run the setup script (macOS/Linux/Windows Git Bash)
bash setup.sh
```

The script will:
- Install all dependencies (backend and frontend)
- Create `.env` files with templates
- Start Jaeger container
- Provide next steps

### Option 2: Manual Setup

```bash
# Clone the repository
git clone <repository-url>
cd madlen-case-study

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
> **Note:** If you used the setup script, template `.env` files are already created. Just add your OpenRouter API key.

**Backend** (`backend/.env`):
```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_actual_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:5174

# OpenTelemetry Configuration
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

### Environment variables & API key (details)

- **What is `OPENROUTER_API_KEY`?**
   - This is the secret API key you get from OpenRouter (https://openrouter.ai/). It authorizes the backend to make requests to the OpenRouter service on your behalf.

- **Where to put the key**
   - Place the key in `backend/.env` as shown above. Do NOT commit `.env` to version control — it contains secrets.

- **How to set the key temporarily (for testing)**
   - Bash / Git Bash / WSL:
      ```bash
      export OPENROUTER_API_KEY="sk-...your-key-here..."
      cd backend
      npm run dev
      ```
   - PowerShell (temporary for current session):
      ```powershell
      $env:OPENROUTER_API_KEY = "sk-...your-key-here..."
      cd backend
      npm run dev
      ```
   - PowerShell (persist across sessions):
      ```powershell
      setx OPENROUTER_API_KEY "sk-...your-key-here..."
      ```

- **How to set the key permanently for the backend (using `.env`)**
   - Create (or edit) `backend/.env` and add:
      ```env
      OPENROUTER_API_KEY=sk-...your-key-here...
      ```
   - After changing `.env`, restart the backend dev server so the new values are loaded.

- **Frontend note**
   - The frontend uses `VITE_API_URL` to contact the backend. The frontend should not hold your OpenRouter API key directly — the backend proxies requests to OpenRouter to keep the key secret.

- **Security & usage tips**
   - Never commit API keys to Git. Add `.env` to `.gitignore` (the repo template already does this).
   - If the key is compromised, rotate it from OpenRouter and update `backend/.env`.
   - Be mindful of rate limits and billing on your OpenRouter account — test with low-volume requests first.

- **Troubleshooting**
   - If requests to the AI backend fail with auth errors, confirm `OPENROUTER_API_KEY` is set and that the backend process has been restarted after changes.
   - If you run the `setup.sh` script, it places a `.env` template in `backend/` — you still need to paste your key into that file.


### 3. Start Jaeger (Tracing)

```bash
# Ensure Docker Desktop is running, then:
docker-compose up -d

# Verify Jaeger is running
# Open http://localhost:16686 in your browser
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3000/api
- **Jaeger UI**: http://localhost:16686

---

## 📁 Project Structure

```
madlen-case-study/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Entry point (imports tracing first)
│   │   ├── tracing.ts            # OpenTelemetry configuration
│   │   ├── routes/
│   │   │   └── chat.routes.ts    # API endpoints
│   │   ├── services/
│   │   │   ├── openrouter.service.ts    # OpenRouter integration (instrumented)
│   │   │   └── conversation.service.ts  # Conversation storage (instrumented)
│   │   └── types/
│   │       └── index.ts          # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Root component
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx     # Main chat container
│   │   │   ├── MessageList.jsx       # Message display
│   │   │   ├── MessageInput.jsx      # User input
│   │   │   ├── ModelSelector.jsx     # Model dropdown
│   │   │   ├── Sidebar.jsx           # Conversation history
│   │   │   └── StreamingText.jsx     # Typing animation
│   │   └── api/
│   │       └── chat.js           # API client with retry logic
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml            # Jaeger container configuration
└── README.md                     # This file
```

---

## 🔍 OpenTelemetry & Jaeger

### What is OpenTelemetry?

OpenTelemetry provides **observability** for your application by tracking:
- **Traces**: Request flow through the system
- **Spans**: Individual operations (API calls, database queries, etc.)
- **Attributes**: Metadata about operations (model used, duration, errors)

### What Does It Track?

**Backend Instrumentation:**
1. **HTTP Requests** (automatic via auto-instrumentation)
   - Request method, path, status code
   - Response time

2. **OpenRouter API Calls** (`openrouter.service.ts`)
   - Model used
   - Message count
   - API response time
   - Error details

3. **Conversation Operations** (`conversation.service.ts`)
   - Create conversation
   - Add message
   - Get conversation
   - List conversations

### Viewing Traces in Jaeger

1. **Start Jaeger**: `docker-compose up -d`
2. **Open Jaeger UI**: http://localhost:16686
3. **Select service**: `madlen-backend`
4. **Click "Find Traces"**

**Example trace visualization:**
```
HTTP POST /api/chat (523ms total)
  ├─ conversation.add_message (2ms)
  ├─ openrouter.chat_completion (510ms)  ← Shows AI model latency
  └─ conversation.add_message (3ms)
```

---

## 🌐 API Endpoints

### Chat Endpoints

**POST `/api/chat`**

*Text-only message:*
```json
{
  "message": "Hello!",
  "model": "openai/gpt-3.5-turbo",
  "conversationId": "conv_1234567890" // optional
}
```

*With image (multipart/form-data):*
```
POST /api/chat
Content-Type: multipart/form-data

Fields:
- message: "What is in this image?"
- model: "openai/gpt-4-vision-preview"
- conversationId: "conv_1234567890" (optional)
- image: [File object]
```

**GET `/api/models`**
- Returns list of available AI models

**GET `/api/conversations`**
- Returns list of all conversations

**GET `/api/conversations/:id`**
- Returns specific conversation with messages

**GET `/health`**
- Health check endpoint

---

## 🎨 Features

### Frontend
- ✅ Gemini-inspired dark theme
- ✅ Streaming text animation (typing effect)
- ✅ Conversation history sidebar
- ✅ Model selection dropdown
- ✅ Message actions (like, dislike, reload, share)
- ✅ Responsive layout
- ✅ Error handling with retry logic
- ✅ **Multi-modal support** - Upload and analyze images

### Backend
- ✅ OpenRouter integration
- ✅ In-memory conversation storage
- ✅ Full conversation context sent to AI
- ✅ OpenTelemetry instrumentation
- ✅ CORS configuration
- ✅ Health check endpoint
- ✅ **Image upload handling** with Multer
- ✅ **Base64 image encoding** for AI models

### Observability
- ✅ Distributed tracing with OpenTelemetry
- ✅ Custom spans for critical operations
- ✅ Jaeger UI for trace visualization
- ✅ Error tracking and performance metrics

---

## 🖼️ Multi-Modal Support (Image Analysis)

The application supports uploading images for AI analysis. This feature works with vision-capable models like GPT-4 Vision, Claude 3, or Gemini Pro Vision.

### How to Use:
1. Click the 📷 **image icon** in the input bar
2. Select an image (max 5MB, JPG/PNG/GIF)
3. Add your question or prompt (optional)
4. Send the message

### Supported Models:
- `openai/gpt-4-vision-preview`
- `openai/gpt-4-turbo`
- `anthropic/claude-3-opus`
- `anthropic/claude-3-sonnet`
- `google/gemini-pro-vision`

### Technical Details:
- Images are uploaded via `multipart/form-data`
- Backend converts images to base64
- Sent to OpenRouter API in vision-compatible format
- Max file size: 5MB
- Supported formats: JPG, PNG, GIF, WebP

---

## 🐳 Docker Commands

```bash
# Start Jaeger
docker-compose up -d

# View Jaeger logs
docker-compose logs -f jaeger

# Stop Jaeger
docker-compose down

# Restart Jaeger
docker-compose restart

# Remove Jaeger container and volumes
docker-compose down -v
```

---

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev        # Start with hot-reload
npm run build      # Build TypeScript
npm start          # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start with hot-reload
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 📊 Environment Variables Reference

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Required |
| `PORT` | Backend server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5174` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Jaeger endpoint | `http://localhost:4318/v1/traces` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |

---

## 🔧 Troubleshooting

### Backend won't start
- Check if `.env` file exists in `backend/` directory
- Verify `OPENROUTER_API_KEY` is set
- Ensure port 3000 is not in use

### Frontend won't connect to backend
- Verify backend is running on port 3000
- Check `VITE_API_URL` in `frontend/.env`
- Check browser console for CORS errors

### Jaeger not showing traces
- **Verify Docker Desktop is running** (most common issue)
- Check Jaeger is running: `docker ps | grep jaeger`
- Verify `OTEL_EXPORTER_OTLP_ENDPOINT` is set correctly
- Check backend logs for OpenTelemetry initialization message: `🔍 OpenTelemetry tracing initialized`

### Docker errors
- Ensure Docker Desktop is installed and running
- On Windows, make sure Docker is using Windows containers
- Try `docker-compose down -v` and `docker-compose up -d`

### Image upload not working
- Ensure you're using a vision-capable model (GPT-4 Vision, Claude 3, Gemini Pro Vision)
- Check image size is under 5MB
- Verify image format is supported (JPG, PNG, GIF, WebP)
- Check browser console and backend logs for errors
- Non-vision models will ignore images (use text-only models for text)

---

## 📝 License

This is a case study project for educational purposes.

---

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI model access
- [OpenTelemetry](https://opentelemetry.io/) for observability
- [Jaeger](https://www.jaegertracing.io/) for trace visualization
- [Ant Design](https://ant.design/) for UI components
