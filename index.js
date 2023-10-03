function Animal(id, x, y) {
    this.element = $('#animal_' + id);
    this.speed = 10;
    this.x = x;
    this.y = y;
    this.author = '';

    this.run = function () {
        var animal = this;
        console.log(animal.element);
        animal.element.css('top', y + 'px');
        animal.element.append('<div class="name">aaa</div>')
    }

    this.setAction = function (key) {
        var animal = this;
        if(this.x + 50 > finish_line_length) {
            clearInterval(gameRunning)
        }
        if (this.speed - speed_road > 0) {
            this.x += (this.speed - speed_road);
            animal.element.css('left', this.x + 'px');
        }
    }
}

var animals = [];
for (i = 1; i <= 5; ++i) {
    $('.mud').append('<div class="animal_gif" id="animal_' + i + '"><img  src="animal_img/animal' + i + '.gif"> </div>');
    animals.push(new Animal(i, 500, i * 60));
}

animals.forEach(element => {
    element.run();
});

var speed_road = 10;
var index_road = 0
var finish_line_length = 3000;

var actions = [];

var gameRunning = setInterval(function () {
    $('.mud').css('background-position-x', index_road + 'px');
    $('.finish_line').css('left', finish_line_length + 'px');
    finish_line_length -= speed_road;
    index_road -= speed_road;

    animals.forEach(element => {
        element.setAction();
    });
}, 100);

$(document).keypress(function (event) {
    animal_id = parseInt(event.key);
    animals[animal_id - 1].speed += 1;
});

for (i = 1; i <= 20; ++i) {
    $('.list_pet').append('<img class="pet_show" src="animal_img/animal' + i + '.gif">');
}