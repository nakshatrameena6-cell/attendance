<p align="center">
  <h1 align="center">🎓 Attendance Tracker</h1>
  <p align="center">
    <strong>A modern, responsive web application for efficient classroom attendance management</strong>
  </p>
  <p align="center">
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-database-setup">Database</a> •
    <a href="#-deployment">Deployment</a>
  </p>
</p>

---

## 📸 Overview

Attendance Tracker is a **production-ready** web application designed for schools and colleges to manage daily attendance across multiple periods. Built with a clean lavender/purple UI and backed by **Supabase (PostgreSQL)**, it provides real-time dashboards, period-wise attendance marking, absentee tracking, and historical records — all from a single page.

### Highlights

| Feature | Description |
|---------|-------------|
| 📊 **Live Dashboard** | Real-time stats with animated attendance trend chart |
| ✅ **Mark Attendance** | Bulk checkbox marking across 9 periods per day |
| 👥 **View Absentees** | Filter by date/period and copy list to clipboard |
| 📜 **History** | Query past attendance with present/absent breakdowns |
| 📱 **Fully Responsive** | Optimized for mobile, tablet, and desktop |

---

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A free [Supabase](https://supabase.com) account

### Step 1 — Set Up the Database

1. Create a new project on [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the contents of [`supabase-setup.sql`](supabase-setup.sql) and click **Run**
   - This creates the `students` and `attendance` tables, indexes, and optional sample data

### Step 2 — Configure Credentials

1. In your Supabase dashboard, navigate to **Settings → API**
2. Copy your **Project URL** and **Anon Public Key**
3. Open `script.js` and update lines 4–6:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### Step 3 — Launch the App

Open `index.html` directly in your browser, **or** serve it locally:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Then navigate to `http://localhost:8000` 🎉

---

## ✨ Features

### 🎯 Dashboard
- Total students, present today, absent today, attendance percentage
- **Live animated chart** that updates every 2 seconds with attendance trend data
- One-click refresh for real-time stats

### ✅ Mark Attendance
- Select date and period (9 periods × 45 min each)
- Load all students with checkboxes
- **Select All Present** toggle for bulk marking
- Saves to database with automatic record replacement for the same date/period

### 👥 View Absentees
- Filter by any date and period
- Displays absentee count with names and roll numbers
- **Copy to Clipboard** for quick sharing (formatted list)

### 📜 Attendance History
- Query past records by date and period
- Shows total enrolled, present count, and absent count
- Separate lists of present and absent students with icons

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | HTML5 |
| **Styling** | CSS3 (custom properties, animations, responsive breakpoints) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Icons** | [Font Awesome 6](https://fontawesome.com) |
| **Backend/DB** | [Supabase](https://supabase.com) (PostgreSQL) |
| **Chart** | HTML5 Canvas (custom animated chart) |

---


## 📁 Project Structure

```
attendance/
├── index.html              # Main HTML — all views, tabs, and forms
├── style.css               # Complete styling — theme, layout, animations, responsive
├── script.js               # Application logic — Supabase integration, state, UI
├── supabase-setup.sql      # Database schema & sample data (ready to run)
├── README.md               # This file
├── QUICKSTART.md           # 5-minute quick start guide
├── DEPLOYMENT_GUIDE.md     # Production deployment & security guide
└── FILES_OVERVIEW.md       # Detailed file-by-file descriptions
```

---

## 🎨 Design System

### Color Palette

| Token | Color | Usage |
|-------|-------|-------|
| `--primary-color` | `#8b5cf6` (Purple) | Primary actions, header, branding |
| `--accent` | `#a78bfa` (Light Purple) | Hover states, highlights |
| `--green` | `#4caf50` | Success states, present indicators |
| `--red` | `#f44336` | Error states, absent indicators |
| `--info` | `#2196f3` | Info alerts, copy button |

### Responsive Breakpoints

| Breakpoint | Target | Layout |
|-----------|--------|--------|
| `< 480px` | Mobile | Single column, condensed nav |
| `480px – 768px` | Tablet | 2-column grids |
| `> 768px` | Desktop | Full multi-column layout |

### Animations

- Fade-in transitions on tab switch
- Smooth hover effects on cards and buttons
- Rotating refresh icon
- Loading spinner overlay
- Live chart with animated data points

---

## 🔐 Security

- **Unique constraints** prevent duplicate attendance records per student/date/period
- **Foreign key constraints** maintain referential integrity between students and attendance
- **Client-side validation** ensures date and period are selected before operations
- **Supabase Row Level Security (RLS)** — can be enabled for production (see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md))

---

## 🚢 Deployment

| Platform | Setup Time | Cost |
|----------|-----------|------|
| [GitHub Pages](https://pages.github.com) | ~5 min | Free |
| [Netlify](https://netlify.com) | ~2 min | Free |
| [Vercel](https://vercel.com) | ~3 min | Free |
| Traditional Hosting | ~10 min | Varies |

For detailed deployment instructions, security hardening, and production checklist, see **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**.

---

## 🔧 Customization

### Change the Theme

Edit CSS custom properties at the top of `style.css`:

```css
:root {
    --primary-color: #8b5cf6;   /* Change to your brand color */
    --green: #4caf50;
    --red: #f44336;
}
```

### Add More Periods

1. Add `<option>` elements in the `<select>` dropdowns in `index.html`
2. Update the `formatPeriod()` function in `script.js`
3. Adjust the `CHECK` constraint in the `attendance` table if needed

### Add Student Fields

1. Add the column to the `students` table in Supabase
2. Update `fetchAllStudents()` in `script.js`
3. Update the student card rendering in `loadStudentsForAttendance()`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot read properties of undefined" | Verify Supabase URL and anon key in `script.js` |
| No students appear | Check that the `students` table has data; check browser console (F12) |
| Attendance not saving | Verify RLS policies allow inserts; ensure period is 1–9 |
| CORS errors | Should not occur with Supabase — check project URL format |

---

## 🗺 Roadmap

- [ ] Class/section management
- [ ] Teacher login & authentication
- [ ] Bulk import from CSV
- [ ] PDF/Excel attendance reports
- [ ] Email notifications for low attendance
- [ ] Dark mode toggle

---

## 📄 License

This project is open for educational and institutional use. Feel free to modify and deploy as needed.

---

<p align="center">
  <strong>Version 1.0</strong> · Last Updated May 2026 · Status: Production Ready ✅
</p>
<p align="center">
  Made with 💜 for classrooms everywhere
</p>
