-- ============================================
-- ATTENDANCE TRACKER - SUPABASE SETUP SCRIPT
-- ============================================
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period INTEGER NOT NULL CHECK (period >= 1 AND period <= 9),
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure only one record per student per day per period
  UNIQUE(student_id, date, period)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_date_period ON attendance(date, period);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- ============================================
-- SAMPLE DATA (Optional - Delete if not needed)
-- ============================================
-- Uncomment the lines below to insert sample students for testing

/*
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
('Jai Kapoor', '010'),
('Kavya Nair', '011'),
('Liam Desai', '012'),
('Maya Chandra', '013'),
('Nikhil Bhat', '014'),
('Olivia Malhotra', '015');

-- Sample attendance records for today
INSERT INTO attendance (student_id, date, period, status)
SELECT 
  id,
  CURRENT_DATE,
  1,
  CASE WHEN RANDOM() > 0.2 THEN 'present' ELSE 'absent' END
FROM students;
*/

-- ============================================
-- ROW LEVEL SECURITY (Optional)
-- ============================================
-- Uncomment and configure RLS policies based on your authentication needs

/*
-- Enable RLS on both tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read students
CREATE POLICY "Allow select on students" ON students
FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete students
CREATE POLICY "Allow insert on students" ON students
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on students" ON students
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete on students" ON students
FOR DELETE USING (true);

-- Similar policies for attendance table
CREATE POLICY "Allow select on attendance" ON attendance
FOR SELECT USING (true);

CREATE POLICY "Allow insert on attendance" ON attendance
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on attendance" ON attendance
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete on attendance" ON attendance
FOR DELETE USING (true);
*/

-- ============================================
-- VERIFY SETUP
-- ============================================
-- Run these queries to verify everything is set up correctly:

-- Check students table structure
-- SELECT * FROM students LIMIT 1;

-- Check attendance table structure
-- SELECT * FROM attendance LIMIT 1;

-- Count total students
-- SELECT COUNT(*) as total_students FROM students;

-- Count today's attendance records
-- SELECT 
--   DATE(date) as attendance_date,
--   COUNT(*) as total_records,
--   COUNTIF(status = 'present') as present_count,
--   COUNTIF(status = 'absent') as absent_count
-- FROM attendance
-- WHERE date = CURRENT_DATE
-- GROUP BY DATE(date);

-- ============================================
-- END OF SETUP SCRIPT
-- ============================================
