import API from "./scripts/api.js";
import { getLocal } from "./scripts/helpers.js";
import { ele, renderUserInfo, renderTimeline, renderLoader, renderDetailLoader, renderDetail, renderUser, } from "./scripts/ui.js";


//localden kullanıcı bilgilerini al
const user = getLocal('user');
// console.log(user);
// kullanıcıyı hangi sayfaya yönlendireceğine karar veren fonksiyon
// ekranın orta kısmına yer alıcak html kodu belirler
const router = () => {
    // url'deki arama paramatrelerine erişme
    // console.log('lokasyon', location.search);
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const query = params.get('q');

    //pagein değerine göre arayüz karar ver
    switch (page) {
        //tweet detay sayfasındaysak
        case 'status':
            //loadingi ekrana bas 
            renderDetailLoader('Gönderi');
            // tweet detaylarını apiden 
            API.getData(`/tweet.php?id=${query}`)
                // ekrana detay sayfasını bas
                .then((data) => renderDetail(data, user));

            break;
        //arama sayfasındaysak
        case 'search':
            renderDetailLoader(`${query} için sonuçlar`);
            API.getData(`/search.php?query=${query}&search_type=top`)
                .then((data) => renderTimeline(data, ele.main, 'user_info')
                );
            break;
        //kullanıcı detay sayfasındaysak
        case 'user':
            // sayfanın yğklendiğini belirt
            renderDetailLoader(query);

            //kullanıcının bilgilerini apiden aal
            API.getUser(query)
                .then((user) => {
                    //KUllanıcınn hesp bilgilerini ekrana bas
                    renderUser(user)
                    //tweetlerinn geleceği yeri seçme
                    const outlet = document.querySelector('.page-bottom');
                    //kullanıcının attığı tweetleri al            
                    API.getData(`/timeline.php?screenname=${query}`)
                        .then((data) => renderTimeline(data, outlet, 'author')
                        );
                });

            break;
        //varsayılan olarak anasayfayı ekrana bas
        default:
            //1 ekrana yükleniyor bas 
            renderLoader(ele.tweetsArea)

            // 2)kullanıcının tweetlweini al
            API.getData(`/timeline.php?screenname=${user.profile}`)
                //3) tweetleri ekrana bas    
                .then((data) => renderTimeline(data, ele.tweetsArea, 'author'));

    }
    // console.log(page, query);
}

// sayfa yüklenince kullanıcı bilgilerini ekrana bas
document.addEventListener('DOMContentLoaded', () => {
    if (user) {
        // eğer kullanıcı oturum açtıysa bilgierini ekrana bas
        renderUserInfo(user);
    } else {
        // oturum açmadıysa logine yönlendir(authorization)
        location = '/auth.html';
    }
    // ekrana basılacak sayfayı belirle
    router();

});

//çıkış butonuuna tıklanıca oturumu kapt
ele.logoutBtn.addEventListener('click', () => {
    // kullanıcı bilgilerini lokalden kaldır
    localStorage.removeItem('user');

    // login yönlendir
    location = '/auth.html';
});

// geri btnuna tıklanma olayını izle
ele.main.addEventListener("click", (e) => {
    if (e.target.id === "back-btn") {
        //bir adım geriye git
        history.back();
    }
});

//arama formunun gönderilmesini izle
ele.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // formadlaki veriye eriş
    const query = e.target[0].value;
    // console.log(query);
    // sayfayı değiş
    location = `?page=search&q=${query}`;
});