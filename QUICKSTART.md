# ⚡ QUICK START GUIDE - 5 MINUTES SETUP

## 📌 What You'll Need

- Supabase account (free at supabase.com)
- Web browser
- Text editor
- 5 minutes! ⏱️

---

## 🚀 QUICK SETUP (4 Steps)

### Step 1️⃣: Create Supabase Project (2 minutes)

```
1. Go to supabase.com
2. Click "Start your project"
3. Sign up (or login)
4. Create new project:
   - Name: "attendance"
   - Set password
   - Choose region
   - Click "Create new project" (wait ~2 min)
```

✅ **Done! Move to Step 2**

---

### Step 2️⃣: Set Up Database (1 minute)

**In Supabase Dashboard:**

1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy this code:

```sql
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period INTEGER NOT NULL CHECK (period >= 1 AND period <= 9),
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  UNIQUE(student_id, date, period)
);

INSERT INTO students (name, roll_no) VALUES
('Student 1', '001'),
('Student 2', '002'),
('Student 3', '003'),
('Student 4', '004'),
('Student 5', '005'),
('Student 6', '006'),
('Student 7', '007'),
('Student 8', '008'),
('Student 9', '009'),
('Student 10', '010');
```

4. Click **Run** (green play button)
5. ✅ **Tables created!**

---

### Step 3️⃣: Get Your Credentials (1 minute)

**In Supabase Dashboard:**

1. Click **Settings** (bottom left)
2. Click **API**
3. Copy these two values:

```
PROJECT_URL:     https://xxxxx.supabase.co
ANON_KEY:        eyJ0eXAiOiJKV1QiLCJhbGc...
```

Keep these values ready! ✅

---

### Step 4️⃣: Configure Application (1 minute)

**In your text editor:**

1. Open `script.js`
2. Find line 2-3:
   ```javascript
   const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

3. Replace with your actual values from Step 3:
   ```javascript
   const SUPABASE_URL = 'https://myproject.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGc...';
   ```

4. **Save** the file

✅ **All set!**

---

## 🎬 RUN THE APP

### On Windows

**Option A: Double-click `index.html`**
```
1. Find the file in Explorer
2. Double-click it
3. Opens in your default browser
```

**Option B: Python Server**
```
1. Open Command Prompt
2. Navigate to folder: cd "C:\Path\To\attendance"
3. Run: python -m http.server 8000
4. Open: http://localhost:8000
```

### On Mac/Linux

**Option A: Double-click `index.html`**

**Option B: Python Server**
```bash
cd ~/path/to/attendance
python3 -m http.server 8000
# Open http://localhost:8000
```

---

## ✅ YOU'RE DONE! 🎉

The app should now be running! Here's what you can do:

### 📊 Dashboard Tab
- View attendance statistics
- See today's attendance at a glance

### ✅ Mark Attendance Tab
1. Select date
2. Select period
3. Click "Load Students"
4. Check boxes for present students
5. Click "Save Attendance"

### 👥 View Absentees Tab
1. Select date and period
2. Click "View Absentees"
3. See who's absent
4. Copy the list if needed

### 📜 History Tab
1. Select date and period
2. Click "View History"
3. See all attendance records

---

## 🆘 QUICK TROUBLESHOOTING

### ❌ Nothing appears / Blank screen
- Check browser console (F12)
- Ensure Supabase URL is correct
- Ensure students table has data

### ❌ "Cannot load students"
- Verify Supabase credentials in script.js
- Check internet connection
- Verify students exist in database

### ❌ "Cannot save attendance"
- Ensure date is selected
- Ensure period is selected
- Check network tab for errors

### ❌ Other issues?
- See full docs: `README.md`
- See deployment guide: `DEPLOYMENT_GUIDE.md`

---

## 📱 FEATURES AT A GLANCE

| Feature | Status |
|---------|--------|
| Dashboard with real-time stats | ✅ |
| Mark attendance by period | ✅ |
| View absentees | ✅ |
| View attendance history | ✅ |
| Copy absentees list | ✅ |
| Responsive design (mobile) | ✅ |
| Light purple theme | ✅ |
| Smooth animations | ✅ |
| Local storage | ✅ |

---

## 🎨 QUICK CUSTOMIZATION

### Change Theme Color
Edit `style.css`, find `--primary-color` (line 2):
```css
--primary-color: #8b5cf6;  /* Change this to any color */
```

### Add More Students
In Supabase SQL Editor:
```sql
INSERT INTO students (name, roll_no) VALUES
('New Student', '011');
```

### Change App Title
In `index.html`, find line with `<title>`:
```html
<title>Your New Title</title>
```

---

## 💾 DEPLOYMENT (Optional)

### GitHub Pages (Free)
1. Create GitHub repo
2. Upload these 3 files: `index.html`, `style.css`, `script.js`
3. Go to Settings → Pages
4. Enable GitHub Pages
5. Your app is live! 🌍

### Netlify (Free)
1. Drag & drop your folder to https://app.netlify.com/drop
2. Done! Your app is live in seconds

---

## 📞 NEED MORE HELP?

- **Full Setup Guide:** Read `README.md`
- **Deployment Guide:** Read `DEPLOYMENT_GUIDE.md`
- **Database SQL:** See `supabase-setup.sql`
- **Report Issues:** Check browser console (F12)

---

## 🎯 NEXT STEPS

1. ✅ Follow the 4 quick setup steps above
2. ✅ Open the app in your browser
3. ✅ Test marking attendance
4. ✅ Show to your institution
5. ✅ Start using for real!

---

**Congratulations! You now have a working Attendance Tracker! 🎓**

For advanced features and customization, see the full documentation.

Happy tracking! 📝
