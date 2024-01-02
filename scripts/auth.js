import API from './api.js';
import { setLocal } from './helpers.js';

const authEle = {
    loginForm: document.querySelector('#login'),
    nameInp: document.querySelector('#name'),
    passInp: document.querySelector('#pass'),
    nameWarn: document.querySelector('.name-warning'),
    passWarn: document.querySelector('.pass-warning'),
}

//  şifre kuralları için regex
// min 1 büyük ve küçük harf
// min 1 sayı
// min 1 özel karakter
// min 8 karakter
const regex =
    '(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$';

// isim ve şifreyi kontrol eder
// isim veya şifrede problem varsa uyarı olarak ekrana basıcak ve false döndürecek
//proble yoksa true döndürür
const checkValues = (name, pass) => {
    let isPassError = false;
    let isNameError = false;
    // console.log(name, pass);

    // 1)isim kontrol eder ve ekrana basar
    if (!name.trim()) {
        isNameError = true;
        authEle.nameWarn.innerHTML =
            "<p>Lütfen isim giriniz</p>";
    } else {
        isNameError = false;
        authEle.nameWarn.innerHTML = '';
    }
    // 2) şifre kontrol
    if (!pass.trim()) {
        isPassError = true;
        authEle.passWarn.innerHTML =
            "<p>Lütfen Şifre giriniz</p>";
    } else if (pass.length < 8) {
        isPassError = true;
        authEle.passWarn.innerHTML =
            "<p>Şifre en az 8 karakter olmalı</p>";
    } else if (!pass.match(regex)) {
        isPassError = true;
        authEle.passWarn.innerHTML =
            "<p>Şifre yeterince güçlü değil</p>";
    } else {
        isPassError = false;
        authEle.passWarn.innerHTML = '';
    }
    //3) fonksiyonun dçndüreceği değere verme
    if (isNameError || isPassError) {
        return false;
    } else {
        return true;
    }
};

// formun gönderilme olayını izle ve inputlardaki verilere eriş
authEle.loginForm.addEventListener('submit', (e) => {
    // sayfayı yenilemeyi engelle
    e.preventDefault();

    //değerlere erişmek için
    const name = authEle.nameInp.value;
    const pass = authEle.passInp.value;
    // console.log('Api isteği atılıyor');

    // 3) değerlerde hata yoksa kullanıcı bilgilerini al
    if (checkValues(name, pass)) {
        // console.log('api ile haberleşildi');
        API.getUser(name)
            .then((data) => {
                //eğerki kullanıcı bulunamadıysa uyarı ver
                if (data.status === 'error') {
                    authEle.nameWarn.innerHTML =
                        "<p>Kullanıcı Bulunamadı</p>";
                } else {
                    //kullanıcı bulunduuysa lokale kaydet ve anasayfaya yönlendir
                    setLocal('user', data);
                    // ana sayfaya yönlendir
                    location = '/';
                }
            })
            .catch((err) => console.log(err));
    }

});




