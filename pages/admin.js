import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ADMIN_EMAIL = 'aaronlee103@gmail.com';

const STATUS_LABELS = {
  pending_payment: { ko: '결제 대기', color: '#f5a623', bg: '#fff8ee' },
  paid:            { ko: '결제 완료', color: '#4a90e2', bg: '#eef4fc' },
  ordered:         { ko: '쿠팡 주문 완료', color: '#7b68ee', bg: '#f0eeff' },
  shipped:         { ko: '배송 중', color: '#27ae60', bg: '#eefaf3' },
  delivered:       { ko: '배송 완료', color: '#999', bg: '#f5f5f5' },
  cancelled:       { ko: '취소', color: '#e74c3c', bg: '#fef0f0' },
};

const NEXT_STATUS = {
  paid: 'ordered',
  ordered: 'shipped',
  shipped: 'delivered',
};

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [noteInput, setNoteInput] = useState({});
  const [trackingInput, setTrackingInput] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    supabaseAdmin.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.replace('/login');
        return;
      }
      setUser(session.user);
      fetchOrders();
    fetchInquiries();
    });
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function fetchInquiries() {
    const { data } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    setInquiries(data || []);
  }

  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId);
    await supabaseAdmin
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    await fetchOrders();
    setUpdating(null);
  }

  async function saveNote(orderId) {
    const note = noteInput[orderId] || '';
    await supabaseAdmin.from('orders').update({ admin_note: note }).eq('id', orderId);
    await fetchOrders();
  }

  async function saveTracking(orderId) {
    const tracking = trackingInput[orderId] || '';
    await supabaseAdmin.from('orders').update({ tracking_number: tracking }).eq('id', orderId);
    await fetchOrders();
  }

  async function saveCoupangOrder(orderId) {
    const num = trackingInput['coupang_' + orderId] || '';
    await supabaseAdmin.from('orders').update({ coupang_order_number: num }).eq('id', orderId);
    await fetchOrders();
  }

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fafaf8', color: '#999', fontSize: '13px', letterSpacing: '.1em' }}>
      LOADING...
    </div>
  );

  return (
    <>
      <Head><title>Admin — Maum Orders</title></Head>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Helvetica Neue', sans-serif; background: #f5f5f3; color: #1a1a1a; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; letter-spacing: .05em; font-weight: 500; }
        input[type="text"] { border: 1px solid #e0e0e0; padding: 7px 10px; font-size: 13px; font-family: inherit; outline: none; border-radius: 3px; }
        input[type="text"]:focus { border-color: #1a1a1a; }
        button { cursor: pointer; font-family: inherit; }
      `}</style>

      {/* Header */}
      <div style={{ background: '#1a1a1a', color: '#fff', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 300, letterSpacing: '.25em', textTransform: 'uppercase' }}>MAUM</span>
          <span style={{ fontSize: '11px', color: '#888', marginLeft: '16px', letterSpacing: '.1em' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>{user?.email}</span>
          <button onClick={() => { supabaseAdmin.auth.signOut(); router.push('/login'); }}
            style={{ background: 'none', border: '1px solid #555', color: '#ccc', padding: '6px 14px', fontSize: '11px', letterSpacing: '.1em' }}>
            로그아웃
          </button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: '전체', count: orders.length },
            { key: 'paid', label: '결제완료', count: counts.paid || 0 },
            { key: 'ordered', label: '쿠팡주문', count: counts.ordered || 0 },
            { key: 'shipped', label: '배송중', count: counts.shipped || 0 },
            { key: 'delivered', label: '완료', count: counts.delivered || 0 },
          ].map(s => (
            <button key={s.key} onClick={() => setFilterStatus(s.key)}
              style={{ background: filterStatus === s.key ? '#1a1a1a' : '#fff', color: filterStatus === s.key ? '#fff' : '#333', border: '1px solid #e0e0e0', padding: '12px 20px', borderRadius: '6px', fontSize: '13px', minWidth: '100px' }}>
              <div style={{ fontSize: '22px', fontWeight: 300, marginBottom: '4px' }}>{s.count}</div>
              <div style={{ fontSize: '11px', letterSpacing: '.05em', color: filterStatus === s.key ? '#ccc' : '#999' }}>{s.label}</div>
            </button>
          ))}
        </div>

        {/* Order list */}
        {filtered.length === 0 ? (
          <div style={{ background: '#fff', padding: '48px', textAlign: 'center', color: '#bbb', borderRadius: '8px', fontSize: '14px' }}>주문이 없습니다</div>
        ) : (
          filtered.map(order => {
            const st = STATUS_LABELS[order.status] || STATUS_LABELS.paid;
            const isExpanded = expanded === order.id;
            const nextSt = NEXT_STATUS[order.status];

            return (
              <div key={order.id} style={{ background: '#fff', borderRadius: '8px', marginBottom: '12px', overflow: 'hidden', border: '1px solid #ebebea' }}>
                {/* Row header */}
                <div
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', userSelect: 'none' }}>
                  <span className="badge" style={{ color: st.color, background: st.bg }}>{st.ko}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{order.sender_name}</div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
                      {new Date(order.created_at).toLocaleString('ko-KR')} · {order.sender_email}
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 400, color: '#1a1a1a' }}>${(order.total_usd || 0).toFixed(2)}</div>
                  <div style={{ color: '#ccc', fontSize: '18px' }}>{isExpanded ? '▲' : '▼'}</div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f0f0f0', padding: '24px', background: '#fafaf8' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                      {/* Items */}
                      <div>
                        <div style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>주문 상품</div>
                        {(order.items || []).map((item, i) => (
                          <div key={i} style={{ fontSize: '13px', padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.productName} × {item.quantity}</span>
                            <span style={{ color: '#555' }}>${(item.total || 0).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items?.[0]?.url && (
                          <a href={order.items[0].url} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-block', marginTop: '8px', fontSize: '11px', color: '#4a90e2', textDecoration: 'none' }}>
                            쿠팡 링크 열기 →
                          </a>
                        )}
                      </div>

                      {/* Recipient */}
                      <div>
                        <div style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>배송 정보</div>
                        <div style={{ fontSize: '13px', lineHeight: '2', color: '#555' }}>
                          <div><strong style={{ color: '#333' }}>받는 분:</strong> {order.recipient_name}</div>
                          <div><strong style={{ color: '#333' }}>연락처:</strong> {order.recipient_phone}</div>
                          <div><strong style={{ color: '#333' }}>우편번호:</strong> {order.recipient_postcode}</div>
                          <div><strong style={{ color: '#333' }}>주소:</strong> {order.recipient_address} {order.recipient_address_detail}</div>
                          {order.message && <div><strong style={{ color: '#333' }}>메시지:</strong> {order.message}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Admin actions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', paddingTop: '20px', borderTop: '1px solid #ebebea' }}>
                      {/* Status update */}
                      <div>
                        <div style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>상태 변경</div>
                        {nextSt ? (
                          <button onClick={() => updateStatus(order.id, nextSt)} disabled={updating === order.id}
                            style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '9px 16px', fontSize: '12px', letterSpacing: '.05em', borderRadius: '4px', opacity: updating === order.id ? 0.5 : 1 }}>
                            → {STATUS_LABELS[nextSt]?.ko}
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#bbb' }}>최종 상태</span>
                        )}
                      </div>

                      {/* Coupang order # */}
                      <div>
                        <div style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>쿠팡 주문번호</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" placeholder={order.coupang_order_number || '주문번호 입력'}
                            defaultValue={order.coupang_order_number || ''}
                            onChange={e => setTrackingInput(p => ({ ...p, ['coupang_' + order.id]: e.target.value }))}
                            style={{ flex: 1, fontSize: '12px' }} />
                          <button onClick={() => saveCoupangOrder(order.id)}
                            style={{ background: '#f5f5f3', border: '1px solid #e0e0e0', padding: '7px 12px', fontSize: '11px', borderRadius: '3px' }}>저장</button>
                        </div>
                      </div>

                      {/* Tracking # */}
                      <div>
                        <div style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>운송장 번호</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" placeholder={order.tracking_number || '운송장 번호 입력'}
                            defaultValue={order.tracking_number || ''}
                            onChange={e => setTrackingInput(p => ({ ...p, [order.id]: e.target.value }))}
                            style={{ flex: 1, fontSize: '12px' }} />
                          <button onClick={() => saveTracking(order.id)}
                            style={{ background: '#f5f5f3', border: '1px solid #e0e0e0', padding: '7px 12px', fontSize: '11px', borderRadius: '3px' }}>저장</button>
                        </div>
                      </div>
                    </div>

                    {/* Admin note */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>관리자 메모</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" placeholder={order.admin_note || '메모 입력...'}
                          defaultValue={order.admin_note || ''}
                          onChange={e => setNoteInput(p => ({ ...p, [order.id]: e.target.value }))}
                          style={{ flex: 1, fontSize: '13px' }} />
                        <button onClick={() => saveNote(order.id)}
                          style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '7px 16px', fontSize: '11px', letterSpacing: '.05em', borderRadius: '3px' }}>저장</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      
      {/* Inquiries */}
      <div style={{ marginTop: '48px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>문의 내역</div>
        {inquiries.length === 0 ? (
          <div style={{ background: '#fff', padding: '24px', textAlign: 'center', color: '#bbb', borderRadius: '8px', fontSize: '13px' }}>문의가 없습니다</div>
        ) : (
          inquiries.map(inq => (
            <div key={inq.id} style={{ background: '#fff', borderRadius: '8px', marginBottom: '8px', padding: '16px 20px', border: '1px solid #ebebea' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 500, fontSize: '13px' }}>{inq.name}</span>
                <span style={{ fontSize: '11px', color: '#999' }}>{new Date(inq.created_at).toLocaleString('ko-KR')}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#555', whiteSpace: 'pre-wrap' }}>{inq.message}</div>
            </div>
          ))
        )}
      </div>
</div>
    </>
  );
}
