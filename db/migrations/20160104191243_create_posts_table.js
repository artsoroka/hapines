exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('posts', function(table){
            table.charset('utf8'); 
            table.collate('utf8_unicode_ci'); 

            table.increments(); 
            table.integer('user_id').unsigned().index().references('id').inTable('users').notNullable(); 
            table.integer('happiness').unsigned().notNullable();  
            table.text('comment');
            table.timestamp("created_at").defaultTo(knex.raw('now()')); 
            table.timestamp("updated_at"); 
        })        
    ]);   
};

exports.down = function(knex, Promise) {
	knex.schema.dropTableIfExists('posts'); 
};