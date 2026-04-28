// ===== SUPABASE CONFIGURATION =====
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://cpmsxozovcinqrjelshk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7SiNof9mQOyo3S2RunPv5w_lLOQPdWI';

// Initialize Supabase client
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== STATE MANAGEMENT =====
let state = {
    students: [],
    currentDate: new Date().toISOString().split('T')[0],
    currentPeriod: null,
    selectedStudents: {},
    todayAttendance: null,
};

// ===== DOM ELEMENTS =====
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const alertDiv = document.getElementById('alert');
const loadingIndicator = document.getElementById('loadingIndicator');

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    setTodayDate();
    setupEventListeners();
    loadDashboard();
});

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Tab Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Dashboard
    document.getElementById('refreshDashboard').addEventListener('click', loadDashboard);

    // Mark Attendance
    document.getElementById('loadStudentsBtn').addEventListener('click', loadStudentsForAttendance);
    document.getElementById('selectAllCheckbox').addEventListener('change', toggleSelectAll);
    document.getElementById('saveAttendanceBtn').addEventListener('click', saveAttendance);
    document.getElementById('cancelAttendanceBtn').addEventListener('click', cancelAttendance);

    // Set default date to today
    document.getElementById('attendanceDate').valueAsDate = new Date();
    document.getElementById('absenteeDate').valueAsDate = new Date();
    document.getElementById('historyDate').valueAsDate = new Date();

    // View Absentees
    document.getElementById('viewAbsenteesBtn').addEventListener('click', viewAbsentees);
    document.getElementById('copyAbsenteesBtn').addEventListener('click', copyAbsenteesList);

    // History
    document.getElementById('loadHistoryBtn').addEventListener('click', loadAttendanceHistory);
}

// ===== TAB NAVIGATION =====
function switchTab(e) {
    const targetTab = e.currentTarget.dataset.tab;

    // Remove active class from all buttons and contents
    navBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked button and corresponding content
    e.currentTarget.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
}

// ===== UTILITY FUNCTIONS =====

/**
 * Show/hide loading indicator
 */
function showLoading(show = true) {
    loadingIndicator.style.display = show ? 'flex' : 'none';
}

/**
 * Display alert messages
 */
function showAlert(message, type = 'info') {
    alertDiv.className = `alert ${type} show`;
    alertDiv.innerHTML = `<strong>${type.toUpperCase()}:</strong> ${message}`;

    setTimeout(() => {
        alertDiv.classList.remove('show');
    }, 4000);
}

/**
 * Set today's date in the dashboard
 */
function setTodayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    document.getElementById('todayDate').textContent = today.toLocaleDateString('en-IN', options);
}

/**
 * Format period number to display text
 */
function formatPeriod(period) {
    const periods = {
        1: 'Period 1 (9:00 - 9:45)',
        2: 'Period 2 (9:45 - 10:30)',
        3: 'Period 3 (10:30 - 11:15)',
        4: 'Period 4 (11:15 - 12:00)',
        5: 'Period 5 (12:00 - 12:45)',
        6: 'Period 6 (1:00 - 1:45 PM)',
        7: 'Period 7 (1:45 - 2:30 PM)',
        8: 'Period 8 (2:30 - 3:15 PM)',
        9: 'Period 9 (3:15 - 4:00 PM)',
    };
    return periods[period] || `Period ${period}`;
}

// ===== SUPABASE OPERATIONS =====

/**
 * Fetch all students from Supabase
 */
async function fetchAllStudents() {
    try {
        showLoading(true);
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('roll_no', { ascending: true });

        if (error) throw error;

        state.students = data || [];
        showLoading(false);
        return state.students;
    } catch (error) {
        console.error('Error fetching students:', error);
        showLoading(false);
        showAlert('Error loading students: ' + error.message, 'error');
        return [];
    }
}

/**
 * Save attendance records to Supabase
 */
async function saveAttendanceRecords(date, period, attendanceData) {
    try {
        showLoading(true);

        // Delete existing records for this date and period
        const { error: deleteError } = await supabase
            .from('attendance')
            .delete()
            .eq('date', date)
            .eq('period', period);

        if (deleteError) throw deleteError;

        // Insert new attendance records
        const { error: insertError } = await supabase
            .from('attendance')
            .insert(attendanceData);

        if (insertError) throw insertError;

        showLoading(false);
        showAlert('Attendance saved successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error saving attendance:', error);
        showLoading(false);
        showAlert('Error saving attendance: ' + error.message, 'error');
        return false;
    }
}

/**
 * Fetch attendance for a specific date and period
 */
async function fetchAttendanceByDatePeriod(date, period) {
    try {
        const { data, error } = await supabase
            .from('attendance')
            .select('*, students(*)')
            .eq('date', date)
            .eq('period', period);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching attendance:', error);
        showAlert('Error loading attendance: ' + error.message, 'error');
        return [];
    }
}

/**
 * Calculate today's attendance statistics
 */
async function calculateTodayStats() {
    try {
        const today = state.currentDate;

        // Fetch all students
        const { data: students, error: studentError } = await supabase
            .from('students')
            .select('id');

        if (studentError) throw studentError;

        const totalStudents = students.length;

        // Fetch today's attendance (all periods)
        const { data: attendanceData, error: attendanceError } = await supabase
            .from('attendance')
            .select('*')
            .eq('date', today);

        if (attendanceError) throw attendanceError;

        // Count present and absent
        const presentCount = attendanceData.filter(a => a.status === 'present').length;
        const absentCount = attendanceData.filter(a => a.status === 'absent').length;

        // Calculate percentage
        const totalMarked = presentCount + absentCount;
        const percentage = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

        return {
            totalStudents,
            presentCount,
            absentCount,
            percentage,
        };
    } catch (error) {
        console.error('Error calculating stats:', error);
        return {
            totalStudents: 0,
            presentCount: 0,
            absentCount: 0,
            percentage: 0,
        };
    }
}

// ===== DASHBOARD SECTION =====

/**
 * Load and display dashboard statistics
 */
async function loadDashboard() {
    showLoading(true);
    const stats = await calculateTodayStats();

    document.getElementById('totalStudents').textContent = stats.totalStudents;
    document.getElementById('totalPresent').textContent = stats.presentCount;
    document.getElementById('totalAbsent').textContent = stats.absentCount;
    document.getElementById('attendancePercentage').textContent = stats.percentage + '%';

    showLoading(false);
}

// ===== MARK ATTENDANCE SECTION =====

/**
 * Load students for attendance marking
 */
async function loadStudentsForAttendance() {
    const date = document.getElementById('attendanceDate').value;
    const period = document.getElementById('periodSelect').value;

    if (!date || !period) {
        showAlert('Please select both date and period', 'error');
        return;
    }

    state.currentDate = date;
    state.currentPeriod = period;
    state.selectedStudents = {};

    showLoading(true);

    // Fetch all students
    await fetchAllStudents();

    // Fetch existing attendance for this date/period
    const existingAttendance = await fetchAttendanceByDatePeriod(date, parseInt(period));

    // Create a map of student IDs with their attendance status
    const attendanceMap = {};
    existingAttendance.forEach(record => {
        attendanceMap[record.student_id] = record.status;
    });

    // Render students list
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';

    state.students.forEach(student => {
        const isPresent = attendanceMap[student.id] === 'present';
        state.selectedStudents[student.id] = isPresent;

        const studentEl = document.createElement('div');
        studentEl.className = 'student-item';
        studentEl.innerHTML = `
            <input type="checkbox" id="student-${student.id}" ${isPresent ? 'checked' : ''}>
            <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-roll">Roll No: ${student.roll_no}</div>
            </div>
        `;

        studentEl.querySelector('input').addEventListener('change', (e) => {
            state.selectedStudents[student.id] = e.target.checked;
        });

        studentsList.appendChild(studentEl);
    });

    // Show students container
    document.getElementById('studentsContainer').style.display = 'block';

    // Reset select all checkbox
    document.getElementById('selectAllCheckbox').checked = false;

    showLoading(false);
}

/**
 * Toggle select all students
 */
function toggleSelectAll() {
    const isChecked = document.getElementById('selectAllCheckbox').checked;
    const checkboxes = document.querySelectorAll('#studentsList input[type="checkbox"]');

    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = isChecked;
        const studentId = Object.keys(state.selectedStudents)[index];
        if (studentId) {
            state.selectedStudents[studentId] = isChecked;
        }
    });
}

/**
 * Save attendance
 */
async function saveAttendance() {
    const date = state.currentDate;
    const period = parseInt(state.currentPeriod);

    // Prepare attendance data
    const attendanceData = Object.entries(state.selectedStudents).map(([studentId, isPresent]) => ({
        student_id: studentId,
        date: date,
        period: period,
        status: isPresent ? 'present' : 'absent',
    }));

    // Save to Supabase
    const success = await saveAttendanceRecords(date, period, attendanceData);

    if (success) {
        cancelAttendance();
        // Refresh dashboard
        await loadDashboard();
    }
}

/**
 * Cancel attendance marking
 */
function cancelAttendance() {
    document.getElementById('studentsContainer').style.display = 'none';
    document.getElementById('studentsList').innerHTML = '';
    document.getElementById('attendanceDate').value = '';
    document.getElementById('periodSelect').value = '';
    state.selectedStudents = {};
}

// ===== VIEW ABSENTEES SECTION =====

/**
 * View absentees for a specific date and period
 */
async function viewAbsentees() {
    const date = document.getElementById('absenteeDate').value;
    const period = document.getElementById('absenteePeriod').value;

    if (!date || !period) {
        showAlert('Please select both date and period', 'error');
        return;
    }

    showLoading(true);

    // Fetch attendance data
    const attendance = await fetchAttendanceByDatePeriod(date, parseInt(period));

    // Get all students
    const allStudents = await fetchAllStudents();

    // Find absentees
    const presentIds = new Set(
        attendance.filter(a => a.status === 'present').map(a => a.student_id)
    );

    const absentees = allStudents.filter(student => !presentIds.has(student.id));

    // Display absentees
    const absenteesList = document.getElementById('absenteesList');
    absenteesList.innerHTML = '';

    if (absentees.length === 0) {
        absenteesList.innerHTML = '<div class="empty-message">No absentees for this period!</div>';
    } else {
        absentees.forEach(student => {
            const absenteeEl = document.createElement('div');
            absenteeEl.className = 'absentee-item';
            absenteeEl.innerHTML = `
                <div class="absentee-icon">
                    <i class="fas fa-user-slash"></i>
                </div>
                <div class="absentee-name">${student.name}</div>
                <div class="absentee-roll" style="color: #666; font-size: 0.9rem;">Roll: ${student.roll_no}</div>
            `;
            absenteesList.appendChild(absenteeEl);
        });
    }

    // Update count
    document.getElementById('absenteeCount').textContent = absentees.length;

    // Show display
    document.getElementById('absenteesDisplay').style.display = 'block';

    showLoading(false);
}

/**
 * Copy absentees list to clipboard
 */
async function copyAbsenteesList() {
    const absenteesList = document.getElementById('absenteesList');
    const items = absenteesList.querySelectorAll('.absentee-item');

    if (items.length === 0) {
        showAlert('No absentees to copy', 'error');
        return;
    }

    let text = 'ABSENTEES LIST\n';
    text += '===============\n\n';

    items.forEach((item, index) => {
        const name = item.querySelector('.absentee-name').textContent;
        const roll = item.querySelector('.absentee-roll').textContent;
        text += `${index + 1}. ${name} (${roll})\n`;
    });

    try {
        await navigator.clipboard.writeText(text);
        showAlert('Absentees list copied to clipboard!', 'success');
    } catch (err) {
        showAlert('Failed to copy to clipboard', 'error');
    }
}

// ===== ATTENDANCE HISTORY SECTION =====

/**
 * Load and display attendance history
 */
async function loadAttendanceHistory() {
    const date = document.getElementById('historyDate').value;
    const period = document.getElementById('historyPeriod').value;

    if (!date || !period) {
        showAlert('Please select both date and period', 'error');
        return;
    }

    showLoading(true);

    // Fetch attendance data
    const attendance = await fetchAttendanceByDatePeriod(date, parseInt(period));

    // Fetch all students
    const allStudents = await fetchAllStudents();

    // Separate present and absent
    const presentIds = new Set();
    const absentIds = new Set();

    attendance.forEach(record => {
        if (record.status === 'present') {
            presentIds.add(record.student_id);
        } else {
            absentIds.add(record.student_id);
        }
    });

    const presentStudents = allStudents.filter(s => presentIds.has(s.id));
    const absentStudents = allStudents.filter(s => absentIds.has(s.id));

    // Update stats
    document.getElementById('historyTotalStudents').textContent = allStudents.length;
    document.getElementById('historyPresentCount').textContent = presentStudents.length;
    document.getElementById('historyAbsentCount').textContent = absentStudents.length;

    // Display present students
    const presentList = document.getElementById('historyPresentList');
    presentList.innerHTML = '';

    if (presentStudents.length === 0) {
        presentList.innerHTML = '<li class="empty-message">No students marked present</li>';
    } else {
        presentStudents.forEach(student => {
            const li = document.createElement('li');
            li.className = 'history-item present';
            li.innerHTML = `<i class="fas fa-check"></i> ${student.name} (${student.roll_no})`;
            presentList.appendChild(li);
        });
    }

    // Display absent students
    const absentList = document.getElementById('historyAbsentList');
    absentList.innerHTML = '';

    if (absentStudents.length === 0) {
        absentList.innerHTML = '<li class="empty-message">No students marked absent</li>';
    } else {
        absentStudents.forEach(student => {
            const li = document.createElement('li');
            li.className = 'history-item absent';
            li.innerHTML = `<i class="fas fa-times"></i> ${student.name} (${student.roll_no})`;
            absentList.appendChild(li);
        });
    }

    // Show display
    document.getElementById('historyDisplay').style.display = 'block';

    showLoading(false);
}

// ===== AUTO-LOAD STUDENTS ON PAGE LOAD (OPTIONAL) =====
// Uncomment the line below to auto-load students when the page loads
// fetchAllStudents();
