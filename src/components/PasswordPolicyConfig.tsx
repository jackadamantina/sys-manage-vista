
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';

const PasswordPolicyConfig = () => {
  const { settings, loading, updateSettings } = useOrganizationSettings();
  const [policy, setPolicy] = useState({
    min_length: 8,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_special_chars: true,
    expiry_days: 90
  });

  useEffect(() => {
    if (settings?.password_policy) {
      setPolicy(settings.password_policy);
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings({
      password_policy: policy
    });
  };

  if (loading) {
    return <div className="animate-pulse">Carregando configurações...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Política de Senhas</CardTitle>
        <CardDescription>
          Configure os requisitos de segurança para senhas dos usuários
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="min_length">Comprimento Mínimo</Label>
          <Input
            id="min_length"
            type="number"
            min="6"
            max="50"
            value={policy.min_length}
            onChange={(e) => setPolicy({
              ...policy,
              min_length: parseInt(e.target.value)
            })}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Exigir Letras Maiúsculas</Label>
              <p className="text-sm text-gray-600">Pelo menos uma letra maiúscula (A-Z)</p>
            </div>
            <Switch
              checked={policy.require_uppercase}
              onCheckedChange={(checked) => setPolicy({
                ...policy,
                require_uppercase: checked
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Exigir Letras Minúsculas</Label>
              <p className="text-sm text-gray-600">Pelo menos uma letra minúscula (a-z)</p>
            </div>
            <Switch
              checked={policy.require_lowercase}
              onCheckedChange={(checked) => setPolicy({
                ...policy,
                require_lowercase: checked
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Exigir Números</Label>
              <p className="text-sm text-gray-600">Pelo menos um número (0-9)</p>
            </div>
            <Switch
              checked={policy.require_numbers}
              onCheckedChange={(checked) => setPolicy({
                ...policy,
                require_numbers: checked
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Exigir Caracteres Especiais</Label>
              <p className="text-sm text-gray-600">Pelo menos um caractere especial (!@#$%...)</p>
            </div>
            <Switch
              checked={policy.require_special_chars}
              onCheckedChange={(checked) => setPolicy({
                ...policy,
                require_special_chars: checked
              })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="expiry_days">Expiração da Senha (dias)</Label>
          <Input
            id="expiry_days"
            type="number"
            min="30"
            max="365"
            value={policy.expiry_days}
            onChange={(e) => setPolicy({
              ...policy,
              expiry_days: parseInt(e.target.value)
            })}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Salvar Política de Senhas
        </Button>
      </CardContent>
    </Card>
  );
};

export default PasswordPolicyConfig;
