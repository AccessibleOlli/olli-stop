import axios from 'axios';
import PouchDB from 'pouchdb';

export default class POISearch {

  constructor() {
    this.db = new PouchDB('pois');
    this.db.createIndex({
      index: {
        fields: [{ 'query': 'asc' }]
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  loadPOISfromPouchDB(query) {
    return this.db.find({
      selector: { "query": query },
      limit: 1
    })
      .then((result) => {
        if (result.docs && result.docs.length > 0) {
          return result.docs[0];
        }
        else {
          return null;
        }
      });
  }

  savePOIsToPouchDB(query, pois) {
    return this.loadPOISfromPouchDB(query)
      .then((doc) => {
        if (doc) {
          doc.pois = pois;
          return this.db.put(doc);
        }
        else {
          let doc = {
            query: query,
            pois: pois
          }
          return this.db.post(doc);
        }
      })
      .then((response) => {
        return pois;
      });
  }

  searchPOIs(query, pouchdb) {
    console.log('POI Search: ' + query);
    return this.loadPOISfromPouchDB(query)
      .then((doc) => {
        if (doc) {
          console.log('Returning results from cache.');
          return doc.pois;
        }
        else {
          var data = {
            text: query,
            skipTTS: true
          };
          return axios({
            method: 'POST',
            url: '/api/conversation/converse',
            data: data
          })
            .then((converationResponse) => {
              let pois = [];
              if (converationResponse.data.card) {
                pois = converationResponse.data.card.content;
      
              }
              return this.savePOIsToPouchDB(query, pois);
            });
        }
      })
    
  }
}