const RSVP = require('rsvp');
const cook = {
    db: function (store, task, data) {
        let book = store.get('cookbook');

        function searchTags(name) {
            console.log(book);
            let aliases;
            if (typeof name === 'object') {
                aliases = name.length;
            } else {
                aliases = 1;
            }
            for (let t = 0; t < aliases; t++) {
                let alias;
                if (aliases === 1) {
                    alias = name;
                } else {
                    alias = name[t];
                }
                for (let i = 0; i < book.tags.length; i++) {
                    for (let c = 0; c < book.tags[i].length; c++) {
                        console.log(book.tags[i][c]);
                        if (book.tags[i][c] === alias.toLowerCase()) {
                            console.log('Found alias');
                            return i
                        }
                    }
                }
            }
            console.log('No Alias found');
            return undefined
        }

        function replace(id, data, tags) {
            var waitForUpdate = new RSVP.Promise(function (fulfill, reject) {
                let dbdata = store.get('cookbook.data');
                let dbtags = store.get('cookbook.tags');
                if (typeof dbdata !== 'undefined' && typeof dbtags !== 'undefined') {
                    let db = [dbdata, dbtags];
                    console.log('fulfill');
                    fulfill(db);
                }
            });
            waitForUpdate.then(function (db) {
                return new RSVP.Promise(function (win, lose) {
                    console.log('got db');
                    let dbdata = db[0];
                    let dbtags = db[1];

                    if (typeof id !== 'undefined') {
                        dbdata[id] = data;
                        dbtags[id] = tags;
                        store.remove('cookbook.data[' + id + ']');
                        store.remove('cookbook.tags[' + id + ']');
                    } else {
                        dbdata.push(data);

                        console.log('tags:');
                        console.log(tags);
                        console.log('dbtags:');
                        console.log(dbtags);
                        dbtags.push(tags);
                        console.log('combined');
                        console.log(dbtags);
                    }
                    store.put('cookbook.data', dbdata);
                    store.put('cookbook.tags', dbtags);
                    let ressy = store.get('cookbook');
                    if (typeof ressy !== 'undefined') {
                        win(ressy)
                    } else {

                    }
                });
            }).then(function (ressy) {
                console.log('end of promise');
                console.log(ressy);
                return ressy
            })


        }

        switch (task) {
            case 'checkDB':
                if (typeof store.get('cookbook') === 'undefined') {
                    store.put('cookbook', {data: {}, tags: {}});
                }

                return store.get('cookbook');
            case 'add':
                let name;
                if (typeof data.aliases === 'undefined') {
                    name = data.name;
                } else if (typeof data.aliases !== 'undefined') {
                    name = data.aliases;
                }
                let id = searchTags(name);


                return replace(id, data, name);

            case 'search':
                let searchResults;
                if (typeof searchTags(data) === 'undefined') {
                    searchResults = `
                        <div class="hr-divider" style="margin: 20px;">
                            <h3 class="hr-divider-content hr-divider-heading">
                                No Recipes Found!
                            </h3>
                        </div>
                    `
                } else {
                    let b = searchTags(data);
                    console.log(b);
                    let deets = book.data;
                    console.log('book data');
                    console.log(deets);
                    searchResults = `
                    <div class="hr-divider" style="margin: 20px;">
                            <h2 class="hr-divider-content hr-divider-heading">
                                Recipes:
                            </h2>
                        </div>
                    <table class="table" data-sort="table" id="tb-AHT">
      <thead style="background-color: #373c48">
        <tr>
          
          <th class="header">tags</th>
          <th class="header">tables</th>
          <th class="header">formula</th>
          <th class="header">notes</th>
        </tr>
      </thead>
      <tbody>
      <tr>      
          <td>${deets[b].name}</td>
          <td>${deets[b].tables}</td>
          <td>${deets[b].formula}</td>
          <td>${deets[b].notes}</td>
          
        </tr>
      </tbody>
    </table>
                    `
                }
                console.log(searchResults);
                return searchResults;
        }
    }

};

/*
let cookbook = {
    data: [
        {
            name:'',
            tags: ['', '', ''],
            tables: '',
            formula: '',
            notes: ''
        }
    ],
    tags: {
        aliases: [],
        titles: []
    }
};
*/
module.exports = cook;

/*
var RSVP = require('rsvp');

var promise = new RSVP.Promise(function(resolve, reject) {
  // succeed
  resolve(value);
  // or reject
  reject(error);
});

promise.then(function(value) {
  // success
}).catch(function(error) {
  // failure
});
 */