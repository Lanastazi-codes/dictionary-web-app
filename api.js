// class FetchWrapper {
//     constructor(baseURL) {
//         this.baseURL = baseURL;
//     }

//     get(endpoint) {
//         return fetch(this.baseURL + endpoint).then((response) => {
//             if (!response.ok) {
//                 // 4xx or 5xx error
//                 throw new Error("API issues.");
//             }
//             return response.json();
//         });
//     }

//     put(endpoint, body) {
//         return this._send("put", endpoint, body);
//     }

//     post(endpoint, body) {
//         return this._send("post", endpoint, body);
//     }

//     delete(endpoint, body) {
//         return this._send("delete", endpoint, body);
//     }

//     _send(method, endpoint, body) {
//         return fetch(this.baseURL + endpoint, {
//             method,
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(body),
//         }).then((response) => response.json());
//     }
// }

// const API = new FetchWrapper("https://api.dictionaryapi.dev/api/v2/entries/en");