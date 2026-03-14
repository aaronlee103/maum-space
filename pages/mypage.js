import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', postcode: '', address: '', address_detail: '' });
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login?redirect=/mypage'); return; }
      setUser(user);
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) setProfile({ name: data.name || '', email: data.email || user.email || '', phone: data.phone || '', postcode: data.postcode || '', address: data.address || '', address_detail: data.address_detail || '' });
        else setProfile(p => ({ ...p, email: user.email || '' }));
      });
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
        if (data) setOrders(data);
      });
      setLoading(false);
    });
  }, []);

  const handleChange = e => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

  const openDaum = () => {
    if (typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => {
      new window.daum.Postcode({
        oncomplete: data => {
          setProfile(p => ({ ...p, postcode: data.zonecode, address: data.roadAddress || data.jibunAddress }));
        },
      }).open();
    };
    if (!window.daum) document.head.appendChild(script);
    else new window.daum.Postcode({ oncomplete: data => setProfile(p => ({ ...p, postcode: data.zonecode, address: data.roadAddress || data.jibunAddress })) }).open();
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('profiles').upsert({ id: user.id, ...profile });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const inputStyle = { width: '100%', padding: '10px 0', fontSize: '14px', border: 'none', borderBottom: '1px solid #ddd', outline: 'none', background: 'transparent', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '11px', letterSpacing: '.1em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#999' }}>\uB85C\uB529 \uC911...</p></div>;

  return (
    <>
      <Head><title>\uB9C8\uC774\uD398\uC774\uC9C0 \u2014 Maum</title></Head>
      <div style={{ minHeight: '100vh', background: '#fafaf8' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '.15em', marginBottom: '4px' }}>Maum</h1>
              <p style={{ fontSize: '12px', color: '#999' }}>\uB9C8\uC774\uD398\uC774\uC9C0</p>
            </div>
            <button onClick={handleLogout} style={{ fontSize: '12px', color: '#999', background: 'none', border: '1px solid #ddd', padding: '8px 16px', cursor: 'pointer', letterSpacing: '.05em' }}>
              \uB85C\uADF8\uC544\uC6C3
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0', marginBottom: '40px', borderBottom: '1px solid #eee' }}>
            {[['profile', '\uD504\uB85C\uD544'], ['orders', '\uC8FC\uBB38 \uB0B4\uC5ED']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === key ? '2px solid #1a1a1a' : '2px solid transparent', fontSize: '13px', color: tab === key ? '#1a1a1a' : '#999', cursor: 'pointer', letterSpacing: '.05em', marginBottom: '-1px' }}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                  <label style={labelStyle}>\uC774\uB984</label>
                  <input name="name" value={profile.name} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>\uC774\uBA54\uC77C</label>
                  <input name="email" value={profile.email} onChange={handleChange} style={{ ...inputStyle, color: '#999' }} disabled />
                </div>
                <div>
                  <label style={labelStyle}>\uC5F0\uB77D\uCC98</label>
                  <input name="phone" value={profile.phone} onChange={handleChange} style={inputStyle} placeholder="010-0000-0000" />
                </div>
                <div>
                  <label style={labelStyle}>\uC8FC\uC18C</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input name="postcode" value={profile.postcode} onChange={handleChange} style={{ ...inputStyle, width: '120px' }} placeholder="\uC6B0\uD3B8\uBC88\uD638" readOnly />
                    <button type="button" onClick={openDaum} style={{ padding: '10px 16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      \uC8FC\uC18C \uAC80\uC0C9
                    </button>
                  </div>
                  <input name="address" value={profile.address} onChange={handleChange} style={{ ...inputStyle, marginBottom: '8px' }} placeholder="\uAE30\uBCF8\uC8FC\uC18C" readOnly />
                  <input name="address_detail" value={profile.address_detail} onChange={handleChange} style={inputStyle} placeholder="\uC0C1\uC138\uC8FC\uC18C" />
                </div>
              </div>
              <button type="submit" disabled={saving}
                style={{ marginTop: '32px', padding: '14px 32px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saved ? '\u2713 \uC800\uC7A5\uB428' : saving ? '\uC800\uC7A5 \uC911...' : '\uC800\uC7A5\uD558\uAE30'}
              </button>
            </form>
          )}

          {tab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>\uC8FC\uBB38 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>
              ) : (
                orders.map(order => {
                  const data = order.order_data || {};
                  const date = new Date(order.created_at).toLocaleDateString('ko-KR');
                  return (
                    <div key={order.id} style={{ borderBottom: '1px solid #eee', padding: '20px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#999' }}>{date}</span>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>${(order.total_usd || 0).toFixed(2)}</span>
                      </div>
                      <p style={{ fontSize: '14px', marginBottom: '4px' }}>{order.product_name || '\uC8FC\uBB38'}</p>
                      <p style={{ fontSize: '12px', color: '#999' }}>
                        \uBC1B\uB294 \uBD84: {data.recipientName || ''} / {data.recipientPhone || ''}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
