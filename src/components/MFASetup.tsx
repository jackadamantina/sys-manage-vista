
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMFA } from '@/hooks/useMFA';

interface MFASetupProps {
  userId: string;
}

const MFASetup = ({ userId }: MFASetupProps) => {
  const {
    mfaSettings,
    loading,
    enableMFA,
    disableMFA,
    generateMFACode,
    verifyMFACode,
    verificationCode,
    setVerificationCode
  } = useMFA(userId);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleEnableMFA = async () => {
    const success = await enableMFA('sms', phoneNumber);
    if (success) {
      setStep('verify');
      // Gerar código automaticamente
      const code = await generateMFACode();
      setGeneratedCode(code);
    }
  };

  const handleVerifyCode = async () => {
    const success = await verifyMFACode(verificationCode);
    if (success) {
      setStep('setup');
      setVerificationCode('');
      setGeneratedCode(null);
    }
  };

  const handleDisableMFA = async () => {
    await disableMFA();
    setStep('setup');
    setPhoneNumber('');
    setVerificationCode('');
    setGeneratedCode(null);
  };

  const handleSendCode = async () => {
    const code = await generateMFACode();
    setGeneratedCode(code);
  };

  if (loading) {
    return <div className="animate-pulse">Carregando configurações de 2FA...</div>;
  }

  const isEnabled = mfaSettings?.mfa_enabled && mfaSettings?.is_verified;
  const isSetupButNotVerified = mfaSettings?.mfa_enabled && !mfaSettings?.is_verified;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Autenticação em Dois Fatores (2FA)</CardTitle>
        <CardDescription>
          {isEnabled 
            ? 'O 2FA está ativo em sua conta'
            : 'Configure o 2FA para adicionar uma camada extra de segurança'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEnabled && step === 'setup' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Número de Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+55 11 99999-9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleEnableMFA}
              disabled={!phoneNumber}
              className="w-full"
            >
              Ativar 2FA
            </Button>
          </div>
        )}

        {(step === 'verify' || isSetupButNotVerified) && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-700">
                Um código foi enviado para seu telefone. Digite o código abaixo para verificar.
              </p>
              {generatedCode && (
                <p className="text-sm font-mono text-blue-800 mt-2">
                  Código de teste: <strong>{generatedCode}</strong>
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="code">Código de Verificação</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6}
                className="flex-1"
              >
                Verificar Código
              </Button>
              <Button 
                variant="outline"
                onClick={handleSendCode}
              >
                Reenviar Código
              </Button>
            </div>
          </div>
        )}

        {isEnabled && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded">
              <i className="ri-shield-check-line text-green-500"></i>
              <div>
                <p className="text-sm font-medium text-green-800">2FA Ativo</p>
                <p className="text-xs text-green-600">
                  Telefone: {mfaSettings?.phone_number}
                </p>
              </div>
            </div>
            <Button 
              variant="destructive"
              onClick={handleDisableMFA}
              className="w-full"
            >
              Desativar 2FA
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MFASetup;
