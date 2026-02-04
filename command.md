========= Cách tạo 1 nhánh để dev và gửi merge request ========= 

<!-- 0. Kiểm tra nhánh hiện tại -->
git branch

<!-- 1.0. Nếu chưa có nhánh -->
git checkout -b <tên nhánh>
<!-- 1.1 Nếu đã có nhánh của mình -->
git checkout <tên nhánh>
git pull origin main <!-- apply code mới nhất từ main --> => git push <!-- nếu trong UI ấn sync changes gặp lỗi fatal error...-->


<!-- 2. thêm code vào nhánh -->
git add .                                                   //   Hoặc sử dụng Source Control trong VSCode
git commit -m "Nội dung thay đổi"                           //
git push origin <tên nhánh> <!-- Push nhánh lên remote -->  //


<!-- 3. Tạo merge request -->
Ctrl+Shift+P => Gitlab: Create new merge request ...



========= Xử lý trường hợp có thay đổi trong main mà muốn update vào nhánh của mình trong khi chưa commit ========= 

git stash
git pull origin main
git stash pop
<!-- sẽ có nội dung thay đổi từ main, chỉ update phần mình, các phần code khác thì phải giữ nguyên -->


========= Docker =========
docker compose up -d --pull always --build
docker compose down