import React, { useState } from 'react'
import { register } from '../api'

export default function Register({ onRegister, locale }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState(null)

  async function submit() {
    try {
      if (!email || !password) return setErr(locale === 'ar' ? 'يرجى إدخال البريد وكلمة المرور' : 'Please enter email and password')
      if (password !== confirm) return setErr(locale === 'ar' ? 'كلمة المرور غير متطابقة' : 'Passwords do not match')
      const res = await register({ email, password, name })
      localStorage.setItem('token', res.token)
      onRegister(res.user)
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="auth">
      <h2>{locale === 'ar' ? 'تسجيل' : 'Register'}</h2>
      {err && <div className="error">{err}</div>}
      <input placeholder={locale === 'ar' ? 'الاسم' : 'Name'} value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder={locale === 'ar' ? 'كلمة المرور' : 'Password'} type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <input placeholder={locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      <button onClick={submit}>{locale === 'ar' ? 'تسجيل' : 'Register'}</button>
    </div>
  )
}
