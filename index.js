import React, { useState, useEffect } from "react";

// Banking Game Hub - Single-file React app (Tailwind CSS assumed) // Features: // - Login / Signup modal // - Product page with "สั่งซื้อเลย" button // - Order quantity input -> Confirmation modal // - After confirmation, navigate to Order History page // - LocalStorage persistence for user and orders

export default function App() { // user state (simple email name) const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("bg_user")) || null; } catch { return null; } });

const [orders, setOrders] = useState(() => { try { return JSON.parse(localStorage.getItem("bg_orders")) || []; } catch { return []; } });

// UI state const [showAuth, setShowAuth] = useState(false); const [showOrderModal, setShowOrderModal] = useState(false); const [selectedProduct, setSelectedProduct] = useState(null); const [qty, setQty] = useState(1); const [showConfirm, setShowConfirm] = useState(false); const [route, setRoute] = useState("home"); // home | history

useEffect(() => { localStorage.setItem("bg_orders", JSON.stringify(orders)); }, [orders]);

useEffect(() => { localStorage.setItem("bg_user", JSON.stringify(user)); }, [user]);

const product = { id: "gacha-1", title: "สุ่มการันตีตัวเทพ", subtitle: "สุ่มตัวแฟนฟิบายการันตีได้100%", point: 100, stock: 0, };

function handleOpenOrder(p) { if (!user) return setShowAuth(true); setSelectedProduct(p); setQty(1); setShowOrderModal(true); }

function confirmOrder() { setShowOrderModal(false); setShowConfirm(true); }

function finalizeOrder() { // create order record const newOrder = { id: ORD-${Date.now()}, product: selectedProduct.title, qty: qty, date: new Date().toLocaleString(), status: "สำเร็จ", }; setOrders((s) => [newOrder, ...s]); setShowConfirm(false); setRoute("history"); }

function logout() { setUser(null); localStorage.removeItem("bg_user"); }

return ( <div className="min-h-screen bg-gray-900 text-gray-100 p-4"> <header className="max-w-4xl mx-auto flex items-center justify-between py-6"> <div> <h1 className="text-2xl font-bold">Banking Game Hub</h1> <p className="text-sm text-gray-400">บริการสุ่มของเล่นเกม | รับประกันความสนุก</p> </div> <div className="flex items-center gap-3"> <nav className="hidden md:flex gap-2"> <button onClick={() => setRoute("home")} className={px-3 py-1 rounded ${route === "home" ? "bg-blue-600" : "bg-gray-800"}}> สินค้า </button> <button onClick={() => setRoute("history")} className={px-3 py-1 rounded ${route === "history" ? "bg-blue-600" : "bg-gray-800"}}> ประวัติการสั่งซื้อ </button> </nav>

{user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm">สวัสดี, {user.name}</span>
          <button onClick={logout} className="px-3 py-1 rounded bg-red-600 text-white text-sm">
            ออกจากระบบ
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => setShowAuth(true)} className="px-3 py-1 rounded bg-green-600">
            สมัครสมาชิก / เข้าสู่ระบบ
          </button>
        </div>
      )}
    </div>
  </header>

  <main className="max-w-4xl mx-auto mt-8">
    {route === "home" && (
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{product.title} ✅</h2>
            <p className="text-gray-400 mb-4">{product.subtitle}</p>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-300">คะแนนที่ใช้: {product.point} point</div>
              <div className="text-sm text-gray-300">สินค้าที่เหลือ: {product.stock} ชิ้น</div>
            </div>
            <button
              onClick={() => handleOpenOrder(product)}
              className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600">
              สั่งซื้อเลย
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col justify-between">
            <h3 className="text-lg font-semibold">เกี่ยวกับร้าน</h3>
            <p className="text-gray-400 text-sm mt-2">Banking Game Hub — ร้านสำหรับการสุ่มไอเท็มและตัวละครในเกม พร้อมการันตี</p>
            <div className="mt-4">
              <button onClick={() => setRoute("history")} className="px-3 py-2 rounded bg-gray-700">
                ดูประวัติการสั่งซื้อ
              </button>
            </div>
          </div>
        </div>
      </section>
    )}

    {route === "history" && (
      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">ประวัติการสั่งซื้อ</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400">ยังไม่มีการสั่งซื้อ</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="py-2">#</th>
                <th>รายการ</th>
                <th>จำนวน</th>
                <th>วันที่</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} className="border-b border-gray-700">
                  <td className="py-2">{i + 1}</td>
                  <td>{o.product}</td>
                  <td>{o.qty}</td>
                  <td>{o.date}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    )}
  </main>

  {/* Authentication Modal */}
  {showAuth && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-lg max-w-md w-full p-6">
        <AuthForm
          onClose={() => setShowAuth(false)}
          onLogin={(u) => {
            setUser(u);
            setShowAuth(false);
          }}
        />
      </div>
    </div>
  )}

  {/* Order Modal (center-left style in the screenshot) */}
  {showOrderModal && (
    <div className="fixed inset-0 flex items-start md:items-center justify-start md:justify-center p-4">
      <div className="bg-white text-gray-900 rounded-lg shadow-lg max-w-sm w-full p-4 ml-4 md:ml-0">
        <h3 className="font-semibold mb-2">{selectedProduct.title} ✅</h3>
        <label className="text-sm text-gray-600">กรอกจำนวนที่ต้องการสั่งซื้อ*</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="mt-2 w-full p-2 border rounded bg-gray-50"
        />
        <div className="mt-4 flex gap-2">
          <button onClick={confirmOrder} className="flex-1 py-2 rounded bg-blue-600 text-white">
            สั่งซื้อเลย
          </button>
          <button
            onClick={() => setShowOrderModal(false)}
            className="py-2 px-4 rounded bg-gray-300 text-gray-700">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Confirmation Modal (right/center style) */}
  {showConfirm && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end md:justify-center p-6">
      <div className="bg-white text-gray-900 rounded-lg max-w-sm w-full p-6">
        <div className="flex items-center gap-3">
          <div className="text-4xl">❗</div>
          <div>
            <h4 className="font-semibold">ยืนยันการสั่งซื้อ?</h4>
            <p className="text-sm text-gray-600">ยืนยันที่จะซื้อ {selectedProduct.title} หรือไม่</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={finalizeOrder} className="px-4 py-2 rounded bg-blue-600 text-white">
            ซื้อเลย
          </button>
          <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded bg-gray-300">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  )}

  <footer className="max-w-4xl mx-auto mt-10 text-center text-gray-500 text-sm">© Banking Game Hub</footer>
</div>

); }

function AuthForm({ onClose, onLogin }) { const [name, setName] = useState(""); const [email, setEmail] = useState("");

function handleSubmit(e) { e.preventDefault(); const u = { name: name || "ผู้ใช้ใหม่", email }; onLogin(u); }

return ( <form onSubmit={handleSubmit}> <h3 className="text-lg font-semibold mb-2">สมัครสมาชิก / เข้าสู่ระบบ</h3> <label className="text-sm text-gray-600">ชื่อ</label> <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mt-1 mb-3" />

<label className="text-sm text-gray-600">อีเมล</label>
  <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mt-1 mb-3" />

  <div className="flex gap-2 justify-end">
    <button type="button" onClick={onClose} className="px-3 py-2 rounded bg-gray-200">
      ปิด
    </button>
    <button type="submit" className="px-3 py-2 rounded bg-green-600 text-white">
      สมัคร / เข้าสู่ระบบ
    </button>
  </div>
</form>

); }

