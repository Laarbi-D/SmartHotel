"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const translations = {
    fr: {
        title: 'Accès Réseau Wi-Fi', connected: 'Connecté !', welcome: 'Bienvenue', access_level: 'Accès :', browse: 'Accéder au service de l\'Hôtel & Internet', tab_client: 'Clients', tab_staff: 'Personnel', room_num: 'Numéro de chambre', room_ph: 'Ex: 301', lastname: 'Identité (Prénom et/ou Nom)', lastname_ph: 'Ex: John Doe', btn_client: 'Connexion Client', 
        staff_email: 'Adresse E-mail', staff_email_ph: 'Ex: paul@test.com', 
        staff_pwd: 'Mot de passe', staff_pwd_ph: '••••••••', 
        btn_staff: 'Connexion Personnel', err_empty: 'Veuillez remplir tous les champs.', err_client: 'Nom ou numéro de chambre incorrect.', err_staff: 'E-mail ou mot de passe incorrect.', err_server: 'Erreur de connexion au serveur.',
        err_email_format: "Veuillez inclure un '@' dans l'adresse e-mail."
    },
    en: {
        title: 'Wi-Fi Network Access', connected: 'Connected!', welcome: 'Welcome', access_level: 'Access Level:', browse: 'Access Hotel Services & Internet', tab_client: 'Guests', tab_staff: 'Staff', room_num: 'Room Number', room_ph: 'e.g., 301', lastname: 'Identity (First and/or Last Name)', lastname_ph: 'e.g., John Doe', btn_client: 'Guest Login', 
        staff_email: 'Email Address', staff_email_ph: 'e.g., paul@test.com', 
        staff_pwd: 'Password', staff_pwd_ph: '••••••••', 
        btn_staff: 'Staff Login', err_empty: 'Please fill in all fields.', err_client: 'Incorrect name or room number.', err_staff: 'Incorrect email or password.', err_server: 'Server connection error.',
        err_email_format: "Please include an '@' in the email address."
    },
    es: {
        title: 'Acceso a la Red Wi-Fi', connected: '¡Conectado!', welcome: 'Bienvenido', access_level: 'Acceso:', browse: 'Acceder a los Servicios del Hotel e Internet', tab_client: 'Huéspedes', tab_staff: 'Personal', room_num: 'Número de habitación', room_ph: 'Ej: 301', lastname: 'Identidad (Nombre y/o Apellido)', lastname_ph: 'Ej: John Doe', btn_client: 'Acceso Huésped', 
        staff_email: 'Correo electrónico', staff_email_ph: 'Ej: paul@test.com', 
        staff_pwd: 'Contraseña', staff_pwd_ph: '••••••••', 
        btn_staff: 'Acceso Personal', err_empty: 'Por favor, complete todos los campos.', err_client: 'Nombre o número de habitación incorrectos.', err_staff: 'Correo electrónico o contraseña incorrectos.', err_server: 'Error de conexión con el servidor.',
        err_email_format: "Incluye un signo '@' en la dirección de correo electrónico."
    }
};

function PortalContent() {
    const [lang, setLang] = useState<'fr'|'en'|'es'>('fr');
    const [role, setRole] = useState<'client'|'employe'>('client');
    const [status, setStatus] = useState<'form'|'success'>('form');
    const [user, setUser] = useState('');
    const [error, setError] = useState('');
    
    const searchParams = useSearchParams();
    const userUrl = searchParams.get('userurl') || searchParams.get('redir') || searchParams.get('redirect') || '/';
    
    const t = translations[lang];

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (role === 'client' && (!data.chambre || !data.nom_client)) {
            return setError(t.err_empty);
        }
        
        if (role === 'employe') {
            if (!data.mail_employe || !data.mdp_employe) {
                return setError(t.err_empty);
            }
            // NOTRE PROPRE VÉRIFICATION DU @
            if (!(data.mail_employe as string).includes('@')) {
                return setError(t.err_email_format);
            }
        }

        const endpoint = role === 'client' ? '/api/login' : '/api/login-staff';
        const body = role === 'client' 
            ? { nom: data.nom_client, chambre: data.chambre } 
            : { mail_employe: data.mail_employe, mdp_employe: data.mdp_employe };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const json = await res.json();

            if (res.ok && json.status === 'success') {
                setUser(role === 'client' 
                    ? `${json.user.PRENOM_CLIENT} ${json.user.NOM_CLIENT}` 
                    : `${json.user.PRENOM_EMPLOYE} ${json.user.NOM_EMPLOYE}`);
                setStatus('success');
            } else {
                setError(role === 'client' ? t.err_client : t.err_staff);
            }
        } catch (err) {
            setError(t.err_server);
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

            <div className="absolute top-6 right-6 z-50 flex gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
                {(['fr', 'en', 'es'] as const).map(l => (
                    <button key={l} onClick={() => { setLang(l); setError(''); }} className={`text-xl transition-transform hover:scale-125 ${lang === l ? 'scale-125 opacity-100' : 'opacity-50'}`}>
                        {l === 'fr' ? '🇫🇷' : l === 'en' ? '🇬🇧' : '🇪🇸'}
                    </button>
                ))}
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative z-10">
                <div className="text-center mb-6">
                    <img src="/images/logobarcelo.png" alt="Barcelo Logo" className="mx-auto h-20 object-contain mb-4" />
                    <h1 className="text-2xl font-serif text-slate-800">{t.title}</h1>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-6 animate-fade-in">
                        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.connected}</h2>
                        <p className="text-slate-600 mb-2">{t.welcome} <b>{user}</b>.</p>
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full mb-6">
                            {t.access_level} {role === 'client' ? 'Client' : 'Employé'}
                        </span>
                        <a href={userUrl} className="block w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors">
                            {t.browse}
                        </a>
                    </div>
                ) : (
                    <>
                        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                            <button onClick={() => { setRole('client'); setError(''); }} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'client' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>{t.tab_client}</button>
                            <button onClick={() => { setRole('employe'); setError(''); }} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'employe' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>{t.tab_staff}</button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-fade-in">
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        {/* On ajoute noValidate pour tuer les messages d'erreur moches du navigateur */}
                        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in" noValidate>
                            {role === 'client' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.room_num}</label>
                                        <input type="text" name="chambre" required placeholder={t.room_ph} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.lastname}</label>
                                        <input type="text" name="nom_client" required placeholder={t.lastname_ph} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all" />
                                    </div>
                                    <button type="submit" className="w-full py-3 mt-4 bg-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-teal-500/30 hover:bg-teal-600 transition-all">{t.btn_client}</button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.staff_email}</label>
                                        {/* Transformé en type="text" pour intercepter nous-mêmes le @ */}
                                        <input type="text" name="mail_employe" required placeholder={t.staff_email_ph} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.staff_pwd}</label>
                                        <input type="password" name="mdp_employe" required placeholder={t.staff_pwd_ph} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
                                    </div>
                                    <button type="submit" className="w-full py-3 mt-4 bg-slate-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-slate-500/30 hover:bg-slate-900 transition-all">{t.btn_staff}</button>
                                </>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default function WifiPortal() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading / Cargando...</div>}>
            <PortalContent />
        </Suspense>
    );
}