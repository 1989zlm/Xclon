//apiye gçndermemiz gereken zorunlu olan ve 
//api key içeren objedir.

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '6a6d16ebdcmsh2bf92f946ce6374p150410jsnbc1064200a56',
        'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com',
    },
};

export default class API {
    // kullanıcı bilgilerinden hesap bilgilerine erişir
    static async getUser(username) {
        //1) verileri al
        const res = await fetch(
            `https://twitter-api45.p.rapidapi.com/screenname.php?screenname=${username}`,
            options
        );
        //2)json verisini js verisine çevir
        const data = await res.json();
        //3)veriyi fonksiyonun çağrıldığı yere gçnder
        return data;
    }
    //twetleri alır
    static getTweets() { }
}
//2.34 dk