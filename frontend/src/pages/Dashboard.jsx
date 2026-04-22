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
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/dashboard`, { headers })
      .then(res => { setStudent(res.data); setCourse(res.data.course); })
      .catch(() => navigate('/login'));
  }, []);

  const updatePassword = async () => {
    try {
      const { data } = await axios.put(`${API}/update-password`, { oldPassword: oldPass, newPassword: newPass }, { headers });
      setMsg(data.message);
    } catch (err) { setMsg(err.response?.data?.message); }
  };

  const updateCourse = async () => {
    try {
      const { data } = await axios.put(`${API}/update-course`, { course }, { headers });
      setMsg(data.message);
      setStudent({ ...student, course });
    } catch (err) { setMsg(err.response?.data?.message); }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!student) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>👋 Welcome, {student.name}</h2>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Course:</b> {student.course}</p>
        <hr />
        <h3>Update Password</h3>
        <input placeholder="Old Password" type="password" style={styles.input} onChange={e => setOldPass(e.target.value)} />
        <input placeholder="New Password" type="password" style={styles.input} onChange={e => setNewPass(e.target.value)} />
        <button style={styles.btn} onClick={updatePassword}>Update Password</button>
        <hr />
        <h3>Change Course</h3>
        <input placeholder="New Course" style={styles.input} value={course} onChange={e => setCourse(e.target.value)} />
        <button style={styles.btn} onClick={updateCourse}>Update Course</button>
        {msg && <p style={{color:'green'}}>{msg}</p>}
        <hr />
        <button style={{...styles.btn, background:'#ef4444'}} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f4f8' },
  card: { background:'white', padding:'2rem', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'400px', display:'flex', flexDirection:'column', gap:'10px' },
  input: { padding:'10px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'15px' },
  btn: { padding:'10px', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'15px' }
};