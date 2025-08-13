# Locofy Home Assignment – Frontend

This project is a React-based frontend bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+  
- **npm** v9+ or **yarn**

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a .env file in the root directory based on .env.example:

- Local env

```bash
    REACT_APP_ENVIRONMENT=development
    REACT_APP_SERVER_URL=http://localhost:8282/api/v1
    GOOGLE_APP_CLIENT_ID=your-google-client-id
    GOOGLE_APP_CLIENT_SECRET=your-google-client-secret
    REACT_APP_BACKEND_API_KEY=your-backend-api-key
```

- Prod env

```bash
    REACT_APP_SERVER_URL=https://locofy-home-assignment-be-production.up.railway.app/api/v1
    REACT_APP_BACKEND_API_KEY=please_contact_admin
```

### 📜 Available Scripts

- Development

```bash
 npm start
```

- Runs the app in development mode at <http://localhost:3000>.
- Prod at <https://locofy-home-assignment-fe-zv6d.vercel.app/figma-detect-file>

### Docker

```bash
docker build --no-cache -t locofy-react-app .
docker run -p 3000:80 locofy-react-app
```

- After run docker success: please access to <http://localhost:3000/figma-detect-file>
- Logs Nginx

```bash
172.17.0.1 - - [13/Aug/2025:08:18:00 +0000] "GET / HTTP/1.1" 200 677 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36" "-"
172.17.0.1 - - [13/Aug/2025:08:18:00 +0000] "GET /static/js/main.bf981fa6.js HTTP/1.1" 200 519250 "http://localhost:3000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36" "-"
```
