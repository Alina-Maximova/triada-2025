exports.up = function(knex) {
    return Promise.all([
      knex.schema.createTable('roles', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable().unique();
        table.text('description');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      }),
  
      knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.integer('role_id').unsigned().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('role_id').references('roles.id').onDelete('CASCADE');
      }),
  
      knex.schema.createTable('products', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.decimal('price', 10, 2).notNullable();
        table.integer('quantity').notNullable();
        table.string('photo_paht').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());

      }),
  
      knex.schema.createTable('services', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.decimal('price', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
      }),
  
      knex.schema.createTable('orders', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.timestamp('order_date').defaultTo(knex.fn.now());
        table.string('status').notNullable();
        table.decimal('total_amount', 10, 2).notNullable();
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
      }),
  
     
  
      knex.schema.createTable('order_products', function(table) {
        table.increments('id').primary();
        table.integer('order_id').unsigned().notNullable();
        table.integer('product_id').unsigned().notNullable();
        table.integer('quantity').notNullable();
        table.foreign('order_id').references('orders.id').onDelete('CASCADE');
        table.foreign('product_id').references('products.id').onDelete('CASCADE');
      }),
  
      knex.schema.createTable('order_services', function(table) {
        table.increments('id').primary();
        table.integer('order_id').unsigned().notNullable();
        table.integer('service_id').unsigned().notNullable();
        table.integer('quantity').notNullable();
        table.foreign('order_id').references('orders.id').onDelete('CASCADE');
        table.foreign('service_id').references('services.id').onDelete('CASCADE');
      })
    ]);
  };
  
  exports.down = function(knex) {
};