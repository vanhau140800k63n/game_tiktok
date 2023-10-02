function Animal(id, x, y, image) {
    this.element = $('#' + id);
    this.speed = 10;
    this.image = image;
    this.originX = x;
    this.originY = y;
    this.x = x;
    this.y = y;

    this.run = function () {
        var horse = this;
        horse.element.css('top', y);
        horse.element.css('background-image', 'url(' + image + ')');
        // setTimeout(function () {
        //     horse.x++;
        //     horse.element.style.left = horse.x + 'vw';
        // }, 1000 / this.speed);
    }
}

var list = [];
for (i = 1; i < 5; ++i) {
    $('.racecourse').append('<div class="animal" id="' + i + '"></div>');
    list.push(new Animal(i, 0, 50 * i, 'images/horse' + i + '.png'));
}

console.log(list);

list.forEach(element => {
    element.run();
});

x = 0;

setInterval(function () {
    $('.racecourse').css('background-position-x', x + 'px');
    x -= 10
}, 100);