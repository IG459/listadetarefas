import React, { useState } from 'react';
import { CheckSquare, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const LoginView: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Por favor, preencha o campo de e-mail.');
      return;
    }

    if (mode !== 'forgot' && !password.trim()) {
      setError('Por favor, preencha o campo de senha.');
      return;
    }

    if (mode !== 'forgot' && password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        // Cadastro
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          const isConfirmRequired = data.session === null;
          if (isConfirmRequired) {
            setMessage('Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar o e-mail antes de fazer login.');
          } else {
            setMessage('Conta criada com sucesso! Conectando...');
          }
          setPassword('');
        }
      } else if (mode === 'login') {
        // Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (signInError) throw signInError;
      } else if (mode === 'forgot') {
        // Redefinição de senha
        const redirectUrl = window.location.origin;
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: redirectUrl,
        });

        if (resetError) throw resetError;
        setMessage('E-mail de redefinição enviado com sucesso! Verifique sua caixa de entrada para redefinir sua senha.');
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      let friendlyMessage = err.message || 'Ocorreu um erro ao processar a autenticação.';
      
      if (friendlyMessage.includes('Invalid login credentials')) {
        friendlyMessage = 'E-mail ou senha incorretos. Verifique suas credenciais.';
      } else if (friendlyMessage.includes('User already registered')) {
        friendlyMessage = 'Este e-mail já está cadastrado no sistema.';
      } else if (friendlyMessage.includes('Email not confirmed')) {
        friendlyMessage = 'Por favor, confirme seu e-mail na mensagem enviada pelo Supabase antes de fazer o login.';
      } else if (friendlyMessage.includes('rate limit')) {
        friendlyMessage = 'Muitas solicitações seguidas. Aguarde alguns instantes e tente novamente.';
      }
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      
      {/* Coluna da Esquerda: Painel Visual Premium (Oculto em telas pequenas) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800/10">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-teal-500/5 blur-3xl pointer-events-none"></div>
        
        {/* Header no Banner */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner">
            <CheckSquare className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white bg-clip-text bg-gradient-to-r from-white to-emerald-300">TaskFlow</span>
        </div>

        {/* Ilustração e Frases de Destaque */}
        <div className="my-auto max-w-lg z-10">
          {/* Card Flutuante de Tarefas Simulado */}
          <div className="mb-8 p-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/50 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-3">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-slate-500 font-mono ml-auto">tarefas_iniciais.sh</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-900">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs">
                  ✓
                </div>
                <div className="h-2 w-32 bg-slate-700 rounded-full"></div>
                <div className="h-4 w-12 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-full flex items-center justify-center ml-auto border border-emerald-500/20 font-medium">Alta</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-900 opacity-60">
                <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs"></div>
                <div className="h-2 w-48 bg-slate-700 rounded-full"></div>
                <div className="h-4 w-12 bg-amber-500/10 text-amber-400 text-[10px] rounded-full flex items-center justify-center ml-auto border border-amber-500/20 font-medium">Média</div>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Gerencie suas tarefas de forma inteligente e integrada.
          </h2>
          <p className="text-emerald-100/90 text-base leading-relaxed">
            Sua lista de tarefas sincronizada em tempo real com o banco de dados do Supabase. Acesse de onde estiver, no navegador ou aplicativo nativo.
          </p>
        </div>

        {/* Rodapé no Banner */}
        <div className="text-xs text-slate-500 z-10">
          Versão Desktop v1.0.0 — Todos os direitos reservados.
        </div>
      </div>

      {/* Coluna da Direita: Formulário de Login/Cadastro/Recuperação (Ocupa 100% no mobile e 50% em telas grandes) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="max-w-md w-full bg-slate-900/45 backdrop-blur-md rounded-2xl border border-slate-850 p-8 shadow-2xl transition-all duration-300 hover:border-slate-800/80 animate-fadeIn">
          
          {/* Header/Logo Mobile */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20 transition-all hover:scale-105 duration-200">
              <CheckSquare className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">TaskFlow</h1>
            <p className="text-slate-200 text-sm mt-1">
              {mode === 'signup' ? 'Crie sua conta para começar' : mode === 'forgot' ? 'Recuperação de acesso à conta' : 'Sua lista de tarefas moderna e organizada'}
            </p>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {mode === 'signup' ? 'Criar Conta' : mode === 'forgot' ? 'Recuperar Senha' : 'Fazer Login'}
            </h1>
            <p className="text-slate-200 text-sm mt-1.5">
              {mode === 'signup' ? 'Preencha os dados abaixo para se cadastrar' : mode === 'forgot' ? 'Insira seu e-mail para receber um link de redefinição' : 'Insira seus dados para acessar o aplicativo'}
            </p>
          </div>

          {/* Mensagens de Sucesso ou Erro */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-rose-950/30 border border-rose-900/50 text-rose-200 p-4 rounded-xl text-xs font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 flex items-start gap-3 bg-emerald-950/30 border border-emerald-900/50 text-emerald-200 p-4 rounded-xl text-xs font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Endereço de E-mail
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="exemplo@email.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-900 disabled:text-slate-600 transition-colors text-sm"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-white">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      tabIndex={-1}
                      disabled={isLoading}
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setMessage('');
                      }}
                      className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold hover:underline focus:outline-none disabled:opacity-50"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Mínimo 6 caracteres"
                    className="block w-full pl-10 pr-10 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-900 disabled:text-slate-600 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={isLoading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none disabled:opacity-75 disabled:shadow-none duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 text-sm cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : mode === 'signup' ? (
                'Criar Minha Conta'
              ) : mode === 'forgot' ? (
                'Enviar E-mail de Recuperação'
              ) : (
                'Entrar no Aplicativo'
              )}
            </button>
          </form>

          {/* Toggle Options */}
          <div className="mt-6 text-center">
            {mode === 'forgot' ? (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode('login');
                  setError('');
                  setMessage('');
                }}
                className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold hover:underline focus:outline-none disabled:opacity-50 flex items-center justify-center gap-1.5 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para o Login
              </button>
            ) : (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                  setMessage('');
                  setPassword('');
                }}
                className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold hover:underline focus:outline-none disabled:opacity-50"
              >
                {mode === 'login' ? 'Não tem uma conta? Cadastre-se gratuitamente' : 'Já possui uma conta? Faça login'}
              </button>
            )}
          </div>

          <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-800 pt-6">
            Conexão criptografada e protegida com Supabase.
          </div>
        </div>
      </div>
    </div>
  );
};
