# Full Stack Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and fill in project details
4. Wait for the project to be created

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon (public) key

## 3. Setup Backend (Python FastAPI)

### Install Dependencies
```bash
cd Swisstination-BE
pip install -r requirements.txt
```

### Configure Environment Variables
1. Copy `env.example` to `.env`
2. Update the `.env` file with your Supabase credentials:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### Run Backend Server
```bash
# From Swisstination-BE directory
python main.py
```

The backend API will be available at `http://localhost:8080`

## 4. Setup Frontend (React)

### Install Dependencies
```bash
cd Swisstination-FE
npm install
```

### Run Frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:8000`

## 5. Set Up Authentication in Supabase

1. In your Supabase dashboard, go to Authentication > Settings
2. Make sure Email authentication is enabled
3. Configure your site URL if needed (for email confirmations)

## Features

- **Login Form**: Email and password fields
- **Signup Form**: Name, email, and password fields
- **User data**: Name is stored in user metadata, email and password handled by Supabase Auth
- **Modern UI**: Beautiful gradient design with responsive forms
- **Error handling**: Clear success and error messages
- **Navigation**: Easy switching between login and signup forms

## Database Schema

Supabase Auth automatically handles user authentication. User data includes:
- Email (managed by Supabase Auth)
- Password (securely hashed by Supabase Auth)
- Name (stored in user metadata)

No additional database tables are needed for basic authentication!
