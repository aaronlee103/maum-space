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
      if (!user) {
        router.replace('/login?redirect=/mypage');
        return;
      }
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

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999' }}>로딩 중...</p>
    </div>
  );

  return (
    <>
      <Head><title>마이페이지 — Maum</title></Head>
      <div style={{ minHeight: '100vh', background: '#fafaf8' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '.15em', marginBottom: '4px' }}>
                <a href="/" style={{ textDecoration: 'none', color: '#1a1a1a' }}>Maum</a>
              </h1>
              <p style={{ fontSize: '12px', color: '#999' }}>마이페이지</p>
            </div>
            <button onClick={handleLogout} style={{ fontSize: '12px', color: '#999', background: 'none', border: '1px solid #ddd', padding: '8px 16px', cursor: 'pointer', letterSpacing: '.05em' }}>
              로그아웃
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0', marginBottom: '40px', borderBottom: '1px solid #eee' }}>
            {[['profile', '프로필'], ['orders', '주문 내역']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === key ? '2px solid #1a1a1a' : '2px solid transparent', fontSize: '13px', color: tab === key ? '#1a1a1a' : '#999', cursor: 'pointer', letterSpacing: '.05em', marginBottom: '-1px' }}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                  <label style={labelStyle}>이름</label>
                  <input name="name" value={profile.name} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>이메일</label>
                  <input name="email" value={profile.email} onChange={handleChange} style={{ ...inputStyle, color: '#999' }} disabled />
                </div>
                <div>
                  <label style={labelStyle}>연락처</label>
                  <input name="phone" value={profile.phone} onChange={handleChange} style={inputStyle} placeholder="010-0000-0000" />
                </div>
                <div>
                  <label style={labelStyle}>주소</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input name="postcode" value={profile.postcode} onChange={handleChange} style={{ ...inputStyle, width: '120px' }} placeholder="우편번호" readOnly />
                    <button type="button" onClick={openDaum} style={{ padding: '10px 16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      주소 검색
                    </button>
                  </div>
                  <input name="address" value={profile.address} onChange={handleChange} style={{ ...inputStyle, marginBottom: '8px' }} placeholder="기본주소" readOnly />
                  <input name="address_detail" value={profile.address_detail} onChange={handleChange} style={inputStyle} placeholder="상세주소" />
                </div>
              </div>
              <button type="submit" disabled={saving} style={{ marginTop: '32px', padding: '14px 32px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saved ? '✓ 저장됨' : saving ? '저장 중...' : '저장하기'}
              </button>
            </form>
          )}

          {tab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>주문 내역이 없습니다.</p>
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
                      <p style={{ fontSize: '14px', marginBottom: '4px' }}>{order.product_name || '주문'}</p>
                      <p style={{ fontSize: '12px', color: '#999' }}>
                        받는 분: {data.recipientName || ''} / {data.recipientPhone || ''}
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
