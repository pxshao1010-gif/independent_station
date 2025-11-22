import React, { useState } from 'react'
import { login } from '../api'
import Register from './Register'

export default function Login({ onLogin, locale }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  async function submit() {
    try {
      const res = await login({ email, password })
      localStorage.setItem('token', res.token)
      onLogin(res.user)
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="auth">
      {!showRegister && (
        <>
          <h2>{locale === 'ar' ? 'تسجيل الدخول' : 'Login'}</h2>
          {err && <div className="error">{err}</div>}
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder={locale === 'ar' ? 'كلمة المرور' : 'Password'} type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={submit}>{locale === 'ar' ? 'دخول' : 'Login'}</button>
          <div style={{ marginTop: 8 }}>
            {locale === 'ar' ? 'لا تملك حسابًا؟' : 'Do not have account?'} <a style={{ cursor: 'pointer' }} onClick={() => setShowRegister(true)}>{locale === 'ar' ? 'سجل هنا' : 'Register here'}</a>
          </div>
        </>
      )}

      {showRegister && (
        <>
          <Register onRegister={(user) => { setShowRegister(false); onLogin(user) }} locale={locale} />
          <div style={{ marginTop: 8 }}>
            <a style={{ cursor: 'pointer' }} onClick={() => setShowRegister(false)}>{locale === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}</a>
          </div>
        </>
      )}
    </div>
  )
}
