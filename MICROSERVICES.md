# Microservices Migration Guide

## Kiến trúc hiện tại

```
┌─────────────┐
│ API Gateway │ :80
│   (Nginx)   │
└──────┬──────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│   Backend   │  │Store Service│  │Public Client│
│  (Monolith) │  │(Microservice│  │  (Frontend) │
│    :3000    │  │    :3000    │  │    :5173    │
└──────┬──────┘  └──────┬──────┘  └─────────────┘
       │                │
       └────────┬───────┘
                │
         ┌──────▼──────┐
         │   MySQL DB  │
         │    :3306    │
         └─────────────┘
```

## Routing Rules (Nginx Gateway)

- `http://localhost/api/store/*` → `store-service:3000`
- `http://localhost/api/*` → `backend:3000` (monolith - các API còn lại)
- `http://localhost/*` → `public-client:5173` (frontend)

## Bước 1: Đã hoàn thành ✅

- ✅ Tạo API Gateway (Nginx)
- ✅ Tạo Store microservice (services/store-service)
- ✅ Cấu hình routing cho /api/store
- ✅ Giữ nguyên logic và code từ backend (via volume mount)

## Chạy microservices

### Rebuild và khởi động
```powershell
cd D:\KTTM1\project-yami-fork-main

# Stop và clean previous containers
docker compose -f docker-compose.yml -f docker-compose.micro.yml down --remove-orphans

# Build và start với gateway + store-service
docker compose -f docker-compose.yml -f docker-compose.micro.yml up --build -d
```

### Kiểm tra containers
```powershell
docker compose ps
docker logs project-yami-fork-main-api-gateway-1
docker logs project-yami-fork-main-store-service-1
```

### Test endpoints

**Via Gateway (port 80):**
```powershell
# Test store service health
curl http://localhost/api/store/health

# Test store endpoints (adjust to actual routes)
curl http://localhost/api/store/products

# Test backend (monolith) - other APIs
curl http://localhost/api/customer/profile
```

**Direct access (bypass gateway):**
```powershell
# Store service direct
curl http://localhost:3000/health

# Backend direct
curl http://localhost:3000/api/...
```

## Bước tiếp theo (chưa làm)

### Bước 2: Tách thêm microservices khác
- [ ] Tạo `customer-service` cho `/api/customer`
- [ ] Tạo `admin-service` cho `/api/admin`
- [ ] Cập nhật nginx routing

### Bước 3: Tách database (optional - advanced)
- [ ] Tạo DB riêng cho mỗi service
- [ ] Migration data
- [ ] Implement inter-service communication (REST/gRPC/message queue)

### Bước 4: Production readiness
- [ ] Add service discovery (Consul/Eureka)
- [ ] Add centralized logging (ELK/Loki)
- [ ] Add monitoring (Prometheus/Grafana)
- [ ] Add API rate limiting
- [ ] Add JWT validation at gateway level
- [ ] Add health checks và circuit breakers

## Lưu ý quan trọng

1. **Shared code**: Hiện tại store-service mount backend code qua volume để giữ nguyên logic. Về sau nên:
   - Copy chỉ code cần thiết vào từng service
   - Hoặc tạo shared library package

2. **Database**: Tất cả services đang dùng chung DB. Đây là giai đoạn transition OK, nhưng lâu dài nên tách DB per service.

3. **Images**: Nếu dùng Supabase/S3 cho images, các service đều access được. Nếu lưu local filesystem cần setup shared volume hoặc object storage.

4. **CORS**: Đã cấu hình CORS cho phép localhost:80 (gateway).

5. **Environment variables**: Mỗi service có `.env.example`. Copy và điều chỉnh theo nhu cầu.

## Troubleshooting

**Lỗi "cannot connect to dockerDesktopLinuxEngine":**
- Mở Docker Desktop và đợi "Docker is running"
- Chuyển sang Linux containers (right-click icon)
- Kiểm tra WSL2: `wsl --list -v`

**Service không start:**
```powershell
# Check logs
docker compose logs store-service
docker compose logs api-gateway

# Restart specific service
docker compose restart store-service
```

**DB connection error:**
- Đảm bảo service `db` đã chạy: `docker compose ps db`
- Check health: `docker compose exec db mysqladmin ping -proot`
