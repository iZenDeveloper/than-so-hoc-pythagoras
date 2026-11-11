# Aura Pythagoras - Hệ Thống Thần Số Học Pythagoras Chuyên Nghiệp

Ứng dụng luận giải thần số học Pythagoras toàn diện theo ngôn ngữ thiết kế **Geometric Balance** (Sacred Geometry / Vàng Hoàng Kim & Thạch Anh Đen), tích hợp AI Cố Vấn Số Học Gemini.

---

## 🌟 Tính Năng Nổi Bật

1. **Hồ sơ tự động & Mẫu có sẵn**:
   - Tự động điền và giải mã ngay hồ sơ mẫu chuẩn: **Nguyễn Khanh Hà Vy** (21/02/2013, 07:45, Nữ).
   - Hỗ trợ thêm trường **Giờ sinh** (tuỳ chọn) cho việc luận giải nhịp sinh học và năng lượng ngày sinh.
2. **Chuẩn hoá thuật toán Pythagoras chính thống**:
   - Bộ giải mã nguyên âm/phụ âm tiếng Việt xử lý chuẩn xác chữ **Y**: Chữ Y đóng vai trò là nguyên âm khi đứng độc lập (không liền kề bất kỳ nguyên âm A, E, I, O, U nào), và là phụ âm khi đứng cạnh nguyên âm khác.
   - Bảo toàn đẳng thức toán học cốt lõi: $\text{Linh Hồn} + \text{Nhân Cách} \equiv \text{Sứ Mệnh}$ (sau khi rút gọn).
   - Bảo tồn các con số Master (11, 22, 33).
   - Mọi chỉ số được tính toán 1 lần duy nhất từ frontend, truyền nguyên trạng sang AI để bảo đảm tính thống nhất tuyệt đối, nghiêm cấm AI tự ý thay đổi số liệu.
3. **Hiển thị & Luận giải chuyên sâu**:
   - Trình bày bài phân tích vận mệnh với định dạng Markdown chuyên nghiệp qua `react-markdown`.
   - Thẻ Số Chủ Đạo tách biệt con số chính và huy hiệu Master sang trọng, loại bỏ hiện tượng tràn viền.
4. **Bảo mật tuyệt đối**:
   - `GEMINI_API_KEY` chỉ được đọc từ biến môi trường phía server (`process.env.GEMINI_API_KEY`), không bao giờ bị lộ ra client hoặc bundle frontend.

---

## 🚀 Hướng Dẫn Deploy Lên Vercel (Gói Free Miễn Phí)

Dự án đã được thiết kế sẵn sàng cho nền tảng Vercel thông qua **Vercel Serverless Functions** (`/api/*`) và cấu hình `vercel.json`.

### Bước 1: Chuẩn bị mã nguồn trên GitHub
1. Khởi tạo Git repository và push toàn bộ mã nguồn lên tài khoản GitHub của bạn:
   ```bash
   git init
   git add .
   git commit -m "feat: Aura Pythagoras Numerology App"
   git remote add origin https://github.com/<tai-khoan-cua-ban>/aura-pythagoras.git
   git branch -M main
   git push -u origin main
   ```

### Bước 2: Import dự án vào Vercel
1. Đăng nhập vào [Vercel](https://vercel.com) (miễn phí).
2. Nhấp vào nút **"Add New..."** -> **"Project"**.
3. Chọn repository `aura-pythagoras` từ danh sách GitHub của bạn và bấm **"Import"**.

### Bước 3: Cấu hình biến môi trường trên Vercel
1. Trong màn hình **Configure Project**:
   - **Framework Preset**: Chọn **Vite**.
   - **Root Directory**: `./` (mặc định).
   - **Build Command**: `vite build` (đã được định nghĩa trong `vercel.json`).
   - **Output Directory**: `dist` (đã được định nghĩa trong `vercel.json`).
2. Mở rộng mục **Environment Variables**:
   - Thêm khoá `GEMINI_API_KEY`:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: Dán Gemini API Key của bạn (lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey)).
3. Bấm nút **Deploy**.

Vercel sẽ tự động:
- Biên dịch frontend React + Vite vào thư mục `dist/`.
- Tự động nhận diện và triển khai các Serverless Functions trong thư mục `/api/`:
  - `/api/numerology/ai-reading.ts`: Luận giải hồ sơ vận mệnh chuyên sâu.
  - `/api/numerology/ai-compatibility.ts`: Phân tích tương hợp cặp đôi.
  - `/api/numerology/ai-qa.ts`: Đối thoại cùng AI Cố Vấn Số Học.
  - `/api/health.ts`: Kiểm tra tình trạng serverless functions.

Sau khi hoàn tất (khoảng 30-45 giây), bạn sẽ nhận được một đường link miễn phí dạng `https://aura-pythagoras.vercel.app` hoạt động vĩnh viễn và bảo mật.

---

## 💻 Chạy Tại Môi Trường Cục Bộ (Local Development)

### Cài đặt thư viện:
```bash
npm install
```

### Chạy test kiểm tra thuật toán Pythagoras:
```bash
npm test
```
*Tất cả 12 bài kiểm tra cho các trường hợp tên tiếng Việt, chữ Y, đẳng thức Linh Hồn + Nhân Cách = Sứ Mệnh (bao gồm ca Nguyễn Khanh Hà Vy) đều được kiểm chứng tự động.*

### Khởi chạy môi trường phát triển:
Tạo file `.env` (hoặc copy từ `.env.example`):
```bash
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```

Chạy server phát triển (Express kết hợp Vite middleware):
```bash
npm run dev
```
Mở trình duyệt tại `http://localhost:3000`.
