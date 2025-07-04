import { useState, useEffect } from 'react';

export default function Home() {
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: 'ENS User' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [ensData, setEnsData] = useState({ user_id: '', bl_number: '', vessel_name: '', port_loading: '', port_discharge: '' });
  const [mrnData, setMrnData] = useState({ vessel_name: '', port_discharge: '' });
  const [user, setUser] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleRegister = async () => {
    if (!registerData.name || !registerData.email || !registerData.password) {
      alert('All fields are required');
      return;
    }
    const res = await fetch(`${apiUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    });
    const data = await res.json();
    alert(`User registered: ${data.name}`);
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      alert('Email and password are required');
      return;
    }
    const res = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    if (data && data.id) {
      setUser(data);
      alert(`Welcome ${data.name}`);
    } else {
      alert('Login failed');
    }
  };

  const handleENS = async () => {
    if (!user) return alert('Login required');
    const res = await fetch(`${apiUrl}/api/ens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ensData, user_id: user.id }),
    });
    const data = await res.json();
    alert(`ENS submitted for vessel: ${data.vessel_name}`);
  };

  const handleMRN = async () => {
    if (!user) return alert('Login required');
    const res = await fetch(`${apiUrl}/api/mrn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mrnData),
    });
    const data = await res.json();
    alert(`MRN submitted for vessel: ${data.vessel_name}`);
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">ENS/MRN Certificate System</h1>

      {!user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            <select className="w-full p-2 mb-2 border rounded" value={registerData.role} onChange={e => setRegisterData({ ...registerData, role: e.target.value })}>
              <option value="ENS User">ENS User</option>
              <option value="MRN User">MRN User</option>
            </select>
            <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="Name" value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} />
            <input className="w-full p-2 mb-2 border rounded" type="email" placeholder="Email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
            <input className="w-full p-2 mb-4 border rounded" type="password" placeholder="Password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} />
            <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={handleRegister}>Register</button>
          </div>

          <div className="border p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <input className="w-full p-2 mb-2 border rounded" type="email" placeholder="Email" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
            <input className="w-full p-2 mb-4 border rounded" type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
            <button className="w-full bg-green-600 text-white py-2 rounded" onClick={handleLogin}>Login</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Apply for ECTN or ENS Certificate</h2>
            <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="Bill of Lading Number" value={ensData.bl_number} onChange={e => setEnsData({ ...ensData, bl_number: e.target.value })} />
            <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="Vessel Name" value={ensData.vessel_name} onChange={e => setEnsData({ ...ensData, vessel_name: e.target.value })} />
            <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="Port of Loading" value={ensData.port_loading} onChange={e => setEnsData({ ...ensData, port_loading: e.target.value })} />
            <input className="w-full p-2 mb-4 border rounded" type="text" placeholder="Port of Discharge" value={ensData.port_discharge} onChange={e => setEnsData({ ...ensData, port_discharge: e.target.value })} />
            <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={handleENS}>Submit ENS</button>
          </div>

          <div className="border p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Apply for Ship Movement (MRN)</h2>
            <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="Vessel Name" value={mrnData.vessel_name} onChange={e => setMrnData({ ...mrnData, vessel_name: e.target.value })} />
            <input className="w-full p-2 mb-4 border rounded" type="text" placeholder="Port of Discharge" value={mrnData.port_discharge} onChange={e => setMrnData({ ...mrnData, port_discharge: e.target.value })} />
            <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={handleMRN}>Submit MRN</button>
          </div>

          <div className="md:col-span-2 border p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        </div>
      )}
    </main>
  );
}

