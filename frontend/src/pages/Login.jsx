import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://student-auth-1-9jkw.onrender.com/api';


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`${API}/login`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('student', JSON.stringify(data.student));
      navigate('/dashboard');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Student Login</h2>
        <input placeholder="Email" style={styles.input} value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" style={styles.input} value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} />
        <button style={styles.btn} onClick={handleSubmit}>Login</button>
        <p style={{color:'red'}}>{msg}</p>
        <p>New student? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f4f8' },
  card: { background:'white', padding:'2rem', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'360px', display:'flex', flexDirection:'column', gap:'12px' },
  input: { padding:'10px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'15px' },
  btn: { padding:'10px', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'15px' }
};