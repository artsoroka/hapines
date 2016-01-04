exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function(table){
            table.charset('utf8'); 
            table.collate('utf8_unicode_ci'); 

            table.increments(); 
            table.string('name', 50);
            table.string('email', 100); 
            table.string('password');
            table.timestamp("created_at").defaultTo(knex.raw('now()')); 
            table.timestamp("updated_at"); 
        })         
    ]);  
};

exports.down = function(knex, Promise) {
    knex.schema.dropTableIfExists('users'); 
};
