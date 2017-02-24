## TODO:

- [x] finish session handling with unique session IDs
- [x] fix modal view functions for more universality
- [x] create AJAX POST requests
    - [x] test them
- [x] add a test password to database
    - [x] test: thisisapassword

- [x] add login form logic
- [x] delete uploads upon save
- [x] TLS via lets encrypt
- [x] appcache
- [x] deploy to digital ocean
- [x] redirect to domain repdom.umassmed.io

- [x] fix dns?

- [x] fix TLS cert

- [ ] :80 redirect to :443
    - go http.ListenAndServeTLS(listenAddr+":443", "tls/cert.pem", "tls/key.pem", nil)
    http.ListenAndServe(listenAddr+":80", http.HandlerFunc(redir))
    ```go
    func main() {
	     authenticator := auth.NewBasicAuthenticator("Train Controler", Secret)
	        http.HandleFunc("/",  authenticator.Wrap(rootHandler))
    	http.Handle("/socket", websocket.Handler(websocketServer))
    	err := http.ListenAndServeTLS("127.0.0.1", "./tls/cert.pem", "./tls/key.pem", nil)
    	err2 := http.ListenAndServe("127.0.0.1", http.RedirectHandler("https://127.0.0.1", http.StatusFound))
    	if err != nil || err2 != nil {
    		log.Fatal(err)
	}
    ```
- [ ] "see all" page

- [ ] csv download functionality

- [ ] add delete or remove option per record

- [ ] figure out hwo best to implement form handlers (ie skip logic)

- [ ] add appspecific prefix? to data keys
