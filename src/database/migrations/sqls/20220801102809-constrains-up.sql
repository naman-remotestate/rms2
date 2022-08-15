/* Replace with your SQL commands */


ALTER TABLE userdb ADD CONSTRAINT unique_email UNIQUE(email);

ALTER TABLE dishesdb ADD CONSTRAINT unique_dish UNIQUE(dish);
