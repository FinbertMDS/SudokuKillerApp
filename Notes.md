- đa ngôn ngữ
- numpad: nếu đã điền toàn bộ số vào các ô thì xóa khỏi numpad.
  VD: số 1 khi được điền 9 lần thì số 1 sẽ ko hiển thị ở numpad nữa
-----
- Tối ưu lại hiển thị của Grid.tsx renderCell để hàm này không bị gọi lại nhiều lần
- Statisic chỉ hiển thị của 7 ngày gần nhất
-----
- xoá ghi chú khi điền số vào 1 ô: xoá trong ô đó, xoá các ghi chú bằng số đó cùng hàng và cột
- cho hiển thị số của notes bé lại 1 chút
- Hiển thị của notes và tổng cage bị trùng vào nhau khó nhìn
- Expert vẫn dễ, ban đầu ko hiển thị số nào gợi ý
- Nếu ở mode ghi chú thì cho hiển thị tất cả các numpad.
-----
- Thêm tính năng gợi ý: điền luôn đáp án ở ô đó vào
- Cập nhật lại các màu trong theme dark/light cho đẹp hơn
- Kiểm tra lại tất cả màn hình xem có màn hình nào bị render nhiều lần không!!!
- Chuyển từ lưu trong AsyncStorage sang lưu ở MMKV
- thêm hiển thị thông tin app trong màn options
- tạo link bymecofffe để nhận donate
-----
- Vào main Main thì gửi event tạo sẵn board, để khi click vào New game thì lấy board ra để đi tiếp
- Build app và tối ưu size của app
- Publish app
- Xem có thể public app trên unsplash để tăng request lên không

| Nền tảng | Tối thiểu | Khuyến nghị |
| -------- | --------- | ----------- |
| iOS      | 12.0      | 13.0+       |
| Android  | API 24    | API 26+     |

-----
Release bug
*Android*
- trang licenses không hiển thị được do lỗi: ERR_CLEARTEXT_NOT_PERMITTED
- trang setting bị chèn ở bottom, không hiển thị hết clear storage
- timefilter không bo tròn ở last item
- thống kê: phân bổ ván theo mức độ: stackedbar nếu ko có data thì cũng hiển thị no data
- thống kê: khi scroll xuống dưới thì 2 chip bên trên vẫn phải có padding

------

app ID
ca-app-pub-4776985253905766~3093131803

ad unit ID: killer-sudoku-ios-main
ca-app-pub-4776985253905766/8720863006

ad unit ID: killer-sudoku-ios-interstitial
ca-app-pub-4776985253905766/9006985221

ad unit ID: killer-sudoku-ios-reward
ca-app-pub-4776985253905766/1244394325

----
android
app ID
ca-app-pub-4776985253905766~6216922933

ad unit ID: killer-sudoku-android-main
ca-app-pub-4776985253905766/8853876327

ad unit ID: killer-sudoku-android-interstitial
ca-app-pub-4776985253905766/1559800119

ad unit ID: killer-sudoku-android-reward
ca-app-pub-4776985253905766/6812126796

--------------

Lệnh bundle JavaScript code và copy assets với ios

npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios


---------------
tăng verion trong app.json

chạy lệnh dưới thì tự đổi trong android và ios
> npx react-native-version --never-amend
> npx react-native-version --never-amend --version 1.0.1

với fastlane thì tự động tăng version code bằng 
> android_set_version_code


----------------
sau khi đổi biến .env cần reset cache
npx react-native start --reset-cache
