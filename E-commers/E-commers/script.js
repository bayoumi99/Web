// 1. تعريف مصفوفة العربة وتحميل البيانات (وحدنا الاسم لـ 'cart')
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 2. عند تحميل الصفحة، تحديث الواجهة
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});

// 3. فتح وإغلاق العربة
function toggleCart() {
    const dropdown = document.getElementById('cart-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// 4. إضافة منتج للعربة
function addToCart(btn, name, price) {
    let product = cart.find(p => p.name === name);
    
    if (product) {
        product.qty += 1;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }
    
    saveAndRefresh();
}

// 5. تغيير الكمية (+ أو -)
function changeQty(btn, change, name) {
    let product = cart.find(p => p.name === name);
    
    if (product) {
        product.qty += change;
        
        if (product.qty <= 0) {
            cart = cart.filter(p => p.name !== name);
        }
    }
    
    saveAndRefresh();
}

// 6. حذف منتج نهائياً (زر الـ ❌)
function removeItem(name) {
    cart = cart.filter(p => p.name !== name);
    saveAndRefresh();
}

// 7. حفظ التغييرات وتحديث الشاشة
function saveAndRefresh() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateUI();
}

// 8. الدالة الأساسية لتحديث الواجهة
function updateUI() {
    // تحديث عداد العربة
    const totalItems = cart.reduce((sum, p) => sum + p.qty, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = totalItems;
    }

    // تحديث القائمة المنسدلة
    const list = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('cart-total-price');
    
    if (list && totalPriceEl) {
        if (cart.length === 0) {
            list.innerHTML = '<li style="text-align:center; padding:10px; color:#ccc;">العربة فارغة</li>';
            totalPriceEl.innerText = '0';
        } else {
            list.innerHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'cart-item-animate'; // إضافة كلاس للأنيميشن لو حبيت
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.padding = '10px 0';
                li.style.borderBottom = '1px solid rgba(212, 30, 30, 1)';
                
                li.innerHTML = `
                    <div style="font-size: 14px; color: white;">
                        <strong>${item.name}</strong> <br>
                        <small style="color: #ea6111ff;">${item.qty} x $${item.price}</small>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="font-weight:bold; margin-right:10px; color: #ff9800;">$${item.price * item.qty}</span>
                        <span onclick="removeItem('${item.name}')" style="cursor:pointer; font-size: 12px;">❌</span>
                    </div>
                `;
                list.appendChild(li);
                total += item.price * item.qty;
            });
            totalPriceEl.innerText = total;
        }
    }

    // ربط زرار الـ Checkout بالصفحة الجديدة
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('عذراً، العربة فارغة!');
            }
        };
    }

    // تحديث أزرار الصفحات
    updatePageButtons();
}

// 9. مزامنة حالة الأزرار (Add vs Counter)
function updatePageButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
        const h3 = card.querySelector('h3');
        if (!h3) return;
        
        const name = h3.innerText.trim();
        const product = cart.find(p => p.name === name);
        
        const addBtn = card.querySelector('.add-btn');
        const counter = card.querySelector('.counter');
        const qtySpan = card.querySelector('.qty');

        if (product) {
            if (addBtn) addBtn.style.display = 'none';
            if (counter) counter.style.display = 'flex';
            if (qtySpan) qtySpan.innerText = product.qty;
        } else {
            if (addBtn) addBtn.style.display = 'inline-block';
            if (counter) counter.style.display = 'none';
        }
    });
}