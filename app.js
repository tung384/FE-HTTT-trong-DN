/* ==========================================
   1. CÁC HÀM TIỆN ÍCH CƠ BẢN & DỮ LIỆU MẪU
   ========================================== */
// Rút gọn hàm querySelector
const $ = s => document.querySelector(s);

// Hàm chống lỗi XSS (bảo mật ký tự đặc biệt)
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

// Lấy ngày hiện tại định dạng kiểu Việt Nam
const today = () => new Date().toLocaleDateString('vi-VN');

// Danh sách nhu cầu, sản phẩm và loại phản hồi mẫu
const NEEDS = ['Gaming', 'Đồ họa', 'Văn phòng', 'Chưa xác định'];
const PRODS = ['Dell Inspiron 15 3530', 'HP 15-fd0231TU', 'Lenovo IdeaPad Slim 3 15IAH8', 'ASUS Vivobook 15 X1504', 'ASUS TUF Gaming F15 FX507', 'Lenovo LOQ 15IAX9', 'MSI Thin 15 B13VE', 'Acer Nitro V 15 ANV15', 'PC Gaming Backline G1', 'PC Gaming Backline G2', 'PC Gaming Backline G3', 'PC Đồ họa Backline D1', 'PC Văn phòng Backline O1', 'PC Văn phòng Backline O2'];
const FTYPE = ['Góp ý', 'Khen ngợi', 'Báo lỗi / Khiếu nại', 'Câu hỏi'];

// Dữ liệu tài khoản mẫu, phản hồi và trạng thái khảo sát đã làm
const U = [{email: 'khach@demo.vn', pass: '123456', name: 'Nguyễn Minh Anh', phone: '0901234567', addr: '12 Lê Lợi, Quận 1, TP.HCM', year: 1998, gender: 'Nữ', need: 'Gaming'}];
const FB = {'khach@demo.vn': [{prod: 'PC Gaming Backline G1', type: 'Khen ngợi', rate: 5, title: 'Máy chạy rất mượt', body: 'Mình chơi game 1080p ổn định, máy chạy êm và nhân viên lắp ráp gọn gàng.', date: '18/09/2026', reply: 'Cảm ơn bạn đã tin tưởng Backline. Chúc bạn chơi game vui vẻ!'}]};
const DONE = {'khach@demo.vn': {s3: '20/09/2026'}};

// Danh sách các bảng khảo sát
const SV = [
{id: 's1', title: 'Mức độ hài lòng về dịch vụ', desc: 'Giúp chúng tôi cải thiện chất lượng tư vấn và chăm sóc khách hàng.', due: '31/10/2026', min: 2, qs: [
{t: 'rate', q: 'Bạn đánh giá chung về dịch vụ của cửa hàng như thế nào?', req: 1},
{t: 'one', q: 'Bạn biết đến cửa hàng qua kênh nào?', o: ['Bạn bè giới thiệu', 'Facebook / TikTok', 'Tìm kiếm Google', 'Đi ngang qua cửa hàng', 'Khác'], req: 1},
{t: 'one', q: 'Nhân viên tư vấn có nhiệt tình và hiểu sản phẩm không?', o: ['Rất tốt', 'Tốt', 'Bình thường', 'Chưa tốt'], req: 1},
{t: 'text', q: 'Bạn có góp ý gì thêm cho chúng tôi?'}]},
{id: 's2', title: 'Nhu cầu mua sắm PC và laptop', desc: 'Cho chúng tôi biết dự định của bạn để gợi ý sản phẩm và ưu đãi phù hợp.', due: '25/10/2026', min: 2, qs: [
{t: 'one', q: 'Bạn dự định mua gì trong 6 tháng tới?', o: ['Laptop', 'PC lắp sẵn', 'Linh kiện nâng cấp', 'Chưa có dự định'], req: 1},
{t: 'multi', q: 'Mục đích sử dụng chính (chọn nhiều đáp án)', o: ['Gaming', 'Đồ họa / Thiết kế', 'Văn phòng / Học tập', 'Lập trình'], req: 1},
{t: 'one', q: 'Ngân sách dự kiến của bạn?', o: ['Dưới 10 triệu', '10 - 20 triệu', '20 - 35 triệu', 'Trên 35 triệu'], req: 1},
{t: 'text', q: 'Bạn quan tâm đến dòng máy hoặc cấu hình cụ thể nào?'}]},
{id: 's3', title: 'Trải nghiệm bảo hành và hỗ trợ', desc: 'Đánh giá về quá trình bảo hành, sửa chữa tại cửa hàng.', due: '30/09/2026', min: 1, qs: [
{t: 'rate', q: 'Bạn hài lòng thế nào về thời gian xử lý bảo hành?', req: 1},
{t: 'text', q: 'Ý kiến khác'}]}];

// Biến trạng thái ứng dụng hiện tại
let me = null, tab = 'survey', open = null, authTab = 'login';


/* ==========================================
   2. CÁC HÀM XỬ LÝ GIAO DIỆN (UI RENDERING)
   ========================================== */
// Hiển thị thông báo nhanh (Toast)
function toast(t) {
    const e = $('#toast'); e.textContent = t; e.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('show'), 2800);
}

// Tạo giao diện chọn số sao đánh giá
const stars = (id, v) => `<div class="stars" id="${id}" data-val="${v || 0}" role="group" aria-label="Đánh giá sao">${[1, 2, 3, 4, 5].map(i => `<button type="button" class="st${i <= v ? ' on' : ''}" data-act="star" data-v="${i}" aria-label="${i} sao">★</button>`).join('')}</div>`;

// Hiển thị số sao tĩnh (Readonly)
const ro = n => `<span class="ro" aria-label="${n} sao">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`;

// Lọc các khảo sát chưa hoàn thành
const pending = () => SV.filter(s => !(DONE[me.email] || {})[s.id]);

// Hàm render chính để vẽ lại giao diện dựa trên trạng thái đăng nhập
function render() {
    $('#who').innerHTML = me ? `<span>${esc(me.name)}</span><button class="btn sm" data-act="out">Đăng xuất</button>` : '';
    $('#app').innerHTML = me ? main() : auth();
}

// Giao diện Đăng nhập / Đăng ký
function auth() {
    const L = authTab === 'login';
    return `<div class="card auth"><div class="tabs"><button class="${L ? 'on' : ''}" data-act="atab" data-v="login">Đăng nhập</button><button class="${L ? '' : 'on'}" data-act="atab" data-v="reg">Đăng ký</button></div>` + (L ?
    `<form id="login" novalidate><label>Email<input name="email" type="email" autocomplete="username" placeholder="ten@email.com"></label><label>Mật khẩu<input name="pass" type="password" autocomplete="current-password"></label><div class="err" id="err" role="alert"></div><button class="btn pri full">Đăng nhập</button><p class="mu" style="margin:12px 0 0">Dùng thử: khach@demo.vn / 123456</p></form>` :
    `<form id="reg" novalidate><label>Họ và tên<input name="name" autocomplete="name"></label><div class="grid"><label>Email<input name="email" type="email" autocomplete="email"></label><label>Số điện thoại<input name="phone" type="tel" autocomplete="tel" placeholder="0901234567"></label></div><div class="grid"><label>Mật khẩu<input name="pass" type="password" autocomplete="new-password" placeholder="Ít nhất 6 ký tự"></label><label>Nhập lại mật khẩu<input name="pass2" type="password" autocomplete="new-password"></label></div><div class="err" id="err" role="alert"></div><button class="btn pri full">Tạo tài khoản</button></form>`) + '</div>';
}

// Giao diện trang chủ sau khi đăng nhập (gồm các tab Khảo sát, Phản hồi, Thông tin cá nhân)
function main() {
    const n = pending().length;
    const T = [['survey', 'Khảo sát' + (n ? `<span class="n">${n}</span>` : '')], ['fb', 'Phản hồi sản phẩm'], ['prof', 'Thông tin cá nhân']];
    return `<div class="tabs">${T.map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-act="tab" data-v="${k}">${l}</button>`).join('')}</div>` + (tab === 'survey' ? (open ? svForm(SV.find(s => s.id === open)) : svList()) : tab === 'fb' ? fbView() : profView());
}

// Danh sách các phiếu khảo sát
function svList() {
    const n = pending().length;
    let h = `<h1>Khảo sát dành cho bạn</h1><p class="mu">${n ? `Bạn có ${n} khảo sát đang chờ. Mỗi khảo sát chỉ mất vài phút.` : 'Bạn đã hoàn thành tất cả khảo sát. Cảm ơn bạn!'}</p>`;
    return h + SV.map(s => { const d = (DONE[me.email] || {})[s.id]; return `<div class="card"><div class="row"><div><h2>${esc(s.title)}</h2><div class="mu">${esc(s.desc)}</div></div>${d ? '<span class="b ok">Đã hoàn thành</span>' : '<span class="b wn">Chưa thực hiện</span>'}</div><div class="row" style="margin-top:12px;align-items:center"><span class="mu">${s.qs.length} câu · khoảng ${s.min} phút · ${d ? 'Hoàn thành ngày ' + d : 'Hạn ' + s.due}</span>${d ? '' : `<button class="btn pri" data-act="start" data-v="${s.id}">Thực hiện khảo sát</button>`}</div></div>` }).join('');
}

// Form chi tiết làm một bảng khảo sát
function svForm(s) {
    return `<button class="btn sm" data-act="back" style="margin-bottom:12px">← Danh sách khảo sát</button><form id="sv" class="card" novalidate><h1>${esc(s.title)}</h1><p class="mu">${esc(s.desc)} Các câu có dấu * là bắt buộc.</p>` + s.qs.map((q, i) => {
        let c = '';
        if (q.t === 'rate') c = stars('q' + i, 0);
        else if (q.t === 'text') c = `<textarea name="q${i}" placeholder="Nhập ý kiến của bạn"></textarea>`;
        else c = q.o.map(o => `<label class="opt" style="margin:0;color:var(--tx);font-size:15px"><input type="${q.t === 'one' ? 'radio' : 'checkbox'}" name="q${i}" value="${esc(o)}"> ${esc(o)}</label>`).join('');
        return `<div class="q"><b>${i + 1}. ${esc(q.q)}${q.req ? ' *' : ''}</b>${c}</div>`;
    }).join('') + `<div class="err" id="err" role="alert"></div><button class="btn pri">Gửi khảo sát</button></form>`;
}

// Giao diện Phản hồi sản phẩm
function fbView() {
    const L = FB[me.email] || [];
    return `<form id="fb" class="card" novalidate><h1>Gửi phản hồi về sản phẩm</h1><p class="mu">Ý kiến của bạn giúp cửa hàng cải thiện sản phẩm và dịch vụ.</p><div class="grid"><label>Sản phẩm<select name="prod"><option value="">Chọn sản phẩm</option>${PRODS.map(p => `<option>${esc(p)}</option>`).join('')}</select></label><label>Loại phản hồi<select name="type">${FTYPE.map(p => `<option>${p}</option>`).join('')}</select></label></div><label>Mức độ hài lòng${stars('fbRate', 0)}</label><label>Tiêu đề<input name="title" maxlength="80" placeholder="Tóm tắt ngắn gọn"></label><label>Nội dung<textarea name="body" placeholder="Bạn thấy sản phẩm thế nào? Có vấn đề gì cần hỗ trợ không?"></textarea></label><div class="err" id="err" role="alert"></div><button class="btn pri">Gửi phản hồi</button></form><h2 style="margin:20px 0 10px">Phản hồi đã gửi (${L.length})</h2>` + (L.length ? L.map(f => `<div class="card"><div class="row"><div><b>${esc(f.title || f.type)}</b><div class="mu">${esc(f.prod)} · ${esc(f.type)} · ${f.date}</div></div><span class="b ${f.reply ? 'ok' : 'in'}">${f.reply ? 'Đã phản hồi' : 'Đã tiếp nhận'}</span></div><div style="margin:6px 0">${ro(f.rate)}</div><div>${esc(f.body)}</div>${f.reply ? `<div class="reply"><b>Cửa hàng trả lời:</b> ${esc(f.reply)}</div>` : ''}</div>`).join('') : '<div class="card empty">Bạn chưa gửi phản hồi nào.</div>');
}

// Giao diện Thông tin cá nhân (Profile)
function profView() {
    return `<form id="prof" class="card" novalidate><h1>Thông tin cá nhân</h1><p class="mu">Thông tin chính xác giúp cửa hàng tư vấn và hỗ trợ bạn tốt hơn.</p><label>Email (dùng để đăng nhập)<input value="${esc(me.email)}" readonly></label><div class="grid"><label>Họ và tên<input name="name" value="${esc(me.name)}"></label><label>Số điện thoại<input name="phone" type="tel" value="${esc(me.phone)}"></label></div><label>Địa chỉ<input name="addr" value="${esc(me.addr)}" placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"></label><div class="grid"><label>Năm sinh<input name="year" type="number" value="${esc(me.year)}" placeholder="1998"></label><label>Giới tính<select name="gender">${['', 'Nam', 'Nữ', 'Khác'].map(g => `<option value="${g}"${me.gender === g ? ' selected' : ''}>${g || 'Không muốn nêu'}</option>`).join('')}</select></label></div><label>Nhu cầu sử dụng PC / laptop<select name="need">${NEEDS.map(g => `<option${me.need === g ? ' selected' : ''}>${g}</option>`).join('')}</select></label><div class="err" id="err" role="alert"></div><button class="btn pri">Lưu thay đổi</button></form>`;
}


/* ==========================================
   3. XỬ LÝ LOGIC NGHIỆP VỤ & SỰ KIỆN (CONTROLLER)
   ========================================== */
const setErr = t => { $('#err').textContent = t; return false; };

// Bộ xử lý các form Submit (Đăng nhập, Đăng ký, Cập nhật Profile, Gửi Feedback, Gửi Khảo sát)
const H = {
    login(v) {
        const u = U.find(x => x.email.toLowerCase() === (v.email || '').trim().toLowerCase() && x.pass === v.pass);
        if (!u) return setErr('Email hoặc mật khẩu không đúng.');
        me = u; tab = 'survey'; open = null; render();
        const n = pending().length;
        toast(n ? `Xin chào ${u.name}. Bạn có ${n} khảo sát mới` : `Xin chào ${u.name}`);
    },
    reg(v) {
        const e = v.email.trim().toLowerCase(), n = v.name.trim(), p = v.phone.trim();
        if (!n) return setErr('Vui lòng nhập họ và tên.');
        if (!/^\S+@\S+\.\S+$/.test(e)) return setErr('Email chưa đúng định dạng.');
        if (U.some(x => x.email.toLowerCase() === e)) return setErr('Email này đã được đăng ký. Hãy đăng nhập.');
        if (!/^0\d{9,10}$/.test(p)) return setErr('Số điện thoại cần 10-11 chữ số và bắt đầu bằng 0.');
        if (U.some(x => x.phone === p)) return setErr('Số điện thoại này đã được đăng ký cho tài khoản khác.');
        if (v.pass.length < 6) return setErr('Mật khẩu cần ít nhất 6 ký tự.');
        if (v.pass !== v.pass2) return setErr('Mật khẩu nhập lại chưa khớp.');
        const u = {email: e, pass: v.pass, name: n, phone: p, addr: '', year: '', gender: '', need: 'Chưa xác định'};
        U.push(u); me = u; tab = 'survey'; render();
        toast('Đăng ký thành công. Chào mừng bạn đến với Backline');
    },
    prof(v) {
        const n = v.name.trim(), y = v.year === '' ? '' : +v.year;
        if (!n) return setErr('Họ và tên không được để trống.');
        if (!/^0\d{9,10}$/.test(v.phone.trim())) return setErr('Số điện thoại cần 10-11 chữ số và bắt đầu bằng 0.');
        if (U.some(x => x !== me && x.phone === v.phone.trim())) return setErr('Số điện thoại này đã được dùng cho tài khoản khác.');
        if (y !== '' && (y < 1940 || y > 2012)) return setErr('Năm sinh cần nằm trong khoảng 1940 - 2012.');
        Object.assign(me, {name: n, phone: v.phone.trim(), addr: v.addr.trim(), year: y, gender: v.gender, need: v.need});
        render(); toast('Đã lưu thông tin cá nhân');
    },
    fb(v) {
        const r = +$('#fbRate').dataset.val;
        if (!v.prod) return setErr('Vui lòng chọn sản phẩm.');
        if (!r) return setErr('Vui lòng chọn số sao đánh giá.');
        if (v.body.trim().length < 10) return setErr('Nội dung phản hồi cần ít nhất 10 ký tự.');
        (FB[me.email] = FB[me.email] || []).unshift({prod: v.prod, type: v.type, rate: r, title: v.title.trim(), body: v.body.trim(), date: today(), reply: ''});
        render(); toast('Đã gửi phản hồi. Cảm ơn bạn!');
    },
    sv(v, f) {
        const s = SV.find(x => x.id === open);
        for (let i = 0; i < s.qs.length; i++) {
            const q = s.qs[i]; if (!q.req) continue;
            const ok = q.t === 'rate' ? +$('#q' + i).dataset.val > 0 : q.t === 'text' ? (v['q' + i] || '').trim() : f.querySelector(`[name=q${i}]:checked`);
            if (!ok) return setErr(`Vui lòng trả lời câu ${i + 1}.`);
        }
        (DONE[me.email] = DONE[me.email] || {})[s.id] = today();
        open = null; render(); toast('Cảm ơn bạn đã hoàn thành khảo sát!');
    }
};

// Lắng nghe sự kiện Submit form
document.addEventListener('submit', e => {
    e.preventDefault(); const f = e.target;
    if (H[f.id]) H[f.id](Object.fromEntries(new FormData(f)), f);
});

// Lắng nghe sự kiện Click chuột tương tác trên giao diện
document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, v = b.dataset.v;
    if (a === 'star') {
        const p = b.parentElement; p.dataset.val = v;
        p.querySelectorAll('.st').forEach((x, i) => x.classList.toggle('on', i < +v));
    } else if (a === 'atab') { authTab = v; render(); }
    else if (a === 'tab') { tab = v; open = null; render(); }
    else if (a === 'start') { open = v; render(); scrollTo(0, 0); }
    else if (a === 'back') { open = null; render(); }
    else if (a === 'out') { me = null; open = null; authTab = 'login'; render(); toast('Bạn đã đăng xuất'); }
});

// Khởi chạy render lần đầu tiên khi tải trang
render();