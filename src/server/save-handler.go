package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/boltdb/bolt"
)

// type datum struct {
// 	Key   string `json:"key"`
// 	Value string `json:"value"`
// }

type row struct {
	ID   string  `json:"id"`
	Data []datum `json:"data"`
}
type datum struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// SaveHandler deals with the POSTs with data and save them to a database
func saveHandler(w http.ResponseWriter, r *http.Request) {

	var newData []row
	sessionIsValid, err := checkSession(w, r)
	if err != nil {
		http.Error(w, "there was a problem checking your session", http.StatusUnauthorized)
		return
	}
	if r.Method == "POST" && sessionIsValid {
		// read the body data
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "there was a problem reading the data that was recieved", http.StatusInternalServerError)
		}
		err = json.Unmarshal(body, &newData)
		if err != nil {
			http.Error(w, "there was a problem handling the data that was recieved", http.StatusInternalServerError)
		}

		db, err := bolt.Open("data.db", 0600, nil)
		if err != nil {
			http.Error(w, "there was a problem opening the database", http.StatusInternalServerError)
		}
		defer db.Close()

		var saved []string
		var alreadyExisted []string

		// save each value to the db
		for _, row := range newData {
			db.Update(
				func(tx *bolt.Tx) error {
					b, err := tx.CreateBucketIfNotExists([]byte("data"))
					if err != nil {
						return fmt.Errorf("create bucket: %s", err)
					}
					currVal := b.Get([]byte(row.ID))
					if currVal != nil {
						// then the survey with the same ID had already been saved
						alreadyExisted = append(alreadyExisted, row.ID)
					} else {
						dataToSave, err := json.Marshal(row.Data)
						if err != nil {
							return err
						}
						b.Put([]byte(row.ID), []byte(dataToSave))
						saved = append(saved, row.ID)
					}
					return nil
				},
			)
		}
		fmt.Println("saved:", saved)
		fmt.Println("already:", alreadyExisted)
		type result struct {
			Saved   []string
			Unsaved []string
		}
		toWrite, err := json.Marshal(result{
			Saved:   saved,
			Unsaved: alreadyExisted,
		})
		fmt.Println(string(toWrite))
		if err != nil {
			http.Error(w, "there was a problem preparing the response", http.StatusInternalServerError)
		}
		w.Write(toWrite)

		// return http response with ids of values that failed

	} else {
		http.Error(w, "your message was not a POST message", http.StatusBadRequest)
	}

}
