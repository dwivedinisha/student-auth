import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', course: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/register`, form);
      setMsg('Registered! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Student Register</h2>
        {['name','email','password','course'].map(field => (
          <input key={field} placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
            type={field === 'password' ? 'password' : 'text'}
            style={styles.input}
            value={form[field]}
            onChange={e => setForm({...form, [field]: e.target.value})} />
        ))}
        <button style={styles.btn} onClick={handleSubmit}>Register</button>
        <p>{msg}</p>
        <p>Already registered? <a href="/login">Login</a></p>
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