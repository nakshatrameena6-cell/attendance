# 🎓 Attendance Tracker Web Application - Setup Guide

## 📋 Overview

This is a complete Attendance Tracker Web Application built with:
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL)
- **Theme**: Light purple/lavender modern design
- **Features**: Dashboard, Attendance Marking, Absentees View, History

---

## 🚀 Quick Start

### Step 1: Set Up Supabase Database

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create a new organization and project

2. **Get Your Credentials**
   - In Supabase Dashboard, go to **Settings → API**
   - Copy: `Project URL` and `Anon Public Key`

3. **Create Tables in Supabase**

   **Table 1: `students`**
   ```sql
   CREATE TABLE students (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     roll_no TEXT NOT NULL UNIQUE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **Table 2: `attendance`**
   ```sql
   CREATE TABLE attendance (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
     date DATE NOT NULL,
     period INTEGER NOT NULL CHECK (period >= 1 AND period <= 9),
     status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
     created_at TIMESTAMP DEFAULT NOW(),
     UNIQUE(student_id, date, period)
   );

   CREATE INDEX idx_attendance_date_period ON attendance(date, period);
   CREATE INDEX idx_attendance_student ON attendance(student_id);
   ```

4. **Insert Sample Data (Optional)**
   ```sql
   -- Insert sample students
   INSERT INTO students (name, roll_no) VALUES
   ('Aarav Kumar', '001'),
   ('Bhavna Singh', '002'),
   ('Chirag Patel', '003'),
   ('Divya Sharma', '004'),
   ('Esha Gupta', '005'),
   ('Faisal Khan', '006'),
   ('Gitika Verma', '007'),
   ('Harsh Jain', '008'),
   ('Ishita Reddy', '009'),
   ('Jai Kapoor', '010');
   ```

### Step 2: Configure the Application

1. **Open `script.js`**

2. **Update Supabase Credentials** (Lines 1-6):
   ```javascript
   const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
   ```

3. **Save the file**

### Step 3: Run the Application

1. **Open `index.html` in your browser**
   - Simply open the file directly, or
   - Use a local server: `python -m http.server 8000`
   - Then navigate to: `http://localhost:8000`

---

## 📱 Features & How to Use

### 🎯 Dashboard Tab
- **View Real-Time Statistics**:
  - Total students in the system
  - Students present today (all periods combined)
  - Students absent today
  - Overall attendance percentage
- **Click Refresh** to update stats

### ✅ Mark Attendance Tab
1. **Select Date** - Choose the attendance date
2. **Select Period** - Pick from 9 periods (each 45 minutes)
3. **Click "Load Students"** - Fetches all students from the database
4. **Mark Attendance**:
   - Check checkbox = Present
   - Uncheck checkbox = Absent
   - Use "Select All Present" to mark everyone present at once
5. **Click "Save Attendance"** - Saves to database
   - Old records for this date/period are automatically replaced
6. **Cancel** to discard changes

### 👥 View Absentees Tab
1. **Select Date** - Choose the date
2. **Select Period** - Choose the period
3. **Click "View Absentees"** - Shows all absent students
4. **Copy Absentees List** - Copies formatted list to clipboard

### 📜 Attendance History Tab
1. **Select Date** - Choose the date
2. **Select Period** - Choose the period
3. **Click "View History"** - Displays:
   - Total students enrolled
   - Number present in that period
   - Number absent in that period
   - Lists of all present and absent students

---

## 🎨 UI/UX Features

### Design Elements
- ✨ **Light Purple Theme** - Calming lavender color scheme
- 🎭 **Modern Cards** - Clean, rounded design with soft shadows
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 🎬 **Smooth Animations** - Fade-ins, transitions, and hover effects
- ⚡ **Loading Indicators** - Visual feedback during API calls

### Color Scheme
- **Primary**: Purple (#8b5cf6)
- **Accent**: Light Purple (#a78bfa)
- **Success**: Green (#4caf50)
- **Error**: Red (#f44336)
- **Info**: Blue (#2196f3)

### Responsive Breakpoints
- **Mobile** (< 480px): Single column layout, condensed navigation
- **Tablet** (480px - 768px): 2-column grids
- **Desktop** (> 768px): Full featured layout with multiple columns

---

## 📊 Data Structure

### Students Table
```
id (UUID) - Primary Key
name (TEXT) - Student full name
roll_no (TEXT) - Roll number (unique)
created_at (TIMESTAMP) - Creation date
```

### Attendance Table
```
id (UUID) - Primary Key
student_id (UUID) - Foreign key to students
date (DATE) - Attendance date
period (INT) - Period number (1-9)
status (TEXT) - 'present' or 'absent'
created_at (TIMESTAMP) - Creation date
```

---

## 🔐 Security Features

- ✅ **Supabase Row Level Security** - Configure RLS policies as needed
- ✅ **Unique Constraints** - Prevents duplicate attendance records
- ✅ **Foreign Key Constraints** - Ensures data integrity
- ✅ **Input Validation** - Client-side validation of date/period selection

---

## 🛠️ Customization

### Change Colors
Edit CSS variables in `style.css` (Lines 1-13):
```css
:root {
    --primary-color: #8b5cf6;
    --green: #4caf50;
    --red: #f44336;
    /* ... etc ... */
}
```

### Add More Periods
Edit `index.html` - Update period options in select elements, and update `formatPeriod()` function in `script.js`

### Modify School Timings
Edit the period timings in the `<option>` elements in `index.html`

### Add New Columns to Students
1. Add column to Supabase `students` table
2. Update the fetch query in `fetchAllStudents()`
3. Update the display in `loadStudentsForAttendance()`

---

## ⚙️ Technical Details

### API Calls (Supabase)

**Fetch All Students:**
```javascript
supabase.from('students').select('*')
```

**Save Attendance:**
```javascript
supabase.from('attendance').insert(records)
```

**Fetch Attendance by Date & Period:**
```javascript
supabase.from('attendance')
    .select('*, students(*)')
    .eq('date', date)
    .eq('period', period)
```

### Modular Functions
- `fetchAllStudents()` - Fetches students list
- `saveAttendanceRecords()` - Saves attendance to DB
- `fetchAttendanceByDatePeriod()` - Retrieves past attendance
- `calculateTodayStats()` - Calculates daily statistics
- `showAlert()` - Displays messages
- `showLoading()` - Shows/hides loader

---

## 🐛 Troubleshooting

### Issue: "Cannot read properties of undefined"
**Solution**: Ensure Supabase credentials are correctly configured in `script.js`

### Issue: No students appear
**Solution**: 
1. Check that students table has data
2. Verify Supabase connection is working
3. Check browser console for errors (F12)

### Issue: Attendance not saving
**Solution**:
1. Check database permissions
2. Ensure date format is YYYY-MM-DD
3. Verify period is between 1-9
4. Check Supabase Row Level Security (RLS) policies

### Issue: CORS Error
**Solution**: This shouldn't occur as Supabase handles CORS. If it does, check your Supabase project settings.

---

## 📝 File Structure

```
attendance/
├── index.html          # Main HTML structure
├── style.css          # All styling and responsive design
├── script.js          # JavaScript logic and Supabase integration
└── README.md          # This file
```

---

## 🌟 Features Summary

✅ **9 Periods per day** - Each 45 minutes  
✅ **Mark Attendance** - Bulk marking with checkboxes  
✅ **Dashboard Stats** - Real-time attendance metrics  
✅ **Absentees List** - View and copy absent students  
✅ **Attendance History** - Query past attendance records  
✅ **Responsive Design** - Mobile, tablet, and desktop friendly  
✅ **Light Purple Theme** - Modern, clean UI  
✅ **Smooth Animations** - Professional transitions  
✅ **Error Handling** - User-friendly error messages  
✅ **Loading Indicators** - Visual feedback  

---

## 📞 Support & Tips

### Best Practices
1. **Back up your data** regularly from Supabase
2. **Use RLS policies** to secure your data
3. **Test on different devices** to ensure responsive design
4. **Keep Supabase dependencies updated**

### Performance Tips
- Use indexes on frequently queried columns
- Limit history queries to specific date ranges
- Consider pagination for large student lists

### Future Enhancements
- Add class/section management
- Implement teacher login system
- Add bulk import from CSV
- Generate attendance reports
- Email notifications for low attendance

---

## 📄 License

This application is ready for college/school use. Feel free to modify as needed.

---

## 🎯 Version

**Version**: 1.0  
**Last Updated**: April 2026  
**Status**: Production Ready

---

Enjoy your Attendance Tracker! 🎉
