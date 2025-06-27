
# IDM Experience - Deployment Guide

## Requisitos do Sistema

- **SO**: Debian 12 (Bookworm)
- **RAM**: Mínimo 2GB, recomendado 4GB
- **Disco**: Mínimo 10GB de espaço livre
- **Porta**: 8084 (aplicação), 3001 (API), 5432 (banco)

## Instalação

### 1. Fazer Download e Extrair

```bash
# Baixar o arquivo idm-experience-onpremises.tar.gz
# Extrair em um diretório temporário
tar -xzf idm-experience-onpremises.tar.gz
cd idm-experience-onpremises
```

### 2. Executar Instalação

```bash
# Como root ou com sudo
sudo ./deploy/install.sh
```

### 3. Iniciar Aplicação

```bash
# Iniciar serviços
sudo systemctl start idm-experience

# Verificar status
sudo systemctl status idm-experience
```

## Acesso à Aplicação

- **URL**: http://seu-servidor:8084
- **Admin**: admin@idm.com / admin123
- **Usuário**: ricardo@idm.com / 123456

## Comandos Úteis

### Gerenciar Serviços
```bash
# Iniciar
sudo systemctl start idm-experience

# Parar
sudo systemctl stop idm-experience

# Reiniciar
sudo systemctl restart idm-experience

# Status
sudo systemctl status idm-experience
```

### Scripts de Gerenciamento
```bash
# Iniciar manualmente
cd /opt/idm-experience
sudo ./deploy/start.sh

# Parar manualmente
sudo ./deploy/stop.sh

# Atualizar aplicação
sudo ./deploy/update.sh

# Fazer backup do banco
sudo ./deploy/backup.sh
```

### Visualizar Logs
```bash
cd /opt/idm-experience

# Logs em tempo real
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs frontend
docker-compose logs backend
docker-compose logs postgres
```

## Configuração

### Variáveis de Ambiente

Edite o arquivo `/opt/idm-experience/.env` para personalizar:

```bash
# Configuração do Banco
DB_HOST=postgres
DB_PORT=5432
DB_USER=idm_user
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=idm_database

# Configuração do Servidor
PORT=3001
NODE_ENV=production

# JWT (Altere esta chave!)
JWT_SECRET=sua-chave-secreta-super-forte

# URL do Frontend
FRONTEND_URL=http://localhost:8084
```

### Alterar Porta da Aplicação

1. Edite `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "NOVA_PORTA:80"  # Altere NOVA_PORTA
```

2. Reinicie a aplicação:
```bash
sudo systemctl restart idm-experience
```

## Backup e Restauração

### Backup Automático
```bash
# Executar backup
sudo /opt/idm-experience/deploy/backup.sh

# Agendar backup diário (crontab)
sudo crontab -e
# Adicionar linha:
0 2 * * * /opt/idm-experience/deploy/backup.sh
```

### Restaurar Backup
```bash
cd /opt/idm-experience

# Parar aplicação
docker-compose down

# Restaurar banco
docker-compose up -d postgres
docker exec -i idm-postgres psql -U idm_user -d idm_database < backups/idm_backup_YYYYMMDD_HHMMSS.sql

# Iniciar aplicação completa
docker-compose up -d
```

## Monitoramento

### Verificar Status dos Containers
```bash
cd /opt/idm-experience
docker-compose ps
```

### Verificar Recursos
```bash
# Uso de CPU e memória
docker stats

# Espaço em disco
df -h
du -sh /opt/idm-experience/
```

## Solução de Problemas

### Aplicação não inicia
1. Verificar logs: `docker-compose logs`
2. Verificar portas em uso: `netstat -tlnp | grep :8084`
3. Verificar espaço em disco: `df -h`

### Banco de dados com problemas
1. Verificar logs do postgres: `docker-compose logs postgres`
2. Conectar ao banco: `docker exec -it idm-postgres psql -U idm_user -d idm_database`

### Performance lenta
1. Verificar recursos: `docker stats`
2. Verificar logs de erro: `docker-compose logs`
3. Considerar aumentar recursos do servidor

## Segurança

### Recomendações
1. **Alterar senhas padrão** dos usuários
2. **Alterar JWT_SECRET** no arquivo .env
3. **Configurar firewall** adequadamente
4. **Fazer backups regulares**
5. **Manter sistema atualizado**

### Firewall (UFW)
```bash
# Permitir apenas portas necessárias
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 8084/tcp  # Aplicação
sudo ufw enable
```

## Suporte

Para problemas técnicos:
1. Verificar logs da aplicação
2. Consultar esta documentação
3. Verificar configurações de rede e firewall
