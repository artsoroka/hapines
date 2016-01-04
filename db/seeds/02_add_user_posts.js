exports.seed = function(knex, Promise) {
  return Promise.join(
    //knex('posts').del(), 

    knex('posts').insert({user_id: 1, happiness: 10, comment: 'So glad to see Khan agin'}),
    knex('posts').insert({user_id: 1, happiness: 9, comment: 'And Chubakka too'}),
    knex('posts').insert({user_id: 2, happiness: 9, comment: 'Flying on Falcon again'})
  );
};