exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('users').del(), 
    knex('users').insert({
        name    : 'princess Leia',
        email   : 'leia@alderaan.com', 
        password: 'alderaan'
    }), 
    knex('users').insert({
        name    : 'Khan Solo',
        email   : 'khan@solo.com', 
        password: 'falcon'
    }), 
    knex('users').insert({
        name    : 'Chubakka',
        email   : 'uuuaaahhhrrr@google.com', 
        password: 'querty'
    })
  );
};