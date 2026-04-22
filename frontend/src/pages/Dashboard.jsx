import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://student-auth-1-9jkw.onrender.com/api';

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [course, setCourse] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    axios.get(`${API}/dashboard`, { headers })
      .then(res => { setStudent(res.data); setCourse(res.data.course); })
      .catch(() => { localStorage.clear(); navigate('/login'); });
  }, []);

  const updatePassword = async () => {
    try {
      const { data } = await axios.put(`${API}/update-password`,
        { oldPassword: oldPass, newPassword: newPass }, { headers });
      setMsg(data.message);
      setMsgType('success');
      setOldPass(''); setNewPass('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating password');
      setMsgType('error');
    }
  };

  const updateCourse = async () => {
    try {
      const { data } = await axios.put(`${API}/update-course`, { course }, { headers });
      setMsg(data.message);
      setMsgType('success');
      setStudent({ ...student, course });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating course');
      setMsgType('error');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!student) return (
    <div style={styles.container}>
      <p style={{ fontSize: '18px', color: '#4f46e5' }}>Loading...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Student Info */}
        <div style={styles.profileBox}>
          <h2 style={styles.title}>👋 Welcome, {student.name}</h2>
          <p style={styles.info}><b>Email:</b> {student.email}</p>
          <p style={styles.info}><b>Course:</b> {student.course}</p>
        </div>

        <hr style={styles.divider} />

        {/* Update Password */}
        <h3 style={styles.sectionTitle}>🔒 Update Password</h3>
        <input
          placeholder="Old Password"
          type="password"
          style={styles.input}
          value={oldPass}
          onChange={e => setOldPass(e.target.value)}
        />
        <input
          placeholder="New Password"
          type="password"
          style={styles.input}
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
        />
        <button style={styles.btn} onClick={updatePassword}>Update Password</button>

        <hr style={styles.divider} />

        {/* Update Course */}
        <h3 style={styles.sectionTitle}>📚 Change Course</h3>
        <input
          placeholder="New Course"
          style={styles.input}
          value={course}
          onChange={e => setCourse(e.target.value)}
        />
        <button style={styles.btn} onClick={updateCourse}>Update Course</button>

        {/* Message */}
        {msg && (
          <p style={msgType === 'success' ? styles.success : styles.error}>{msg}</p>
        )}

        <hr style={styles.divider} />

        {/* Logout */}
        <button style={styles.logoutBtn} onClick={logout}>🚪 Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f4f8' },
  card: { background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '400px', display: 'flex', flexDirection: 'column', gap: '10px' },
  profileBox: { background: '#f5f3ff', padding: '1rem', borderRadius: '10px' },
  title: { color: '#4f46e5', margin: 0 },
  info: { margin: '4px 0', color: '#374151' },
  sectionTitle: { color: '#374151', margin: '0' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px' },
  btn: { padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  logoutBtn: { padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  error: { color: 'red', textAlign: 'center' },
  success: { color: 'green', textAlign: 'center' },
  divider: { border: 'none', borderTop: '1px solid #e5e7eb' }
};